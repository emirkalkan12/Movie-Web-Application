import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Star, X, Info, Heart, Eye, EyeOff, Calendar, Clock, Award } from "lucide-react";

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
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const favorite = isFavorite(movie.id);
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Tarih yok';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Format runtime
  const formatRuntime = (minutes) => {
    if (!minutes) return '';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs}s` : ''} ${mins > 0 ? `${mins}dk` : ''}`;
  };

  // Calculate vote color based on rating
  const getVoteColor = (vote) => {
    if (!vote) return 'text-muted';
    if (vote >= 8) return 'text-success';
    if (vote >= 6) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="card h-100 shadow-sm movie-card overflow-hidden border-0">
      {/* Card header - Poster area */}
      <div className="position-relative poster-container">
        {/* Watched badge */}
        {isWatched && (
          <div className="position-absolute top-0 start-0 m-2 z-3">
            <span className="badge bg-success d-flex align-items-center gap-1 py-2">
              <Eye size={14} /> İzlendi
            </span>
          </div>
        )}
        
        {/* User rating badge */}
        {userRating > 0 && (
          <div className="position-absolute top-0 end-0 m-2 z-3">
            <span className="badge bg-warning text-dark d-flex align-items-center gap-1 py-2">
              <Star size={14} fill="currentColor" /> 
              <span className="fw-bold">{userRating}</span>
            </span>
          </div>
        )}
        
        {/* Poster image */}
        <img
          src={posterUrl}
          className="card-img-top"
          alt={movie.title || "Film Görseli"}
          loading="lazy"
        />
        
        {/* Info overlay on hover */}
        <div className="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-75 text-white p-2 translate-up">
          {movie.vote_average > 0 && (
            <div className={`d-flex align-items-center mb-1 ${getVoteColor(movie.vote_average)}`}>
              <Star size={14} fill="currentColor" className="me-1" />
              <span className="small">{movie.vote_average.toFixed(1)}/10</span>
            </div>
          )}
          
          <div className="d-flex flex-wrap gap-2 small">
            {movie.release_date && (
              <div className="d-flex align-items-center text-light">
                <Calendar size={12} className="me-1" />
                <span>{movie.release_date.substring(0, 4)}</span>
              </div>
            )}
            
            {movie.runtime > 0 && (
              <div className="d-flex align-items-center text-light">
                <Clock size={12} className="me-1" />
                <span>{formatRuntime(movie.runtime)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card body - Movie info */}
      <div className="card-body d-flex flex-column">
        {/* Movie title */}
        <h5 className="card-title fw-bold mb-2 text-truncate-2" title={movie.title}>
          {movie.title}
        </h5>
        
        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="mb-2">
            <div className="d-flex flex-wrap gap-1">
              {movie.genres.slice(0, 3).map(genre => (
                <span key={genre.id} className="badge bg-secondary small">
                  {genre.name}
                </span>
              ))}
              {movie.genres.length > 3 && (
                <span className="badge bg-secondary small">+{movie.genres.length - 3}</span>
              )}
            </div>
          </div>
        )}

        {/* Overview text */}
        {movie.overview && (
          <p className="card-text small text-muted mb-3 text-truncate-2">
            {movie.overview.substring(0, 100)}{movie.overview.length > 100 ? '...' : ''}
          </p>
        )}

        {/* Action buttons */}
        <div className="mt-auto pt-2 d-flex flex-wrap gap-2">
          <button
            className="btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
            onClick={() => onOpenDetails(movie)}
          >
            <Info size={16} />
            Detaylar
          </button>

          <button
            className={`btn btn-sm ${favorite ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => onToggleFavorite(movie)}
            title={favorite ? "Favoriden Kaldır" : "Favorilere Ekle"}
          >
            <Heart size={16} fill={favorite ? "currentColor" : "none"} />
          </button>

          <button
            className={`btn btn-sm ${isWatched ? "btn-success" : "btn-outline-success"}`}
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
