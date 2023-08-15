import {useEffect, useState, useRef} from 'react';
import './App.css'
import SearchIcon from './search.svg'
import MovieCard from './MovieCard';

const API_URL ="http://www.omdbapi.com/?apikey=aa59505"

const App = () => {

    const [movies, setMovies] = useState([]); //movies is the state variable, setMovies is the function to update the state variable
    const [searchTerm, setSearchTerm] = useState(''); //searchTerm is the state variable, setSearchTerm is the function to update the state variable
    const [suggestions, setSuggestions] = useState([]); //suggestionMovies is the state variable, setSuggestionMovies is the function to update the state variable
    const suggestionsRef = useRef(null); 


    const search = async (title) =>{
        const response = await fetch(`${API_URL}&s=${title}`);
        const data = await response.json();
        console.log(data.Search);
        setMovies(data.Search);
    }

    const handleKeyDown = (e) =>{
        if(e.key =='Enter'){
            search(searchTerm);
        }
    };

    const suggestionMovies = async (e) =>{
        const value = e.target.value;
        setSearchTerm(value);
        if(value.length > 0){
        const response = await fetch(`${API_URL}&s=${value}`);
        const data = await response.json();
        if(data.Search){
            const titles = data.Search.map((movie)=> movie.Title)
            setSuggestions(titles);
        }
    } else{
        setSuggestions([]);
    }    
    };

    // when the DOM loads, search for "star wars"
    useEffect(()=>{
        search("beyonce");
    }, [])

    //
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
            setSuggestions([]); // Hide suggestions when clicking outside the container
          }
        };
    
        document.addEventListener('click', handleClickOutside);
    
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
      }, []);

   
    return(
<div className='app'>
    <h1>GouuFlix</h1>

    <div className='search'>
        <input
            type='text'
            placeholder='Search for a movie'
            value={searchTerm}
            onChange={(e) => { suggestionMovies(e) }}
            onKeyDown={(e) => { handleKeyDown(e) }} />
        <img
            src={SearchIcon}
            alt="Search icon"
            onClick={() => { search(searchTerm) }}/>

        {suggestions.length > 0 && (
    <div ref={suggestionsRef} className='suggestions'>
            {suggestions.map((title, index) => (
         <div key={index} className='suggestion' onClick={() => {
            setSearchTerm(title);
            setSuggestions([]); // Clear suggestions when a suggestion is clicked
        }}><span>{title}</span></div>
            ))}
            </div>
        )}
</div>


   {movies?.length > 0 
    ? (
        <div className='container'>
            {
                movies.map((movie, index)=>(
                    <MovieCard key={index} movie={movie}/>
                ))}
        </div>
    ) :(
        <div className='empty'>
            <h2>No movies found</h2>
        </div>
    )  
}
     </div>
    );
}

//always export the component to be used in other files
export default App;