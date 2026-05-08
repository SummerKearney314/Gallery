import React, { useEffect, useState, useCallback } from "react";
import { database } from "../firebase";
import { ref, onValue, set, increment } from "firebase/database";

// Firebase Storage (no longer free — kept for reference)
// import { storage } from "../firebase";
// import { ref as storageRef, listAll, getDownloadURL } from "firebase/storage";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import "../App.css";
import Slideshow from "./slideshow";

const Main = () => {
  const [images, setImages] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    const imagesRef = ref(database, "images");
    onValue(imagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const imageList = Object.entries(data).map(([key, item]) => ({
          src: item.url,
          dbKey: key,
          horizontal: Math.random() > 0.5,
        }));
        setImages(imageList);
      }
    });

    // --- Firebase Storage (no longer free — kept for reference) ---
    // const fetchImages = async () => {
    //   try {
    //     const rootRef = storageRef(storage, "/");
    //     const result = await listAll(rootRef);
    //     const urlPromises = result.items.map(async (imageRef) => {
    //       const url = await getDownloadURL(imageRef);
    //       return { src: url, horizontal: Math.random() > 0.5 };
    //     });
    //     const urls = await Promise.all(urlPromises);
    //     setImages(urls);
    //   } catch (error) {
    //     console.error("Error loading images:", error);
    //   }
    // };
    // fetchImages();

    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const recordView = useCallback((image) => {
    const viewRef = ref(database, `views/${image.dbKey}`);
    set(viewRef, { count: increment(1) });
  }, []);

  const toggleFavorite = useCallback((image) => {
    const updatedFavorites = favorites.includes(image.src)
      ? favorites.filter((fav) => fav !== image.src)
      : [...favorites, image.src];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    const favoriteRef = ref(database, `favorites/${image.dbKey}`);
    set(favoriteRef, {
      count: updatedFavorites.includes(image.src)
        ? increment(1)
        : increment(-1),
    });
  }, [favorites]);

  const slides = images.map((img) => ({ src: img.src }));

  return (
    <div>
      <Slideshow images={images} />
      <div className="gallery">
        {images.map((image, index) => (
          <div key={index} className="gallery-item">
            <img
              src={image.src}
              alt={`${index + 1}`}
              onClick={() => { recordView(image); setLightboxIndex(index); }}
            />
            <button
              onClick={() => toggleFavorite(image)}
              className={`favorite-button ${
                favorites.includes(image.src) ? "favorited" : ""
              }`}
            >
              <FontAwesomeIcon
                icon={favorites.includes(image.src) ? solidHeart : regularHeart}
              />
            </button>
          </div>
        ))}
      </div>
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
      />
    </div>
  );
};

export default Main;
