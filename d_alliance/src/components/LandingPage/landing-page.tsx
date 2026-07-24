import '../background.css'
import './landing-page.css'

import Header from '../header-&-footer/header'
import Footer from '../header-&-footer/footer'

import CharacterBox from '../character-box/character-box'

export default function LandingPage() {

    return(
        <>
            <Header />
                <div id = "pageContentWrapper">

                    <div id = "newsAndDescripion">
                        <h2 className = "titles">Welcome to Dokkan Alliance!</h2>

                        <div id = "dashboardMessage">
                            <p>
                                Discover the ultimate Dragon Ball Z Dokkan Battle experience. 
                                Build your perfect team, explore powerful characters, and discover 
                                new strategic combinations to dominate the battlefield.
                            </p>

                            <br></br>

                            <p>
                                Dokkan Alliance provides you all the tools you'll need to create 
                                the ideal team for yourself. Allowing you to browse all the characters 
                                in the game, as well as assemble teams of said characters.
                            </p>

                            <br></br>

                            <p>
                                Join our community of dedicated players and sign up to take your 
                                game to the next level. Explore character stats, team synergies, and powerful strategies 
                                that will help you conquer even the toughest events.
                            </p>
                        </div>

                    </div>

                    <div id = "verticalSeparator"></div>

                    <div id = "recentUnits">
                        <h2 className = "titles">Recent Units:</h2>

                        <div id = "recentIcons">
                           
                            {Array.from({ 
                                length: 18 }).map((_, i) => (<CharacterBox key={i}/>
                            ))}
                        </div>
                    </div>
                    
                </div>
                <div id = "informationSection">
                    <div id = "heading">
                        <h2 className = "titles">What You'll Find Here</h2>
                    </div>
                    <div id = "infoGrid">
                        <div id = "cardsCol">
                            <h3 className="subtitles">View Cards</h3>
                            <p>Browse a catalogue of all the different cards in the game, select them, and assess the card.</p>
                            <br></br>
                            <p>Look into the many specific details on any card such as:</p>
                            <ul>
                                <li>Leader skill</li>
                                <li>Active skill</li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                            
                        <div id = "teamsCol">
                            <h3 className="subtitles">Build Teams</h3>
                            <p></p>
                        </div>

                        <div id = "userCol">
                            <h3 className="subtitles">Edit Your Profile</h3>
                            <p></p>
                        </div>
                    </div>
                </div>
            <Footer />
        </>
    )}