import React from 'react';
import './Loader.css'; // Make sure to create and style this CSS file

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-spinner"></div>
      <p className="loader-text">Logging in ...</p>
    </div>
  );
};

export default Loader;
