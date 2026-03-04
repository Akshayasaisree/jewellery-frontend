import React, { useState } from 'react';
import Hero from '../components/Hero';
import ImageUploader from '../components/ImageUploader'; // Assuming ImageUploader is created

const Home = () => {
  const [showUploader, setShowUploader] = useState(false);

  const handleOpenUploader = () => {
    setShowUploader(true); // Show the uploader when button is clicked
  };
  const handleOpenUploader1 = () => {
    setShowUploader(false); // Show the uploader when button is clicked
  };

  return (
    <div>
      <Hero onButtonClick={handleOpenUploader} /> {/* Pass function to Hero */}
      {showUploader && <ImageUploader onButtonClick={handleOpenUploader1}/>} {/* Conditionally render ImageUploader */}
    </div>
  );
};

export default Home;