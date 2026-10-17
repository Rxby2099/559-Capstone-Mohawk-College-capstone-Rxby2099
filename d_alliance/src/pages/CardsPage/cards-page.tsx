import './cards-page.css'
import { useEffect, useState } from 'react'

import Header from '@/components/header-&-footer/header'
import Footer from '@/components/header-&-footer/footer'

type Card = { id: number; name: string; title: string }

type CardResp = {
    data: Card[]
    page: number
    pageSize: number
    total: number
    totalPages: number
}

export default function CardsPage() {
    const [cards, setCards] = useState<Card[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState <string | null>(null);

    useEffect(() =>{
        let cancelled = false
        
        async function loadCards(){
            setLoading(true);
            setError(null);

            try{
                const res = await fetch(`/api/cards?page=${page}`);
                if(!res.ok){
                    throw new Error(`Request failed (${res.status})`)
                }

                const json: CardResp = await res.json();
                if(cancelled) return

                setCards(json.data)
                setTotalPages(json.totalPages)
            }
            catch(err){
                if(!cancelled){
                    setError(err instanceof Error ? err.message : 'Something went wrong')
                }
            }
            finally{
                if(!cancelled){
                    setLoading(false)
                }
            }
        }

        loadCards();
        window.scrollTo({top: 0})

        return function cleanup(){
            cancelled = true
        }
    }, [page])

    function handleBackButton(){
        setPage(page - 1)
    }

    function handleNextButton(){
        setPage(page + 1)
    }

    return(
        <>
            <Header/>
            <div className = "cardPageContainer">
                {error && <p>{error}</p>}

                <div className = "cardList">
                    {cards.map(card => (
                        <div key = {card.id} className = "cardItem">
                            <span className="cardTitle">{card.title}&nbsp;|&nbsp;</span>
                            <span className="cardName">{card.name}</span>
                        </div>
                    ))}
                </div>
                <div className = "listButtons">
                    <button onClick={handleBackButton} disabled = {page <= 1 || loading}>BACK&nbsp;|</button>
                    <button onClick={handleNextButton} disabled = {page >= totalPages || loading}>&nbsp;NEXT&nbsp;</button>
                    <span>Page {page} / {totalPages}</span>
                </div>
            </div>
            <Footer/>
        </>
    )
}