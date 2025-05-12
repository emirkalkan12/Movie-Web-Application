import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import 'bootstrap/dist/css/bootstrap.min.css';

const DiscoverPage = ({ isFavorite, onToggleFavorite, onOpenDetails, isWatched, toggleWatched, ratings }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    const fetchDiscoverMovies = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=tr-TR&sort_by=popularity.desc`);
        setMovies(res.data.results);
      } catch (err) {
        console.error(err);
        setError("Filmler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscoverMovies();
  }, [apiKey]);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4"> Keşfet</h1>
      {loading && <div className="text-center">Yükleniyor...</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <div className="row">
        {movies.map(movie => (
          <div key={movie.id} className="col-md-3 mb-4">
            <MovieCard
              movie={movie}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
              onOpenDetails={onOpenDetails}
              isWatched={isWatched(movie.id)}
              toggleWatched={() => toggleWatched(movie)}
              userRating={ratings[movie.id] || 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoverPage;
