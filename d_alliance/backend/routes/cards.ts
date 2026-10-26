import { Router, Request } from 'express';
import dokkanDb from '../lib/dokkan-db';

const cardRouter = Router();

// Cards shown on each page
const PAGE_SIZE = 100;


/**
 * Conditions in place to make sure only playable cards are displayed, due to 
 * the fact that the global db contains characters that would otherwise be used for 
 * upgrades, or boss characters which all wouldnt be able to be used on teams, as well as
 * any duplicate versions of the same character
 */
const PLAYABLE_FILTER =`
    cards.leader_skill_set_id IS NOT NULL
    AND cards.open_at <= datetime('now')
    AND cards.id < 7000000
    AND cards.is_selling_only = 0
    AND cards.element IN (10,11,12,13,14,20,21,22,23,24)
    AND cards.hp_max > 1000
    AND cards.atk_max < 20000
    AND cards.id = (SELECT MAX(c2.id) FROM cards c2
                    WHERE c2.leader_skill_set_id = cards.leader_skill_set_id)
    AND NOT EXISTS (SELECT 1 FROM card_awakening_routes r
                    WHERE r.card_id = cards.id
                    AND r.type IN ('CardAwakeningRoute::Zet', 'CardAwakeningRoute::Dokkan'))
`;

const FROM_CARDS = 'FROM cards JOIN leader_skill_sets ls ON ls.id = cards.leader_skill_set_id';

const TYPE_DIGIT: Record<string, number> = {agl: 0, teq: 1, int: 2, str: 3, phy: 4};

const CLASS_DIGIT: Record<string, number> = {super: 1, extreme: 2}

const SORTS: Record<string, string> = {
    newest: 'cards.open_at DESC, cards.id DESC',
    oldest: 'cards.open_at ASC, cards.id ASC',
    alpha: 'cards.name COLLATE NOCASE ASC, cards.id ASC',
    alphaBack: 'cards.name COLLATE NOCASE DESC, cards.id DESC',
};

/**
 * A check through the dictionaries of type and class to see if the dictionary contains the key we enter.
 * @param obj - dictionary we are checking (class or type)
 * @param key - key we're checking the dictionary for
 * @returns returns true or false depending on if the item is in the dictionary
 */
const has = (obj: object, key: string) => Object.keys(obj).includes(key);




/**
 * Grabs one page of 100 playable cards from newest to oldest. The frontend
 * requests the next or previous page.
 */
cardRouter.get('/', (req, resp) => {
    // converts query param into an int to validate the page number
    const requested = parseInt(req.query.page as string, 10);
    const page = Number.isInteger(requested) && requested > 0 ? requested : 1;

    // counts every matching card to find out how many pages exist
    const { total } = dokkanDb
        .prepare(`SELECT COUNT(*) AS total FROM cards WHERE ${PLAYABLE_FILTER}`)
        .get() as { total: number };

    // Round up so that the last page still shows cards even if there isnt 100
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    // Select statement to grab the id, name, and title from each card, specifigically 
    // ones with valid leader skills (has a leader skill) offsetting by 100 on each next click
    const data = dokkanDb.prepare(`
        SELECT 
            cards.id,
            cards.name,
            ls.name AS title
        FROM cards
        JOIN leader_skill_sets ls ON ls.id = cards.leader_skill_set_id
        WHERE ${PLAYABLE_FILTER}
        ORDER BY cards.open_at DESC, cards.id DESC
        LIMIT ? OFFSET ?`).all(PAGE_SIZE, (page - 1) * PAGE_SIZE);
    

        // Initial query that will probably 
        // const data = dokkanDb.prepare(`
        // SELECT 
        //     cards.id,
        //     cards.name,
        //     ls.name AS title,
        //     cards.rarity,
        //     cards.element,
        //     cards.cost,
        //     cards.hp_max,
        //     cards.atk_max,
        //     cards.def_max
        // FROM cards
        // JOIN leader_skill_sets ls ON ls.id = cards.leader_skill_set_id
        // WHERE ${PLAYABLE_FILTER}
        // ORDER BY cards.open_at DESC, cards.id DESC
        // LIMIT ? OFFSET ?`).all(PAGE_SIZE, (page - 1) * PAGE_SIZE);

    resp.json({ data, page, pageSize: PAGE_SIZE, total, totalPages })
});

export default cardRouter;