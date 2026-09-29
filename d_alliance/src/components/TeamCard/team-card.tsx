import './team-card.css'

import Header from '../header-&-footer/header'
import Footer from '../header-&-footer/footer'
import { Pencil, Trash2 } from 'lucide-react'


export default function TeamCard() {
    return(
        <>
            <div className='teamCard'>
                <h3>Daima</h3>
                <button type='button'><Pencil size={16} /></button>
                <button type='button'><Trash2 size={16} /></button>
            </div>
        </>
    )
}