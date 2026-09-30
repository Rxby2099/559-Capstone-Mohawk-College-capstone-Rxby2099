import './profile-page.css'

import Header from '../../components/header-&-footer/header'
import Footer from '../../components/header-&-footer/footer'
import TeamCard from '../../components/TeamCard/team-card'
import supabase from '@/lib/supabase-frontend'
import { useNavigate } from 'react-router-dom'

import gokuPic from '../../assets/HiImGoku.jpg'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function ProfilePage() {

    type UserProfile = {
        username: string;
        email: string;
        created_at: string;
    }

    const navigate = useNavigate();
    const { user} = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (!user) return;

        const currentUser = user;

        async function fetchProfile() {
            const { data, error} = await supabase
                .from('users')
                .select('username, email, created_at')
                .eq('id', currentUser.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error)
                return;
            }

            setProfile(data);
        }

        fetchProfile();
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
                        </div>

                        <div className = "verticalSeparator"></div>

                        <div className='teamsSection'>
                            <h3 id = "teamTitle">Teams</h3>
                            <TeamCard name = "DAIMA"/>
                            <TeamCard name = "Goku Fam"/>
                        </div>
                    </div>
                    

                    <button id = 'logoutButton' type='button' onClick={handleLogout}>Logout!</button>
                </div>
            </main>
            <Footer/>
        </>
    )
}