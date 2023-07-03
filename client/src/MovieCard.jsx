import React from "react";

const MovieCard = ({ movie }) => {
    return (
        <div className="movie">
            <div>
                <p>{movie.year}</p>
            </div>         
            <div>
                <img src={movie.cover_image !== "N/A" ? movie.cover_image : 'https://via.placeholder.com/400'} alt={movie.name}/>
            </div>     
            <div>
                <span>{movie.artists}</span>
                <h3>{movie.name}</h3>
            </div>

        </div>
    )
}
export default MovieCard;