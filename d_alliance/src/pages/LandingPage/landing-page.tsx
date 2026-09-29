import './landing-page.css'

import Header from '@/components/header-&-footer/header'
import Footer from '@/components/header-&-footer/footer'

import CharacterBox from '@/components/character-box/character-box'

import GokuImg from '@/assets/HiImGoku.jpg'

/**
 * The dasaboard of Dokkan alliance where the user will be greeted with:
 * information on the website and what is to be expected of it
 * TO BE ADDED:
 * display of recently added characters, currently showing as an array of character 
 * slots with a goku placeholder.
 * @returns The landing page/dashboard of Dokkan Alliance
 */
export default function LandingPage() {

    return(
        <>
            <Header />
                <div id = "landingPageWrapper">

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
                                length: 18 }).map((_, i) => (<CharacterBox key={i} image= {GokuImg}  />
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
                            <p>Browse a catalogue of all the different cards in the game, select them, and assess the card. Look into the many specific details on any card such as:</p>

                            <br></br>

                            <ul>
                                <li>Leader skill</li>
                                <li>Active skill</li>
                                <li>Super attack effects</li>
                                <li>Link Skills</li>
                                <li>Categories</li>
                                <li>Domains</li>
                                <li>Revival skills</li>
                                <li>Reversible exchanges</li>
                            </ul>

                        </div>
                            
                        

                        <div id = "userCol">
                            <h3 className="subtitles">Edit Your Profile</h3>

                            <p>Visit your own profile page where you;ll be able to view your personal account data like your email and username, as well as changing your profile picture to match your own vibe</p>
                            
                            <br></br>

                            <p>Once your profile is setup to your liking, its time to make some teams and get them saved to your profile where you can go to view and edit them at any time.</p>

                        </div>
                        
                        <div id = "teamsCol">

                            <h3 className="subtitles">Build Teams</h3>
                            <p>Once you've browsed enough at the cards you like, its time to assemble a team of your strongest cards.</p>
                            
                            <br></br>

                            <p>Whether it's a team with all around utility to take into the strongest events like Red Zones, or a team with a specific strategy in mind for fights with certain gimmicks. </p>

                            <br></br>

                            <p>After saving some teams, its time to open DBZ Dokkan Battle and put these teams to use, whether its a team you plan to make after aquirring certain characters you dont yet have, or a team you can test out and take to battle right away.</p>
                        
                        </div>
                    </div>
                </div>
            <Footer />
        </>
    )}