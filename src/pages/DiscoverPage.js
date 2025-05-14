import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Sliders, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';

const DiscoverPage = ({ 
  isFavorite, 
  onToggleFavorite, 
  onOpenDetails, 
  isWatched, 
  toggleWatched, 
  ratings,
  isInWatchlist,
  toggleWatchlist
}) => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [year, setYear] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [voteAverage, setVoteAverage] = useState(0);

  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

  // Sorting options
  const sortOptions = [
    { value: 'popularity.desc', label: 'Popülerlik (Çoktan Aza)' },
    { value: 'popularity.asc', label: 'Popülerlik (Azdan Çoğa)' },
    { value: 'vote_average.desc', label: 'Puan (Çoktan Aza)' },
    { value: 'vote_average.asc', label: 'Puan (Azdan Çoğa)' },
    { value: 'release_date.desc', label: 'Yeni Çıkanlar' },
    { value: 'release_date.asc', label: 'Eski Filmler' },
    { value: 'revenue.desc', label: 'Hasılat (Çoktan Aza)' },
  ];

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=tr-TR`);
        setGenres(res.data.genres);
      } catch (err) {
        console.error('Genre fetch error:', err);
      }
    };

    fetchGenres();
  }, [apiKey]);

  // Fetch movies with filters
  useEffect(() => {
    const fetchDiscoverMovies = async () => {
      setLoading(true);
      try {
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=tr-TR&sort_by=${sortBy}&page=${page}`;
        
        if (year) {
          url += `&primary_release_year=${year}`;
        }
        
        if (selectedGenres.length > 0) {
          url += `&with_genres=${selectedGenres.join(',')}`;
        }
        
        if (voteAverage > 0) {
          url += `&vote_average.gte=${voteAverage}`;
        }

        const res = await axios.get(url);
        setMovies(res.data.results);
        setTotalPages(Math.min(res.data.total_pages, 500)); // TMDb API limits to 500 pages max
      } catch (err) {
        console.error(err);
        setError("Filmler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscoverMovies();
  }, [apiKey, page, sortBy, year, selectedGenres, voteAverage]);

  // Handle genre selection
  const handleGenreToggle = (genreId) => {
    setSelectedGenres(prev => 
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
    setPage(1); // Reset to first page when filter changes
  };

  // Handle pagination
  const goToPreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const goToNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Reset all filters
  const resetFilters = () => {
    setSortBy('popularity.desc');
    setYear('');
    setSelectedGenres([]);
    setVoteAverage(0);
    setPage(1);
  };

  // Generate year options (last 100 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">🔍 Film Keşfet</h1>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary d-flex align-items-center gap-1"
            onClick={resetFilters}
            disabled={selectedGenres.length === 0 && !year && voteAverage === 0}
          >
            <X size={18} /> Filtreleri Temizle
          </button>
          <button 
            className={`btn ${showFilters ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center gap-1`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Sliders size={18} /> 
            {showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title mb-0">Gelişmiş Filtreler</h5>
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={resetFilters}
              >
                Filtreleri Sıfırla
              </button>
            </div>
            
            <div className="row">
              {/* Sorting options */}
              <div className="col-md-4 mb-3">
                <label className="form-label">Sıralama</label>
                <select 
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Year filter */}
              <div className="col-md-4 mb-3">
                <label className="form-label">Yıl</label>
                <select 
                  className="form-select"
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">Tüm Yıllar</option>
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              {/* Minimum rating */}
              <div className="col-md-4 mb-3">
                <label className="form-label">Minimum Puan: {voteAverage}</label>
                <input 
                  type="range" 
                  className="form-range" 
                  min="0" 
                  max="10" 
                  step="0.5"
                  value={voteAverage}
                  onChange={(e) => {
                    setVoteAverage(parseFloat(e.target.value));
                    setPage(1);
                  }}
                />
              </div>
            </div>
            
            {/* Genre filters */}
            <div className="mb-3">
              <label className="form-label">Türler</label>
              <div className="d-flex flex-wrap gap-2">
                {genres.map(genre => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreToggle(genre.id)}
                    className={`btn btn-sm ${
                      selectedGenres.includes(genre.id)
                        ? 'btn-primary'
                        : 'btn-outline-primary'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      )}
      
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* Applied filters summary */}
      {(selectedGenres.length > 0 || year || voteAverage > 0) && !loading && (
        <div className="alert alert-info mb-4">
          <div className="d-flex align-items-center gap-2">
            <Filter size={16} />
            <strong>Aktif Filtreler:</strong>
            {selectedGenres.length > 0 && (
              <span className="badge bg-primary me-2">
                {selectedGenres.length} tür seçili
              </span>
            )}
            {year && (
              <span className="badge bg-primary me-2">
                {year} yılı
              </span>
            )}
            {voteAverage > 0 && (
              <span className="badge bg-primary me-2">
                Min. {voteAverage} puan
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Results count */}
      {!loading && movies.length > 0 && (
        <p className="text-muted mb-4">
          Sayfa {page}/{totalPages} · Toplam {movies.length} film gösteriliyor
        </p>
      )}

      {/* Movies grid */}
      <div className="row">
        {!loading && movies.length === 0 && (
          <div className="col-12 text-center py-5">
            <div className="alert alert-warning">
              Bu filtrelere uygun film bulunamadı. Lütfen filtreleri değiştirip tekrar deneyin.
            </div>
          </div>
        )}

        {movies.map(movie => (
          <div key={movie.id} className="col-md-3 mb-4">
            <MovieCard
              movie={movie}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
              onOpenDetails={onOpenDetails}
              isWatched={isWatched(movie.id)}
              toggleWatched={() => toggleWatched(movie)}
              isInWatchlist={isInWatchlist}
              toggleWatchlist={() => toggleWatchlist(movie)}
              userRating={ratings[movie.id] || 0}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!loading && movies.length > 0 && (
        <div className="d-flex justify-content-center mt-4">
          <nav aria-label="Page navigation">
            <ul className="pagination">
              <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link d-flex align-items-center" 
                  onClick={goToPreviousPage}
                  disabled={page === 1}
                >
                  <ChevronLeft size={16} className="me-1" /> Önceki
                </button>
              </li>
              
              {/* Page number indicators */}
              {page > 2 && (
                <li className="page-item d-none d-md-block">
                  <button className="page-link" onClick={() => setPage(1)}>1</button>
                </li>
              )}
              
              {page > 3 && (
                <li className="page-item disabled d-none d-md-block">
                  <span className="page-link">...</span>
                </li>
              )}
              
              {page > 1 && (
                <li className="page-item d-none d-md-block">
                  <button className="page-link" onClick={() => setPage(page - 1)}>{page - 1}</button>
                </li>
              )}
              
              <li className="page-item active">
                <span className="page-link">{page}</span>
              </li>
              
              {page < totalPages && (
                <li className="page-item d-none d-md-block">
                  <button className="page-link" onClick={() => setPage(page + 1)}>{page + 1}</button>
                </li>
              )}
              
              {page < totalPages - 2 && (
                <li className="page-item disabled d-none d-md-block">
                  <span className="page-link">...</span>
                </li>
              )}
              
              {page < totalPages - 1 && (
                <li className="page-item d-none d-md-block">
                  <button className="page-link" onClick={() => setPage(totalPages)}>{totalPages}</button>
                </li>
              )}
              
              <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link d-flex align-items-center" 
                  onClick={goToNextPage}
                  disabled={page === totalPages}
                >
                  Sonraki <ChevronRight size={16} className="ms-1" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
