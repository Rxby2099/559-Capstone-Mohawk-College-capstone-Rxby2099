export type CharacterFormValues = {
    name: string;
    title: string;
    characterClass: string;
    type: string;
    leaderSkill: string;
    hp55: string;
    atk55: string;
    def55: string;
    hpRainbow: string;
    atkRainbow: string;
    defRainbow: string;
    superName: string;
    superDescription: string;
    hasUltra: boolean;
    ultraName: string;
    ultraDescription: string;
    passiveName: string;
    passiveDescription: string;
}

export const EMPTY_FORM: CharacterFormValues = {
    name: '',
    title: '',
    characterClass: 'super',
    type: 'agl',
    leaderSkill: '',
    hp55: '',
    atk55: '',
    def55: '',
    hpRainbow: '',
    atkRainbow: '',
    defRainbow: '',
    superName: '',
    superDescription: '',
    hasUltra: false,
    ultraName: '',
    ultraDescription: '',
    passiveName: '',
    passiveDescription: ''
}

const STAT_KEYS = ['hp55', 'atk55', 'def55', 'hpRainbow', 'atkRainbow', 'defRainbow'] as const;

export function validateCharacterForm(form: CharacterFormValues): string{
    //Name
    if(form.name.trim() === ''){
        return 'Name is required';
    }

    //Title
    if(form.title.trim() === ''){
        return 'Title is required';
    }

    // Name and Title Length
    if(form.name.trim().length > 100 || form.title.length > 100){
        return 'Name and title must be 100 characters or less';
    }

    // Leader Skill
    if(form.leaderSkill.trim() === ''){
        return 'Leader skill is required';
    }

    // Stats
    for (const key of STAT_KEYS) {
        if (!/^\d{1,7}$/.test(form[key].trim())) {
            return 'Stats must be whole numbers with up to 7 digits';
        }
    }

    // Super Atk name
    if (form.superName.trim() === '' || form.superDescription.trim() === '') {
        return 'The 12 Ki super attack needs a name and a description';
    }

    // if 18 ki check name an description
    if (form.hasUltra && (form.ultraName.trim() === '' || form.ultraDescription.trim() === '')) {
        return 'The 18 Ki super attack needs a name and a description';
    }

    // Passive Skill check
    const hasPassiveName = form.passiveName.trim() !== '';
    const hasPassiveDescription = form.passiveDescription.trim() !== '';

    // Cant have a name without description or vice versa
    if (hasPassiveName !== hasPassiveDescription) {
        return 'The passive needs both a name and a description, or leave both empty';
    }

    return '';
}

export function characterRow(form: CharacterFormValues){
    
    // Holds 12 ki super and if hasUltra holds the 18 ki 
    const supers = [
        {style: 'Normal', kiNeeded: 12, name: form.superName.trim(), description: form.superDescription.trim() }
    ];

    if(form.hasUltra){
        supers.push({style: 'Hyper', kiNeeded: 18, name: form.ultraName.trim(), description: form.ultraDescription.trim() });
    }

    return {
        name: form.name.trim(),
        title: form.title.trim(),
        class: form.characterClass,
        type: form.type,
        leader_skill: form.leaderSkill.trim(),
        hp_55: Number(form.hp55),
        atk_55: Number(form.atk55),
        def_55: Number(form.def55),
        hp_rainbow: Number(form.hpRainbow),
        atk_rainbow: Number(form.atkRainbow),
        def_rainbow: Number(form.defRainbow),
        supers,
        passive_name: form.passiveName.trim() || null,
        passive_description: form.passiveDescription.trim() || null
    };
}

export type CharacterData = {
    id: number;
    name: string;
    title: string;
    leaderSkill: string;
    supers: { style: string; kiNeeded: number; name: string; description: string }[];
    passive?: { name: string; description: string } | null;
    stats: {
        fiftyFive: { hp: number; atk: number; def: number };
        rainbow: { hp: number; atk: number; def: number };
    };
    class: string;
    type: string;
    openAt: string;
}

/**
 * Checks whether a character fits the standard 12 ki 18 ki super attacks and if not wont allow them to be editted
 * @param character character being assessed for editing
 * @returns a boolean on wether the character can be editted or not.
 */
export function canEditInForm(character: CharacterData): boolean{
    const { supers } = character;

    if(supers.length === 0 || supers.length > 2) return false;
    if(supers[0].kiNeeded !== 12) return false;

    return supers.length === 1 || supers[1].kiNeeded === 18;
}

export function ConvertCharToForm(c: CharacterData): CharacterFormValues{
    const [normal, ultra] = c.supers;

    return{
        name: c.name,
        title: c.title,
        characterClass: c.class,
        type: c.type,
        leaderSkill: c.leaderSkill,
        hp55: String(c.stats.fiftyFive.hp),
        atk55: String(c.stats.fiftyFive.atk),
        def55: String(c.stats.fiftyFive.def),
        hpRainbow: String(c.stats.rainbow.hp),
        atkRainbow: String(c.stats.rainbow.atk),
        defRainbow: String(c.stats.rainbow.def),
        superName: normal.name,
        superDescription: normal.description,
        hasUltra: ultra !== undefined,
        ultraName: ultra?.name ?? '',
        ultraDescription: ultra?.description ?? '',
        passiveName: c.passive?.name ?? '',
        passiveDescription: c.passive?.description ?? ''
    };
}