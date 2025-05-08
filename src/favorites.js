import React, { useState } from "react";
import MovieModal from "./MovieModal";

function Favorites({ favorites, toggleFavorite, isFavorite }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">⭐ Favori Filmler</h1>
      <div className="row">
        {favorites.length === 0 ? (
          <p className="text-center">Henüz favori film eklenmedi.</p>
        ) : (
          favorites.map((movie) => (
            <div key={movie.id} className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm d-flex flex-column">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  className="card-img-top"
                  alt={movie.title}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{movie.title}</h5>
                  <p className="card-text text-muted">{movie.release_date}</p>
                  <button
                    className="btn btn-danger btn-sm mt-auto"
                    onClick={() => toggleFavorite(movie)}
                  >
                    Favoriden Kaldır
                  </button>
                  <button
                    className="btn btn-info btn-sm mt-2"
                    onClick={() => {
                      setSelectedMovie(movie);
                      setShowModal(true);
                    }}
                  >
                    Detaylar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <MovieModal
        show={showModal}
        onHide={() => setShowModal(false)}
        movie={selectedMovie}
      />
    </div>
  );
}

export default Favorites;
