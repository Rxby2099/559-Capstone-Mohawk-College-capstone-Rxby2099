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
            <div className='characterContainer'>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}

                {character && (
                    <div>
                        <h1 className='characterTitle'>{character.title}</h1>
                        <h1 className='characterName'>{character.name}</h1>
                        <br></br>
                        <div className='leaderSkillSection'>
                            <h3>--Leader Skill--</h3>
                            <p>{character.leaderSkill}</p>
                        </div>
                        <br></br>
                        <div className='statsSection'>
                            <h3>--Stats--</h3>
                            <table className='statsTable'>
                                <thead>
                                    <tr><th></th><th>HP</th><th>ATK</th><th>DEF</th></tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td><strong>55%</strong>&nbsp;</td>
                                        <td>{character.stats.fiftyFive.hp}</td>
                                        <td>{character.stats.fiftyFive.atk}</td>
                                        <td>{character.stats.fiftyFive.def}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Rainbow</strong>&nbsp;</td>
                                        <td>{character.stats.rainbow.hp}</td>
                                        <td>{character.stats.rainbow.atk}</td>
                                        <td>{character.stats.rainbow.def}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <br></br>
                        <div className='superSection'>
                            {character.supers.map((s, i) => (
                                <div key = {i} className='superItem'>
                                    <strong>--Super Attack: {s.name} ({s.kiNeeded} Ki)--</strong>
                                    <p>{s.description}</p>
                                </div>
                            ))}
                        </div>
                        <br></br>
                        {character.passive && (
                            <div className='passiveSection'>
                                <h3>--Passive Skill: {character.passive.name}--</h3>
                                <p>{character.passive.description}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer/>
        </>
    )
}