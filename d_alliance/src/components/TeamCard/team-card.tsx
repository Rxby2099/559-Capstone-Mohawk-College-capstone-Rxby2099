import './team-card.css'
import { Pencil, Trash2 } from 'lucide-react'
import GokuImg from '@/assets/HiImGoku.jpg'
import CharacterBox from '../character-box/character-box'

// To be added to as external db is connected to
type TeamCardProps = {
    name: string;
}

export default function TeamCard({name}: TeamCardProps) {
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
                        length: 6 }).map((_, i) => (<CharacterBox key={i} image= {GokuImg}  />
                        ))}
                </div>
            </div>
        </>
    )
}