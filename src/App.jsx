import React, { useState, useEffect } from 'react';
import SearchBar from './Components/SearchBar.jsx';
import MovieCard from './Components/MovieCard.jsx';
import Spinner from './Components/Spinner.jsx';
import { useDebounce } from 'react-use'

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
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

    // Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = React.useCallback(async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');
    try{
      const endpoint = query ? `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&sort_by=popularity.desc`
        :`${TMDB_BASE_URL}/discover/movie?include_adult=false&include_video=false&page=${page}&sort_by=vote_count.desc`;
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
  }, [page]);
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
    fetchMovies(debouncedSearchTerm);
  }, [fetchMovies, debouncedSearchTerm]);
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

      {/* Show search results only when searchTerm is not empty */}
      {searchTerm ? (
        <section className='all-movies m-8'>
          <h2>Search Results for "{searchTerm}"</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <MovieCard key={movie.id || movie.$id} movie={movie} />
                ))
              ) : (
                <p className="text-gray-500">No results found.</p>
              )}
            </ul>
          )}
        </section>
      ) : (
        <>
          {/* Trending Movies */}
          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2 className='mb-8'>Trending Movies</h2>
              <div className="overflow-x-auto custom-scrollbar">
                <ul className="flex gap-x-32 p-4 min-w-max">
                  {trendingMovies.map((movie, index) => (
                    <li key={movie.title + index} className="flex-shrink-0 w-40">
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

          {/* Popular Movies */}
          <section className='all-movies m-8'>
            <h2>Popular</h2> 
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movies.map((movie) => (
                  <MovieCard key={movie.id || movie.$id} movie={movie} />
                ))}
              </ul>
            )}
          </section>

          {/* Pagination */}
          <div className="pagination flex justify-around text-md font-semibold gap-4 m-8">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn btn-primary cursor-pointer disabled:cursor-not-allowed">
              <img src="left-arrow.png" width={30} height={30} alt="Previous Page" />
            </button>
            <p className='text-zinc-500'><span className='text-amber-50'>{page} </span>/100</p>
            <button disabled={page >= 100} onClick={() => setPage(page + 1)} className="btn btn-primary cursor-pointer">
              <img src="left-arrow.png" width={30} height={30} alt="Previous Page" className='rotate-180' />
            </button>
          </div>
        </>
      )}
    </div>
  </main>
  );
}

export default App
