import React, { useEffect, useState } from 'react';
import Spinner from './Spinner.jsx';
import { useParams, Link } from 'react-router-dom';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_API_KEY}`
    }
};

function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [trailerKey, setTrailerKey] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchMovie() {
            try {
                const res = await fetch(`${TMDB_BASE_URL}/movie/${id}?append_to_response=credits`, API_OPTIONS);
                if (!res.ok) throw new Error('Failed to fetch movie details');
                const data = await res.json();
                setMovie(data);
            } catch (err) {
                setError('Could not load movie details: ' + err.message);
            }
        }
        async function fetchTrailer() {
            try {
                const res = await fetch(`${TMDB_BASE_URL}/movie/${id}/videos`, API_OPTIONS);
                if (!res.ok) return;
                const data = await res.json();
                const trailer = data.results?.find(
                    v => v.type === 'Trailer' && v.site === 'YouTube'
                );
                if (trailer) setTrailerKey(trailer.key);
            } catch (err) {
                alert('Could not load trailer: ' + err.message);
            }
        }
        fetchMovie();
        fetchTrailer();
    }, [id]);

    if (error) return <div className="p-8 text-red-500">{error}</div>;
    if (!movie) return <div className="p-8"><Spinner /></div>;

    // Extract main actors (top 5 billed)
    const mainActors = movie.credits?.cast?.slice(0, 5).map(actor => actor.name).join(', ') || 'N/A';
    // Extract spoken languages
    const languages = movie.spoken_languages?.map(l => l.english_name).join(', ') || 'N/A';
    // Extract production companies
    const companies = movie.production_companies?.map(c => c.name).join(', ') || 'N/A';
    // Extract countries
    const countries = movie.production_countries?.map(c => c.name).join(', ') || 'N/A';
    // Format budget and revenue
    const formatMoney = n => n ? `$${n.toLocaleString()}` : 'N/A';

    return (
        <div className="bg-[#0F0D23] rounded-2xl text-white relative  mx-16 my-8 p-6 md:p-10 shadow-purple-500/50 shadow-xl">
            <Link to="/" className="absolute left-8 top-8 text-blue-400 hover:text-blue-200 underline flex items-center gap-1">
                <span className="text-xl">←</span> Back
            </Link>
            {/* Title and Rating */}
            <div className="flex flex-row items-center justify-between gap-2 mb-4 mt-8">
                <span className="text-3xl md:text-4xl font-extrabold">{movie.title}</span>
                <div className="flex items-center gap-2 text-lg">
                    <span className="text-yellow-400 font-bold">{movie.vote_average?.toFixed(1)}</span>
                    <img src="/star.svg" alt="Star Icon" className="w-6 h-6" />
                    <span className="text-zinc-400 text-base">({movie.vote_count} votes)</span>
                </div>
            </div>
            {/* Year, PG, Duration */}
            <div className="flex flex-wrap items-center gap-6 mb-6 text-zinc-300 text-base">
                <span>{movie.release_date?.split('-')[0]}</span>
                <span>{movie.adult ? '18+' : 'PG-13'}</span>
                <span>{movie.runtime} min</span>
            </div>
            {/* Poster and Trailer */}
            <div className="flex flex-col md:flex-row mb-8">
                <div className="flex-1 flex justify-center items-center">
                    <img
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'}
                        alt={movie.title}
                        className="rounded-xl shadow-lg w-full max-w-xs object-cover h-80 md:h-96"
                        style={{ minHeight: '20rem', maxHeight: '24rem' }}
                    />
                </div>
                <div className="flex-1 flex items-center justify-center">
                    {trailerKey ? (
                        <div className="w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
                            <iframe
                                src={`https://www.youtube.com/embed/${trailerKey}`}
                                title="Movie Trailer"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                                style={{ minHeight: '20rem', maxHeight: '24rem' }}
                            ></iframe>
                        </div>
                    ) : (
                        <div className="text-zinc-400 italic text-center w-full">No trailer available.</div>
                    )}
                </div>
            </div>
            {/* Details */}
            <div className="space-y-6">
                <div>
                    <span className="font-bold text-purple-400">Genres: </span>
                    {movie.genres?.map(g => g.name).join(', ') || 'N/A'}
                </div>
                <div>
                    <span className="font-bold text-purple-400">Overview: </span>
                    {movie.overview || 'N/A'}
                </div>
                <div>
                    <span className="font-bold text-purple-400">Main Actors: </span>
                    {mainActors}
                </div>
                <div>
                    <span className="font-bold text-purple-400">Release Date: </span>
                    {movie.release_date || 'N/A'}
                </div>
                <div>
                    <span className="font-bold text-purple-400">Countries: </span>
                    {countries}
                </div>
                <div>
                    <span className="font-bold text-purple-400">Status: </span>
                    {movie.status || 'N/A'}
                </div>
                <div>
                    <span className="font-bold text-purple-400">Languages: </span>
                    {languages}
                </div>
                <div>
                    <span className="font-bold text-purple-400">Budget: </span>
                    {formatMoney(movie.budget)}
                </div>
                <div>
                    <span className="font-bold text-purple-400">Revenue: </span>
                    {formatMoney(movie.revenue)}
                </div>
                <div>
                    <span className="font-bold text-purple-400">Production Companies: </span>
                    {companies}
                </div>
            </div>
            {movie.homepage && (
                <a
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-8 px-6 py-2 bg-gradient-to-r from-amber-500 to-pink-500 rounded-full text-white font-bold shadow hover:scale-105 transition"
                >
                    Official Website
                </a>
            )}
        </div>
    );
}

export default MovieDetail;