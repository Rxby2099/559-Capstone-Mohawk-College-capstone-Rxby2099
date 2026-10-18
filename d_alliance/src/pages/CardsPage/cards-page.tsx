import './cards-page.css'
import { useEffect, useState } from 'react'

import Header from '@/components/header-&-footer/header'
import Footer from '@/components/header-&-footer/footer'


// Card object containing the cards id, name, and title
type Card = { id: number; name: string; title: string }

// The card response which will contain the cards, the page (100 cards each) the pageSize, the total cards 
// in the db from the select statemetn, and the total amount of pages.
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
        
        /**
         * 
         * @returns cleanup() - a return function that always runs whenever the page loads and will set cancelled to true in
         * order to prevent reace conditons like someone hititng back or next too fast twice, which would lead to the 2nd pages
         * data showing instead of the 3rds despite saying page 3. 
         */
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
        window.scrollTo({top: document.documentElement.scrollHeight, behavior: 'smooth'})

        return function cleanup(){
            cancelled = true
        }
    }, [page])

    /**
     * Sets the page one page back
     */
    function handleBackButton(){
        setPage(page - 1)
    }

    /**
     * Sets the page one page forward
     */
    function handleNextButton(){
        setPage(page + 1)
    }

    return(
        <>
            <Header/>
            <div className = "cardPageContainer">
                {error && <p>{error}</p>}
                <h1 className='title'>Cards</h1>
                <div className= "searchSection">
                    <form>
                        <label htmlFor='searchBar'>Search</label>
                        <input type="text" id="searchBar" name="searchBar" placeholder="Search character..."></input>
                        <button className='searchButton'>Search</button>
                        <div className='searchOptions'>
                            <div className='sorting'>
                                <label htmlFor = "sort">Sort</label>
                                <select name="sort" id="sort" required>
                                    <option value="">-- Please select an option --</option>
                                    <option value="newest">Newest to Oldest</option>
                                    <option value="oldest">Oldest to Newest</option>
                                    <option value="alpha">Alphabetical (A-Z)</option>
                                    <option value="alphaBack">Alphabetical (Z-A)</option>
                                </select>
                            </div>
                            <div className='filtering'>
                                <label htmlFor='filters'>Filter</label>
                                <div className='filters'>
                                    <label htmlFor='str'>Str</label>
                                    <input type="checkbox" id="str" name="str" value="" checked></input>

                                    <p>|</p>

                                    <label htmlFor='str'>Agl</label>
                                    <input type="checkbox" id="agl" name="agl" value="" checked></input>

                                    <p>|</p>

                                    <label htmlFor='str'>Teq</label>
                                    <input type="checkbox" id="teq" name="teq" value="" checked></input>

                                    <p>|</p>

                                    <label htmlFor='str'>Int</label>
                                    <input type="checkbox" id="int" name="int" value="" checked></input>

                                    <p>|</p>

                                    <label htmlFor='str'>Phy</label>
                                    <input type="checkbox" id="phy" name="phy" value="" checked></input>

                                    <p>|</p>

                                    <label htmlFor='str'>Super</label>
                                    <input type="checkbox" id="super" name="super" value="" checked></input>

                                    <p>|</p>

                                    <label htmlFor='str'>Extreme</label>
                                    <input type="checkbox" id="extreme" name="extreme" value="" checked></input>

                                    <p>|</p>

                                    <label htmlFor = "categories">Category</label>
                                    <select name="categories" id="categories" required>
                                        <option value="">-- Please select an option --</option>
                                        <option value="">All Categories</option>
                                    </select>

                                </div>
                                
                            </div>
                            
                        </div>
                    </form>

                </div>

                <div className = "cardList">
                    {cards.map(card => (
                        <div key = {card.id} className = "cardItem">
                            <span className="cardTitle">{card.title}&nbsp;|&nbsp;</span>
                            <span className="cardName">{card.name}</span>
                        </div>
                    ))}
                </div>
                <div className = "listButtons">
                    <button onClick={handleBackButton} disabled = {page <= 1 || loading} className='backButton'>BACK</button>
                    <span>&nbsp;Page {page} / {totalPages}&nbsp;</span>
                    <button onClick={handleNextButton} disabled = {page >= totalPages || loading}className='nextButton'>NEXT</button>
                </div>
            </div>
            <Footer/>
        </>
    )
}