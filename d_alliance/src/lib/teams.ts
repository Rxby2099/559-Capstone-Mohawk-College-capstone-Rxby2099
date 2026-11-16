import supabase from "./supabase-frontend";

export type TeamRow = {
    id: string;
    name: string;
    team_members: { slot: number; card_id: number}[];
}

export async function fetchUserTeams(): Promise<TeamRow[]>{
    const {data, error} = await supabase
        .from('teams')
        .select('id, name, team_members(slot, card_id)')
        .order('created_at');

    if(error)throw error;
    return (data ?? []) as TeamRow[];
}