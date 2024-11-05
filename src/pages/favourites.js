import React, { useEffect, useState } from "react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Load favorites from local storage
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  return (
    <div className="favorites-container">
      <h1>Favorites</h1>
      {favorites.length === 0 ? (
        <p>No favorite images yet.</p>
      ) : (
        <div className="gallery">
          {favorites.map((src, index) => (
            <div key={index} className="gallery-item">
              <img src={src} alt={`Favorite ${index + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
