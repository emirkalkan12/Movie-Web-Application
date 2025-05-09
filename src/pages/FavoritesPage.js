import React, { useState, useEffect, useMemo } from 'react'; // useMemo'yu da ekledik
// Lucide React ikonları - Eğer kullanılıyorsa kurulu olmalı
import { Star, StarOff, X, Heart, List, Grid, Search, Filter, ChevronDown, Info } from "lucide-react";

// Modal ve Kart bileşenlerini dışarıdan import edeceğiz (Bootstrap versiyonları)
import MovieCard from '../components/MovieCard'; // Bootstrap tabanlı MovieCard
// MovieDetailsModal'ı burada import etmiyoruz, App.js tarafından yönetiliyor
// import MovieDetailsModal from '../components/MovieDetailsModal';

// Liste görünümü için basit bir bileşen oluşturalım
const MovieListItem = ({ movie, isFavorite, onToggleFavorite, onOpenDetails, isWatched, userRating }) => {
  // Poster URL'si
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
    : "https://via.placeholder.com/92x138?text=No+Image";

  return (
    <div className="d-flex align-items-center border-bottom py-3"> {/* Bootstrap sınıfları */}
      {/* Poster */}
      <img
        src={posterUrl}
        alt={movie.title}
        className="me-3" // Bootstrap margin right
        style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '4px' }} // Boyut ve stil
      />

      {/* Bilgiler */}
      <div className="flex-grow-1">
        <div className="d-flex align-items-center mb-1"> {/* Bootstrap sınıfları */}
          <h5 className="mb-0 me-2">{movie.title}</h5> {/* Bootstrap sınıfları */}
          {isWatched && (
            <span className="badge bg-success me-2">İzlendi</span> {/* Bootstrap badge */}
          )}
           {userRating > 0 && (
             <div className="d-flex align-items-center text-warning me-2"> {/* Bootstrap text-warning */}
               <Star size={16} fill="currentColor" stroke="none"/> {/* Lucide Star ikonu */}
               <span className="ms-1">{userRating}</span> {/* Bootstrap margin start */}
             </div>
           )}
        </div>
        <p className="text-muted mb-0">{movie.release_date?.substring(0, 4)}</p> {/* Bootstrap text-muted */}
         {/* Türleri göstermek isterseniz buraya ekleyebilirsiniz */}
         {/* {movie.genres && (
            <div className="d-flex flex-wrap gap-1 mt-1">
              {movie.genres.map(genre => (
                <span key={genre.id} className="badge bg-secondary text-white">{genre.name}</span>
              ))}
            </div>
         )} */}
      </div>

      {/* Aksiyon Butonları */}
      <div className="d-flex gap-2"> {/* Bootstrap gap */}
        {/* Detay butonu */}
        <button
           className="btn btn-outline-primary btn-sm" // Bootstrap buton sınıfları
           onClick={() => onOpenDetails(movie)}
           title="Detaylar"
        >
          <Info size={18} /> {/* Lucide Info ikonu */}
           <span className="d-none d-sm-inline ms-1">Detaylar</span> {/* Küçük ekranlarda gizle */}
        </button>
        {/* Favoriden Kaldır butonu */}
        <button
          className="btn btn-outline-danger btn-sm" // Bootstrap buton sınıfları
          onClick={() => onToggleFavorite(movie)}
          title="Favoriden Kaldır"
        >
          <X size={18} /> {/* Lucide X ikonu */}
        </button>
      </div>
    </div>
  );
};


// Ana Favoriler Sayfası Bileşeni
const FavoritesPage = ({ favorites, isFavorite, onToggleFavorite, onOpenDetails, watchedMovies, toggleWatched, ratings, rateMovie }) => {

  // Yerel state'ler (arama, filtre, sıralama, görünüm modu)
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' veya 'list'
  const [sortBy, setSortBy] = useState("title"); // 'title', 'date', 'rating'
  const [filterGenre, setFilterGenre] = useState(""); // Filtrelenecek tür
  const [filteredFavorites, setFilteredFavorites] = useState([]); // Filtrelenmiş ve sıralanmış liste

   // Dropdown menü görünürlüğü için yerel state'ler (Bootstrap JS kullanmıyorsak)
   const [showGenreDropdown, setShowGenreDropdown] = useState(false);
   const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Filtre ve sıralama mantığı
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
      result.sort((a, b) => a.title.localeCompare(b.title)); // İsme göre (A-Z)
    } else if (sortBy === "date") {
      // release_date string formatında olabilir, Date objesine çevirerek sırala
      result.sort((a, b) => new Date(b.release_date) - new Date(a.release_date)); // Tarihe göre (Yeni-Eski)
    } else if (sortBy === "rating") {
       // Önce kullanıcının verdiği puana göre, sonra TMDB puanına göre sırala
       result.sort((a, b) => {
           const ratingA = ratings[a.id] || a.vote_average || 0;
           const ratingB = ratings[b.id] || b.vote_average || 0;
           return ratingB - ratingA; // Puana göre (Yüksek-Düşük)
       });
    }

    setFilteredFavorites(result);

  }, [favorites, searchTerm, sortBy, filterGenre, ratings]); // bağımlılıklara ratings'i de ekledik

  // Tüm türleri topla ve duplicate'leri kaldır (performans için useMemo kullanabiliriz)
  const allGenres = useMemo(() => {
    const genres = favorites.flatMap(movie => movie.genres?.map(genre => genre.name) || []);
    return [...new Set(genres)].sort(); // Türleri alfabetik sırala
  }, [favorites]); // favorites listesi değiştiğinde yeniden hesapla


  // Ana Render
  return (
    <div className="container py-5"> {/* Bootstrap container ve padding */}
      <div className="mb-4 text-center">
        <h1 className="mb-2">❤️ Favori Filmlerim</h1> {/* Bootstrap başlık */}
        <p className="text-muted"> {/* Bootstrap text-muted */}
          {favorites.length === 0
            ? "Henüz favori film eklenmedi"
            : `Toplam ${favorites.length} favori film`}
        </p>
      </div>

      {favorites.length > 0 && (
        <div className="card mb-4 p-4"> {/* Bootstrap card */}
          <div className="d-flex flex-column flex-md-row align-items-center gap-3"> {/* Bootstrap flex ve gap */}

            {/* Arama Inputu */}
            <div className="flex-grow-1 w-100 position-relative"> {/* Bootstrap flex-grow ve position */}
              <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" /> {/* Bootstrap pozisyon ve margin */}
              <input
                type="text"
                className="form-control ps-5" // Bootstrap form control ve padding start
                placeholder="Film adı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtre ve Sıralama Kontrolleri */}
            <div className="d-flex gap-3"> {/* Bootstrap gap */}

              {/* Tür Filtresi (Basit Dropdown Simülasyonu) */}
              <div className="dropdown"> {/* Bootstrap dropdown container */}
                <button
                   className="btn btn-outline-secondary dropdown-toggle" // Bootstrap buton ve dropdown sınıfları
                   type="button"
                   onClick={() => setShowGenreDropdown(!showGenreDropdown)} // Dropdown'ı aç/kapa
                   aria-expanded={showGenreDropdown}
                >
                   <Filter size={16} className="me-2" /> {/* Lucide Filter ikonu */}
                   Tür: {filterGenre || "Tümü"}
                </button>
                {/* Dropdown Menü İçeriği */}
                <ul className={`dropdown-menu ${showGenreDropdown ? 'show' : ''}`} style={{ position: 'absolute', zIndex: 1000 }}> {/* Bootstrap dropdown menu */}
                   <li>
                       <button
                           className={`dropdown-item ${!filterGenre ? 'active' : ''}`} // Bootstrap dropdown item
                           onClick={() => { setFilterGenre(""); setShowGenreDropdown(false); }}
                       >
                           Tümü
                       </button>
                   </li>
                   <li><hr className="dropdown-divider"/></li> {/* Ayırıcı */}
                   {allGenres.map(genre => (
                       <li key={genre}>
                           <button
                               className={`dropdown-item ${filterGenre === genre ? 'active' : ''}`} // Bootstrap dropdown item
                               onClick={() => { setFilterGenre(genre); setShowGenreDropdown(false); }}
                           >
                               {genre}
                           </button>
                       </li>
                   ))}
                </ul>
              </div>

              {/* Sıralama (Basit Dropdown Simülasyonu) */}
               <div className="dropdown"> {/* Bootstrap dropdown container */}
                <button
                   className="btn btn-outline-secondary dropdown-toggle" // Bootstrap buton ve dropdown sınıfları
                   type="button"
                   onClick={() => setShowSortDropdown(!showSortDropdown)} // Dropdown'ı aç/kapa
                   aria-expanded={showSortDropdown}
                >
                   Sırala: {sortBy === 'title' ? 'İsim' : sortBy === 'date' ? 'Tarih' : 'Puan'}
                </button>
                {/* Dropdown Menü İçeriği */}
                <ul className={`dropdown-menu dropdown-menu-end ${showSortDropdown ? 'show' : ''}`} style={{ position: 'absolute', zIndex: 1000 }}> {/* Bootstrap dropdown menu */}
                   <li>
                       <button
                           className={`dropdown-item ${sortBy === 'title' ? 'active' : ''}`}
                           onClick={() => { setSortBy("title"); setShowSortDropdown(false); }}
                       >
                           İsme Göre (A-Z)
                       </button>
                   </li>
                   <li>
                       <button
                           className={`dropdown-item ${sortBy === 'date' ? 'active' : ''}`}
                           onClick={() => { setSortBy("date"); setShowSortDropdown(false); }}
                       >
                           Tarihe Göre (Yeni-Eski)
                       </button>
                   </li>
                    <li>
                       <button
                           className={`dropdown-item ${sortBy === 'rating' ? 'active' : ''}`}
                           onClick={() => { setSortBy("rating"); setShowSortDropdown(false); }}
                       >
                           Puana Göre (Yüksek-Düşük)
                       </button>
                   </li>
                </ul>
              </div>

              {/* Görünüm Modu Toggle */}
              <div className="btn-group"> {/* Bootstrap buton grubu */}
                 <button
                    className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-outline-secondary"}`} // Bootstrap buton sınıfları
                    onClick={() => setViewMode("grid")}
                    title="Izgara Görünümü"
                 >
                   <Grid size={20} /> {/* Lucide Grid ikonu */}
                 </button>
                 <button
                    className={`btn ${viewMode === "list" ? "btn-primary" : "btn-outline-secondary"}`} // Bootstrap buton sınıfları
                    onClick={() => setViewMode("list")}
                    title="Liste Görünümü"
                 >
                   <List size={20} /> {/* Lucide List ikonu */}
                 </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Film Listesi veya Durum Mesajları */}
      {favorites.length === 0 ? (
         // Favori listesi tamamen boşsa
        <div className="text-center py-5 border rounded-lg bg-light"> {/* Bootstrap border, padding, rounded, background */}
          <StarOff size={48} className="mx-auto text-muted mb-3" /> {/* Lucide StarOff ikonu, Bootstrap text-muted */}
          <p className="text-muted mb-3">Favori listeniz boş görünüyor.</p>
          <p className="text-muted">Film keşfetmeye başlayın ve beğendiklerinizi buraya ekleyin!</p>
        </div>
      ) : filteredFavorites.length === 0 && searchTerm.length > 0 ? (
        // Arama yapıldı ama sonuç bulunamadıysa
        <div className="text-center py-5 border rounded-lg bg-light"> {/* Bootstrap border, padding, rounded, background */}
          <Search size={36} className="mx-auto text-muted mb-3" /> {/* Lucide Search ikonu, Bootstrap text-muted */}
          <p className="text-muted">"{searchTerm}" için favori filmlerinizde sonuç bulunamadı.</p>
        </div>
      ) : filteredFavorites.length === 0 && (filterGenre || sortBy !== 'title') ? (
         // Filtre/Sıralama uygulandı ama sonuç bulunamadıysa (arama kutusu boşken)
         <div className="text-center py-5 border rounded-lg bg-light"> {/* Bootstrap border, padding, rounded, background */}
            <Filter size={36} className="mx-auto text-muted mb-3" /> {/* Lucide Filter ikonu, Bootstrap text-muted */}
            <p className="text-muted">Uyguladığınız filtre ve sıralama kriterlerine uygun favori film bulunamadı.</p>
         </div>
      ) : viewMode === "grid" ? (
        // Izgara Görünümü
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4"> {/* Bootstrap grid ve gap */}
          {filteredFavorites.map(movie => (
            <div key={movie.id} className="col"> {/* Bootstrap grid sütunu */}
              <MovieCard
                movie={movie}
                 // Favoriler sayfasında oldukları için hepsi favori sayılır
                isFavorite={() => true}
                 // Favoriden çıkarma (X butonu)
                onToggleFavorite={onToggleFavorite}
                 // Detay modalını açma
                onOpenDetails={onOpenDetails}
                 // İzlendi/Puan bilgisini karta iletiyoruz
                isWatched={watchedMovies.includes(movie.id)}
                userRating={ratings[movie.id] || 0}
              />
            </div>
          ))}
        </div>
      ) : (
        // Liste Görünümü
        <div className="list-group"> {/* Bootstrap list group */}
          {filteredFavorites.map(movie => (
             // Link yerine div kullanıyoruz, tıklama MovieListItem içinde
             <div key={movie.id} className="list-group-item list-group-item-action bg-white"> {/* Bootstrap list group item */}
               <MovieListItem
                 movie={movie}
                 isFavorite={() => true}
                 onToggleFavorite={onToggleFavorite}
                 onOpenDetails={onOpenDetails}
                 isWatched={watchedMovies.includes(movie.id)}
                 userRating={ratings[movie.id] || 0}
               />
             </div>
          ))}
        </div>
      )}

      {/* Modal App.js tarafından yönetildiği için burada render etmiyoruz */}
       {/* {showModal && selectedMovie && (
          <MovieDetailsModal
              movie={selectedMovie}
              onClose={() => setShowModal(false)}
               // İzlendi ve Puanlama propsları App.js'den gelecek
               // isWatched={watchedMovies.includes(selectedMovie.id)}
               // toggleWatched={toggleWatched}
               // userRating={ratings[selectedMovie.id] || 0}
               // rateMovie={rateMovie}
               // isFavorite ve onToggleFavorite de App.js'den gelecek
               // isFavorite={isFavorite}
               // onToggleFavorite={onToggleFavorite}
          />
       )} */}

    </div>
  );
};

export default FavoritesPage;