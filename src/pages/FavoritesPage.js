import React, { useState, useEffect, useMemo } from 'react';
import { Star, StarOff, X, Heart, List, Grid, Search, Filter, ChevronDown, Info } from "lucide-react";
import MovieCard from '../components/MovieCard';

const MovieListItem = ({ movie, isFavorite, onToggleFavorite, onOpenDetails, isWatched, userRating }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
    : "https://via.placeholder.com/92x138?text=No+Image";

  return (
    <div className="d-flex align-items-center border-bottom py-3">
      <img
        src={posterUrl}
        alt={movie.title}
        className="me-3"
        style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '4px' }}
      />
      <div className="flex-grow-1">
        <div className="d-flex align-items-center mb-1">
          <h5 className="mb-0 me-2">{movie.title}</h5>
          {isWatched && <span className="badge bg-success me-2">Izlendi</span>}
          {userRating > 0 && (
            <div className="d-flex align-items-center text-warning me-2">
              <Star size={16} fill="currentColor" stroke="none" />
              <span className="ms-1">{userRating}</span>
            </div>
          )}
        </div>
        <p className="text-muted mb-0">{movie.release_date?.substring(0, 4)}</p>
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-outline-primary btn-sm" onClick={() => onOpenDetails(movie)} title="Detaylar">
          <Info size={18} /> <span className="d-none d-sm-inline ms-1">Detaylar</span>
        </button>
        <button className="btn btn-outline-danger btn-sm" onClick={() => onToggleFavorite(movie)} title="Favoriden Kaldır">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

const FavoritesPage = ({ favorites, isFavorite, onToggleFavorite, onOpenDetails, watchedMovies, toggleWatched, ratings, rateMovie }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("title");
  const [filterGenre, setFilterGenre] = useState("");
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    let result = [...favorites];
    if (searchTerm) {
      result = result.filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterGenre) {
      result = result.filter(movie => movie.genres && movie.genres.some(genre => genre.name === filterGenre));
    }
    if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "date") {
      result.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (sortBy === "rating") {
      result.sort((a, b) => {
        const ratingA = ratings[a.id] || a.vote_average || 0;
        const ratingB = ratings[b.id] || b.vote_average || 0;
        return ratingB - ratingA;
      });
    }
    setFilteredFavorites(result);
  }, [favorites, searchTerm, sortBy, filterGenre, ratings]);

  const allGenres = useMemo(() => {
    const genres = favorites.flatMap(movie => movie.genres?.map(genre => genre.name) || []);
    return [...new Set(genres)].sort();
  }, [favorites]);

  return (
    <div className="container py-5">
      <div className="mb-4 text-center">
        <h1 className="mb-2">❤️ Favori Filmlerim</h1>
        <p className="text-muted">
          {favorites.length === 0
            ? "Henüz favori film eklenmedi"
            : `Toplam ${favorites.length} favori film`}
        </p>
      </div>
      <div className="mb-4 d-flex gap-3 flex-wrap">
        <input
          type="text"
          className="form-control"
          placeholder="Film adı ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredFavorites.length === 0 ? (
        <p className="text-muted">Filtreye uyan favori film bulunamadı.</p>
      ) : viewMode === "grid" ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {filteredFavorites.map(movie => (
            <div className="col" key={movie.id}>
              <MovieCard
                movie={movie}
                isFavorite={() => true}
                onToggleFavorite={onToggleFavorite}
                onOpenDetails={onOpenDetails}
                isWatched={watchedMovies.includes(movie.id)}
                userRating={ratings[movie.id] || 0}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="list-group">
          {filteredFavorites.map(movie => (
            <div key={movie.id} className="list-group-item">
              <MovieListItem
                movie={movie}
                isFavorite={() => true}
                onToggleFavorite={onToggleFavorite}
                onOpenDetails={onOpenDetails}
                isWatched={watchedMovies.includes(movie.id)}
                userRating={ratings[movie.id] || 0}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
