import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";

// Firebase Storage (no longer free — kept for reference)
// import { storage } from "../firebase";
// import { ref as storageRef, getDownloadURL } from "firebase/storage";

import "../App.css";

const Analytics = () => {
  const [images, setImages] = useState({});
  const [views, setViews] = useState({});
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    // --- Load images from Firebase DB (Cloudinary URLs) ---
    const imagesRef = ref(database, "images");
    onValue(imagesRef, (snapshot) => {
      setImages(snapshot.val() || {});
    });

    // --- Firebase Storage URL fetching (no longer free — kept for reference) ---
    // const fetchImageUrls = async (data) => {
    //   const imageUrls = {};
    //   for (const imageName in data) {
    //     try {
    //       const storageImageName = imageName.replace("_JPG", ".JPG");
    //       const imageRef = storageRef(storage, `/${storageImageName}`);
    //       const url = await getDownloadURL(imageRef);
    //       imageUrls[imageName] = { url, ...data[imageName] };
    //     } catch (error) {
    //       console.error(`Error fetching URL for ${imageName}:`, error);
    //     }
    //   }
    //   return imageUrls;
    // };

    const viewsRef = ref(database, "views");
    onValue(viewsRef, (snapshot) => {
      setViews(snapshot.val() || {});
    });

    const favoritesRef = ref(database, "favorites");
    onValue(favoritesRef, (snapshot) => {
      setFavorites(snapshot.val() || {});
    });
  }, []);

  const sortedViews = Object.entries(views)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5);

  const sortedFavorites = Object.entries(favorites)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="analytics-container">
      <h1>Analytics</h1>
      <div className="analytics-section">
        <h2>Views</h2>
        <div className="analytics-gallery">
          {sortedViews.map(([key, data]) => (
            <div key={key} className="analytics-item">
              <img src={images[key]?.url} alt={key} />
              <div className="analytics-info">
                <p>{data.count} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="analytics-section">
        <h2>Favorites</h2>
        <div className="analytics-gallery">
          {sortedFavorites.map(([key, data]) => (
            <div key={key} className="analytics-item">
              <img src={images[key]?.url} alt={key} />
              <div className="analytics-info">
                <p>{data.count} favorites</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
