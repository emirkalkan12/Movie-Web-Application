import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min"; // Bootstrap JS (Modal, dropdown vb. için)
// İkonlar için Lucide React'i kullanacaksak import etmeliyiz
// import { Film } from "lucide-react";

import HomePage from "./pages/HomePage"; // Ana sayfa bileşeni
import FavoritesPage from "./pages/FavoritesPage"; // Favoriler sayfası bileşeni
import MovieDetailsModal from "./components/MovieDetailsModal"; // Modal bileşeni

function App() {
  // Favori filmler state'i - localStorage'dan başlat
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    try {
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to parse favorites from localStorage:", error);
      return [];
    }
  });

  // İzlenmiş filmler state'i - localStorage'dan başlat
  const [watchedMovies, setWatchedMovies] = useState(() => {
    const saved = localStorage.getItem("watchedMovies");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse watchedMovies from localStorage:", error);
      return [];
    }
  });

  // Film puanları state'i - localStorage'dan başlat
  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem("movieRatings");
    try {
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error("Failed to parse movieRatings from localStorage:", error);
      return {};
    }
  });

  // Detayları gösterilecek film state'i (modal için)
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Favoriler state'i değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // İzlenmiş filmler state'i değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies));
  }, [watchedMovies]);

  // Puanlar state'i değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("movieRatings", JSON.stringify(ratings));
  }, [ratings]);

  // Bir filmi favorilere ekleme veya çıkarma fonksiyonu
  const toggleFavorite = (movie) => {
    const exists = favorites.find((fav) => fav.id === movie.id);
    if (exists) {
      setFavorites(favorites.filter((fav) => fav.id !== movie.id));
      // Favoriden çıkarınca izlendi ve puan bilgisini de temizleyebiliriz (isteğe bağlı)
      // toggleWatched(movie.id, false); // İzlendi işaretini kaldır
      // rateMovie(movie.id, 0); // Puanı sıfırla
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  // Bir filmin favoride olup olmadığını kontrol etme fonksiyonu
  const isFavorite = (id) => favorites.some((fav) => fav.id === id);

  // Bir filmi izlendi olarak işaretleme/işaretini kaldırma fonksiyonu
  const toggleWatched = (movieId, setStatus = undefined) => {
    setWatchedMovies((prevWatched) => {
      const isCurrentlyWatched = prevWatched.includes(movieId);
      let updatedWatched;

      if (setStatus === true) {
        // Explicitly set as watched
        updatedWatched = isCurrentlyWatched
          ? prevWatched
          : [...prevWatched, movieId];
      } else if (setStatus === false) {
        // Explicitly set as unwatched
        updatedWatched = prevWatched.filter((id) => id !== movieId);
      } else {
        // Toggle
        updatedWatched = isCurrentlyWatched
          ? prevWatched.filter((id) => id !== movieId)
          : [...prevWatched, movieId];
      }
      return updatedWatched;
    });
  };

  // Bir filme puan verme fonksiyonu
  const rateMovie = (movieId, rating) => {
    setRatings((prevRatings) => {
      const updatedRatings = { ...prevRatings, [movieId]: rating };
      return updatedRatings;
    });
  };

  // Modal açma fonksiyonu - hangi filmin detaylarının gösterileceğini ayarlar
  const handleOpenDetails = (movie) => {
    setSelectedMovie(movie);
  };

  // Modal kapatma fonksiyonu - selectedMovie state'ini sıfırlar
  const handleCloseDetails = () => {
    setSelectedMovie(null);
  };

  return (
    <Router>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          {/* İkon kullanmak için Lucide React kurulu olmalı */}
          <Link className="navbar-brand" to="/">
            {/* <Film className="inline-block mr-2 w-6 h-6 text-blue-500" /> */}
            🎬 MovieApp
          </Link>
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
                <Link className="nav-link" to="/">
                  Ana Sayfa
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/favorites">
                  Favoriler
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Sayfa İçerikleri */}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                onOpenDetails={handleOpenDetails}
                // HomePage'de izlendi/puan göstermeyeceksek bu proplara gerek yok
                // watchedMovies={watchedMovies}
                // ratings={ratings}
                // toggleWatched={toggleWatched}
                // rateMovie={rateMovie}
              />
            }
          />

          <Route
            path="/favorites"
            element={
              <FavoritesPage
                favorites={favorites} // App.js'den favori listesini iletiyoruz
                isFavorite={isFavorite} // Favori kontrol fonksiyonunu iletiyoruz
                onToggleFavorite={toggleFavorite} // Favoriden çıkarma fonksiyonunu iletiyoruz
                onOpenDetails={handleOpenDetails} // Modal açma fonksiyonunu iletiyoruz
                watchedMovies={watchedMovies} // İzlenmiş filmler listesini iletiyoruz
                toggleWatched={toggleWatched} // İzlendi durumunu değiştirme fonksiyonunu iletiyoruz
                ratings={ratings} // Puanlar objesini iletiyoruz
                rateMovie={rateMovie} // Puan verme fonksiyonunu iletiyoruz
              />
            }
          />
        </Routes>
      </main>

      {/* Film Detayları Modalı - selectedMovie state'ine bağlı olarak görünür */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={handleCloseDetails}
          isFavorite={isFavorite} // Modal içinde favori durumunu göstermek için
          onToggleFavorite={toggleFavorite} // Modal içinden favori yönetimi için
          isWatched={watchedMovies.includes(selectedMovie.id)} // Modal için izlendi bilgisi
          toggleWatched={(status) => toggleWatched(selectedMovie.id, status)} // Modal içinden izlendi yönetimi için (true/false/undefined)
          userRating={ratings[selectedMovie.id] || 0} // Modal için kullanıcının verdiği puan
          rateMovie={(rating) => rateMovie(selectedMovie.id, rating)} // Modal içinden puan verme için
        />
      )}
    </Router>
  );
}

export default App;
// App.js dosyası, uygulamanın ana bileşenidir ve tüm sayfaları ve bileşenleri içerir.
// Ana sayfa ve favoriler sayfası için yönlendirme ve modal bileşenini içerir.
// Ayrıca, favori filmleri, izlendi filmleri ve puanları yönetmek için gerekli state'leri ve fonksiyonları içerir.
// Bu yapı, uygulamanın temel işlevselliğini sağlar ve kullanıcıların filmleri aramasına, favorilere eklemesine ve detaylarını görüntülemesine olanak tanır.
// Uygulama, React Router kullanarak sayfalar arasında geçiş yapar ve Bootstrap ile stilize edilmiştir.