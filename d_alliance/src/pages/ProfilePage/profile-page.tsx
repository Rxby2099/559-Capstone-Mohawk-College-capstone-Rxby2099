import './profile-page.css'

import Header from '../../components/header-&-footer/header'
import Footer from '../../components/header-&-footer/footer'
import EditTeam from '@/components/forms/edit-team-form/edit-team-form'
import DeleteTeam from '@/components/forms/delete-team-form/delete-team-form'
import TeamCard from '../../components/TeamCard/team-card'
import supabase from '@/lib/supabase-frontend'
import { useNavigate } from 'react-router-dom'
import { fetchTeamsAndCharacters, type Team } from '@/lib/teams'
import gokuPic from '../../assets/HiImGoku.jpg'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import EditProfile from '@/components/forms/edit-profile-form/edit-profile-form'

export default function ProfilePage() {

    type UserProfile = {
        username: string;
        email: string;
        created_at: string;
    }

    const navigate = useNavigate();
    const { user} = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [teams, setTeams] = useState<Team[]>([]);
    const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
    const editingTeam = teams.find(t => t.id === editingTeamId);
    const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null)
    const deletingTeam = teams.find(t => t.id === deletingTeamId);

    /**
     * Queries the database to retrieve the users username, email and created_at time
     * 
     * @returns returns an object of the users username, email, and time created all unpacked from data
     */
    async function fetchProfile() {

        if (!user) return;

        const { data, error} = await supabase
            .from('users')
            .select('username, email, created_at')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching profile:', error)
            return;
        }

        setProfile(data);
    }

    useEffect(() => {
        fetchProfile();
    }, [user])

    async function loadTeams() {
        if (!user) return;
        try {
            setTeams(await fetchTeamsAndCharacters());
        } catch (error) {
            console.error('Error fetching teams: ', error);
        }
    }
    
    useEffect(() => {
        loadTeams();
    }, [user])


    /**
     * handles the logging out functionality, calling supase's built in signout
     */
    async function handleLogout() {
        await supabase.auth.signOut();
        navigate('/login');
    }



    return(
        <>
            <Header/>
            <main id = "pageContentWrapper">
                <div id = "profileWrapper">
                    <h1 className='title'>Your Profile Page</h1>
                    
                    <div className='profileSection'>
                        <div className='profilePicSection'>
                            <div className="profilePicCircle">
                                <img src = {gokuPic} alt="profile" />
                            </div>
                            <a href="#" className="changePicLink">Change Picture</a>
                        </div>
                        <div className='informationSection'>
                            <h2>Username: </h2>
                            <p>{profile?.username ?? 'Loading...'}</p>

                            <h2>Email: </h2>
                            <p>{profile?.email ?? 'Loading...'}</p>

                            <h2>Date Joined: </h2>
                            <p>{profile ? new Date(profile.created_at).toLocaleDateString() : 'Loading...'}</p>
                            <button id = 'editProfile' type='button' onClick={ () => setShowEditProfile(true)}>Edit Profile</button>

                            {showEditProfile && (
                                <EditProfile 
                                onClose={() => setShowEditProfile(false)}
                                onUpdate={fetchProfile} />
                            )}
                        </div>

                        <div className = "verticalSeparator"></div>

                        <div className='teamsSection'>
                            <h3 id = "teamTitle">Teams</h3>
                            {teams.map(team => (
                                <TeamCard key = {team.id} name = {team.name} members = {team.members} onEdit = {() => setEditingTeamId(team.id)} onDelete = {() => setDeletingTeamId(team.id)} />
                            ))}
                             {editingTeam && (
                                <EditTeam team = {editingTeam} onClose = {() => setEditingTeamId(null)} onChanged = {loadTeams} />
                            )}
                            {deletingTeam && (
                                <DeleteTeam team = {deletingTeam} onClose={() => setDeletingTeamId(null)} onChanged={loadTeams} />
                            )}
                        </div>
                    </div>
                    <button id = 'logoutButton' type='button' onClick={handleLogout}>Logout!</button>
                </div>
            </main>
            <Footer/>
        </>
    )
}