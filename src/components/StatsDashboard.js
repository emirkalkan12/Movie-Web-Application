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
      return `${hours} saat ${minutes % 60} dakika`;
    }
  };

  // Get top 5 genres
  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="container my-4">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0 d-flex align-items-center">
            <TrendingUp size={20} className="me-2" />
            Film İzleme İstatistikleriniz
          </h4>
          <button 
            className="btn btn-sm btn-close btn-close-white"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        
        <div className="card-body">
          {/* Main Stats Cards */}
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body text-center">
                  <Film size={32} className="text-primary mb-2" />
                  <h5 className="card-title">{totalMovies}</h5>
                  <p className="card-text text-dark fw-semibold">İzlenen Film</p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body text-center">
                  <Heart size={32} className="text-danger mb-2" />
                  <h5 className="card-title">{totalFavorites}</h5>
                  <p className="card-text text-dark fw-semibold">Favori Film</p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body text-center">
                  <ListChecks size={32} className="text-primary mb-2" />
                  <h5 className="card-title">{totalWatchlist}</h5>
                  <p className="card-text text-dark fw-semibold">İzleme Listesindeki</p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body text-center">
                  <Star size={32} className="text-warning mb-2" />
                  <h5 className="card-title">{averageRating}/10</h5>
                  <p className="card-text text-dark fw-semibold">Ortalama Puanınız</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Second row of stats */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body text-center">
                  <Clock size={32} className="text-success mb-2" />
                  <h5 className="card-title">{formatWatchTime(totalWatchTime)}</h5>
                  <p className="card-text text-dark fw-semibold">Toplam İzleme Süresi</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body text-center">
                  <BarChart size={32} className="text-info mb-2" />
                  <h5 className="card-title">{totalRated}</h5>
                  <p className="card-text text-dark fw-semibold">Puanlandırdığınız Film</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Stats */}
          <div className="row">
            {/* Genre preferences */}
            <div className="col-md-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-light">
                  <h5 className="mb-0 d-flex align-items-center">
                    <PieChart size={18} className="me-2" />
                    En Çok İzlediğiniz Türler
                  </h5>
                </div>
                <div className="card-body">
                  {topGenres.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {topGenres.map(([genre, count], index) => (
                        <div 
                          key={genre} 
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <span>{genre}</span>
                          <div className="d-flex align-items-center">
                            <div className="progress me-2" style={{ width: '100px', height: '8px' }}>
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
                    <p className="text-dark fw-semibold text-center my-4">
                      Henüz yeterli film izlenmemiş.
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Activity box */}
            <div className="col-md-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-light">
                  <h5 className="mb-0 d-flex align-items-center">
                    <BarChart size={18} className="me-2" />
                    İzleme İstatistikleri
                  </h5>
                </div>
                <div className="card-body">
                  <div className="d-flex flex-column justify-content-between h-100">
                    <div>
                      <p className="mb-3">
                        <strong>En Sevdiğiniz Tür:</strong> {mostWatchedGenre || 'Henüz veri yok'}
                      </p>
                      <p className="mb-3">
                        <strong>Puanlandırdığınız Film Sayısı:</strong> {totalRated} film
                      </p>
                      <p className="mb-3">
                        <strong>Ortalama Film Süresi:</strong> {totalMovies > 0 ? Math.round(totalWatchTime / totalMovies) : 0} dakika
                      </p>
                      <p className="mb-3">
                        <strong>Puanlandırma Oranı:</strong> {totalMovies > 0 ? Math.round((totalRated / totalMovies) * 100) : 0}%
                      </p>
                      <p className="mb-3">
                        <strong>İzleme Listesinden Tamamlama Oranı:</strong> {totalWatchlist + totalMovies > 0 ? Math.round((totalMovies / (totalWatchlist + totalMovies)) * 100) : 0}%
                      </p>
                    </div>
                    
                    {totalMovies === 0 ? (
                      <div className="alert alert-primary text-center mb-0 fw-semibold">
                        <p className="mb-0">Film izleme istatistiklerinizi görmek için film izlemeye başlayın!</p>
                      </div>
                    ) : totalMovies < 5 ? (
                      <div className="alert alert-primary text-center mb-0 fw-semibold">
                        <p className="mb-0">Daha detaylı istatistikler için daha fazla film izleyin.</p>
                      </div>
                    ) : (
                      <div className="alert alert-success text-center mb-0 fw-semibold">
                        <p className="mb-0">Tebrikler! {totalMovies} film izleyerek film tutkunları arasına girdiniz!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard; 