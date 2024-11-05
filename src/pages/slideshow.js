import React, { useEffect, useState } from "react";
import "../App.css"; // Import custom CSS for the slideshow

const Slideshow = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000); // Change image every 5 seconds

      return () => clearInterval(interval);
    }
  }, [images]);

  if (images.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="slideshow-container">
      <img
        className="slideshow-image"
        src={images[currentIndex].src}
        alt="Slideshow"
      />
    </div>
  );
};

export default Slideshow;
