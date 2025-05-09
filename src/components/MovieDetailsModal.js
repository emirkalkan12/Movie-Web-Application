import React, { useState } from 'react';
import { X, Star, StarHalf, Calendar, Clock, Tag, Heart, CheckCircle } from 'lucide-react';

const MovieDetailsModal = ({ movie, isOpen, onClose, isFavorite, onToggleFavorite, isWatched, onToggleWatched, userRating, onRateMovie }) => {
  const [rating, setRating] = useState(userRating);
  
  if (!isOpen || !movie) return null;
  
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/api/placeholder/500/750";
  
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  
  const handleRating = (newRating) => {
    setRating(newRating);
    onRateMovie(movie.id, newRating);
  };
  
  const formatRuntime = (minutes) => {
    if (!minutes) return 'Süre belirtilmemiş';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs} sa` : ''} ${mins > 0 ? `${mins} dk` : ''}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Backdrop header */}
        {backdropUrl && (
          <div className="relative h-48 md:h-64 overflow-hidden">
            <img 
              src={backdropUrl} 
              alt={`${movie.title} backdrop`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Poster and actions */}
            <div className="flex flex-col items-center gap-4">
              <img 
                src={posterUrl} 
                alt={movie.title} 
                className="w-40 h-60 object-cover rounded-lg shadow-md"
              />
              
              <div className="flex flex-col gap-2 w-full">
                <button 
                  onClick={() => onToggleFavorite(movie)}
                  className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${
                    isFavorite(movie.id) 
                    ? 'bg-red-500 text-white' 
                    : 'border border-red-500 text-red-500'
                  }`}
                >
                  <Heart size={18} fill={isFavorite(movie.id) ? "white" : "none"} /> 
                  {isFavorite(movie.id) ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                </button>
                
                <button 
                  onClick={() => onToggleWatched(movie.id)}
                  className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${
                    isWatched 
                    ? 'bg-green-500 text-white' 
                    : 'border border-green-500 text-green-500'
                  }`}
                >
                  <CheckCircle size={18} /> 
                  {isWatched ? 'İzlendi' : 'İzlendi İşaretle'}
                </button>
              </div>
            </div>
            
            {/* Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
              
              {movie.tagline && (
                <p className="text-gray-500 italic mb-4">{movie.tagline}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.release_date && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-1" />
                    {new Date(movie.release_date).getFullYear()}
                  </div>
                )}
                
                {movie.runtime && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-1" />
                    {formatRuntime(movie.runtime)}
                  </div>
                )}
                
                {movie.vote_average > 0 && (
                  <div className="flex items-center text-sm text-yellow-500">
                    <Star size={16} fill="currentColor" className="mr-1" />
                    {movie.vote_average.toFixed(1)}
                  </div>
                )}
              </div>
              
              {movie.genres && movie.genres.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map(genre => (
                      <span key={genre.id} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {movie.overview && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Özet</h3>
                  <p className="text-gray-700">{movie.overview}</p>
                </div>
              )}
              
              {/* Rating */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Puanınız</h3>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => handleRating(star)}
                      className="text-yellow-400 hover:scale-110 transition-transform"
                    >
                      <Star 
                        size={24} 
                        fill={rating >= star ? 'currentColor' : 'none'} 
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <button 
                      onClick={() => handleRating(0)} 
                      className="ml-2 text-gray-400 hover:text-gray-600"
                      title="Puanı kaldır"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t p-4 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;