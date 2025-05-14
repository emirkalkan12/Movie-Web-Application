import React, { useState, useMemo } from 'react';
import { ListChecks, Search, SlidersHorizontal, Filter, Eye, Calendar, Grid, List } from 'lucide-react';
import MovieCard from '../components/MovieCard';

const WatchlistPage = ({
  watchlist,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  toggleWatched,
  isInWatchlist,
  removeFromWatchlist
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("added");
  const [filterGenre, setFilterGenre] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  // Filter and sort watchlist
  const filteredWatchlist = useMemo(() => {
    let result = [...watchlist];
    
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
    } else if (sortBy === "popularity") {
      result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }
    // default is "added" which is the natural order of the array
    
    return result;
  }, [watchlist, searchTerm, sortBy, filterGenre]);

  // Extract all unique genres from watchlist movies
  const allGenres = useMemo(() => {
    const genres = watchlist.flatMap(movie => movie.genres?.map(genre => genre.name) || []);
    return [...new Set(genres)].sort();
  }, [watchlist]);

  // Movie list view component
  const MovieListItem = ({ movie }) => {
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
      : 'https://via.placeholder.com/92x138?text=Resim+Yok&bg=343a40&fg=ffffff';
    
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
                  onClick={() => removeFromWatchlist(movie)}
                  title="Listeden Çıkar"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-10 col-sm-9 col-8">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="card-title">{movie.title}</h5>
              </div>
              
              <div className="d-flex gap-2 text-muted small mb-2">
                {movie.release_date && (
                  <span className="d-flex align-items-center">
                    <Calendar size={14} className="me-1" />
                    {new Date(movie.release_date).getFullYear()}
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
              
              <p className="card-text small text-dark text-truncate-2">
                {movie.overview || "Film açıklaması bulunmamaktadır."}
              </p>
              
              <div className="mt-2">
                <button 
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => onOpenDetails(movie)}
                >
                  Detaylar
                </button>
                <button 
                  className="btn btn-success btn-sm me-2"
                  onClick={() => toggleWatched(movie)}
                >
                  İzledim
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => removeFromWatchlist(movie)}
                >
                  Listeden Çıkar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Get empty state message component
  const EmptyState = () => (
    <div className="text-center py-5">
      <div className="mb-4">
        <ListChecks size={64} className="text-primary opacity-50" />
      </div>
      <h4>İzleme Listeniz Boş</h4>
      <p className="text-muted">
        İzlemek istediğiniz filmler burada görünecek. <br />
        Filmleri keşfedip "İzleme Listesine Ekle" butonuna tıklayarak başlayabilirsiniz.
      </p>
      <a href="/discover" className="btn btn-primary mt-2">
        Filmleri Keşfedin
      </a>
    </div>
  );

  // Return empty state if no movies in watchlist
  if (watchlist.length === 0) {
    return (
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col">
            <h1 className="display-5 fw-bold mb-0 d-flex align-items-center">
              <ListChecks size={32} className="text-primary me-2" />
              İzleme Listem
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <EmptyState />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-5 fw-bold mb-0 d-flex align-items-center">
            <ListChecks size={32} className="text-primary me-2" />
            İzleme Listem
          </h1>
          <p className="text-muted mt-2">
            İzlemek istediğiniz {watchlist.length} film
          </p>
        </div>
      </div>
      
      {/* Search and Filters */}
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
                >
                  <Grid size={16} />
                </button>
                <button
                  className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      {isFiltersVisible && (
        <div className="row mb-4">
          <div className="col">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="sortBy" className="form-label d-flex align-items-center">
                      <Filter size={16} className="me-2" /> Sıralama
                    </label>
                    <select
                      id="sortBy"
                      className="form-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="added">Eklenme Sırası</option>
                      <option value="title">Film Adı</option>
                      <option value="date">Yayın Tarihi</option>
                      <option value="popularity">Popülerlik</option>
                    </select>
                  </div>
                  
                  {allGenres.length > 0 && (
                    <div className="col-md-6">
                      <label htmlFor="filterGenre" className="form-label d-flex align-items-center">
                        <Filter size={16} className="me-2" /> Tür Filtresi
                      </label>
                      <select
                        id="filterGenre"
                        className="form-select"
                        value={filterGenre}
                        onChange={(e) => setFilterGenre(e.target.value)}
                      >
                        <option value="">Tüm Türler</option>
                        {allGenres.map(genre => (
                          <option key={genre} value={genre}>{genre}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Movie List */}
      {filteredWatchlist.length === 0 ? (
        <div className="alert alert-info text-center">
          Arama kriterlerinize uygun film bulunamadı.
        </div>
      ) : (
        <div className="row">
          {viewMode === 'grid' ? (
            <>
              {filteredWatchlist.map(movie => (
                <div key={movie.id} className="col-md-3 mb-4">
                  <MovieCard
                    movie={movie}
                    isFavorite={isFavorite}
                    onToggleFavorite={onToggleFavorite}
                    onOpenDetails={onOpenDetails}
                    isWatched={false}
                    toggleWatched={toggleWatched}
                    isInWatchlist={isInWatchlist}
                    toggleWatchlist={removeFromWatchlist}
                  />
                </div>
              ))}
            </>
          ) : (
            <>
              {filteredWatchlist.map(movie => (
                <div key={movie.id} className="col-12 mb-3">
                  <MovieListItem movie={movie} />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage; 