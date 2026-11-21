import "./edit-profile-form.css";
import "./edit-team-form.css";

import { useEffect, useState } from "react";
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

    
 }