import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Home, Heart, Film, Compass, Tv, TrendingUp, Search, Menu, ListChecks } from "lucide-react";
import './App.css';

import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";
import WatchedPage from "./pages/WatchedPage";
import DiscoverPage from "./pages/DiscoverPage";
import WatchlistPage from "./pages/WatchlistPage";
import MovieDetailsModal from "./components/MovieDetailsModal";
import StatsDashboard from "./components/StatsDashboard";

function App() {
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    try {
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [watchedMovies, setWatchedMovies] = useState(() => {
    const stored = localStorage.getItem("watchedMovies");
    try {
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [watchlist, setWatchlist] = useState(() => {
    const stored = localStorage.getItem("watchlist");
    try {
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [ratings, setRatings] = useState(() => {
    const stored = localStorage.getItem("movieRatings");
    try {
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored || "dark";
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies));
  }, [watchedMovies]);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem("movieRatings", JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.setAttribute("data-bs-theme", theme);
  }, [theme]);

  const toggleFavorite = (movie) => {
    const exists = favorites.find((fav) => fav.id === movie.id);
    if (exists) {
      setFavorites(favorites.filter((fav) => fav.id !== movie.id));
      toast.info(`${movie.title} favorilerden kaldırıldı.`);
    } else {
      setFavorites([...favorites, movie]);
      toast.success(`${movie.title} favorilere eklendi.`);
    }
  };

  const isFavorite = (id) => favorites.some((fav) => fav.id === id);

  const toggleWatched = (movie) => {
    const exists = watchedMovies.find((m) => m.id === movie.id);
    if (exists) {
      setWatchedMovies(watchedMovies.filter((m) => m.id !== movie.id));
      toast.info(`${movie.title} izlendi listesinden çıkarıldı.`);
    } else {
      setWatchedMovies([...watchedMovies, movie]);
      toast.success(`${movie.title} izlendi listesine eklendi.`);
      // İzlendi olarak işaretlenince izleme listesinden kaldır
      if (isInWatchlist(movie.id)) {
        removeFromWatchlist(movie);
      }
    }
  };

  const isWatched = (id) => watchedMovies.some((m) => m.id === id);

  const toggleWatchlist = (movie) => {
    const exists = watchlist.find((m) => m.id === movie.id);
    if (exists) {
      removeFromWatchlist(movie);
    } else {
      addToWatchlist(movie);
    }
  };

  const addToWatchlist = (movie) => {
    if (isWatched(movie.id)) {
      toast.info(`${movie.title} zaten izlendi olarak işaretlenmiş.`);
      return;
    }
    
    setWatchlist([...watchlist, movie]);
    toast.success(`${movie.title} izleme listesine eklendi.`);
  };

  const removeFromWatchlist = (movie) => {
    setWatchlist(watchlist.filter((m) => m.id !== movie.id));
    toast.info(`${movie.title} izleme listesinden kaldırıldı.`);
  };

  const isInWatchlist = (id) => watchlist.some((m) => m.id === id);

  const rateMovie = (movieId, rating) => {
    setRatings((prev) => ({ ...prev, [movieId]: rating }));
    const movie = [...favorites, ...watchedMovies].find(m => m.id === movieId);
    if (movie) {
      toast.success(`${movie.title} için puanınız: ${rating}/10`);
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "dark" ? "light" : "dark");
  };

  const handleOpenDetails = (movie) => setSelectedMovie(movie);
  const handleCloseDetails = () => setSelectedMovie(null);

  // Calculate statistics
  const totalWatchTime = watchedMovies.reduce((acc, movie) => {
    return acc + (movie.runtime || 0);
  }, 0);
  
  const genreCounts = watchedMovies.reduce((acc, movie) => {
    if (movie.genres) {
      movie.genres.forEach(genre => {
        acc[genre.name] = (acc[genre.name] || 0) + 1;
      });
    }
    return acc;
  }, {});

  const mostWatchedGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0];

  const stats = {
    totalMovies: watchedMovies.length,
    totalFavorites: favorites.length,
    totalWatchTime,
    totalRated: Object.keys(ratings).length,
    totalWatchlist: watchlist.length,
    averageRating: Object.values(ratings).length 
      ? (Object.values(ratings).reduce((acc, val) => acc + val, 0) / Object.values(ratings).length).toFixed(1)
      : 0,
    mostWatchedGenre: mostWatchedGenre ? mostWatchedGenre[0] : 'Henüz yok',
    genreCounts
  };

  return (
    <Router>
      <div className={`app-container ${theme}`}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
          <div className="container">
            <Link className="navbar-brand d-flex align-items-center" to="/">
              <Film className="me-2" size={24} /> 
              <span className="fw-bold">MovieApp</span>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <Menu size={24} />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <NavLink className={({isActive}) => `nav-link d-flex align-items-center gap-2 ${isActive ? 'active fw-bold' : ''}`} to="/">
                    <Home size={20} /> <span className="d-none d-md-inline">Ana Sayfa</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({isActive}) => `nav-link d-flex align-items-center gap-2 ${isActive ? 'active fw-bold' : ''}`} to="/discover">
                    <Compass size={20} /> <span className="d-none d-md-inline">Keşfet</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({isActive}) => `nav-link d-flex align-items-center gap-2 ${isActive ? 'active fw-bold' : ''}`} to="/watchlist">
                    <ListChecks size={20} /> <span className="d-none d-md-inline">İzleme Listesi</span>
                    {watchlist.length > 0 && (
                      <span className="badge bg-primary rounded-pill">{watchlist.length}</span>
                    )}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({isActive}) => `nav-link d-flex align-items-center gap-2 ${isActive ? 'active fw-bold' : ''}`} to="/favorites">
                    <Heart size={20} /> <span className="d-none d-md-inline">Favoriler</span>
                    {favorites.length > 0 && (
                      <span className="badge bg-danger rounded-pill">{favorites.length}</span>
                    )}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({isActive}) => `nav-link d-flex align-items-center gap-2 ${isActive ? 'active fw-bold' : ''}`} to="/watched">
                    <Tv size={20} /> <span className="d-none d-md-inline">İzlenenler</span>
                    {watchedMovies.length > 0 && (
                      <span className="badge bg-success rounded-pill">{watchedMovies.length}</span>
                    )}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button 
                    className="nav-link d-flex align-items-center gap-2"
                    onClick={() => setShowStats(!showStats)}
                  >
                    <TrendingUp size={20} /> <span className="d-none d-md-inline">İstatistikler</span>
                  </button>
                </li>
                <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                  <button 
                    className="btn btn-outline-light btn-sm w-100"
                    onClick={toggleTheme}
                  >
                    {theme === 'dark' ? '☀️' : '🌙'} <span className="d-none d-md-inline">{theme === 'dark' ? 'Aydınlık Mod' : 'Karanlık Mod'}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Statistics Dashboard Modal */}
        {showStats && (
          <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" 
               style={{ zIndex: 1050 }}>
            <div className="container-fluid container-md px-2 py-2 py-md-0">
              <StatsDashboard 
                stats={stats} 
                onClose={() => setShowStats(false)}
              />
            </div>
          </div>
        )}

        <main className="container my-4">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                  onOpenDetails={handleOpenDetails}
                  isWatched={isWatched}
                  toggleWatched={toggleWatched}
                  isInWatchlist={isInWatchlist}
                  toggleWatchlist={toggleWatchlist}
                  ratings={ratings}
                />
              }
            />
            <Route
              path="/favorites"
              element={
                <FavoritesPage
                  favorites={favorites}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                  onOpenDetails={handleOpenDetails}
                  watchedMovies={watchedMovies}
                  toggleWatched={toggleWatched}
                  isInWatchlist={isInWatchlist}
                  toggleWatchlist={toggleWatchlist}
                  ratings={ratings}
                  rateMovie={rateMovie}
                />
              }
            />
            <Route
              path="/watched"
              element={
                <WatchedPage
                  watchedMovies={watchedMovies}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                  onOpenDetails={handleOpenDetails}
                  isWatched={isWatched}
                  toggleWatched={toggleWatched}
                  ratings={ratings}
                  rateMovie={rateMovie}
                />
              }
            />
            <Route
              path="/watchlist"
              element={
                <WatchlistPage
                  watchlist={watchlist}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                  onOpenDetails={handleOpenDetails}
                  toggleWatched={toggleWatched}
                  isInWatchlist={isInWatchlist}
                  removeFromWatchlist={removeFromWatchlist}
                />
              }
            />
            <Route
              path="/discover"
              element={
                <DiscoverPage
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                  onOpenDetails={handleOpenDetails}
                  isWatched={isWatched}
                  toggleWatched={toggleWatched}
                  isInWatchlist={isInWatchlist}
                  toggleWatchlist={toggleWatchlist}
                  ratings={ratings}
                />
              }
            />
          </Routes>
        </main>

        <footer className="bg-dark text-light py-4 mt-5">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h5 className="mb-3">MovieApp</h5>
                <p className="text-light-emphasis">
                  Film tutkunları için geliştirilmiş, filmleri keşfetmenize, 
                  favorilere eklemenize ve izleme listenizi yönetmenize yardımcı olan
                  bir uygulamadır.
                </p>
              </div>
              <div className="col-md-3">
                <h5 className="mb-3">Bağlantılar</h5>
                <ul className="list-unstyled">
                  <li><Link className="text-decoration-none text-light-emphasis" to="/">Ana Sayfa</Link></li>
                  <li><Link className="text-decoration-none text-light-emphasis" to="/discover">Keşfet</Link></li>
                  <li><Link className="text-decoration-none text-light-emphasis" to="/watchlist">İzleme Listesi</Link></li>
                  <li><Link className="text-decoration-none text-light-emphasis" to="/favorites">Favoriler</Link></li>
                  <li><Link className="text-decoration-none text-light-emphasis" to="/watched">İzlenenler</Link></li>
                </ul>
              </div>
              <div className="col-md-3">
                <h5 className="mb-3">API</h5>
                <p className="text-light-emphasis small">
                  Bu uygulama, The Movie Database (TMDb) API'sini kullanmaktadır.
                  Film verileri TMDb tarafından sağlanmaktadır.
                </p>
              </div>
            </div>
            <hr className="my-4 border-secondary" />
            <div className="text-center text-light-emphasis small">
              <p>© {new Date().getFullYear()} MovieApp. Tüm Hakları Saklıdır.</p>
            </div>
          </div>
        </footer>

        {selectedMovie && (
          <MovieDetailsModal
            movie={selectedMovie}
            onClose={handleCloseDetails}
            isFavorite={isFavorite(selectedMovie.id)}
            onToggleFavorite={() => toggleFavorite(selectedMovie)}
            isWatched={isWatched(selectedMovie.id)}
            toggleWatched={() => toggleWatched(selectedMovie)}
            isInWatchlist={isInWatchlist(selectedMovie.id)}
            toggleWatchlist={() => toggleWatchlist(selectedMovie)}
            userRating={ratings[selectedMovie.id] || 0}
            rateMovie={(rating) => rateMovie(selectedMovie.id, rating)}
          />
        )}

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme}
        />
      </div>
    </Router>
  );
}

export default App;
