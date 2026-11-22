import "../login-registration-form/log-reg-form.css"
import "../edit-profile-form/edit-profile-form.css"
import "./team-creation-form.css"

import { useState, type SubmitEvent } from "react"
import { useAuth } from "@/context/AuthContext"
import supabase from "@/lib/supabase-frontend"

type CreateTeamProps = {
    onClose: () => void;
    onCreated: () => void;
}

export default function CreateTeam({onClose, onCreated}: CreateTeamProps){
    const {user} = useAuth();
    const [teamName, setTeamName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>){
        e.preventDefault();

        if(!user) return;

        const name = teamName.trim();
        if(name === ''){
            setErrorMsg("Team must have a name");
            return;
        }

        if(name.length > 15){
            setErrorMsg("Team name must be 15 or characters or less");
            return;
        }

        const { error } = await supabase
            .from('teams')
            .insert({user_id: user.id, name}); 

        if(error){
            console.error("Error creating team: ", error);
            setErrorMsg("Could not create the team, please try again");
            return;
        }

        onCreated();
        onClose();
    }

    return(
        <div className="modalOverlay">
            <div id="createTeamForm">
                <form onSubmit={handleSubmit}>
                    <h1 className="titleText">Create Team</h1>

                    <div>
                        <label  htmlFor="teamName">Team Name:</label>
                        <input
                            type = "text"
                            id = "teamName"
                            name = "teamName"
                            maxLength={15}
                            placeholder="Enter Team Name..."
                            spellCheck="false"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                        />
                    </div>
                    {errorMsg && <p role = "alert">{errorMsg}</p>}
                    <br></br>
                    <button type = "submit">Create</button>
                    <button type = "button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    )
}