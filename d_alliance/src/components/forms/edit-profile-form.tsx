import "./log-reg-form.css"
import "./edit-profile-form.css"

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabase-frontend";

type EditProfileProps = {
    onClose: () => void;
    onUpdate: () => void;
}

export default function EditProfile({ onClose, onUpdate }: EditProfileProps){

    const { user } = useAuth();
    const [newUsername, setNewUsername] = useState('');

    /**
     * Handles the submission of the edit profile form. Will update
     * the current user's username in the 'users' table to the value 
     * the user enters which is held in the newUsername state
     * 
     * TODO:
     * - add password changing
     * - add error handling so usernames and passwords still follow 
     * original registeration rules
     * 
     * @param e The event trigger which submits the edit profile form
     */
    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();

        if (!user) return;

        const { error } = await supabase
            .from('users')
            .update({username: newUsername})
            .eq('id', user.id);
        
        if (error) {
            console.error('Error updating username:', error);
            return;
        }

        onUpdate();
        onClose();
    }

    return (
        <div className="modalOverlay">
            <div id = "editProfileForm">
                <form onSubmit={handleSubmit}>
                    <div>
                        <h1 className = "titleText">Edit Profile</h1>
                    </div>

                    <div id = "usernameSection">
                        <label htmlFor ="username">New Username:</label>
                        <input 
                            type = "text" 
                            id = "username" 
                            name = "username" 
                            minLength={3}
                            maxLength={20}
                            autoComplete = "Enter Username" 
                            placeholder="Enter Username" 
                            spellCheck = "false" 
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                        />
                    </div>

                    <div id = "passwordSection">
                        <div>
                            <label htmlFor = "password1">New Password:</label>
                            <div id = "passwordAndEye">
                                <input 
                                    type="password"
                                    id = "password1" 
                                    name = "password1" 
                                    minLength={8}
                                    maxLength={64}
                                    autoComplete = "Enter Password" placeholder="Enter Password"              
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor = "password2">Re-Enter New Password:</label>
                            <div id = "passwordAndEye">
                                <input 
                                    type="password"
                                    id = "password2" 
                                    name = "password2" 
                                    minLength={8}
                                    maxLength={64}
                                    autoComplete = "Re-Enter Password" 
                                    placeholder="Re-Enter Password"
                                />
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div id = "submitButton">
                        <button id = "submitButton" title = "subBtn" type="submit">Confirm</button>
                        <button type="button" onClick={onClose} id="cancelButton">Cancel</button>
                    </div>
                    
                </form>

            </div>
        </div>
    )
}