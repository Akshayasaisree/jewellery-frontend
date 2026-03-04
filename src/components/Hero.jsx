import React, { useState, useEffect, useRef } from 'react';
import img from '../assets/sketch.jpg';
import ImageUploader from './ImageUploader';
import ImageUploaders from './ImageUploaders';
import arrow from '../assets/arrow.png';
import './Hero.css';

function Hero() {
  const [showGoldSilverSection, setShowGoldSilverSection] = useState(false);
  const [showGoldUploader, setShowGoldUploader] = useState(false);
  const [showSilverUploader, setShowSilverUploader] = useState(false);
  const [fadeInClass, setFadeInClass] = useState('');
  const token = localStorage.getItem('token');

  // Create refs for scrolling
  const goldSilverSectionRef = useRef(null);
  const goldSectionRef = useRef(null);
  const silverSectionRef = useRef(null);

  useEffect(() => {
    setFadeInClass('fadeIn');
  }, []);

  const handleImageUploaderClick = () => {
    setShowGoldSilverSection(!showGoldSilverSection);
    // Scroll to the gold and silver section when it's made visible
    setTimeout(() => {
      if (goldSilverSectionRef.current && !showGoldSilverSection) {
        goldSilverSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Delay to ensure the section is visible before scrolling
  };

  const toggleGoldUploader = () => {
    if (showSilverUploader) {
      setShowSilverUploader(false);
    }
    setShowGoldUploader(!showGoldUploader);
    
    // Scroll to the gold section smoothly when it's toggled
    setTimeout(() => {
      if (goldSectionRef.current && !showGoldUploader) {
        goldSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Delay to ensure visibility
  };

  const toggleSilverUploader = () => {
    if (showGoldUploader) {
      setShowGoldUploader(false);
    }
    setShowSilverUploader(!showSilverUploader);

    // Scroll to the silver section smoothly when it's toggled
    setTimeout(() => {
      if (silverSectionRef.current && !showSilverUploader) {
        silverSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Delay to ensure visibility
  };

  const handleCloseClick = () => {
    setShowGoldSilverSection(false);
    setShowGoldUploader(false);
    setShowSilverUploader(false);
  };

  return (
    <div className="hero-container">
      <div className={`hero-section ${fadeInClass}`}>
        <div className="hero-left">
          <div className="hero-text">
            <div className="section-title">
              <p className="line" />
              <p className="section-label">IMAGE CONVERSION</p>
            </div>
            <h1 className="hero-heading">Jewelry Model</h1>
            <div className="section-title">
              <p className="section-label">DO HERE</p>
              <p className="line" />
            </div>
          </div>
          <img src={img} alt="Sketch" className="hero-image" />
          <button
            onClick={handleImageUploaderClick}
            className="upload-btn"
            disabled={!token}
            style={{
              cursor: token ? 'pointer' : 'not-allowed',
            }}
          >
            Image Uploader
          </button>
        </div>
      </div>

      {showGoldSilverSection && (
        <div
          className="gold-silver-section"
          ref={goldSilverSectionRef} // Attach ref to the gold and silver section
        >
          <div className="close-section" onClick={handleCloseClick}>
            <img src={arrow} alt="Close" className="arrow-icon" />
            <p className="close-text">Close</p>
          </div>

          <div className="gold-silver-blocks">
            <div className="gold-block" ref={goldSectionRef}>
              <h2 className="block-heading">Upload Section</h2>
              <button onClick={toggleGoldUploader} className="upload-btn">
                Open Uploader
              </button>
            </div>

            {/* <div className="silver-block" ref={silverSectionRef}>
              <h2 className="block-heading">Silver Section</h2>
              <button onClick={toggleSilverUploader} className="upload-btn">
                Open Silver Uploader
              </button>
            </div> */}
          </div>
        </div>
      )}

      {showGoldUploader && <ImageUploader onButtonClick={toggleGoldUploader} />}
      {/* {showSilverUploader && <ImageUploaders onButtonClick={toggleSilverUploader} />} */}
    </div>
  );
}

export default Hero;
