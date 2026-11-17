import './teams-page.css'

import TeamCard from '@/components/TeamCard/team-card'
import Header from '@/components/header-&-footer/header'
import Footer from '@/components/header-&-footer/footer'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { fetchTeamsAndCharacters, type Team } from '@/lib/teams'

export default function TeamsPage() {
    const {user} = useAuth();
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        if(!user) return;
        async function loadTeams() {
            try{
                setTeams(await fetchTeamsAndCharacters());
            }
            catch(error){
                console.error('Error fetching teams: ', error);
            }
        }
        loadTeams();
    }, [user])
    return(
        <>
            <Header/>
                <div className='teamsPageContainer'>
                    <h1 className='teamsTitle'>Teams</h1>
                    {teams.map(team => (
                        <TeamCard key = {team.id} name = {team.name} members = {team.members} />
                    ))}
                </div>
            <Footer/>
        </>
    )
}