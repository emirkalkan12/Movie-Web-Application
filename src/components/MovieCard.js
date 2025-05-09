import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Star, X, Info, Heart, Eye, EyeOff } from "lucide-react";

const MovieCard = ({
  movie,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  isWatched,
  toggleWatched,
  userRating
}) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  const favorite = isFavorite(movie.id);

  return (
    <div className="card h-100 shadow-sm d-flex flex-column">
      {/* Poster alanı */}
      <div className="position-relative">
        {isWatched && (
          <span className="badge bg-success position-absolute top-0 start-0 m-2">
            İzlendi
          </span>
        )}
        <img
          src={posterUrl}
          className="card-img-top"
          alt={movie.title || "Film Görseli"}
        />
      </div>

      <div className="card-body d-flex flex-column">
        {/* Başlık ve kullanıcı puanı */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0 me-2">{movie.title}</h5>
          {userRating > 0 && (
            <div className="d-flex align-items-center text-warning">
              <Star size={16} fill="currentColor" stroke="none" />
              <span className="ms-1">{userRating}</span>
            </div>
          )}
        </div>

        <p className="card-text text-muted">
          {movie.release_date?.substring(0, 4)}
        </p>

        {/* Butonlar */}
        <div className="mt-auto pt-3 d-flex flex-wrap gap-2">
          <button
            className="btn btn-outline-primary btn-sm flex-grow-1"
            onClick={() => onOpenDetails(movie)}
          >
            <Info size={16} className="me-1" />
            Detaylar
          </button>

          <button
            className={`btn btn-sm ${favorite ? "btn-danger" : "btn-outline-primary"}`}
            onClick={() => onToggleFavorite(movie)}
            title={favorite ? "Favoriden Kaldır" : "Favorilere Ekle"}
          >
            {favorite ? <X size={16} /> : <Heart size={16} />}
          </button>

          <button
            className={`btn btn-sm ${isWatched ? "btn-success" : "btn-outline-secondary"}`}
            onClick={() => toggleWatched(movie)}
            title={isWatched ? "İzlendi olarak işaretlendi" : "İzlenmedi olarak işaretlendi"}
          >
            {isWatched ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
