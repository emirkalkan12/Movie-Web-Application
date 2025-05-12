import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";
import WatchedPage from "./pages/WatchedPage";
import DiscoverPage from "./pages/DiscoverPage"; // DiscoverPage eklendi
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
    }
  };

  const isWatched = (id) => watchedMovies.some((m) => m.id === id);

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
              <li className="nav-item">
                <Link className="nav-link" to="/watched">İzlenenler</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/discover">Keşfet</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

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
            path="/discover"
            element={
              <DiscoverPage
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                onOpenDetails={handleOpenDetails}
                isWatched={isWatched}
                toggleWatched={toggleWatched}
                ratings={ratings}
              />
            }
          />
        </Routes>
      </main>

      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={handleCloseDetails}
          isFavorite={isFavorite(selectedMovie.id)}
          onToggleFavorite={() => toggleFavorite(selectedMovie)}
          isWatched={isWatched(selectedMovie.id)}
          toggleWatched={() => toggleWatched(selectedMovie)}
          userRating={ratings[selectedMovie.id] || 0}
          rateMovie={(rating) => rateMovie(selectedMovie.id, rating)}
        />
      )}

      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </Router>
  );
}

export default App;
