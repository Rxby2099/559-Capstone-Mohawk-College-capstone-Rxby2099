import './cards-page.css'
import { useEffect, useState, type SubmitEvent } from 'react'
import { Link } from 'react-router-dom'

import Header from '@/components/header-&-footer/header'
import Footer from '@/components/header-&-footer/footer'

// Card object containing the cards id, name, and title
type Card = { id: number; name: string; title: string }
type Category = { id: number; name: string};
// The card response which will contain the cards, the page (100 cards each) the pageSize, the total cards 
// in the db from the select statemetn, and the total amount of pages.
type CardResp = {
    data: Card[]
    page: number
    pageSize: number
    total: number
    totalPages: number
}

const FILTER_OPTIONS = [
    {id: 'agl', label: 'Agl', group: 'type'},
    {id: 'str', label: 'Str', group: 'type'},
    {id: 'phy', label: 'Phy', group: 'type'},
    {id: 'int', label: 'Int', group: 'type'},
    {id: 'teq', label: 'Teq', group: 'type'},
    {id: 'super', label: 'Super', group: 'class'},
    {id: 'extreme', label: 'Extreme', group: 'class'}
] as const

const CLASSES: string[] = FILTER_OPTIONS.filter(o => o.group === 'class').map(o => o.id);
const TYPES: string[] = FILTER_OPTIONS.filter(o => o.group === 'type').map(o => o.id);

export default function CardsPage() {
    const [cards, setCards] = useState<Card[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState <string | null>(null);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('newest');
    const [classes, setClasses] = useState<string[]>(CLASSES);
    const [types, setTypes] = useState<string[]>(TYPES);
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetch('/api/cards/categories').then(res => (res.ok ? res.json() : []))
            .then(setCategories)
            .catch(() => setCategories([]))
    }, []);

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
                const params = new URLSearchParams({
                    page: String(page),
                    search,
                    sort,
                    classes: classes.join(','),
                    types: types.join(','),
                    category,
                })

                const res = await fetch(`/api/cards?${params}`);
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
    

        return function cleanup(){
            cancelled = true
        }
    }, [page, search, sort, classes, types, category])

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

    function handleSearch(e: SubmitEvent<HTMLFormElement>){
        e.preventDefault()
        setSearch(searchInput.trim())
        setPage(1)
    }

    function toggle(list: string[], value: string){
        return list.includes(value) ? list.filter(v => v !== value) : [...list, value]
    }

    function handleFilterToggle(group: 'class' | 'type', id: string){
        if(group === 'class'){
            setClasses(prev => toggle(prev, id))
        }    
        else {
            setTypes(prev => toggle(prev, id))
        }
        setPage(1)
    }

    return(
        <>
            <Header/>
            <div className = "cardPageContainer">
                {error && <p>{error}</p>}
                <h1 className='title'>Cards</h1>
                <div className= "searchSection">
                    <form onSubmit={handleSearch}>
                        <label htmlFor='searchBar'>Search</label>
                        <input 
                            type="text" 
                            id="searchBar" 
                            name="searchBar" 
                            placeholder="Search character..."
                            value = {searchInput} onChange={e => setSearchInput(e.target.value)}>
                        </input>
                        <button className='searchButton' type='submit'>Search</button>
                        <div className='searchOptions'>
                            <div className='sorting'>
                                <label htmlFor = "sort">Sort</label>
                                <select 
                                    name="sort" 
                                    id="sort" 
                                    value = {sort} 
                                    onChange={e => {setSort(e.target.value); setPage(1)}}>
                                    <option value="newest">Newest to Oldest</option>
                                    <option value="oldest">Oldest to Newest</option>
                                    <option value="alpha">Alphabetical (A-Z)</option>
                                    <option value="alphaBack">Alphabetical (Z-A)</option>
                                </select>
                            </div>
                            <div className='filtering'>
                                <label htmlFor='filters'>Filter</label>
                                <div className='filters'>
                                    {FILTER_OPTIONS.map((opt, i) => (
                                        <span key = {opt.id} style ={{display: 'contents'}}>
                                            {i > 0 && <p>|</p>}
                                            <label htmlFor={opt.id}>{opt.label}</label>
                                            <input 
                                                type="checkbox" 
                                                id={opt.id} 
                                                name={opt.id} 
                                                checked= {(opt.group === 'class' ? classes : types).includes(opt.id)}
                                                onChange={() => handleFilterToggle(opt.group, opt.id)}>
                                            </input>
                                        </span>
                                    ))}

                                    <p>|</p>
                                    
                                    <label htmlFor = "categories">Category</label>
                                    <select 
                                        name="categories" 
                                        id="categories" 
                                        value = {category}
                                        onChange={e => {setCategory(e.target.value); setPage(1)}}>
                                        <option value="">All Categories</option>
                                        {categories.map(c => (
                                            <option key={c.id} value = {c.id}>{c.name}</option>
                                        ))}
                                    </select>

                                </div>
                                
                            </div>
                            
                        </div>
                    </form>

                </div>

                <div className = "cardList">
                    {!loading && !error && cards.length === 0 && <p> No characters found.</p>}
                    {cards.map(card => (
                        <div key = {card.id} className = "cardItem">
                            <Link to={`/characters/${card.id}`}>
                                <span className="cardTitle">{card.title}&nbsp;|&nbsp;</span>
                                <span className="cardName">{card.name}</span>
                            </Link>
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