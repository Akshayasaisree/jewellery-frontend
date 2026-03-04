import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Title from './Title';
import arrow from '../assets/arrow.png';
import './ImageUploader.css';
import * as THREE from 'three';

const ImageUploaders = ({ onButtonClick }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [show3DView, setShow3DView] = useState(false); // Toggle between 2D/3D
  const [errorMessage, setErrorMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const token = localStorage.getItem('token');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setErrorMessage('');
      setProcessedImageUrl(null);
      setShow3DView(false); // Reset 3D view when a new image is selected
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedImage(file);
      setErrorMessage('');
      setProcessedImageUrl(null);
      setShow3DView(false);
    }
  };

  const handleProcess = async () => {
    if (!selectedImage) {
      setErrorMessage('Please select an image file.');
      return;
    }
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error('Image processing failed. Please try again.');

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setProcessedImageUrl(imageUrl);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="upload-container">
      <div
        className="card"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ border: dragActive ? '2px dashed #4CAF50' : '2px solid #ccc' }}
      >
        <div className="close-section" onClick={onButtonClick}>
          <img src={arrow} alt="Close" className="arrow-icon" />
          <p className="close-text">Close</p>
        </div>
        <Title text1="UPLOAD" text2=" IMAGE" />
        <Title text1="for" text2=" SILVER" />

        {selectedImage && (
          <div className="uploaded-image-section">
            <h3>Uploaded Image:</h3>
            <div
              className="image-preview-container"
              onClick={() => document.getElementById('fileInput').click()} // Trigger file input click
            >
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Uploaded"
                className="image-preview"
              />
            </div>
          </div>
        )}

        {!selectedImage && (
          <div
            className={`image-placeholder ${dragActive ? 'drag-active' : ''}`}
            onClick={() => document.getElementById('fileInput').click()} // Trigger file input click
          >
            <p>Drag & Drop your image here, or click to select</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          id="fileInput"
          className="file-input"
          style={{ display: 'none' }} // Hide the file input
        />

        <div className="button-container">
          <label htmlFor="fileInput" className="select-button">
            Select Image
          </label>
          <button
            className="upload-button"
            onClick={handleProcess}
            disabled={!selectedImage || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Upload & Process'}
          </button>
        </div>

        {processedImageUrl && (
          <div className="processed-image-section">
            <h3>Processed Image:</h3>
            {!show3DView ? (
              <>
                <div className="image-wrapper">
                  <img
                    src={processedImageUrl}
                    alt="Processed"
                    className="image-preview-container"
                  />
                  <div
                    className="hover-overlay"
                    onClick={() => setShow3DView(true)}
                  >
                    View in 3D
                  </div>
                </div>
              </>
            ) : (
              <div className="canvas-container">
                <button
                  className="red-close-button"
                  onClick={() => setShow3DView(false)}
                >
                  ×
                </button>
                <Canvas>
                  <ambientLight />
                  <OrbitControls />
                  <mesh>
                    <planeGeometry args={[3, 3, 64, 64]} />
                    <meshStandardMaterial
                      map={new THREE.TextureLoader().load(processedImageUrl)}
                      displacementMap={new THREE.TextureLoader().load(processedImageUrl)}
                      displacementScale={0.2}
                    />
                  </mesh>
                </Canvas>
              </div>
            )}
          </div>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default ImageUploaders;