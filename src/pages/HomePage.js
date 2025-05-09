import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import 'bootstrap/dist/css/bootstrap.min.css';

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

const HomePage = ({ isFavorite, onToggleFavorite, onOpenDetails, isWatched, toggleWatched }) => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

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
        response.data.results.map(async (movie) => {
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

      {loading && (
        <div className="text-center py-4">
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
        {!loading && !error && movies.length === 0 && query.trim() === "" && (
          <div className="col-12 text-center text-muted">
            Yukarıdaki alana bir film adı yazarak arama yapın.
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
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
