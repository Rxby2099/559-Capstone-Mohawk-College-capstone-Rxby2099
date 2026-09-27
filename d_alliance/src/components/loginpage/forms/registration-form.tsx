import "./log-reg-form.css"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import supabase from '../../../supabase-frontend'
import { useNavigate } from "react-router-dom";


/**
 * The function to export the registration form to be used on the LoginPage.
 * 
 * @returns The HTML for the registration form to be used on the LoginPage.
 */
export default function RegistrationForm() {

    const [registrationData, setRegistrationData] = useState({ email: '', username: '', password: ''});
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [password2, setPassword2] = useState('');
    const [missingFields, setMissingFields] = useState('');
    const [noMatch, setNoMatch] = useState('');
    const [usernameToken, setUsernameToken] = useState('');
    const [emailToken, setEmailToken] = useState('');

    const navigate = useNavigate();
    
    //Password Validation constants
    const digit = /[0-9]/
    const uppercase = /[A-Z]/
    const lowercase = /[a-z]/
    const nonAlphanumeric = /[^0-9A-Za-z]/
    


    /**
     * Handles the submission of the user registration form. It checks whether the password
     * entered by the user is valid or not (requiring a min of 8 and max of 64 characters,
     * a symbol, a lowercase and uppercase letter, and a number) and will check if the confirmed
     * password matches the original. 
     * 
     * On successful validation, it will send a POST request to the /signup endpoint
     * with the user's registration data
     * 
     * On failure, an appropriate error message will be displayed to the user, prompting them to
     * make adjustments to their passowrd(s).
     * 
     * @param e The event to submit the form.
     */
    async function handleRegistration(e: React.FormEvent) {
        e.preventDefault();
        setUsernameToken('');
        setEmailToken('');
        setMissingFields('');
        let error = false;


        if(!digit.test(registrationData.password) ||
            !uppercase.test(registrationData.password) || 
            !lowercase.test(registrationData.password) ||
            !nonAlphanumeric.test(registrationData.password) || 
            registrationData.password.length < 8 ||
            registrationData.password.length > 64 ){
            
                setMissingFields("Password must contain 1: uppercase letter, lowercase letter, number and symbol!");
                error = true;
                
        }

        else{
            setMissingFields('');
        }

        if (password2 != registrationData.password){
            setNoMatch("Passwords must match!");
            error = true;
        }

        else{
            setNoMatch('');
        }

        if(error){
            return;
        }

        const resp = await fetch("http://localhost:8000/signup", {
            method: "POST",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(registrationData)
        });

        const data = await resp.json();
        console.log("Registration response:", data);

        // Checks if the response was okay and awaits
        if (resp.ok && data.session) {
            await supabase.auth.setSession({
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token
            });

            navigate("/dashboard")
        } 

        else if (data.message === 'Username taken'){
            setUsernameToken('Username is already taken!');
        }

        else if (data.message === 'Email already in use'){
            setEmailToken('Email is already taken!')
        }
        
    }
    
    return (
        <div id = "registrationForm">
            <form onSubmit={handleRegistration}>

                <div>
                    <h1 className = "titleText">Registration</h1>
                </div>

                <div id = "emailSection">
                    <label htmlFor ="email">Email:</label>

                    <input 
                        type = "email" 
                        id = "email" 
                        name = "email" 
                        maxLength={254}
                        autoComplete = "Enter Email" 
                        placeholder="Enter Email" 
                        spellCheck = "false"
                        value = {registrationData.email}
                        onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                    />
                    <p id = "emailErrorStr" title = "emailError">{emailToken}</p>
                </div>

                <div id = "usernameSection">
                    <label htmlFor ="username">Username:</label>
                    <input 
                        type = "text" 
                        id = "username" 
                        name = "username" 
                        minLength={3}
                        maxLength={20}
                        autoComplete = "Enter Username" 
                        placeholder="Enter Username" 
                        spellCheck = "false" 
                        value = {registrationData.username}
                        onChange={(e) => setRegistrationData({...registrationData, username: e.target.value})}/>
                    <p id = "usernameErrorStr" title = "usernameError">{usernameToken}</p>
                </div>

                <div id = "passwordSection">
                    <div>
                        <label htmlFor = "password1">Password:</label>
                        <div id = "passwordAndEye">
                            <input 
                                type={showPassword ? "text" : "password"}
                                id = "password1" 
                                name = "password1" 
                                minLength={8}
                                maxLength={64}
                                autoComplete = "Enter Password" placeholder="Enter Password"
                                value = {registrationData.password}
                                onChange={(e) => setRegistrationData({...registrationData, password: e.target.value})}
                                
                            />
                            <button id = "passwordToggle" type="button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p id = "passwordErrorStr" title = "errorMsg">{missingFields}</p>
                    </div>

                    <div>
                        <label htmlFor = "password2">Re-Enter Password:</label>
                        <div id = "passwordAndEye">
                            <input 
                                type={showPassword2 ? "text" : "password"}
                                id = "password2" 
                                name = "password2" 
                                minLength={8}
                                maxLength={64}
                                autoComplete = "Re-Enter Password" 
                                placeholder="Re-Enter Password"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                            />
                            <button id = "passwordToggle" type="button" onClick={() => setShowPassword2(!showPassword2)}>
                                {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p id = "passwordErrorStr" title = "errorMsgPass2">{noMatch}</p>
                    </div>
                </div>

                <div id = "registerButton">
                    <button 
                        id = "submitButton" 
                        title = "subBtn" 
                        type="submit"
                >Register</button>
                </div>
                
            </form>

        </div>
    )
}