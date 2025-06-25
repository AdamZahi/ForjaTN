function MovieCard({ movie }) {
    const GENRES = [
        { id: 28, name: "Action" },
        { id: 12, name: "Adventure" },
        { id: 16, name: "Animation" },
        { id: 35, name: "Comedy" },
        { id: 80, name: "Crime" },
        { id: 99, name: "Documentary" },
        { id: 18, name: "Drama" },
        { id: 10751, name: "Family" },
        { id: 14, name: "Fantasy" },
        { id: 36, name: "History" },
        { id: 27, name: "Horror" },
        { id: 10402, name: "Music" },
        { id: 9648, name: "Mystery" },
        { id: 10749, name: "Romance" },
        { id: 878, name: "Science Fiction" },
        { id: 10770, name: "TV Movie" },
        { id: 53, name: "Thriller" },
        { id: 10752, name: "War" },
        { id: 37, name: "Western" }
    ];
    return (
    <div className="movie-card hover:scale-105 transition-transform duration-300 cursor-pointer">
        <img
            src={movie.poster_path ?
            `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'}
            alt={movie.title}
        />

        <div className="mt-4">
            <h3>{movie.title}</h3>

            <div className="content">
            <div className="rating">
                <img src="star.svg" alt="Star Icon" />
                <p>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
            </div>

            <span>•</span>
            <p className="lang">
            {
            movie.genre_ids && movie.genre_ids.length > 0
                ? (GENRES.find(g => g.id === movie.genre_ids[0])?.name || "Unknown")
                : "Unknown"
            }
            </p>

            <span>•</span>
            <p className="year">
                {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
            </p>
            </div>
        </div>
    </div>
    );
}

export default MovieCard;