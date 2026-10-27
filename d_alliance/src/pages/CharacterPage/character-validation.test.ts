const MAX_PASSIVE_LEN = 2000;

/**
 * validates whether all stats are positive and throws and error if the character stat is negative
 * @param stats - a dictionary of stat names and values
 */
function validateStats(stats: Record<string, number>){
    for(const [stat, value] of Object.entries(stats)){
        if(value < 0){
            throw new Error(`${stat} cannot be negative`);
        }
    }
}

/**
 * validates whether a passive skill is too long or not and throws an error if its above 2000 chars.
 * @param passive - a passive skill description for a character
 */
function validatePassive(passive: string){
    if (passive.length > MAX_PASSIVE_LEN){
        throw new Error(`Passive is too long (max ${MAX_PASSIVE_LEN} characters)`);
    }
}

/**
 * Tests for the Character page: UT-7, testing if negative stats for a character get rejected,
 * UT-8, testing passive description length
 */
describe("Character validation testing", () => {
    test("testing negative character stats are rejected", () => {
        expect(() => validateStats({attack: -5})).toThrow("attack cannot be negative");
    })

    test("testing oversized passive length to be rejcted", () => {
        expect(() => validatePassive("a".repeat(2100))).toThrow("Passive is too long (max 2000 characters)");
    })
})