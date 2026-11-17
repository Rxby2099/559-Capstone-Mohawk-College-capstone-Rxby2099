import supabase from "./supabase-frontend";
import { API_URL } from "./api";

export type TeamRow = {
    id: string;
    name: string;
    team_members: { slot: number; card_id: number}[];
}

export type TeamMember = {
    id: number;
    name: string;
    title: string
}

export type Team = {
    id: string;
    name: string;
    members: TeamMember[]
}

export async function fetchUserTeams(): Promise<TeamRow[]>{
    const {data, error} = await supabase
        .from('teams')
        .select('id, name, team_members(slot, card_id)')
        .order('created_at');

    if(error)throw error;
    return (data ?? []) as TeamRow[];
}

export async function fetchTeamsAndCharacters(): Promise<Team[]> {
    const rows = await fetchUserTeams();
    const ids = [... new Set(rows.flatMap(t => t.team_members.map(m => m.card_id)))];

    let cards: TeamMember[] = [];
    if(ids.length > 0){
        const res = await fetch(`${API_URL}/api/cards/by-ids?ids=${ids.join(',')}`);
        if(!res.ok){
            throw new Error(`Request failed (${res.status})`);
        }
        cards = await res.json();
    }

    const cardsById = new Map(cards.map(c => [c.id, c]));

    return rows.map(t => ({
        id: t.id,
        name: t.name,
        members: [...t.team_members]
            .sort((a,b) => a.slot - b.slot)
            .map(m => cardsById.get(m.card_id))
            .filter((c): c is TeamMember => c !== undefined),
    }));
}