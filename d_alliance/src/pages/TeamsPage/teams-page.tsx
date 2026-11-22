import './teams-page.css'

import TeamCard from '@/components/TeamCard/team-card'
import Header from '@/components/header-&-footer/header'
import Footer from '@/components/header-&-footer/footer'

import CreateTeam from '@/components/forms/team-creation-form'
import EditTeam from '@/components/forms/edit-team-form'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { fetchTeamsAndCharacters, type Team } from '@/lib/teams'

export default function TeamsPage() {
    const {user} = useAuth();
    const [teams, setTeams] = useState<Team[]>([]);
    const [showCreateTeam, setShowCreateTeam] = useState(false);
    const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
    const editingTeam = teams.find(t => t.id === editingTeamId);
    
    async function loadTeams() {
        if(!user) return;
        try{
            setTeams(await fetchTeamsAndCharacters());
        }
        catch(error){
            console.error('Error fetching teams: ', error);
        }
    }

    // handleDelete(){
    //     set
    // }

    useEffect(() =>{
        loadTeams();
    }, [user])

    return(
        <>
            <Header/>
                <div className='teamsPageContainer'>
                    <h1 className='teamsTitle'>Teams</h1>
                    <button type='button' className='createTeamButton' onClick={() => setShowCreateTeam(true)}>
                        Create Team
                    </button>
                    {showCreateTeam && (
                        <CreateTeam
                            onClose={() => setShowCreateTeam(false)}
                            onCreated={loadTeams} 
                        />
                    )}
                    
                    {teams.map(team => (
                        <TeamCard key = {team.id} name = {team.name} members = {team.members} onEdit = {() => setEditingTeamId(team.id)} />
                    ))}
                    {editingTeam && (
                        <EditTeam team = {editingTeam} onClose = {() => setEditingTeamId(null)} onChanged = {loadTeams} />
                    )}
                </div>
            <Footer/>
        </>
    )
}