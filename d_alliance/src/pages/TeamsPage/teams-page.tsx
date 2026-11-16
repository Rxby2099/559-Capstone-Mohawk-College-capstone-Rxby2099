import './teams-page.css'

import TeamCard from '@/components/TeamCard/team-card'
import Header from '@/components/header-&-footer/header'
import Footer from '@/components/header-&-footer/footer'
import { use, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { fetchUserTeams } from '@/lib/teams'

const SAMPLE_TEAMS = [
    {
        id: 'sample-1',
        name: 'Test Team',
        members: [
            { id: 4031441, name: 'Zamasu + Goku Black (Super Saiyan Rosé)', title: 'Terrifying Zero Mortals Plan' },
            { id: 4032131, name: 'Super Saiyan Trunks (Youth) (Future)', title: 'Bonds Leading to the Future' },
        ],
    },
    {
        id: 'sample-2',
        name: 'Empty Team',
        members: [],
    },
]

export default function TeamsPage() {
    const {user} = useAuth();

    useEffect(() => {
        if(!user) return;
        async function loadTeams() {
            try{
                const teams = await fetchUserTeams();
                console.log(teams);
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
                    {SAMPLE_TEAMS.map(team => (
                        <TeamCard key = {team.id} name = {team.name} members = {team.members} />
                    ))}
                </div>
            <Footer/>
        </>
    )
}