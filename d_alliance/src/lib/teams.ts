import supabase from "./supabase-frontend";
import { API_URL } from "./api";

const TEAM_SIZE = 6;

/**
 * Object to contain data fetched from supabase of a users team
 */
export type TeamRow = {
    id: string;
    name: string;
    team_members: { slot: number; card_id: number}[];
}

/**
 * Object to contain data of a team member from the TeamRow
 */
export type TeamMember = {
    id: number;
    name: string;
    title: string;
}

/**
 * Object to contain data fetched from supabase of a users TeamRow and the members name and title from TeamMember fetched from
 * the global dokkan database
 */
export type Team = {
    id: string;
    name: string;
    members: (TeamMember | null)[];
}

/**
 * Fetches the users teams from supabase
 * @returns data containing the TeamRow for the requested team
 */
export async function fetchUserTeams(): Promise<TeamRow[]>{
    const {data, error} = await supabase
        .from('teams')
        .select('id, name, team_members(slot, card_id)')
        .order('created_at');

    if(error)throw error;
    return (data ?? []) as TeamRow[];
}

/**
 * using fetchUserTeams to get the users already saved teams, and will make an api call based on the ids in the TeamRows member IDs
 * to retreive the name and title of the card from the global dokkan database.
 * @returns The team data with the characters name and title
 */
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

    const teams: Team[] = [];
    for (const row of rows){
        const members = new Array<TeamMember | null>(TEAM_SIZE).fill(null);
        for (const member of row.team_members) {
            if (member.slot < 0 || member.slot >= TEAM_SIZE) continue;
            members[member.slot] = cardsById.get(member.card_id) ?? null;
        }
        teams.push({id: row.id, name: row.name, members});
    }
    return teams;
}