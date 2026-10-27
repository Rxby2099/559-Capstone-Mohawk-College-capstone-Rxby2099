import './character-page.css'

import Header from '../../components/header-&-footer/header'
import Footer from '../../components/header-&-footer/footer'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

type Stats = { 
    hp: number; 
    atk: number; 
    def: number
};
type Super = { 
    style: string; 
    kiNeeded: number; 
    name: string; 
    description: string
};

type Character = {
    id: number;
    name: string;
    title: string;
    leaderSkill: string;
    supers: Super[];
    passive: {
        name: string;
        description: string;
    } | undefined
    stats: { 
        fiftyFive: Stats;
        rainbow: Stats;
    }
}

export default function CharacterPage() {
    const {id} = useParams();
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadCharacter() {
            setLoading(true)
            setError(null)
            try{
                const res = await fetch(`/api/character/${id}`);

                if(!res.ok){
                    throw new Error(res.status === 404 ? 'Character not found' : `Request failed (${res.status})`)
                }

                const json: Character = await res.json();

                if(cancelled) return;
                setCharacter(json)
            }
            catch(err){
                if (!cancelled) setError(err instanceof Error ? err.message: 'Error loading charcter page')
            }
            finally{
                if(!cancelled){
                    setLoading(false);
                }
            }
        }

        loadCharacter()
        return function cleanup(){
            cancelled = true
        }
    }, [id])

    return(
        <>
            <Header/>
                <p> cards page</p>
            <Footer/>
        </>
    )
}