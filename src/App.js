import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Favorites from "./favorites";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    if (query.trim() === "") {
      setMovies([]);
      return;
    }

    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchMovies();
  }, [query]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movie) => {
    const exists = favorites.find((fav) => fav.id === movie.id);
    if (exists) {
      setFavorites(favorites.filter((fav) => fav.id !== movie.id));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  const isFavorite = (id) => favorites.some((fav) => fav.id === id);

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">🎬 MovieApp</Link>
          <div className="collapse navbar-collapse">
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

      <Routes>
        <Route path="/" element={
          <div className="container py-5">
            <h1 className="text-center mb-4">🎬 Film Arama</h1>
            <div className="row mb-5">
              <div className="col-md-6 offset-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Bir film adı girin..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              {movies.map((movie) => (
                <div key={movie.id} className="col-md-3 mb-4">
                  <div className="card h-100 shadow-sm d-flex flex-column">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                          : "https://via.placeholder.com/300x450?text=No+Image"
                      }
                      className="card-img-top"
                      alt={movie.title}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{movie.title}</h5>
                      <p className="card-text text-muted">{movie.release_date}</p>
                      <button
                        className={`btn btn-sm mt-auto ${
                          isFavorite(movie.id)
                            ? "btn-danger"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => toggleFavorite(movie)}
                      >
                        {isFavorite(movie.id)
                          ? "Favoriden Kaldır"
                          : "Favorilere Ekle"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        } />
        
        <Route path="/favorites" element={
          <Favorites
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        } />
      </Routes>
    </Router>
  );
}

export default App;
