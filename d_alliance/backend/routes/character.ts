import { Router} from 'express';
import dokkanDb from '../lib/dokkan-db';
import supabase from '../supabase-backend';

const characterRouter = Router();

const FROM_CARDS = 'FROM cards JOIN leader_skill_sets ls ON ls.id = cards.leader_skill_set_id';
const CLASS_NAMES = ['', 'super', 'extreme']
const TYPE_NAMES = ['agl', 'teq', 'int', 'str', 'phy'];

characterRouter.get('/:id', async (req, res) =>{
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id) || id <=0){
        return res.status(400).json({error: "Invalid card id"});
    }
    
    const { data: custom, error: customError } = await supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if(customError){
        console.error('Error reading custom character: ', customError);
    }

    if(custom){
        return res.json({
            id: custom.id,
            name: custom.name,
            title: custom.title,
            leaderSkill: custom.leader_skill,
            supers: Array.isArray(custom.supers) ? custom.supers : [],
            passive: custom.passive_name
                ? { name: custom.passive_name, description: custom.passive_description ?? ''}
                : undefined,
            stats: {
                fiftyFive: { hp: custom.hp_55, atk: custom.atk_55, def: custom.def_55 },
                rainbow: { hp: custom.hp_rainbow, atk: custom.atk_rainbow, def: custom.def_rainbow }
            },
            class: custom.class,
            type: custom.type,
            openAt: custom.open_at
        });
    }

    // Quert to get a chatcayers name, title, leaderskill description, stats at full level, their hidden potential board id, and their passive id
    const character = dokkanDb.prepare(`
        SELECT
            cards.id,
            cards.name,
            ls.name AS title,
            ls.description AS leaderSkill,
            cards.hp_max AS hp,
            cards.atk_max AS atk,
            cards.def_max AS def,
            cards.potential_board_id AS boardId,
            cards.passive_skill_set_id AS passiveId,
            cards.element,
            cards.open_at AS openAt
        ${FROM_CARDS}
        WHERE cards.id = ?`).get(id) as any;
    
        if (!character) return res.status(404).json({error: "Character not found"});

        // Query to get a characters stats at rainbow aka 100% hidden potential
        const rainbowStats = dokkanDb.prepare(`
            SELECT
                COALESCE(SUM(CASE WHEN e.type = 'PotentialEvent::Hp' THEN e.additional_value END), 0) AS hp,
                COALESCE(SUM(CASE WHEN e.type = 'PotentialEvent::Atk' THEN e.additional_value END), 0) AS atk,
                COALESCE(SUM(CASE WHEN e.type = 'PotentialEvent::Defense' THEN e.additional_value END), 0) AS def
            FROM potential_squares s
            JOIN potential_events e ON e.id = s.event_id
            WHERE s.potential_board_id = ?`).get(character.boardId) as {hp: number; atk: number; def: number};


        // Query to get a characters suepr attacks, ki sphere requirement, name and description
        const supers = dokkanDb.prepare(`
            SELECT 
                cs.style, 
                cs.eball_num_start AS kiNeeded,
                ss.name,
                ss.description
            FROM card_specials cs
            JOIN special_sets ss ON ss.id = cs.special_set_id
            WHERE cs.card_id = ?
            ORDER BY cs.priority, cs.lv_start`).all(id);

        // Query to get a characters passive skill title and description
        const passive = dokkanDb.prepare(`
            SELECT
                name, 
                itemized_description AS description
            FROM passive_skill_sets WHERE id = ?`).get(character.passiveId)

        res.json({
            id: character.id,
            name: character.name,
            title: character.title,
            leaderSkill: character.leaderSkill,
            supers,
            passive,
            stats: {
                fiftyFive: {
                    hp: character.hp + 2000,
                    atk: character.atk + 2000,
                    def: character.def + 2000
                },
                rainbow: {
                    hp: character.hp + rainbowStats.hp,
                    atk: character.atk + rainbowStats.atk,
                    def: character.def + rainbowStats.def
                },

            },
            class: CLASS_NAMES[Math.floor(character.element / 10)],
            type: TYPE_NAMES[character.element % 10],
            openAt: character.openAt
        });
});

export default characterRouter;