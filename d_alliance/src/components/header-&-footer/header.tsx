import "./header.css"
import starImage from '../../assets/1star.png';
import {Link} from "react-router-dom"
 
export default function Header(){

    return(
        <header>
            <div id = "headerLogo">
                    <img src = {starImage} alt = "1 star"/> 
                    <p>DokkanAlliance</p>
            </div>
            <div id = "navBar">
                <nav>
                    <ul>
                        <li><Link to= "/dashboard">Home</Link></li>
                        <li><Link to= "/cards">Cards</Link></li>
                        <li><Link to= "/teams">Teams</Link></li>
                        <li><Link to= "#">About us</Link></li>
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
