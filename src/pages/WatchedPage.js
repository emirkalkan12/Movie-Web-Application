import React from "react";
import MovieCard from "../components/MovieCard";

const WatchedPage = ({
  watchedMovies,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  toggleWatched,
  ratings,
}) => {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">👁️ İzlenen Filmler</h1>
      {watchedMovies.length === 0 ? (
        <p className="text-muted text-center">Henüz izlenen film yok.</p>
      ) : (
        <div className="row">
          {watchedMovies.map((movie) => (
            <div key={movie.id} className="col-md-3 mb-4">
              <MovieCard
                movie={movie}
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
                onOpenDetails={onOpenDetails}
                isWatched={true}
                userRating={ratings[movie.id] || 0}
                toggleWatched={toggleWatched}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchedPage;
