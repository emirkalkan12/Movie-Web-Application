import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

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

  return (
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
            <div className="card h-100 shadow-sm">
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
