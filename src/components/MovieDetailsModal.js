import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS - Modal çalışması için gerekli

const MovieDetailsModal = ({ movie, onClose, onToggleFavorite, isFavorite }) => {

  // movie prop'u değiştiğinde modalı yönetmek için useEffect
  useEffect(() => {
    const modalElement = document.getElementById('movieDetailModal');
    if (!modalElement) return; // Modal elementi yoksa çık

    const modal = new window.bootstrap.Modal(modalElement);

    if (movie) {
      modal.show(); // movie prop'u varsa modalı göster
    } else {
      // movie prop'u null olduğunda (yani kapatılınca) modalı gizle
      // Ancak Bootstrap modal zaten DOM'dan kaldırılmıyor, sadece gizleniyor
      // onClose handle edildiği için burada hide çağırmak genellikle gereksizdir
      // modal.hide(); // onClose fonksiyonu bu state'i zaten güncelleyecek
    }

    // Modal tamamen kapatıldığında state'i sıfırlamak için event listener
    // Bu, modalın tekrar açılmasını beklerken DOM'da kalmasını önler
    modalElement.addEventListener('hidden.bs.modal', onClose);

    // Cleanup fonksiyonu: Bileşen kapanırken veya movie değiştiğinde listener'ı kaldır
    return () => {
       modalElement.removeEventListener('hidden.bs.modal', onClose);
       modal.dispose(); // Cleanup sırasında modal instance'ını dispose et
    };
  }, [movie, onClose]); // movie veya onClose değiştiğinde bu effect yeniden çalışır

  // movie prop'u null ise (modal kapalıysa) null döndür, DOM'a bir şey render etme
  if (!movie) {
    return null;
  }

  // Poster için doğru URL yolunu oluşturma
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` // Detay için daha büyük poster
    : 'https://via.placeholder.com/500x750?text=No+Image';

  // Eğer TMDB'den detaylar çekildiğinde tür bilgisi de varsa gösterilir (opsiyonel, search sonuçlarında olmayabilir)
  const genres = movie.genres ? movie.genres.map(genre => genre.name).join(', ') : 'N/A';


  return (
    // Bootstrap Modal Yapısı
    <div className="modal fade" id="movieDetailModal" tabIndex="-1" aria-labelledby="movieDetailModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header border-secondary">
            <h5 className="modal-title" id="movieDetailModalLabel">{movie.title}</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-4 text-center">
                 <img src={posterUrl} alt={movie.title} className="img-fluid rounded mb-3" />
                 {/* Favori butonu modal içinde */}
                 <button
                   className={`btn btn-lg w-100 mb-3 ${
                     isFavorite(movie.id)
                       ? "btn-danger"
                       : "btn-outline-primary"
                   }`}
                   onClick={() => onToggleFavorite(movie)}
                 >
                   {isFavorite(movie.id)
                     ? "Favoriden Kaldır"
                     : "Favorilere Ekle"}
                 </button>
              </div>
              <div className="col-md-8">
                <p><strong>Yayın Tarihi:</strong> {movie.release_date}</p>
                {/* Eğer tür bilgisi varsa göster */}
                {movie.genres && movie.genres.length > 0 && (
                    <p><strong>Türler:</strong> {genres}</p>
                )}
                {/* Eğer API'den tam detay çekildiğinde runtime vb varsa buraya eklenebilir */}
                <p><strong>Özet:</strong> {movie.overview || 'Özet bulunamadı.'}</p>
                {/* Diğer detaylar (oyuncular, yönetmen vb.) buraya eklenebilir,
                    ancak bunun için ayrı API çağrıları gerekebilir (movie/{id} endpoint'i) */}
              </div>
            </div>
          </div>
          <div className="modal-footer border-secondary">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;