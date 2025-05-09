import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";
import MovieDetailsModal from "./components/MovieDetailsModal";

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

  const [ratings, setRatings] = useState(() => {
    const stored = localStorage.getItem("movieRatings");
    try {
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies));
  }, [watchedMovies]);

  useEffect(() => {
    localStorage.setItem("movieRatings", JSON.stringify(ratings));
  }, [ratings]);

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      return prev.some((fav) => fav.id === movie.id)
        ? prev.filter((fav) => fav.id !== movie.id)
        : [...prev, movie];
    });
  };

  const isFavorite = (id) => favorites.some((fav) => fav.id === id);

  const toggleWatched = (movieId, setStatus = undefined) => {
    setWatchedMovies((prev) => {
      const isWatched = prev.includes(movieId);
      if (setStatus === true) return isWatched ? prev : [...prev, movieId];
      if (setStatus === false) return prev.filter((id) => id !== movieId);
      return isWatched ? prev.filter((id) => id !== movieId) : [...prev, movieId];
    });
  };

  const rateMovie = (movieId, rating) => {
    setRatings((prev) => ({ ...prev, [movieId]: rating }));
  };

  const handleOpenDetails = (movie) => setSelectedMovie(movie);
  const handleCloseDetails = () => setSelectedMovie(null);

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">✨ MovieApp</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Ana Sayfa</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/favorites">Favoriler</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                onOpenDetails={handleOpenDetails}
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
                ratings={ratings}
                rateMovie={rateMovie}
              />
            }
          />
        </Routes>
      </main>

      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={handleCloseDetails}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          isWatched={watchedMovies.includes(selectedMovie.id)}
          toggleWatched={(status) => toggleWatched(selectedMovie.id, status)}
          userRating={ratings[selectedMovie.id] || 0}
          rateMovie={(rating) => rateMovie(selectedMovie.id, rating)}
        />
      )}
    </Router>
  );
}

export default App;
// App.js dosyası, uygulamanın ana bileşenini içerir ve yönlendirme, durum yönetimi ve modal açma/kapama işlevlerini yönetir.
// Uygulama, ana sayfa ve favori filmler sayfası arasında geçiş yapar. Ayrıca, film detayları için bir modal bileşeni kullanır.
