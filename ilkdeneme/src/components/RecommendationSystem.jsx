import React from "react";
import { useNavigate } from "react-router-dom";
import "./recommendationsystem.css"; // CSS dosyasını import et

const RecommendationSystem = () => {
  const navigate = useNavigate();

  const handleBackToMovies = () => {
    navigate("/");
  };

  return (
    <div className="recommendation-system-container">
      <h1>Tavsiye Sistemi</h1>
      <p>Burada seçtiğiniz filmlere göre öneriler yer alacaktır.</p>
      <button onClick={handleBackToMovies} className="back-button">
        Filmlere Geri Dön
      </button>
    </div>
  );
};

export default RecommendationSystem;