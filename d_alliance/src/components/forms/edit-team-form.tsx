import "./edit-profile-form.css";
import "./edit-team-form.css";

import { useEffect, useState, type SubmitEvent } from "react";
import { API_URL } from "@/lib/api";
import type { Team, TeamMember } from "@/lib/teams";

type EditTeamProps = {
    team: Team;
    onClose?(): void;
};

export default function EditTeam({ team, onClose }: EditTeamProps){
    const [selectedSlot, setSelectedSlot] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    function handlePick(card: TeamMember){
        console.log(`slot ${selectedSlot} <- card ${card.id}`)
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
                        <button key ={card.id} type = "button" className="editResult" onClick={() => handlePick(card)}>
                            {card.title} | {card.name}
                        </button>
                    ))}
                </div>
                <button type = "button" onClick={onClose}>Close</button>
            </div>
        </div>
    )
    
 }