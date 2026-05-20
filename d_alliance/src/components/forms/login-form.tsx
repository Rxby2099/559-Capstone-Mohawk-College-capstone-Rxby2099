import "./login-form.css"
export default function LoginForm() {
    return (
        <div id = "loginForm">
            <form>
                <div id = "usernameSection">
                    <label htmlFor ="username">Username or email</label>
                    <input type = "text" id = "username" name = "username" autoComplete = "username" placeholder="Enter username" spellCheck = "false"/>
                </div>

                <div id = "passwordSection">
                    <label htmlFor = "password">Password</label>
                    <input type = "text" id = "password" name = "password" autoComplete = "password" placeholder="Enter password"
                    />
                </div>
                <button type="submit">Sign in</button>
            </form>

        </div>
    )
}