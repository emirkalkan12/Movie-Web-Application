import React, { useState, useEffect, useMemo } from 'react';
import { Star, StarOff, X, Heart, List, Grid, Search, Filter, ChevronDown, Info } from "lucide-react";
import MovieDetailsModal from '../components/MovieDetailsModal';


// Fixed MovieListItem component
const MovieListItem = ({ movie, isFavorite, onToggleFavorite, onOpenDetails, isWatched, userRating }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
    : "/api/placeholder/92/138";

  return (
    <div className="flex items-center border-b py-3">
      <img
        src={posterUrl}
        alt={movie.title}
        className="mr-3"
        style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '4px' }}
      />
      <div className="flex-grow">
        <div className="flex items-center mb-1">
          <h5 className="mb-0 mr-2">{movie.title}</h5>
          {isWatched && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded mr-2">Izlendi</span>}
          {userRating > 0 && (
            <div className="flex items-center text-yellow-500 mr-2">
              <Star size={16} fill="currentColor" stroke="none" />
              <span className="ml-1">{userRating}</span>
            </div>
          )}
        </div>
        <p className="text-gray-500 mb-0">{movie.release_date?.substring(0, 4)}</p>
      </div>
      <div className="flex gap-2">
        <button 
          className="border border-blue-500 text-blue-500 px-2 py-1 rounded text-sm flex items-center" 
          onClick={() => onOpenDetails(movie)} 
          title="Detaylar"
        >
          <Info size={18} /> <span className="hidden sm:inline ml-1">Detaylar</span>
        </button>
        <button 
          className="border border-red-500 text-red-500 px-2 py-1 rounded text-sm" 
          onClick={() => onToggleFavorite(movie)} 
          title="Favoriden Kaldır"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

// Fixed MovieCard component
const MovieCard = ({ movie, isFavorite, onToggleFavorite, onOpenDetails, isWatched, userRating }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/api/placeholder/500/750";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-64 object-cover"
        />
        <button
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
          onClick={() => onToggleFavorite(movie)}
          title="Favoriden Kaldır"
        >
          <X size={20} className="text-red-500" />
        </button>
        {isWatched && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            Izlendi
          </div>
        )}
      </div>
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h5 className="font-medium text-lg">{movie.title}</h5>
          {userRating > 0 && (
            <div className="flex items-center text-yellow-500">
              <Star size={16} fill="currentColor" stroke="none" />
              <span className="ml-1">{userRating}</span>
            </div>
          )}
        </div>
        <p className="text-gray-500 text-sm mb-2">{movie.release_date?.substring(0, 4)}</p>
        <p className="text-sm line-clamp-3 mb-4">{movie.overview}</p>
      </div>
      <div className="p-4 pt-0">
        <button
          className="w-full bg-blue-500 text-white py-2 rounded flex items-center justify-center"
          onClick={() => onOpenDetails(movie)}
        >
          <Info size={18} className="mr-1" /> Detaylar
        </button>
      </div>
    </div>
  );
};

const FavoritesPage = ({ favorites, isFavorite, onToggleFavorite, onOpenDetails, watchedMovies, toggleWatched, ratings, rateMovie }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("title");
  const [filterGenre, setFilterGenre] = useState("");
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // For Details Modal
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle opening movie details
  const handleOpenDetails = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  // Handle closing details modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    let result = [...favorites];
    if (searchTerm) {
      result = result.filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterGenre) {
      result = result.filter(movie => movie.genres && movie.genres.some(genre => genre.name === filterGenre));
    }
    if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "date") {
      result.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (sortBy === "rating") {
      result.sort((a, b) => {
        const ratingA = ratings[a.id] || a.vote_average || 0;
        const ratingB = ratings[b.id] || b.vote_average || 0;
        return ratingB - ratingA;
      });
    }
    setFilteredFavorites(result);
  }, [favorites, searchTerm, sortBy, filterGenre, ratings]);

  const allGenres = useMemo(() => {
    const genres = favorites.flatMap(movie => movie.genres?.map(genre => genre.name) || []);
    return [...new Set(genres)].sort();
  }, [favorites]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowGenreDropdown(false);
      setShowSortDropdown(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Prevent propagation for dropdown buttons
  const handleDropdownToggle = (setter, currentValue, e) => {
    e.stopPropagation();
    setter(!currentValue);
  };

  return (
    <div className="container mx-auto py-5 px-4">
      <div className="mb-4 text-center">
        <h1 className="mb-2 text-2xl font-bold">❤️ Favori Filmlerim</h1>
        <p className="text-gray-500">
          {favorites.length === 0
            ? "Henüz favori film eklenmedi"
            : `Toplam ${favorites.length} favori film`}
        </p>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="relative w-full sm:w-auto grow">
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 pl-10"
            placeholder="Film adı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative">
            <button 
              className="flex items-center border rounded-lg px-3 py-2 bg-white"
              onClick={(e) => handleDropdownToggle(setShowSortDropdown, showSortDropdown, e)}
            >
              <Filter size={18} className="mr-1" />
              <span>Sırala</span>
              <ChevronDown size={16} className="ml-1" />
            </button>
            
            {showSortDropdown && (
              <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 w-48" onClick={(e) => e.stopPropagation()}>
                <div 
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${sortBy === 'title' ? 'font-bold' : ''}`}
                  onClick={() => {
                    setSortBy('title');
                    setShowSortDropdown(false);
                  }}
                >
                  İsme göre
                </div>
                <div 
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${sortBy === 'date' ? 'font-bold' : ''}`}
                  onClick={() => {
                    setSortBy('date');
                    setShowSortDropdown(false);
                  }}
                >
                  Tarihe göre
                </div>
                <div 
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${sortBy === 'rating' ? 'font-bold' : ''}`}
                  onClick={() => {
                    setSortBy('rating');
                    setShowSortDropdown(false);
                  }}
                >
                  Puana göre
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button 
              className="flex items-center border rounded-lg px-3 py-2 bg-white"
              onClick={(e) => handleDropdownToggle(setShowGenreDropdown, showGenreDropdown, e)}
            >
              <Filter size={18} className="mr-1" />
              <span>{filterGenre || "Tür filtrele"}</span>
              <ChevronDown size={16} className="ml-1" />
            </button>
            
            {showGenreDropdown && (
              <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 w-48 max-h-60 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div 
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${!filterGenre ? 'font-bold' : ''}`}
                  onClick={() => {
                    setFilterGenre('');
                    setShowGenreDropdown(false);
                  }}
                >
                  Tümü
                </div>
                {allGenres.map(genre => (
                  <div 
                    key={genre}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${filterGenre === genre ? 'font-bold' : ''}`}
                    onClick={() => {
                      setFilterGenre(genre);
                      setShowGenreDropdown(false);
                    }}
                  >
                    {genre}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button 
            className={`border rounded-lg px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => setViewMode('grid')}
            title="Izgara görünümü"
          >
            <Grid size={18} />
          </button>
          
          <button 
            className={`border rounded-lg px-3 py-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => setViewMode('list')}
            title="Liste görünümü"
          >
            <List size={18} />
          </button>
        </div>
      </div>
      
      {filteredFavorites.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Filtreye uyan favori film bulunamadı.</p>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredFavorites.map(movie => (
            <div key={movie.id}>
              <MovieCard
                movie={movie}
                isFavorite={() => true}
                onToggleFavorite={onToggleFavorite}
                onOpenDetails={handleOpenDetails}
                isWatched={watchedMovies.includes(movie.id)}
                userRating={ratings[movie.id] || 0}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          {filteredFavorites.map(movie => (
            <div key={movie.id}>
              <MovieListItem
                movie={movie}
                isFavorite={() => true}
                onToggleFavorite={onToggleFavorite}
                onOpenDetails={handleOpenDetails}
                isWatched={watchedMovies.includes(movie.id)}
                userRating={ratings[movie.id] || 0}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Movie Details Modal */}
      <MovieDetailsModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isFavorite={(id) => true}
        onToggleFavorite={onToggleFavorite}
        isWatched={selectedMovie ? watchedMovies.includes(selectedMovie.id) : false}
        onToggleWatched={toggleWatched}
        userRating={selectedMovie ? ratings[selectedMovie.id] || 0 : 0}
        onRateMovie={rateMovie}
      />
    </div>
  );
};

export default FavoritesPage;