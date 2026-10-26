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

// Does the join to grab the card's name and title
const FROM_CARDS = 'FROM cards JOIN leader_skill_sets ls ON ls.id = cards.leader_skill_set_id';

// a dictionary of the types and their associated number in the db
const TYPE_DIGIT: Record<string, number> = {agl: 0, teq: 1, int: 2, str: 3, phy: 4};

// a dictionary of the classes and their associated number in the db
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
 * Reads a param like "teq, agl, phy" into a list of known vals. returns undefined if the param wasnt sent and has an empty list if it was sent with nothing valid / found no matches
 * @param value - the string being checked
 * @param allowed - the dictionary being checked through to verify if the value exists within it
 * @returns a number array with the digit values for the filter types, or undefined if the value is not of type string
 */
function parseList(value: unknown, allowed: Record<string, number>): number[] | undefined{
    if(typeof value !== 'string') return undefined;
    return value.split(',')
    .map(v => v.trim().toLowerCase())
    .filter(v => has(allowed, v))
    .map(v => allowed[v]);
};

function buildFilters(query: Request['query']){
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    // Search matches to either card OR title, and will still recognize
    // chars like % and _ as literal text rather than as the SQL special chars.
    const search = typeof query.search === 'string' ? query.search.trim() : '';

    if(search){
        const pattern = `%${search.replace(/[\\%_]/g, '\\$&')}%`
        conditions.push(`(cards.name LIKE ? ESCAPE '\\' OR ls.name LIKE ? ESCAPE '\\')`);
        params.push(pattern, pattern);
    }

    const classes = parseList(query.classes, CLASS_DIGIT);
    const types = parseList(query.types, TYPE_DIGIT);

    if(classes || types){
        const classDigits = classes ?? Object.values(CLASS_DIGIT);
        const typeDigits = types ?? Object.values(TYPE_DIGIT);
        const elements = classDigits.flatMap(c => typeDigits.map(t => c * 10 + t));

        if(elements.length === 0){
            conditions.push('0 = 1');
        }
        else{
            conditions.push(`cards.element IN (${elements.map(() => '?').join(',')})`);
        }

        params.push(...elements);
    }

    const categoryId = parseInt(query.category as string, 10);
    if(Number.isInteger(categoryId) && categoryId > 0){
        conditions.push(`EXISTS (SELECT 1 FROM card_card_categories cc
            WHERE cc.card_id = cards.id AND cc.card_category_id = ?)`);

        params.push(categoryId);
    }

    return { where: conditions.length ? ` AND ${conditions.join(' AND ')}` : '', params};
}

/**
 * Grabs one page of 100 playable cards from newest to oldest. The frontend
 * requests the next or previous page.
 */
cardRouter.get('/', (req, resp) => {
    // converts query param into an int to validate the page number
    const requested = parseInt(req.query.page as string, 10);
    const page = Number.isInteger(requested) && requested > 0 ? requested : 1;
    const { where, params } = buildFilters(req.query);

    const sortKey = typeof req.query.sort === 'string' ? req.query.sort: '';
    const orderBy = has(SORTS, sortKey) ? SORTS[sortKey] : SORTS.newest;

    // counts every matching card to find out how many pages exist
    const { total } = dokkanDb
        .prepare(`SELECT COUNT(*) AS total ${FROM_CARDS} WHERE ${PLAYABLE_FILTER}${where}`)
        .get(...params) as { total: number}; 

    // Round up so that the last page still shows cards even if there isnt 100
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    // Select statement to grab the id, name, and title from each card, specifigically 
    // ones with valid leader skills (has a leader skill) offsetting by 100 on each next click
    const data = dokkanDb.prepare(`
        SELECT 
            cards.id,
            cards.name,
            ls.name AS title
        ${FROM_CARDS}
        WHERE ${PLAYABLE_FILTER}${where}
        ORDER BY ${orderBy}
        LIMIT ? OFFSET ?`).all(...params, PAGE_SIZE, (page - 1) * PAGE_SIZE);
    
    resp.json({ data, page, pageSize: PAGE_SIZE, total, totalPages })
});

cardRouter.get('/categories', (_req, res) =>{
    const categories = dokkanDb.prepare(`
        SELECT id, name FROM card_categories
        WHERE open_at <= datetime('now') 
        ORDER BY name COLLATE NOCASE`).all();

    res.json(categories);
});

export default cardRouter;