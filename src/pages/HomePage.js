import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Search, TrendingUp, Star, Activity, Clock, Film, PlayCircle, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

const HomePage = ({ isFavorite, onToggleFavorite, onOpenDetails, isWatched, toggleWatched, ratings }) => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [genreHighlights, setGenreHighlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('popular');

  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

  // Genres to highlight with their IDs from TMDB
  const featuredGenres = [
    { id: 28, name: 'Aksiyon', icon: <Activity size={18} /> },
    { id: 35, name: 'Komedi', icon: <PlayCircle size={18} /> },
    { id: 18, name: 'Drama', icon: <Film size={18} /> },
    { id: 27, name: 'Korku', icon: <Clock size={18} /> }
  ];

  // Fetch initial data (popular, trending, top rated movies)
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!apiKey) return;
      
      setInitialLoading(true);
      
      try {
        // Fetch popular movies
        const popularRes = await axios.get(
          `${TMDB_API_BASE_URL}/movie/popular?api_key=${apiKey}&language=tr-TR&page=1`
        );
        setPopularMovies(popularRes.data.results.slice(0, 8));
        
        // Fetch trending movies
        const trendingRes = await axios.get(
          `${TMDB_API_BASE_URL}/trending/movie/day?api_key=${apiKey}&language=tr-TR`
        );
        setTrendingMovies(trendingRes.data.results.slice(0, 8));
        
        // Fetch top rated movies
        const topRatedRes = await axios.get(
          `${TMDB_API_BASE_URL}/movie/top_rated?api_key=${apiKey}&language=tr-TR&page=1`
        );
        setTopRatedMovies(topRatedRes.data.results.slice(0, 8));
        
        // Fetch one movie for each featured genre
        const genrePromises = featuredGenres.map(async (genre) => {
          const genreRes = await axios.get(
            `${TMDB_API_BASE_URL}/discover/movie?api_key=${apiKey}&language=tr-TR&with_genres=${genre.id}&sort_by=popularity.desc`
          );
          // Pick a random movie from the top 5 results instead of always the first one
          const randomIndex = Math.floor(Math.random() * Math.min(5, genreRes.data.results.length));
          const genreMovie = genreRes.data.results[randomIndex];
          return { ...genre, movie: genreMovie };
        });
        
        const genreResults = await Promise.all(genrePromises);
        setGenreHighlights(genreResults);
        
      } catch (err) {
        console.error("API Error:", err);
        setError("Film verileri yüklenirken bir hata oluştu.");
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchInitialData();
  }, [apiKey]);

  // Search for movies
  const fetchMovies = useCallback(async (searchQuery) => {
    if (!searchQuery.trim() || !apiKey) {
      setMovies([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${TMDB_API_BASE_URL}/search/movie?api_key=${apiKey}&query=${searchQuery}&language=tr-TR`
      );

      const enrichedMovies = await Promise.all(
        response.data.results.slice(0, 12).map(async (movie) => {
          try {
            const detailRes = await axios.get(
              `${TMDB_API_BASE_URL}/movie/${movie.id}?api_key=${apiKey}&language=tr-TR`
            );
            return { ...movie, ...detailRes.data };
          } catch {
            return movie;
          }
        })
      );

      setMovies(enrichedMovies);

      if (response.data.results.length === 0 && searchQuery.trim() !== "") {
        setError("Aradığınız kritere uygun film bulunamadı.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Filmler getirilirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMovies(query);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, fetchMovies]);

  // Get current display movies based on active section
  const getCurrentMovies = () => {
    switch(activeSection) {
      case 'popular': return popularMovies;
      case 'trending': return trendingMovies;
      case 'topRated': return topRatedMovies;
      default: return popularMovies;
    }
  };

  // Hero section with cover movie
  const HeroSection = () => {
    const heroMovie = trendingMovies[0] || popularMovies[0];
    if (!heroMovie) return null;
    
    const backdropUrl = heroMovie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`
      : null;
    
    return (
      <div className="mb-5 position-relative">
        <div className="card border-0 bg-dark text-white overflow-hidden rounded-lg shadow-lg">
          <div className="ratio ratio-21x9 opacity-50">
            <img 
              src={backdropUrl} 
              className="card-img object-fit-cover" 
              alt={heroMovie.title} 
            />
          </div>
          <div className="card-img-overlay d-flex flex-column justify-content-end">
            <div className="container">
              <div className="row">
                <div className="col-lg-6">
                  <span className="badge bg-primary mb-2 d-inline-flex align-items-center">
                    <TrendingUp size={14} className="me-1" /> Öne Çıkan
                  </span>
                  <h1 className="card-title display-4 fw-bold">{heroMovie.title}</h1>
                  <p className="card-text lead mb-3 d-none d-md-block">
                    {heroMovie.overview?.substring(0, 150)}
                    {heroMovie.overview?.length > 150 ? '...' : ''}
                  </p>
                  <div className="d-flex gap-2 mb-3">
                    <button 
                      className="btn btn-primary" 
                      onClick={() => onOpenDetails(heroMovie)}
                    >
                      Detayları Görüntüle
                    </button>
                    <button 
                      className="btn btn-outline-light"
                      onClick={() => onToggleFavorite(heroMovie)}
                    >
                      {isFavorite(heroMovie.id) ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render genre card with a featured movie
  const GenreCard = ({ genre }) => {
    if (!genre.movie) return null;
    
    const posterUrl = genre.movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${genre.movie.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Image';
    
    return (
      <div className="col-lg-3 col-md-6 mb-4">
        <div className="card h-100 border-0 shadow-sm movie-card overflow-hidden">
          <div className="position-relative">
            <img 
              src={posterUrl}
              className="card-img-top"
              alt={genre.movie.title}
            />
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
              <div className="card-img-overlay d-flex flex-column align-items-center justify-content-center text-center bg-dark bg-opacity-50">
                <div className="mb-2">
                  {genre.icon}
                </div>
                <h3 className="h5 text-white fw-bold">{genre.name}</h3>
                <Link 
                  to="/discover" 
                  className="btn btn-sm btn-primary mt-2"
                >
                  Tümünü Keşfet
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid px-0">
      {/* Hero section */}
      {!initialLoading && !query && <HeroSection />}
      
      <div className="container py-4">
        {/* Search section */}
        <div className="row mb-5">
          <div className="col-lg-8 offset-lg-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">
                  <Search size={24} className="me-2" /> 
                  Film Arama
                </h2>
                <div className="search-container">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Film adı yazın ve binlerce film arasında arama yapın..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <Search className="search-icon" size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {query && (
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="mb-4">Arama Sonuçları</h2>
              
              {loading && (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="alert alert-danger text-center" role="alert">
                  {error}
                </div>
              )}
              
              <div className="row">
                {!loading && !error && movies.length === 0 && query.trim() !== "" && (
                  <div className="col-12 text-center py-5">
                    <div className="alert alert-warning">
                      "{query}" için sonuç bulunamadı. Lütfen farklı anahtar kelimelerle tekrar deneyin.
                    </div>
                  </div>
                )}
                
                {movies.map((movie) => (
                  <div key={movie.id} className="col-md-3 mb-4">
                    <MovieCard
                      movie={movie}
                      isFavorite={isFavorite}
                      onToggleFavorite={onToggleFavorite}
                      onOpenDetails={onOpenDetails}
                      isWatched={isWatched ? isWatched(movie.id) : false}
                      toggleWatched={() => toggleWatched(movie)}
                      userRating={ratings && movie.id ? ratings[movie.id] : 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Featured Content (only shown when not searching) */}
        {!query && (
          <>
            {/* Genre Navigation Cards */}
            <div className="row mb-5">
              <div className="col-12">
                <h2 className="mb-4">Türlere Göz Atın</h2>
                <div className="row">
                  {initialLoading ? (
                    <div className="col-12 text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Yükleniyor...</span>
                      </div>
                    </div>
                  ) : (
                    genreHighlights.map(genre => (
                      <GenreCard key={genre.id} genre={genre} />
                    ))
                  )}
                </div>
              </div>
            </div>
            
            {/* Movie Collections Tabs */}
            <div className="row mb-5">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="mb-0">Keşfedin</h2>
                  <Link to="/discover" className="btn btn-outline-primary d-flex align-items-center gap-2">
                    <Compass size={16} /> Tümünü Keşfet
                  </Link>
                </div>
                
                <ul className="nav nav-tabs mb-4">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeSection === 'popular' ? 'active' : ''}`}
                      onClick={() => setActiveSection('popular')}
                    >
                      <Film size={16} className="me-1" /> Popüler
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeSection === 'trending' ? 'active' : ''}`}
                      onClick={() => setActiveSection('trending')}
                    >
                      <TrendingUp size={16} className="me-1" /> Trend
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeSection === 'topRated' ? 'active' : ''}`}
                      onClick={() => setActiveSection('topRated')}
                    >
                      <Star size={16} className="me-1" /> En İyi Puanlı
                    </button>
                  </li>
                </ul>
                
                <div className="tab-content">
                  <div className="tab-pane fade show active">
                    {initialLoading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Yükleniyor...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="row">
                        {getCurrentMovies().map((movie) => (
                          <div key={movie.id} className="col-md-3 mb-4">
                            <MovieCard
                              movie={movie}
                              isFavorite={isFavorite}
                              onToggleFavorite={onToggleFavorite}
                              onOpenDetails={onOpenDetails}
                              isWatched={isWatched ? isWatched(movie.id) : false}
                              toggleWatched={() => toggleWatched(movie)}
                              userRating={ratings && movie.id ? ratings[movie.id] : 0}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
