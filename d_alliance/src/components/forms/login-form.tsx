
import "./login-form.css"
import { Eye, EyeOff } from "lucide-react"
import supabase from '@/supabase-frontend'
import { useState } from "react"
import {useNavigate} from "react-router-dom"

export default function LoginForm() {
    const [loginData, setLoginData] = useState({email: '', password: ''});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()

    async function handleUserLogin(e: React.FormEvent){    
        e.preventDefault();

        const {data, error} = await supabase.auth.signInWithPassword({
            email: loginData.email,
            password: loginData.password
        });

        if (error){
            console.error('Error signing in: ', error);
            return;
        }

        navigate("/dashboard");
        console.log('User Signed in successfully: ', data);
    }

    return (
        <div id = "loginForm">
            <form onSubmit={handleUserLogin}>

                <div>
                    <p id = "titleText">Login</p>
                </div>

                <div id = "usernameSection">
                    <label htmlFor ="email">Email:</label>
                    <input 
                        type = "text" 
                        id = "email" 
                        name = "email" 
                        maxLength={254}
                        autoComplete = "Enter Email" 
                        placeholder="Enter Email" 
                        spellCheck = "false"
                        value = {loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    />
                </div>

                <div id = "passwordSection">
                    <label htmlFor = "password">Password:</label>
                    <div id = "passwordAndEye">
                        <input 
                            type={showPassword ? "text" : "password"}
                            id = "password" 
                            name = "password" 
                            autoComplete = "Enter password" 
                            placeholder="Enter Password"
                            value = {loginData.password}
                            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        />
                        <button id = "passwordToggle" type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    

                    <div id = "forgotPasswordLink">
                        <a href="#">Forgot password?</a>
                    </div>
                </div>

                <div id = "loginButton">
                    <button type="submit">Sign in</button>
                </div>
                
            </form>

        </div>
    )
}