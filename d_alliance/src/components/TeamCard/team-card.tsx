import './team-card.css'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'


// To be added to as external db is connected to
type TeamMember = {
    id: number,
    name: string,
    title: string;
}

type TeamCardProps = {
    name: string;
    members?: TeamMember[];
}

const TEAM_SIZE = 6;

export default function TeamCard({name, members = [] }: TeamCardProps) {
    return(
        <>
            <div className='teamCardWrapper'>
                <div className='teamCard'>
                    <h3>{name}</h3>
                    <button type='button'><Pencil size={16} /></button>
                    <button type='button'><Trash2 size={16} /></button>
                </div>
                <div className='teamArray'>
                    {Array.from({ 
                        length: TEAM_SIZE }).map((_, i) =>  {
                          const member = members[i];
                          return member ? (
                            <Link key = {member.id} to ={`/characters/${member.id}`} className = "teamSlot">
                                <span className = "slotTitle">{member.title}&nbsp;|&nbsp;</span>
                                <span className = "slotName">{member.name}</span>
                            </Link>
                          )  : (
                            <div key ={`empty-${i}`} className='teamSlot emptyTeamSlot'>Empty Slot</div>
                          );
                        }
                        )}
                </div>
            </div>
        </>
    )
}