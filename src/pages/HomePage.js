import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard'; // MovieCard'ı import et
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS

// İsteğe bağlı: Yükleme ve hata ikonları için
// import { Loader2, AlertTriangle } from "lucide-react"; // veya başka bir ikon kütüphanesi

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

const HomePage = ({ isFavorite, onToggleFavorite, onOpenDetails }) => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

  // API çağırma fonksiyonu - callback kullanarak optimize ediyoruz
  const fetchMovies = useCallback(async (searchQuery) => {
    // Boş sorgu gelirse veya API anahtarı yoksa işlemi durdur
    if (!searchQuery.trim() || !apiKey) {
      setMovies([]);
      setError(null);
      setLoading(false); // Yüklemeyi durdur
      return;
    }

    setLoading(true);
    setError(null); // Yeni arama başladığında önceki hatayı temizle

    try {
      // TMDB search endpoint'ine istek gönderme
      const response = await axios.get(
        `${TMDB_API_BASE_URL}/search/movie?api_key=${apiKey}&query=${searchQuery}&language=tr-TR` // Türkçe sonuçlar için language=tr-TR ekleyebilirsiniz
      );

       // İsteğe bağlı: Her film için detayları çekerek tür bilgisini ekleme (önceki örneğinizdeki gibi)
       // Bu, her film için ek API çağrıları yapar, performansı etkileyebilir.
       // Eğer sadece arama sonuçlarındaki bilgiler yeterliyse bu kısmı atlayın.
       const enrichedMovies = await Promise.all(
          response.data.results.map(async (movie) => {
            try {
              const detailRes = await axios.get(
                 `${TMDB_API_BASE_URL}/movie/${movie.id}?api_key=${apiKey}&language=tr-TR`
              );
              // Sadece tür bilgisini değil, detay endpoint'inden gelen her şeyi ekleyebiliriz
              return { ...movie, ...detailRes.data };
            } catch {
              // Detay getirme başarısız olursa sadece arama sonucundaki bilgileri kullan
              return movie;
            }
          })
       );

       // setMovies(response.data.results); // Enriching yapmıyorsanız bu satırı kullanın
       setMovies(enrichedMovies); // Enriching yapıyorsanız bu satırı kullanın

      if (response.data.results.length === 0 && searchQuery.trim() !== "") {
          // Arama yapıldı ama sonuç yok
          setError("Aradığınız kritere uygun film bulunamadı.");
      }

    } catch (err) {
      console.error("API Error:", err);
      setError("Filmler getirilirken bir hata oluştu.");
    } finally {
      setLoading(false); // Yüklemeyi bitir
    }
  }, [apiKey]); // apiKey fetchMovies bağımlılığıdır

  // Debouncing useEffect'i
  useEffect(() => {
    // Kullanıcı yazmayı durdurduktan 500ms sonra fetchMovies'i çağır
    const delayDebounceFn = setTimeout(() => {
      fetchMovies(query);
    }, 500); // 500ms gecikme

    // Cleanup fonksiyonu: Kullanıcı tekrar yazarsa önceki zamanlayıcıyı temizle
    return () => clearTimeout(delayDebounceFn);

  }, [query, fetchMovies]); // query veya fetchMovies değiştiğinde yeniden çalışır

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

      {/* Yükleme durumu göstergesi */}
      {loading && (
        <div className="text-center py-4">
          {/* Bootstrap spinner */}
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
           {/* İsteğe bağlı: Lucide React ikonu */}
           {/* <Loader2 className="animate-spin w-8 h-8 text-primary" /> */}
        </div>
      )}

      {/* Hata mesajı */}
      {error && (
         <div className="alert alert-danger text-center" role="alert">
            {/* İsteğe bağlı: Lucide React ikonu */}
            {/* <AlertTriangle className="inline-block mr-2 w-5 h-5" /> */}
            {error}
         </div>
      )}

      {/* Film listesi */}
      <div className="row">
        {/* movies state'i boşsa ve yükleme/hata yoksa, arama yapılması gerektiğini belirten bir mesaj göster */}
         {!loading && !error && movies.length === 0 && query.trim() === "" && (
             <div className="col-12 text-center text-muted">
                 Yukarıdaki alana bir film adı yazarak arama yapın.
             </div>
         )}

        {/* Filmleri listeleme */}
        {movies.map((movie) => (
          <div key={movie.id} className="col-md-3 mb-4"> {/* Grid sütunu burada */}
            <MovieCard
              movie={movie}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
              onOpenDetails={onOpenDetails} // Modal açma fonksiyonunu iletiyoruz
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;