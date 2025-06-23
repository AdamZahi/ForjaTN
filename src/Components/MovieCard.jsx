function MovieCard({ movie }) {
    return (
        <div className="movie-card">
        <img src={movie.poster} alt={`${movie.title} poster`} />
        <h3>{movie.title}</h3>
        <p>{movie.description}</p>
        <span>Rating: {movie.rating}</span>
        </div>
    );
}

export default MovieCard;