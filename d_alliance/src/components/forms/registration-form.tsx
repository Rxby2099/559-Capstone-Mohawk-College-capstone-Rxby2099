import "./registration-form.css"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function RegistrationForm() {

    const [registrationData, setRegistrationData] = useState({ email: '', username: '', password: ''});
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    

    const digit = /[0-9]/
    const uppercase = /[A-Z]/
    const lowercase = /[a-z]/
    const nonAlphanumeric = /[^0-9A-Za-z]/
    
    

    async function handleRegistration(e: React.FormEvent) {
        e.preventDefault();
        const resp = await fetch("http://localhost:8000/signup", {
            method: "POST",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(registrationData)
        });

        const data = await resp.json();
        console.log("Registrtion response:", data);

        if (resp.ok) {
            window.location.reload();
        } 
        
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
                        maxLength={254}
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
                        maxLength={20}
                        autoComplete = "Enter Username" 
                        placeholder="Enter Username" 
                        spellCheck = "false" 
                        value = {registrationData.username}
                        onChange={(e) => setRegistrationData({...registrationData, username: e.target.value})}/>
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
                        <p id = "missingFieldsStr"></p>
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
                            />
                            <button id = "passwordToggle" type="button" onClick={() => setShowPassword2(!showPassword2)}>
                                {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p id = "missingFieldsStr"></p>
                    </div>
                </div>

                <div id = "registerButton">
                    <button id = "submitButton" type="submit">Register</button>
                </div>
                
            </form>

        </div>
    )
}