import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../css/banner.css";
import banner_pic1 from "../../assets/images/bannerpic1.jpg";
import banner_pic2 from "../../assets/images/bannerpic2.png";
const images = [banner_pic1, banner_pic2];
export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="slider-container">
        <div
          className="slider-image"
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
        ></div>
        <div className="slider-button-container">
          <button className="explore-button">
            <Link className="link_explore" to="/collection">
              Explore
            </Link>
          </button>
        </div>
      </div>
    </>
  );
}
