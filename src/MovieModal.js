import React from "react";
import { Modal, Button } from "react-bootstrap";

function MovieModal({ show, onHide, movie }) {
  if (!movie) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{movie.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column flex-md-row">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={movie.title}
            className="mb-3 mb-md-0 me-md-4"
            style={{ width: "200px", height: "auto", borderRadius: "5px" }}
          />
          <div>
            <p><strong>Açıklama:</strong> {movie.overview || "Açıklama bulunamadı."}</p>
            <p><strong>Vizyon Tarihi:</strong> {movie.release_date}</p>
            <p><strong>IMDB Puanı:</strong> {movie.vote_average}</p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Kapat
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MovieModal;
// This code defines a MovieModal component that displays detailed information about a selected movie in a modal dialog. It uses React Bootstrap for styling and layout. The modal shows the movie's poster, overview, release date, and IMDB rating. The modal can be closed by clicking the close button or the "Kapat" button.