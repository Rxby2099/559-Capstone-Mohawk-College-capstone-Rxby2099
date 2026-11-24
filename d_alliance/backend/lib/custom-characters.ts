import supabase from '../supabase-backend';

export type CustomCharacter = {
    id: number;
    name: string;
    title: string;
    class: string;
    type: string;
    open_at: string;
}

export async function getCustomChars(): Promise<CustomCharacter[]> {
    const {data, error} = await supabase
        .from('characters')
        .select('id, name, title, class, type, open_at');
        
    if(error){
        console.error('Error reading custom characters: ', error);
        return [];
    }

    return data as CustomCharacter[];
}