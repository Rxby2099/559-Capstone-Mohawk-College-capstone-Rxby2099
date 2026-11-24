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
    if(form.name.trim() === ''){
        return 'Name is required';
    }

    if(form.title.trim() === ''){
        return 'Title is required';
    }

    if(form.name.trim().length > 100 || form.title.length > 100){
        return 'Name and title must be ';
    }

    if(form.leaderSkill.trim() === ''){
        return 'Leader skill is required';
    }

}