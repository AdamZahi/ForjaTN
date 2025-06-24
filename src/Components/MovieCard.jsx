function MovieCard({ movie }) {
    return (
        <div className="movie-card">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`${movie.title} poster`} />
            <h3 className="text-gray-50">{movie.title}</h3>
            <p>{movie.overview}</p>
            <span>Rating: {String(movie.vote_average).slice(0,3)}/10</span>
        </div>
    );
}

export default MovieCard;