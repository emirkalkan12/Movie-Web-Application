import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  X, Star, Calendar, Clock, Tag, Heart, CheckCircle, 
  User, Users, Globe, BarChart2, Video, TrendingUp, Image, Info, 
  Eye, EyeOff, Award
} from 'lucide-react';

const MovieDetailsModal = ({ 
  movie, 
  onClose, 
  isFavorite, 
  onToggleFavorite, 
  isWatched, 
  toggleWatched, 
  userRating, 
  rateMovie 
}) => {
  const [rating, setRating] = useState(userRating || 0);
  const [activeTab, setActiveTab] = useState('overview');
  const [credits, setCredits] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  
  useEffect(() => {
    if (!movie) return;
    
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        // Fetch cast and crew
        const creditsRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}&language=tr-TR`
        );
        setCredits(creditsRes.data);
        
        // Fetch similar movies
        const similarRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=${apiKey}&language=tr-TR`
        );
        setSimilar(similarRes.data.results.slice(0, 6));
        
        // Fetch videos (trailers)
        const videosRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=tr-TR`
        );
        setVideos(videosRes.data.results.filter(video => 
          video.site === "YouTube" && 
          (video.type === "Trailer" || video.type === "Teaser")
        ).slice(0, 3));
      } catch (err) {
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [movie, apiKey]);
  
  if (!movie) return null;
  
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";
  
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  
  const handleRating = (newRating) => {
    setRating(newRating);
    rateMovie(newRating);
  };
  
  const formatRuntime = (minutes) => {
    if (!minutes) return 'Süre belirtilmemiş';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs} sa` : ''} ${mins > 0 ? `${mins} dk` : ''}`;
  };

  const formatMoney = (amount) => {
    if (!amount) return 'Belirtilmemiş';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}} onClick={onClose}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg overflow-hidden">
          {/* Backdrop header */}
          <div className="position-relative">
            {backdropUrl ? (
              <div className="ratio ratio-21x9" style={{maxHeight: '350px', overflow: 'hidden'}}>
                <img 
                  src={backdropUrl} 
                  alt={`${movie.title} backdrop`} 
                  className="w-100 h-100 object-fit-cover"
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-to-b from-transparent to-dark opacity-75"></div>
              </div>
            ) : (
              <div className="bg-dark py-3"></div>
            )}
            
            {/* Floating movie info on backdrop */}
            <div className="position-absolute bottom-0 start-0 p-4 text-white">
              <h2 className="fw-bold mb-1">{movie.title}</h2>
              {movie.tagline && (
                <p className="fst-italic mb-0 text-light">{movie.tagline}</p>
              )}
            </div>
            
            {/* Close button */}
            <button 
              onClick={onClose}
              className="position-absolute top-0 end-0 m-3 btn btn-dark btn-sm rounded-circle opacity-75"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Modal body */}
          <div className="modal-body p-0">
            <div className="row g-0">
              {/* Sidebar with poster and actions */}
              <div className="col-md-3 bg-light p-3 text-center">
                <div className="sticky-top" style={{top: '15px'}}>
                  <img 
                    src={posterUrl} 
                    alt={movie.title} 
                    className="img-fluid rounded-3 shadow-sm mb-3"
                    style={{maxHeight: '350px'}}
                  />
                  
                  <div className="d-grid gap-2 mb-4">
                    <button 
                      onClick={() => onToggleFavorite(movie)}
                      className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'} d-flex align-items-center justify-content-center gap-2`}
                    >
                      <Heart size={18} fill={isFavorite ? "currentColor" : "none"} /> 
                      {isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                    </button>
                    
                    <button 
                      onClick={() => toggleWatched()}
                      className={`btn ${isWatched ? 'btn-success' : 'btn-outline-success'} d-flex align-items-center justify-content-center gap-2`}
                    >
                      {isWatched ? (
                        <>
                          <Eye size={18} /> İzlendi
                        </>
                      ) : (
                        <>
                          <EyeOff size={18} /> İzlemedim
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Basic Info */}
                  <div className="list-group list-group-flush rounded-3 mb-4">
                    {movie.release_date && (
                      <div className="list-group-item d-flex justify-content-between align-items-center bg-light border-top">
                        <span className="text-muted d-flex align-items-center">
                          <Calendar size={14} className="me-2" /> Yayın Tarihi
                        </span>
                        <span>{new Date(movie.release_date).toLocaleDateString('tr-TR')}</span>
                      </div>
                    )}
                    
                    {movie.runtime > 0 && (
                      <div className="list-group-item d-flex justify-content-between align-items-center bg-light">
                        <span className="text-muted d-flex align-items-center">
                          <Clock size={14} className="me-2" /> Süre
                        </span>
                        <span>{formatRuntime(movie.runtime)}</span>
                      </div>
                    )}
                    
                    {movie.vote_average > 0 && (
                      <div className="list-group-item d-flex justify-content-between align-items-center bg-light">
                        <span className="text-muted d-flex align-items-center">
                          <BarChart2 size={14} className="me-2" /> TMDB Puanı
                        </span>
                        <span className="d-flex align-items-center">
                          <Star size={14} className="text-warning me-1" fill="currentColor" />
                          {movie.vote_average.toFixed(1)}/10
                        </span>
                      </div>
                    )}
                    
                    {movie.status && (
                      <div className="list-group-item d-flex justify-content-between align-items-center bg-light">
                        <span className="text-muted d-flex align-items-center">
                          <Info size={14} className="me-2" /> Durum
                        </span>
                        <span>{movie.status}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Rating */}
                  <div className="card shadow-sm mb-3">
                    <div className="card-header bg-warning-subtle py-2">
                      <h6 className="card-title mb-0 fw-bold text-center">Film Puanınız</h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-center mb-2">
                        <div className="star-rating">
                          {[...Array(10)].map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              className={`btn btn-sm p-0 ${i < rating ? 'text-warning' : 'text-muted'}`}
                              onClick={() => handleRating(i + 1)}
                            >
                              <Star
                                size={24}
                                fill={i < rating ? 'currentColor' : 'none'}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="text-center">
                        {rating > 0 ? (
                          <div className="d-flex align-items-center justify-content-center">
                            <span className="fw-bold fs-4">{rating}</span>
                            <span className="text-muted ms-1">/10</span>
                            <button
                              onClick={() => handleRating(0)}
                              className="btn btn-sm text-muted ms-2"
                              title="Puanı kaldır"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted small">Henüz puanlanmamış</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main content */}
              <div className="col-md-9 p-4">
                {/* Tabs */}
                <ul className="nav nav-tabs mb-4">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                    >
                      <Info size={16} className="me-1" /> Genel Bakış
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'cast' ? 'active' : ''}`}
                      onClick={() => setActiveTab('cast')}
                      disabled={!credits}
                    >
                      <Users size={16} className="me-1" /> Oyuncular
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'videos' ? 'active' : ''}`}
                      onClick={() => setActiveTab('videos')}
                      disabled={videos.length === 0}
                    >
                      <Video size={16} className="me-1" /> Videolar
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'similar' ? 'active' : ''}`}
                      onClick={() => setActiveTab('similar')}
                      disabled={similar.length === 0}
                    >
                      <TrendingUp size={16} className="me-1" /> Benzer Filmler
                    </button>
                  </li>
                </ul>
                
                {/* Tab content */}
                <div className="tab-content">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="tab-pane fade show active">
                      {/* Genres */}
                      {movie.genres && movie.genres.length > 0 && (
                        <div className="mb-3">
                          <div className="d-flex flex-wrap gap-2">
                            {movie.genres.map(genre => (
                              <span key={genre.id} className="badge bg-secondary">
                                {genre.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Overview */}
                      {movie.overview && (
                        <div className="mb-4">
                          <h5 className="border-bottom pb-2 mb-3">Film Özeti</h5>
                          <p className="mb-4">{movie.overview}</p>
                        </div>
                      )}
                      
                      {/* Production Info */}
                      <div className="row mb-4">
                        {/* Production Companies */}
                        {movie.production_companies?.length > 0 && (
                          <div className="col-md-6 mb-4">
                            <h5 className="border-bottom pb-2 mb-3">Yapım Şirketleri</h5>
                            <div className="d-flex flex-wrap gap-3 align-items-center">
                              {movie.production_companies.map(company => (
                                <div key={company.id} className="text-center">
                                  {company.logo_path ? (
                                    <img
                                      src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                      alt={company.name}
                                      className="img-fluid mb-2"
                                      style={{ maxHeight: '40px', maxWidth: '80px' }}
                                    />
                                  ) : (
                                    <div className="bg-light text-center p-2 rounded mb-2">
                                      <Image size={24} className="text-muted" />
                                    </div>
                                  )}
                                  <small className="d-block text-muted">{company.name}</small>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Production Countries */}
                        {movie.production_countries?.length > 0 && (
                          <div className="col-md-6 mb-4">
                            <h5 className="border-bottom pb-2 mb-3">Yapım Ülkeleri</h5>
                            <div className="d-flex flex-wrap gap-2 mb-3">
                              {movie.production_countries.map(country => (
                                <span key={country.iso_3166_1} className="badge bg-light text-dark d-flex align-items-center gap-1">
                                  <Globe size={14} />
                                  {country.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Financial Info */}
                      <div className="row mb-4">
                        {/* Budget & Revenue */}
                        <div className="col-md-6">
                          <div className="card h-100">
                            <div className="card-body">
                              <h5 className="card-title">
                                <Award size={18} className="me-2" />
                                Finansal Bilgiler
                              </h5>
                              
                              <div className="list-group list-group-flush">
                                {movie.budget > 0 && (
                                  <div className="list-group-item px-0">
                                    <div className="d-flex justify-content-between">
                                      <span>Bütçe</span>
                                      <span>{formatMoney(movie.budget)}</span>
                                    </div>
                                  </div>
                                )}
                                
                                {movie.revenue > 0 && (
                                  <div className="list-group-item px-0">
                                    <div className="d-flex justify-content-between">
                                      <span>Gelir</span>
                                      <span>{formatMoney(movie.revenue)}</span>
                                    </div>
                                  </div>
                                )}
                                
                                {movie.budget > 0 && movie.revenue > 0 && (
                                  <div className="list-group-item px-0">
                                    <div className="d-flex justify-content-between">
                                      <span>Kar/Zarar</span>
                                      <span className={movie.revenue > movie.budget ? 'text-success' : 'text-danger'}>
                                        {formatMoney(movie.revenue - movie.budget)}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Original Language & Other Info */}
                        <div className="col-md-6">
                          <div className="card h-100">
                            <div className="card-body">
                              <h5 className="card-title">
                                <Info size={18} className="me-2" />
                                Ek Bilgiler
                              </h5>
                              
                              <div className="list-group list-group-flush">
                                {movie.original_language && (
                                  <div className="list-group-item px-0">
                                    <div className="d-flex justify-content-between">
                                      <span>Orijinal Dil</span>
                                      <span>
                                        {movie.original_language === 'en' ? 'İngilizce' :
                                         movie.original_language === 'tr' ? 'Türkçe' :
                                         movie.original_language === 'ja' ? 'Japonca' :
                                         movie.original_language === 'fr' ? 'Fransızca' :
                                         movie.original_language === 'de' ? 'Almanca' :
                                         movie.original_language === 'es' ? 'İspanyolca' :
                                         movie.original_language === 'ko' ? 'Korece' :
                                         movie.original_language === 'it' ? 'İtalyanca' :
                                         movie.original_language === 'ru' ? 'Rusça' :
                                         movie.original_language}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                
                                {movie.popularity && (
                                  <div className="list-group-item px-0">
                                    <div className="d-flex justify-content-between">
                                      <span>Popülerlik</span>
                                      <span>{movie.popularity.toFixed(1)}</span>
                                    </div>
                                  </div>
                                )}
                                
                                {movie.adult !== undefined && (
                                  <div className="list-group-item px-0">
                                    <div className="d-flex justify-content-between">
                                      <span>Yetişkin İçeriği</span>
                                      <span>{movie.adult ? 'Evet' : 'Hayır'}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Cast Tab */}
                  {activeTab === 'cast' && (
                    <div className="tab-pane fade show active">
                      {loading ? (
                        <div className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Yükleniyor...</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Cast */}
                          {credits?.cast?.length > 0 && (
                            <div className="mb-4">
                              <h5 className="border-bottom pb-2 mb-3">Oyuncular</h5>
                              <div className="row">
                                {credits.cast.slice(0, 12).map(person => (
                                  <div key={person.id} className="col-md-2 col-sm-4 col-6 mb-3">
                                    <div className="card h-100 border-0 shadow-sm">
                                      <div className="position-relative" style={{ paddingBottom: '150%' }}>
                                        <img 
                                          src={person.profile_path 
                                            ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                                            : `https://via.placeholder.com/185x278/eee?text=${person.name}`}
                                          alt={person.name}
                                          className="card-img-top position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                                        />
                                      </div>
                                      <div className="card-body p-2 text-center">
                                        <h6 className="card-title mb-0 fs-6">{person.name}</h6>
                                        <p className="card-text small text-muted">{person.character}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Crew - Directors and Writers */}
                          {credits?.crew?.length > 0 && (
                            <div className="mb-4">
                              <h5 className="border-bottom pb-2 mb-3">Ekip</h5>
                              <div className="row">
                                {credits.crew
                                  .filter(person => 
                                    person.job === 'Director' || 
                                    person.job === 'Screenplay' || 
                                    person.job === 'Writer' ||
                                    person.job === 'Producer'
                                  )
                                  .slice(0, 6)
                                  .map(person => (
                                    <div key={`${person.id}-${person.job}`} className="col-md-2 col-sm-4 col-6 mb-3">
                                      <div className="card h-100 border-0 shadow-sm">
                                        <div className="position-relative" style={{ paddingBottom: '150%' }}>
                                          <img 
                                            src={person.profile_path 
                                              ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                                              : `https://via.placeholder.com/185x278/eee?text=${person.name}`}
                                            alt={person.name}
                                            className="card-img-top position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                                          />
                                        </div>
                                        <div className="card-body p-2 text-center">
                                          <h6 className="card-title mb-0 fs-6">{person.name}</h6>
                                          <p className="card-text small text-muted">{person.job}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                }
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* Videos Tab */}
                  {activeTab === 'videos' && (
                    <div className="tab-pane fade show active">
                      {loading ? (
                        <div className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Yükleniyor...</span>
                          </div>
                        </div>
                      ) : videos.length > 0 ? (
                        <div className="row">
                          {videos.map(video => (
                            <div key={video.id} className="col-md-6 mb-4">
                              <div className="card">
                                <div className="ratio ratio-16x9">
                                  <iframe
                                    src={`https://www.youtube.com/embed/${video.key}`}
                                    title={video.name}
                                    allowFullScreen
                                  ></iframe>
                                </div>
                                <div className="card-body">
                                  <h6 className="card-title">{video.name}</h6>
                                  <p className="card-text text-muted small">
                                    {video.type} • {new Date(video.published_at).toLocaleDateString('tr-TR')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="alert alert-info">
                          Bu film için video bulunamadı.
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Similar Movies Tab */}
                  {activeTab === 'similar' && (
                    <div className="tab-pane fade show active">
                      {loading ? (
                        <div className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Yükleniyor...</span>
                          </div>
                        </div>
                      ) : similar.length > 0 ? (
                        <div className="row">
                          {similar.map(movie => (
                            <div key={movie.id} className="col-md-2 col-sm-4 col-6 mb-3">
                              <div className="card h-100 border-0 shadow-sm">
                                <div className="position-relative" style={{ paddingBottom: '150%' }}>
                                  <img 
                                    src={movie.poster_path 
                                      ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
                                      : `https://via.placeholder.com/185x278/eee?text=${movie.title}`}
                                    alt={movie.title}
                                    className="card-img-top position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                                  />
                                  {movie.vote_average > 0 && (
                                    <div className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark">
                                      <Star size={10} fill="currentColor" className="me-1" />
                                      {movie.vote_average.toFixed(1)}
                                    </div>
                                  )}
                                </div>
                                <div className="card-body p-2">
                                  <h6 className="card-title small mb-0">{movie.title}</h6>
                                  <p className="card-text small text-muted">
                                    {movie.release_date?.substring(0, 4) || 'Tarih yok'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="alert alert-info">
                          Bu filme benzer filmler bulunamadı.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;