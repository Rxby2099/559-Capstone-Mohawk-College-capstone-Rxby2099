import { Router} from 'express';
import dokkanDb from '../lib/dokkan-db';

const characterRouter = Router();

const FROM_CARDS = 'FROM cards JOIN leader_skill_sets ls ON ls.id = cards.leader_skill_set_id';

characterRouter.get('/:id', (req, res) =>{
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id) || id <=0){
        return res.status(400).json({error: "Invalid card id"});
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
            cards.passive_skill_set_id AS passiveId
        ${FROM_CARDS}
        WHERE cards.id = ?`).get(id) as any;
    
        if (!character) return res.status(404).json({error: "Character not found"});

        // Query to get a characters stats at rainbow aka 100% hidden potential
        const rainbowStats = dokkanDb.prepare(`
            SELECT
                COALESCE(SUM(CASE WHEN e.type = 'PotentialEVENT::Hp' THEN e.additional_value END), 0) AS hp,
                COALESCE(SUM(CASE WHEN e.type = 'PotentialEVENT::Atk' THEN e.additional_value END), 0) AS atk,
                COALESCE(SUM(CASE WHEN e.type = 'PotentialEVENT::Defense' THEN e.additional_value END), 0) AS def
            FROM potential_events e ON e.id = s.event_id
            WHERE s.potential_board_id = ?`).get(character.id.boardId) as {hp: number; atk: number; def: number};


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

})