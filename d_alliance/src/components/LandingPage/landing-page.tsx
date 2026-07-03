import '../background.css'
import './landing-page.css'

import Header from '../header-&-footer/header'
import Footer from '../header-&-footer/footer'

export default function LandingPage() {

    return(
        <>
            <Header />
                <div id = "pageContentWrapper">
                    <div id = "newsAndDescripion">
                        <h2 id = "subtitles">Welcome to Dokkan Alliance!</h2>

                    </div>
                    
                    <div id = "verticalSeparator"></div>

                    <div id = "recentUnits">
                        <h2 id = "subtitles">Recent Units:</h2>
                    </div>
                </div>
            <Footer />
        </>
    )}