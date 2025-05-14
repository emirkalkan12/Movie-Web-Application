import React from 'react';
import { X, Clock, Heart, Star, Film, TrendingUp, BarChart, PieChart, ListChecks } from 'lucide-react';

const StatsDashboard = ({ stats, onClose }) => {
  const { 
    totalMovies, 
    totalFavorites,
    totalWatchlist,
    totalWatchTime, 
    totalRated, 
    averageRating,
    mostWatchedGenre,
    genreCounts
  } = stats;

  // Format watch time
  const formatWatchTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} gün ${hours % 24} saat`;
    } else {
      return `${hours} saat ${minutes % 60} dk`;
    }
  };

  // Get top 5 genres
  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="container-fluid p-2 p-md-4">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-2 py-md-3">
          <h4 className="mb-0 d-flex align-items-center fs-5 fs-md-4">
            <TrendingUp size={18} className="me-2 d-none d-sm-block" />
            Film İstatistikleri
          </h4>
          <button 
            className="btn btn-sm btn-close btn-close-white"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        
        <div className="card-body p-2 p-md-4">
          {/* Main Stats Cards */}
          <div className="row g-2 g-md-4 mb-3">
            <div className="col-6 col-md-3">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body text-center p-2 p-md-3">
                  <Film size={24} className="text-primary mb-1 mb-md-2" />
                  <h5 className="card-title mb-0 fs-6 fs-md-5">{totalMovies}</h5>
                  <p className="card-text text-dark fw-semibold small mb-0">İzlenen Film</p>
                </div>
              </div>
            </div>
            
            <div className="col-6 col-md-3">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body text-center p-2 p-md-3">
                  <Heart size={24} className="text-danger mb-1 mb-md-2" />
                  <h5 className="card-title mb-0 fs-6 fs-md-5">{totalFavorites}</h5>
                  <p className="card-text text-dark fw-semibold small mb-0">Favori</p>
                </div>
              </div>
            </div>
            
            <div className="col-6 col-md-3">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body text-center p-2 p-md-3">
                  <ListChecks size={24} className="text-primary mb-1 mb-md-2" />
                  <h5 className="card-title mb-0 fs-6 fs-md-5">{totalWatchlist}</h5>
                  <p className="card-text text-dark fw-semibold small mb-0">İzleme Listesi</p>
                </div>
              </div>
            </div>
            
            <div className="col-6 col-md-3">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body text-center p-2 p-md-3">
                  <Star size={24} className="text-warning mb-1 mb-md-2" />
                  <h5 className="card-title mb-0 fs-6 fs-md-5">{averageRating}/10</h5>
                  <p className="card-text text-dark fw-semibold small mb-0">Ortalama Puan</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Second row of stats */}
          <div className="row g-2 g-md-4 mb-3">
            <div className="col-12 col-md-6">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body text-center p-2 p-md-3">
                  <Clock size={24} className="text-success mb-1 mb-md-2" />
                  <h5 className="card-title mb-0 fs-6 fs-md-5">{formatWatchTime(totalWatchTime)}</h5>
                  <p className="card-text text-dark fw-semibold small mb-0">Toplam İzleme Süresi</p>
                </div>
              </div>
            </div>
            
            <div className="col-12 col-md-6">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body text-center p-2 p-md-3">
                  <BarChart size={24} className="text-info mb-1 mb-md-2" />
                  <h5 className="card-title mb-0 fs-6 fs-md-5">{totalRated}</h5>
                  <p className="card-text text-dark fw-semibold small mb-0">Puanlandırdığınız Film</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Stats */}
          <div className="row g-2 g-md-4">
            {/* Genre preferences */}
            <div className="col-12 col-md-6 mb-2 mb-md-0">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-light p-2 p-md-3">
                  <h5 className="mb-0 d-flex align-items-center fs-6 fs-md-5">
                    <PieChart size={16} className="me-2" />
                    En Çok İzlediğiniz Türler
                  </h5>
                </div>
                <div className="card-body p-0">
                  {topGenres.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {topGenres.map(([genre, count], index) => (
                        <div 
                          key={genre} 
                          className="list-group-item d-flex justify-content-between align-items-center p-2 p-md-3"
                        >
                          <span className="small">{genre}</span>
                          <div className="d-flex align-items-center">
                            <div className="progress me-2" style={{ width: '60px', height: '6px' }}>
                              <div 
                                className="progress-bar" 
                                role="progressbar" 
                                style={{ 
                                  width: `${(count / topGenres[0][1]) * 100}%`,
                                  backgroundColor: index === 0 ? '#198754' : 
                                                   index === 1 ? '#0d6efd' :
                                                   index === 2 ? '#6610f2' :
                                                   index === 3 ? '#fd7e14' : '#20c997'
                                }} 
                                aria-valuenow={(count / topGenres[0][1]) * 100} 
                                aria-valuemin="0" 
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <span className="badge bg-secondary">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-dark fw-semibold text-center my-3 small">
                      Henüz yeterli film izlenmemiş.
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Activity box */}
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-light p-2 p-md-3">
                  <h5 className="mb-0 d-flex align-items-center fs-6 fs-md-5">
                    <BarChart size={16} className="me-2" />
                    İzleme İstatistikleri
                  </h5>
                </div>
                <div className="card-body p-2 p-md-3">
                  <div className="d-flex flex-column justify-content-between h-100">
                    <div>
                      <p className="mb-2 small">
                        <strong>En Sevdiğiniz Tür:</strong> {mostWatchedGenre || 'Henüz veri yok'}
                      </p>
                      <p className="mb-2 small">
                        <strong>Puanlandırdığınız Film:</strong> {totalRated} film
                      </p>
                      <p className="mb-2 small">
                        <strong>Ortalama Film Süresi:</strong> {totalMovies > 0 ? Math.round(totalWatchTime / totalMovies) : 0} dk
                      </p>
                      <p className="mb-2 small">
                        <strong>Puanlandırma Oranı:</strong> {totalMovies > 0 ? Math.round((totalRated / totalMovies) * 100) : 0}%
                      </p>
                      <p className="mb-2 small">
                        <strong>Tamamlama Oranı:</strong> {totalWatchlist + totalMovies > 0 ? Math.round((totalMovies / (totalWatchlist + totalMovies)) * 100) : 0}%
                      </p>
                    </div>
                    
                    {totalMovies === 0 ? (
                      <div className="alert alert-primary text-center mb-0 fw-semibold p-2 small">
                        <p className="mb-0">Film izlemeye başlayın!</p>
                      </div>
                    ) : totalMovies < 5 ? (
                      <div className="alert alert-primary text-center mb-0 fw-semibold p-2 small">
                        <p className="mb-0">Daha çok film izleyin!</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-footer bg-light p-2 p-md-3 text-center">
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard; 