import './profile-page.css'

import Header from '../../components/header-&-footer/header'
import Footer from '../../components/header-&-footer/footer'
import TeamCard from '../../components/TeamCard/team-card'

import gokuPic from '../../assets/HiImGoku.jpg'

export default function ProfilePage() {
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
                        <div className='teamsSection'>
                            <h3 id = "teamTitle">Teams</h3>
                            <TeamCard/>
                        </div>
                    </div>
                    

                    <button id = 'logoutButton' type='button'>Logout!</button>
                </div>
            </main>
            <Footer/>
        </>
    )
}