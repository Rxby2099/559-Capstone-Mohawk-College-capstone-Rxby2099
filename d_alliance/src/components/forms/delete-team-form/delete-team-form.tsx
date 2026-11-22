import "./delete-team-form.css"
import "../edit-profile-form/edit-profile-form.css"

import supabase from "@/lib/supabase-frontend";
import {useState} from "react";
import type { Team } from "@/lib/teams";

type DeleteTeamProps = {
    team: Team;
    onClose: () => void;
    onChanged: () => Promise<void>; 
};

export default function DeleteTeam({ team, onClose, onChanged }: DeleteTeamProps){
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    async function handleDelete(){
        setSaving(true);
        setError('');

        const { error: deleteError} = await supabase
            .from('teams')
            .delete()
            .eq("id", team.id)
            
        setSaving(false);

        if(deleteError){
            console.error('Error deleting team: ', deleteError);
            setError('Could not delete that team, please try again!')
        }

        await onChanged();
        onClose();
    }

    return(
        <div className="modalOverlay">
            <h3>Are you sure you want to delete this Team?</h3>
            {error && <p role = "alert">{error}</p>} 
            <div className="buttonOptions">   
                <button type = "button" onClick={handleDelete} disabled = {saving}>
                    Delete Team
                </button>
                <button type = "button" onClick = {onClose}>
                    Cancel
                </button>
            </div>
        </div>
    )
}