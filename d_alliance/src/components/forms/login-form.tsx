import "./login-form.css"
export default function LoginForm() {
    return (
        <div id = "loginForm">
            <form>

                <div>
                    <p id = "titleText">Login</p>
                </div>

                <div id = "usernameSection">
                    <label htmlFor ="userOrEmail">Username/Email</label>
                    <input type = "text" id = "userOrEmail" name = "userOrEmail" autoComplete = "Enter Username/Email" placeholder="Enter Username/Email" spellCheck = "false"/>
                </div>

                <div id = "passwordSection">
                    <label htmlFor = "password">Password</label>
                    <input type = "text" id = "password" name = "password" autoComplete = "Enter password" placeholder="Enter Password"
                    />
                    <div id = "forgotPasswordLink">
                        <a>Forgot password?</a>
                    </div>
                </div>

                <div id = "loginButton">
                    <button type="submit">Sign in</button>
                </div>

                <div id = "registrationLink">
                    <p>New to Dokkan Alliance? <a>Sign Up</a></p>
                </div>
                
            </form>

        </div>
    )
}