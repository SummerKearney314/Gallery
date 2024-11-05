import React, { useEffect, useState } from "react";
import { storage, database } from "../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { ref as dbRef, set, increment } from "firebase/database";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

import "../App.css";
import Slideshow from "./slideshow";

const Main = () => {
  const [images, setImages] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Fetch images from Firebase
    const fetchImages = async () => {
      try {
        const storageRef = ref(storage, "/");
        const result = await listAll(storageRef);

        const urlPromises = result.items.map(async (imageRef) => {
          const url = await getDownloadURL(imageRef);
          return {
            src: url,
            horizontal: Math.random() > 0.5,
          };
        });

        const urls = await Promise.all(urlPromises);
        setImages(urls);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };
    fetchImages();

    // Load favorites from local storage on initial load
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const recordView = (imageSrc) => {
    const imageId = imageSrc.split("/").pop().split("?")[0].replace(/\./g, "_"); // Replace '.' with '_'
    const viewRef = dbRef(database, `views/${imageId}`);
    set(viewRef, {
      count: increment(1),
    });
  };

  // Toggle favorite status
  const toggleFavorite = (image) => {
    const updatedFavorites = favorites.includes(image.src)
      ? favorites.filter((fav) => fav !== image.src)
      : [...favorites, image.src];

    setFavorites(updatedFavorites);

    // Save to local storage
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    // Track favourites
    const imageId = image.src
      .split("/")
      .pop()
      .split("?")[0]
      .replace(/\./g, "_"); // Replace '.' with '_' (wont allow '.' in db)
    const favoriteRef = dbRef(database, `favorites/${imageId}`);
    set(favoriteRef, {
      count: updatedFavorites.includes(image.src)
        ? increment(1)
        : increment(-1),
    });
  };

  return (
    <div>
      {/* Slideshow */}
      <Slideshow images={images} />
      {/* Gallery */}
      <div className="gallery">
        {images.map((image, index) => (
          <div key={index} className="gallery-item">
            <img
              src={image.src}
              alt={`${index + 1}`}
              onClick={() => recordView(image.src)}
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
    </div>
  );
};

export default Main;
