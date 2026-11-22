import "../edit-profile-form/edit-profile-form.css"
import "./edit-team-form.css";

import supabase from "@/lib/supabase-frontend";
import { useEffect, useState, type SubmitEvent } from "react";
import { API_URL } from "@/lib/api";
import type { Team, TeamMember } from "@/lib/teams";

type EditTeamProps = {
    team: Team;
    onClose: () => void;
    onChanged: () => Promise<void>; 
};

export default function EditTeam({ team, onClose, onChanged }: EditTeamProps){
    const [selectedSlot, setSelectedSlot] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if(search === '')return;
        let cancelled = false;

        async function loadResults(){
            setLoading(true);
            setError('');
            try{
                const params = new URLSearchParams({ search });
                const res = await fetch(`${API_URL}/api/cards?${params}`);
                if(!res.ok){
                    throw new Error(`Request failed (${res.status})`);
                }

                const json = await res.json();
                if(!cancelled){
                    setResults(json.data);
                } 
            }

            catch(error){
                if(!cancelled){
                    setError(error instanceof Error ? error.message : 'Something went Wrong')
                }
            }

            finally{
                if(!cancelled){
                    setLoading(false);
                }
            }
        }
        loadResults();

        return function cleanup(){
            cancelled = true;
        }
    }, [search])

    function handleSearch(e: SubmitEvent<HTMLFormElement>){
        e.preventDefault();
        setSearch(searchInput.trim())
    }

    async function handlePick(card: TeamMember){
        for(let i = 0; i < team.members.length; i++){
            const member = team.members[i];
            if(member && member.id === card.id && i !== selectedSlot){
                setError('That card is already on this team');
                return;
            }
        }
        setSaving(true);
        setError('');

        const {error: saveError } = await supabase 
            .from('team_members')
            .upsert(
                { team_id: team.id, slot: selectedSlot, card_id: card.id},
                {onConflict: 'team_id,slot'}
            );

            setSaving(false);

            if(saveError){
                console.error("Error saving character: ", saveError);
                setError('Could not save that character, pelase try again!');
                return;
            }

            await onChanged();
    }

    async function handleRemove(){
        setSaving(true);
        setError('');

        const { error: removeError} = await supabase
            .from('team_members')
            .delete()
            .eq('team_id', team.id)
            .eq('slot', selectedSlot);
        
        setSaving(false);

        if(removeError){
            console.error('Error removing character: ', removeError);
            setError('Could not remove that character, please try again!');
            return;
        }

        await onChanged();
    }

    return(
        <div className="modalOverlay">
            <div className="editTeamForm">
                <h1 className="titleText">{team.name}</h1>

                <div className="editTeamSlots">
                    {team.members.map((member, i) => (
                        <button
                            key = {i}
                            type = "button"
                            className={i === selectedSlot ? 'editSlot selectedSlot' : 'editSlot'}
                            onClick = {() => setSelectedSlot(i)}>
                            {member ? `${member.title} | ${member.name}` : 'Empty Slot'}
                        </button>
                    ))}
                </div>

                <button type = "button" onClick = {handleRemove} disabled={saving || team.members[selectedSlot] === null}>
                     Remove from slot {selectedSlot + 1}   
                </button> 
                
                <form onSubmit={handleSearch}>
                    <label htmlFor="teamSearch">Search</label>
                    <input
                        type = "text"
                        id = "teamSearch"
                        name = "teamSearch"
                        placeholder = "Search character..."
                        spellCheck = "false"
                        value = {searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}>
                    </input>
                    <button type = "submit">Search</button>
                </form>

                {error && <p role = "alert">{error}</p>}
                {loading && <p>loading...</p>}
                {!loading && search && results.length === 0 && <p>No characters found.</p>}
                <div className="editTeamResults">
                    {search && results.map(card => (
                        <button key ={card.id} type = "button" className="editResult" disabled = {saving} onClick={() => handlePick(card)}>
                            {card.title} | {card.name}
                        </button>
                    ))}
                </div>
                <button type = "button" onClick={onClose}>Close</button>
            </div>
        </div>
    )
    
 }