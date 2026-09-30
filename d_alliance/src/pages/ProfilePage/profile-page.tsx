import './profile-page.css'

import Header from '../../components/header-&-footer/header'
import Footer from '../../components/header-&-footer/footer'
import TeamCard from '../../components/TeamCard/team-card'
import supabase from '@/lib/supabase-frontend'
import { useNavigate } from 'react-router-dom'

import gokuPic from '../../assets/HiImGoku.jpg'
import { use } from 'react'

export default function ProfilePage() {

    const navigate = useNavigate();

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
                            <p>@usernameFillerText</p>

                            <h2>Email: </h2>
                            <p>@emailFillerText</p>

                            <h2>Date Joined: </h2>
                            <p>DD/MM/YYY</p>
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