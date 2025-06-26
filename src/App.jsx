import React, { useState, useEffect } from 'react';
import SearchBar from './Components/SearchBar.jsx';
import MovieCard from './Components/MovieCard.jsx';
import Spinner from './Components/Spinner.jsx';
import { useDebounce } from 'react-use'
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import MovieDetail from './Components/MovieDetail.jsx';

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

  const navigate = useNavigate();
  return(
    <>
      <Routes>
      <Route path="/" element={
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
                        <li onClick={()=> navigate(`/movie/${movie.id || movie.$id}`)} 
                            key={movie.title + index} 
                            className="flex-shrink-0 w-40 hover:scale-103 transition-transform duration-300 cursor-pointer">
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
      } />
      <Route path="/movie/:id" element={<MovieDetail />} />
    </Routes>

      {/* footer */}
    <footer className="w-full mt-12 px-12 py-4 bg-[#18132a] text-center text-zinc-300 flex flex-row justify-between items-center gap-2">
      <span className="font-semibold">Developed by Adam Zahi</span>
      <div className="flex gap-4 justify-center mt-2">
        <a
          href="https://github.com/AdamZahi/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition"
          id="github-link"
        >
          <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.72-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.45.11-3.02 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.62 1.57.23 2.73.11 3.02.74.8 1.18 1.83 1.18 3.09 0 4.43-2.7 5.41-5.27 5.7.41.36.77 1.08.77 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/>
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/adam-zahi/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition"
          id="linkedin-link"
        >
          <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.74z"/>
          </svg>
        </a>
        <a
          href="https://discord.com/users/sushii1669"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition"
          id="discord-link"
        >
          <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.07.07 0 0 0-.073.035c-.211.375-.444.864-.608 1.249-1.844-.276-3.68-.276-5.486 0-.164-.393-.405-.874-.617-1.249a.07.07 0 0 0-.073-.035 19.736 19.736 0 0 0-4.885 1.515.064.064 0 0 0-.03.027C.533 9.045-.32 13.579.099 18.057a.08.08 0 0 0 .031.056c2.052 1.507 4.041 2.422 5.992 3.029a.077.077 0 0 0 .084-.027c.461-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.041-.104c-.652-.247-1.27-.549-1.872-.892a.077.077 0 0 1-.008-.127c.126-.094.252-.192.371-.291a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.245.198.372.292a.077.077 0 0 1-.006.127 12.298 12.298 0 0 1-1.873.891.076.076 0 0 0-.04.105c.36.699.772 1.364 1.225 1.993a.076.076 0 0 0 .084.028c1.961-.607 3.95-1.522 6.002-3.029a.077.077 0 0 0 .031-.055c.5-5.177-.838-9.673-3.548-13.661a.061.061 0 0 0-.03-.028zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.175 1.094 2.157 2.418 0 1.334-.955 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.175 1.094 2.157 2.418 0 1.334-.947 2.419-2.157 2.419z"/>
          </svg>
        </a>
      </div>
    </footer>
    </>
  );
}

export default App
