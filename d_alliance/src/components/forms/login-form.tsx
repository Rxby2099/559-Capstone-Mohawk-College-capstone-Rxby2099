
import "./login-form.css"
import supabase from '@/supabase-frontend'
import { useState } from "react"
export default function LoginForm() {
    const [loginData, setLoginData] = useState({email: '', password: ''});

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
                        autoComplete = "Enter Email" 
                        placeholder="Enter Email" 
                        spellCheck = "false"
                        value = {loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    />
                </div>

                <div id = "passwordSection">
                    <label htmlFor = "password">Password:</label>
                    <input 
                        type = "password" 
                        id = "password" 
                        name = "password" 
                        autoComplete = "Enter password" 
                        placeholder="Enter Password"
                        value = {loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    />
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