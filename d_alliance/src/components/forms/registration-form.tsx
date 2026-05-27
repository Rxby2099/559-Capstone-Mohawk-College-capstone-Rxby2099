import "./registration-form.css"
import { useState } from "react"

export default function RegistrationForm() {
    const [registrationData, setRegistrationData] = useState({ email: '', username: '', password: ''});
    async function handleRegistration(e: React.FormEvent) {
        e.preventDefault();
        const resp = await fetch("http://localhost:8000/signup", {
            method: "POST",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(registrationData)
        });
        const data = await resp.json();
        console.log("Registrtion response:", data);
    }
    
    return (
        <div id = "registrationForm">
            <form onSubmit={handleRegistration}>

                <div>
                    <p id = "titleText">Registration</p>
                </div>

                <div id = "emailSection">
                    <label htmlFor ="email">Email:</label>

                    <input 
                        type = "text" 
                        id = "email" 
                        name = "email" 
                        autoComplete = "Enter Email" 
                        placeholder="Enter Email" 
                        spellCheck = "false"
                        value = {registrationData.email}
                        onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                    />
                </div>

                <div id = "usernameSection">
                    <label htmlFor ="username">Username:</label>
                    <input 
                        type = "text" 
                        id = "username" 
                        name = "username" 
                        autoComplete = "Enter Username" placeholder="Enter Username" 
                        spellCheck = "false" 
                        value = {registrationData.username}
                        onChange={(e) => setRegistrationData({...registrationData, username: e.target.value})}/>
                </div>

                <div id = "passwordSection">
                    <div>
                        <label htmlFor = "password1">Password:</label>
                        <input 
                            type = "text" 
                            id = "password1" 
                            name = "password1" 
                            autoComplete = "Enter Password" placeholder="Enter Password"
                            value = {registrationData.password}
                            onChange={(e) => setRegistrationData({...registrationData, password: e.target.value})}
                        />
                    </div>

                    <div>
                        <label htmlFor = "password2">Re-Enter Password:</label>
                        <input type = "text" id = "password2" name = "password2" autoComplete = "Re-Enter Password" placeholder="Re-Enter Password"
                        />
                    </div>
                </div>

                <div id = "registerButton">
                    <button type="submit">Register</button>
                </div>
                
            </form>

        </div>
    )
}