import "./footer.css"
import { Link } from "react-router-dom"

export default function Footer(){
    return(
        <footer>
            <div id = "navBar">
                <nav>
                    <ul>
                        <li><Link to= "#">Terms of Service</Link></li>
                        <li><p> | </p></li>
                        <li><Link to= "#">Privacy Policy</Link></li>
                        <li><p> | </p></li>
                        <li><a href="#">Contact us</a></li>        
                    </ul>
                </nav>
            </div>
        </footer>
    )
}
