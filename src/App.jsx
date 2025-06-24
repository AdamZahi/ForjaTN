import React, { useState, useEffect } from 'react';
import SearchBar from './Components/SearchBar.jsx';
import MovieCard from './Components/MovieCard.jsx';
import Spinner from './Components/Spinner.jsx';
// import { useDebounce } from 'react-use'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_API_KEY}`
  }
};
function App() {
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

    // Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 500ms
  // useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try{
      const endpoint = `${TMDB_BASE_URL}/discover/movie?include_adult=false&include_video=false&page=1&sort_by=vote_count.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Network response was not ok: '+ response.statusText);
      }
      const data = await response.json();
      if (data.response ==='False') {
        setMovies([]);
        throw new Error('Failed to fetch movies: ' + data.Error);
      }
      setMovies(data.results || []);
    }catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    }
    finally{
      setIsLoading(false);
    }
  }
  const fetchTrendingMovies = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try{
      const endpoint = `${TMDB_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Network response was not ok: '+ response.statusText);
      }
      const data = await response.json();
      if (data.response ==='False') {
        setTrendingMovies([]);
        throw new Error('Failed to fetch movies: ' + data.Error);
      }
      setTrendingMovies(data.results || []);
    }
    catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    }
    finally{
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchMovies();
  },[])
  useEffect(() => {
    fetchTrendingMovies();
  }, []);
  return(
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="hero.png" alt="heroCard" />
          <h1 className='mb-4'>Your Favorite <span className='text-gradient'>Cinematic Platform</span> In Tunisia</h1>
          <SearchBar searchName={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
      {/* trending Movies */}
      {trendingMovies.length > 0 && (
    <section className="trending">
      <h2 className='mb-8'>Trending Movies</h2>
      <div className="overflow-x-auto custom-scrollbar">
        <ul className="flex gap-x-32 p-4 min-w-max">
          {trendingMovies.map((movie, index) => (
            <li key={movie.title + movie.index} className="flex-shrink-0 w-40">
              <p>{index + 1}</p>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto rounded-lg"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
)}

      {/* All Movies */}
      <section className='all-movies m-8'>
        <h2>All Movies</h2> 
        {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movies.map((movie) => (
                <MovieCard key={movie.id || movie.$id} movie= {movie} />
              ))}
            </ul>
          )}
      </section>
      </div>
    </main>
  );
}

export default App
