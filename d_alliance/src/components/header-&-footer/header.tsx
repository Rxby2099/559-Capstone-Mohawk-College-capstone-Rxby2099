import "./header.css"
import starImage from '@/assets/1star.png';
import {Link} from "react-router-dom"
 
/**
 * This page returns the header which contains the navbar to navigate through the different pages
 * accross the website, to be displayed on all pages except log in.
 * @returns The header to be used across all pages in Dokkan Alliance except log in.
 */
export default function Header(){

    return(
        <header>
            <div id = "headerLogo">
                    <img src = {starImage} alt = "1 star"/> 
                    <p>DokkanAlliance</p>
            </div>
            <div id = "headerNav">
                <nav>
                    <ul>
                        <li><Link to= "/dashboard">Home</Link></li>
                        <li><Link to= "/cards">Cards</Link></li>
                        <li><Link to= "/teams">Teams</Link></li>
                    </ul>
                </nav>
            </div>
            <div id = "viewProfile">
                <Link to = "/profile">
                    <div id = "profilePic"></div>
                    <div id = "profileLink">View Profile</div>
                </Link>
            </div>     
            
        </header>
    )
}
