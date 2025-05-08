import React, { useState, useEffect } from "react";
import { Star, StarOff, X, Heart, List, Grid, Search, Filter, ChevronDown, Info } from "lucide-react";

const Favorites = ({ favorites, toggleFavorite, isFavorite }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("title");
  const [filterGenre, setFilterGenre] = useState("");
  const [filteredFavorites, setFilteredFavorites] = useState([]);

  // Filtre ve sıralama fonksiyonları
  useEffect(() => {
    let result = [...favorites];
    
    // Arama filtresi
    if (searchTerm) {
      result = result.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Tür filtresi
    if (filterGenre) {
      result = result.filter(movie => 
        movie.genres && movie.genres.some(genre => genre.name === filterGenre)
      );
    }
    
    // Sıralama
    if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "date") {
      result.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.vote_average - a.vote_average);
    }
    
    setFilteredFavorites(result);
  }, [favorites, searchTerm, sortBy, filterGenre]);

  // Tüm türleri topla
  const allGenres = [...new Set(favorites.flatMap(movie => movie.genres?.map(genre => genre.name) || []))];

  // Filmi izlendi olarak işaretle
  const [watchedMovies, setWatchedMovies] = useState(() => {
    const saved = localStorage.getItem("watchedMovies");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWatched = (movieId) => {
    const updatedWatched = watchedMovies.includes(movieId)
      ? watchedMovies.filter(id => id !== movieId)
      : [...watchedMovies, movieId];
      
    setWatchedMovies(updatedWatched);
    localStorage.setItem("watchedMovies", JSON.stringify(updatedWatched));
  };

  // Yıldız puanı verme
  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem("movieRatings");
    return saved ? JSON.parse(saved) : {};
  });

  const rateMovie = (movieId, rating) => {
    const updatedRatings = { ...ratings, [movieId]: rating };
    setRatings(updatedRatings);
    localStorage.setItem("movieRatings", JSON.stringify(updatedRatings));
  };

  // Film Detay Modalı
  const MovieModal = ({ movie, onClose }) => {
    if (!movie) return null;
    
    const userRating = ratings[movie.id] || 0;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
          <div className="relative">
            <div className="relative h-64 bg-gray-900">
              {movie.backdrop_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover opacity-60"
                />
              ) : (
                <div className="w-full h-full bg-gray-800"></div>
              )}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex px-6 -mt-16">
              <div className="w-32 h-48 shadow-lg">
                <img
                  src={movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"}
                  alt={movie.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              
              <div className="ml-6 pt-16">
                <h2 className="text-3xl font-bold">{movie.title}</h2>
                <div className="flex items-center text-gray-600 mt-1">
                  <span>{movie.release_date?.substring(0, 4)}</span>
                  {movie.vote_average && (
                    <div className="ml-4 flex items-center">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="ml-1">{movie.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres?.map(genre => (
                <span key={genre.id} className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
            
            <p className="text-gray-700 mb-6">{movie.overview}</p>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Sizin Değerlendirmeniz</h3>
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star}
                    onClick={() => rateMovie(movie.id, star)}
                    className="mr-1"
                  >
                    {star <= userRating ? (
                      <Star size={24} className="text-yellow-500 fill-yellow-500" />
                    ) : (
                      <Star size={24} className="text-gray-400" />
                    )}
                  </button>
                ))}
                {userRating > 0 && (
                  <button 
                    onClick={() => rateMovie(movie.id, 0)}
                    className="ml-2 text-sm text-red-500"
                  >
                    Puanı Temizle
                  </button>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => toggleWatched(movie.id)}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    watchedMovies.includes(movie.id) 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {watchedMovies.includes(movie.id) ? "İzlendi ✓" : "İzlendi İşaretle"}
                </button>
                
                <button
                  onClick={() => toggleFavorite(movie)}
                  className="flex items-center px-4 py-2 rounded-md bg-red-100 text-red-700"
                >
                  <Heart size={18} className={`mr-1 ${isFavorite(movie.id) ? "fill-red-500" : ""}`} />
                  {isFavorite(movie.id) ? "Favoriden Kaldır" : "Favoriye Ekle"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Kart Bileşenleri
  const MovieCard = ({ movie }) => {
    const isWatched = watchedMovies.includes(movie.id);
    const userRating = ratings[movie.id] || 0;
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-transform hover:shadow-lg hover:-translate-y-1">
        <div className="relative">
          {isWatched && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md">
              İzlendi
            </div>
          )}
          <img
            src={movie.poster_path 
              ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Image"}
            className="w-full h-64 object-cover"
            alt={movie.title}
          />
        </div>
        
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg">{movie.title}</h3>
            {userRating > 0 && (
              <div className="flex items-center">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="ml-1 text-sm">{userRating}</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mt-1">
            {movie.release_date?.substring(0, 4)}
          </p>
          
          {movie.genres && (
            <div className="flex flex-wrap gap-1 mt-2">
              {movie.genres.slice(0, 2).map(genre => (
                <span key={genre.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {genre.name}
                </span>
              ))}
            </div>
          )}
          
          <div className="mt-auto pt-4 flex space-x-2">
            <button
              onClick={() => {
                setSelectedMovie(movie);
                setShowModal(true);
              }}
              className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center justify-center"
            >
              <Info size={16} className="mr-1" />
              Detaylar
            </button>
            
            <button
              onClick={() => toggleFavorite(movie)}
              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const MovieListItem = ({ movie }) => {
    const isWatched = watchedMovies.includes(movie.id);
    const userRating = ratings[movie.id] || 0;
    
    return (
      <div className="flex items-center border-b py-3 px-2 hover:bg-gray-50">
        <img
          src={movie.poster_path 
            ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
            : "https://via.placeholder.com/92x138?text=No+Image"}
          alt={movie.title}
          className="w-12 h-16 object-cover rounded mr-4"
        />
        
        <div className="flex-grow">
          <div className="flex items-center">
            <h3 className="font-medium">{movie.title}</h3>
            {isWatched && (
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                İzlendi
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-500 flex items-center">
            <span>{movie.release_date?.substring(0, 4)}</span>
            {userRating > 0 && (
              <div className="ml-3 flex items-center">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="ml-0.5">{userRating}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedMovie(movie);
              setShowModal(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Info size={18} />
          </button>
          
          <button
            onClick={() => toggleFavorite(movie)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  };

  // Ana Render
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">⭐ Favori Filmler</h1>
        <p className="text-gray-600">
          {favorites.length === 0 
            ? "Henüz favori film eklenmedi" 
            : `Toplam ${favorites.length} favori film`}
        </p>
      </div>
      
      {favorites.length > 0 && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-grow relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Film adı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
              />
            </div>
            
            <div className="flex space-x-2">
              <div className="relative">
                <button className="flex items-center px-4 py-2 border rounded-md bg-white">
                  <Filter size={16} className="mr-2 text-gray-500" />
                  <span>Tür: {filterGenre || "Tümü"}</span>
                  <ChevronDown size={16} className="ml-2 text-gray-500" />
                </button>
                
                {/* Dropdown menü yerine basitleştirilmiş bir liste */}
                <div className="absolute z-10 mt-1 w-56 bg-white shadow-lg rounded-md border overflow-hidden">
                  <button 
                    onClick={() => setFilterGenre("")}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${!filterGenre ? "bg-blue-50 text-blue-700" : ""}`}
                  >
                    Tümü
                  </button>
                  {allGenres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => setFilterGenre(genre)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${filterGenre === genre ? "bg-blue-50 text-blue-700" : ""}`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <button className="flex items-center px-4 py-2 border rounded-md bg-white">
                  <span>Sırala</span>
                  <ChevronDown size={16} className="ml-2 text-gray-500" />
                </button>
                
                {/* Dropdown menü yerine basitleştirilmiş bir liste */}
                <div className="absolute right-0 z-10 mt-1 w-48 bg-white shadow-lg rounded-md border overflow-hidden">
                  <button
                    onClick={() => setSortBy("title")}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === "title" ? "bg-blue-50 text-blue-700" : ""}`}
                  >
                    İsme Göre (A-Z)
                  </button>
                  <button
                    onClick={() => setSortBy("date")}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === "date" ? "bg-blue-50 text-blue-700" : ""}`}
                  >
                    Tarihe Göre (Yeni-Eski)
                  </button>
                  <button
                    onClick={() => setSortBy("rating")}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === "rating" ? "bg-blue-50 text-blue-700" : ""}`}
                  >
                    Puana Göre (Yüksek-Düşük)
                  </button>
                </div>
              </div>
              
              <div className="flex border rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed">
          <StarOff size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Favori listeniz boş görünüyor.</p>
          <p className="text-gray-500">Film keşfetmeye başlayın ve beğendiklerinizi buraya ekleyin!</p>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <Search size={36} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">"{searchTerm}" için sonuç bulunamadı.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFavorites.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border">
          {filteredFavorites.map(movie => (
            <MovieListItem key={movie.id} movie={movie} />
          ))}
        </div>
      )}
      
      {showModal && selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default Favorites;