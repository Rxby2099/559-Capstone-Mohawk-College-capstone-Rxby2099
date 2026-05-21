import "./header.css"
import starImage from '../../assets/1star.png';
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
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Cards</a></li>
                        <li><a href="#">About us</a></li>
                    </ul>
                </nav>
            </div>
                
            
        </header>
    )
}
