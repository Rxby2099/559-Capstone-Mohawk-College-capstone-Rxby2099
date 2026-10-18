import "./footer.css"
import { Link } from "react-router-dom"

/**
 * This page returns the footer which contains the navbar to navigate through the different pages
 * accross the website, to be displayed on all pages.
 * @returns The footer to be used across all pages in Dokkan Alliance
 */
export default function Footer(){
    return(
        <footer>
            <div id = "footerNav">
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
