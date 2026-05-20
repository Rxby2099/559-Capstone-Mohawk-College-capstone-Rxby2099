import "./registration-form.css"
export default function RegistrationForm() {
    return (
        <div id = "registrationForm">
            <form>

                <div>
                    <p id = "titleText">Registration</p>
                </div>
                
                <div id = "emailSection">
                    <label htmlFor ="email">Email</label>
                    <input type = "text" id = "email" name = "email" autoComplete = "Enter Email" placeholder="Enter Email" spellCheck = "false"/>
                </div>

                <div id = "usernameSection">
                    <label htmlFor ="username">Username</label>
                    <input type = "text" id = "username" name = "username" autoComplete = "Enter Username" placeholder="Enter Username" spellCheck = "false"/>
                </div>

                <div id = "passwordSection">
                    <div>
                        <label htmlFor = "password">Password</label>
                        <input type = "text" id = "password" name = "password" autoComplete = "Enter Password" placeholder="Enter Password"
                        />
                    </div>

                    <div>
                        <label htmlFor = "password2">Re-Enter Password</label>
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