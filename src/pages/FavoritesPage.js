import React, { useState, useEffect, useMemo } from 'react';
import { Star, Filter, Search, Grid, List, Heart, SlidersHorizontal, Clock, Calendar } from "lucide-react";
import MovieCard from '../components/MovieCard';
import 'bootstrap/dist/css/bootstrap.min.css';

const FavoritesPage = ({ 
  favorites, 
  isFavorite, 
  onToggleFavorite, 
  onOpenDetails, 
  watchedMovies, 
  toggleWatched, 
  ratings, 
  rateMovie 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("title");
  const [filterGenre, setFilterGenre] = useState("");
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  // Filter and sort favorites
  useEffect(() => {
    let result = [...favorites];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply genre filter
    if (filterGenre) {
      result = result.filter(movie => 
        movie.genres && movie.genres.some(genre => genre.name === filterGenre)
      );
    }
    
    // Apply sorting
    if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "date") {
      result.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
    } else if (sortBy === "rating") {
      result.sort((a, b) => {
        const ratingA = ratings[a.id] || 0;
        const ratingB = ratings[b.id] || 0;
        return ratingB - ratingA;
      });
    } else if (sortBy === "popularity") {
      result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }
    
    setFilteredFavorites(result);
  }, [favorites, searchTerm, sortBy, filterGenre, ratings]);

  // Extract all unique genres from favorite movies
  const allGenres = useMemo(() => {
    const genres = favorites.flatMap(movie => movie.genres?.map(genre => genre.name) || []);
    return [...new Set(genres)].sort();
  }, [favorites]);

  // Find if any movie is watched
  const hasWatchedMovies = useMemo(() => {
    return favorites.some(movie => watchedMovies.some(m => m.id === movie.id));
  }, [favorites, watchedMovies]);

  // Find if any movie is rated
  const hasRatedMovies = useMemo(() => {
    return favorites.some(movie => ratings[movie.id] > 0);
  }, [favorites, ratings]);

  // Filter stats
  const filterStats = useMemo(() => {
    if (filteredFavorites.length === 0) return null;
    
    const watchedCount = filteredFavorites.filter(movie => 
      watchedMovies.some(m => m.id === movie.id)
    ).length;
    
    const ratedCount = filteredFavorites.filter(movie => 
      ratings[movie.id] > 0
    ).length;
    
    const avgRating = ratedCount > 0 
      ? filteredFavorites.reduce((sum, movie) => sum + (ratings[movie.id] || 0), 0) / ratedCount
      : 0;
    
    return {
      watchedCount,
      ratedCount,
      avgRating: avgRating.toFixed(1)
    };
  }, [filteredFavorites, watchedMovies, ratings]);

  // Movie list view component
  const MovieListItem = ({ movie }) => {
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
      : 'https://via.placeholder.com/92x138?text=No+Image';
    
    const isMovieWatched = watchedMovies.some(m => m.id === movie.id);
    const userRating = ratings[movie.id] || 0;
    
    return (
      <div className="card mb-3 border-0 shadow-sm">
        <div className="row g-0">
          <div className="col-md-2 col-sm-3 col-4">
            <div className="position-relative h-100">
              <img
                src={posterUrl}
                alt={movie.title}
                className="img-fluid rounded-start h-100 w-100 object-fit-cover"
                style={{ maxHeight: '150px' }}
              />
              <div className="position-absolute top-0 end-0 mt-2 me-2">
                <button 
                  className="btn btn-sm btn-danger rounded-circle p-1"
                  onClick={() => onToggleFavorite(movie)}
                >
                  <Heart size={16} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-10 col-sm-9 col-8">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="card-title">{movie.title}</h5>
                <div className="d-flex gap-2 align-items-center">
                  {userRating > 0 && (
                    <span className="badge bg-warning text-dark d-flex align-items-center">
                      <Star size={14} fill="currentColor" className="me-1" />
                      {userRating}
                    </span>
                  )}
                  {isMovieWatched && (
                    <span className="badge bg-success">İzlendi</span>
                  )}
                </div>
              </div>
              
              <div className="d-flex gap-2 text-muted small mb-2">
                {movie.release_date && (
                  <span className="d-flex align-items-center">
                    <Calendar size={14} className="me-1" />
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                )}
                {movie.runtime && (
                  <span className="d-flex align-items-center">
                    <Clock size={14} className="me-1" />
                    {Math.floor(movie.runtime / 60)}s {movie.runtime % 60}dk
                  </span>
                )}
              </div>
              
              {movie.genres && (
                <div className="mb-2">
                  {movie.genres.slice(0, 3).map(genre => (
                    <span key={genre.id} className="badge bg-secondary me-1">{genre.name}</span>
                  ))}
                </div>
              )}
              
              <p className="card-text small text-muted text-truncate-2">
                {movie.overview || "Film açıklaması bulunmamaktadır."}
              </p>
              
              <button 
                className="btn btn-primary btn-sm mt-2"
                onClick={() => onOpenDetails(movie)}
              >
                Detaylar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="display-5 fw-bold mb-0 d-flex align-items-center">
            <Heart size={32} className="text-danger me-2" fill="currentColor" />
            Favori Filmlerim
          </h1>
          <p className="text-muted mt-2">
            {favorites.length === 0
              ? "Henüz favori film eklenmedi"
              : `Kütüphanenizde ${favorites.length} film var`}
          </p>
        </div>
        
        {favorites.length > 0 && filterStats && (
          <div className="col-md-4">
            <div className="card border-0 bg-light shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <small className="text-muted">İzlenen:</small>
                  <span className="badge bg-success">
                    {filterStats.watchedCount} / {filteredFavorites.length}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <small className="text-muted">Ortalama Puan:</small>
                  <span className="d-flex align-items-center text-warning">
                    <Star size={14} fill="currentColor" className="me-1" />
                    {filterStats.avgRating}/10
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Search and Filters */}
      {favorites.length > 0 && (
        <>
          <div className="row mb-4">
            <div className="col">
              <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
                {/* Search input */}
                <div className="search-container">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Film adı ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="search-icon" size={18} />
                </div>
                
                {/* View mode and filter toggles */}
                <div className="d-flex gap-2">
                  <button
                    className={`btn btn-outline-primary d-flex align-items-center gap-2`}
                    onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                  >
                    <SlidersHorizontal size={16} />
                    {isFiltersVisible ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
                  </button>
                  
                  <div className="btn-group">
                    <button 
                      className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setViewMode('grid')}
                      title="Izgara görünümü"
                    >
                      <Grid size={16} />
                    </button>
                    <button 
                      className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setViewMode('list')}
                      title="Liste görünümü"
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Advanced Filters */}
          {isFiltersVisible && (
            <div className="row mb-4">
              <div className="col">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="row">
                      {/* Sort options */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Sıralama</label>
                        <select 
                          className="form-select"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                        >
                          <option value="title">İsme göre (A-Z)</option>
                          <option value="date">Tarihe göre (Yeni-Eski)</option>
                          <option value="rating">Puanınıza göre (Yüksek-Düşük)</option>
                          <option value="popularity">Popülerliğe göre</option>
                        </select>
                      </div>
                      
                      {/* Genre filter */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Tür</label>
                        <select 
                          className="form-select"
                          value={filterGenre}
                          onChange={(e) => setFilterGenre(e.target.value)}
                        >
                          <option value="">Tüm Türler</option>
                          {allGenres.map(genre => (
                            <option key={genre} value={genre}>
                              {genre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Active filters summary */}
                    {(filterGenre || searchTerm) && (
                      <div className="mt-2">
                        <div className="d-flex align-items-center gap-2">
                          <Filter size={16} className="text-primary" />
                          <strong>Aktif Filtreler:</strong>
                          {searchTerm && (
                            <span className="badge bg-primary me-2">
                              "{searchTerm}"
                            </span>
                          )}
                          {filterGenre && (
                            <span className="badge bg-primary me-2">
                              {filterGenre}
                            </span>
                          )}
                          <button 
                            className="btn btn-sm btn-outline-secondary ms-auto"
                            onClick={() => {
                              setSearchTerm('');
                              setFilterGenre('');
                            }}
                          >
                            Filtreleri Temizle
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Empty state */}
      {favorites.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <Heart size={64} className="text-secondary opacity-50" />
          </div>
          <h3>Favori film listeniz boş</h3>
          <p className="text-muted">
            Beğendiğiniz filmleri favorilere ekleyin ve burada listeleyin
          </p>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="alert alert-warning text-center">
          <p className="mb-0">Arama kriterlerine uygun film bulunamadı.</p>
        </div>
      ) : (
        <>
          {/* Results count */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="text-muted mb-0">
              {filteredFavorites.length} film bulundu
            </p>
          </div>
          
          {/* Movies grid view */}
          {viewMode === 'grid' ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-4">
              {filteredFavorites.map(movie => (
                <div className="col" key={movie.id}>
                  <MovieCard
                    movie={movie}
                    isFavorite={isFavorite}
                    onToggleFavorite={onToggleFavorite}
                    onOpenDetails={onOpenDetails}
                    isWatched={watchedMovies.some(m => m.id === movie.id)}
                    toggleWatched={() => toggleWatched(movie)}
                    userRating={ratings[movie.id] || 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-4">
              {filteredFavorites.map(movie => (
                <MovieListItem key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FavoritesPage;