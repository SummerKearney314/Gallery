import React, { useEffect, useState } from "react";
import { ref as dbRef, onValue } from "firebase/database";
import { storage, database } from "../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import "../App.css";

const Analytics = () => {
  const [images, setImages] = useState({});
  const [views, setViews] = useState({});
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const fetchImageUrls = async (data) => {
      const imageUrls = {};

      for (const imageName in data) {
        try {
          const storageImageName = imageName.replace("_JPG", ".JPG");
          const imageRef = ref(storage, `/${storageImageName}`);
          const url = await getDownloadURL(imageRef);
          imageUrls[imageName] = { url, ...data[imageName] };
        } catch (error) {
          console.error(`Error fetching URL for ${imageName}:`, error);
        }
      }

      return imageUrls;
    };

    const viewsRef = dbRef(database, "views");
    const favoritesRef = dbRef(database, "favorites");

    onValue(viewsRef, async (snapshot) => {
      const viewsData = snapshot.val() || {};
      const imageUrls = await fetchImageUrls(viewsData);

      setImages((prevImages) => ({ ...prevImages, ...imageUrls }));
      setViews(viewsData);
    });

    onValue(favoritesRef, async (snapshot) => {
      const favoritesData = snapshot.val() || {};
      const imageUrls = await fetchImageUrls(favoritesData);

      setImages((prevImages) => ({ ...prevImages, ...imageUrls }));
      setFavorites(favoritesData);
    });
  }, []);

  // Top 5 images
  // Sort by highest to lowest
  const sortedViews = Object.entries(views)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);
  const sortedFavorites = Object.entries(favorites)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  return (
    <div className="analytics-container">
      <h1>Analytics</h1>
      <div className="analytics-section">
        {/* Top Views */}
        <h2>Views</h2>
        <div className="analytics-gallery">
          {sortedViews.map(([imageName, data]) => (
            <div key={imageName} className="analytics-item">
              <img src={images[imageName]?.url} alt={imageName} />
              <div className="analytics-info">
                <p>{data.count} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="analytics-section">
        {/* Top Favourites */}
        <h2>Favorites</h2>
        <div className="analytics-gallery">
          {sortedFavorites.map(([imageName, data]) => (
            <div key={imageName} className="analytics-item">
              <img src={images[imageName]?.url} alt={imageName} />
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
