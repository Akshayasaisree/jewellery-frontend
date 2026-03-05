import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Title from './Title';
import arrow from '../assets/arrow.png';
import './ImageUploader.css';
import * as THREE from 'three';

const ImageUploader = ({ onButtonClick }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [captionText, setCaptionText] = useState(''); // Store the generated caption
  const [show3DView, setShow3DView] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selection, setSelection] = useState('gold'); // Default selection is gold
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('username'); // Get email from localStorage

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setErrorMessage('');
      setProcessedImageUrl(null);
      setShow3DView(false);
      setCaptionText(''); // Reset caption when a new image is selected
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
      setCaptionText(''); // Reset caption when a new image is selected
    }
  };

  const handlePaste = (event) => {
    const clipboardItem = event.clipboardData.items[0];
    if (clipboardItem && clipboardItem.type.startsWith('image/')) {
      const imageBlob = clipboardItem.getAsFile();
      if (imageBlob) {
        setSelectedImage(imageBlob);
        setErrorMessage('');
        setProcessedImageUrl(null);
        setShow3DView(false);
        setCaptionText(''); // Reset caption when a new image is selected
      }
    }
  };

  const handleUploadgen = async () => {
    if (!selectedImage) return;

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      
      reader.onloadend = async () => {
        // Get base64 data
        const base64Data = reader.result.split(',')[1];
        
        try {
          const response = await fetch("https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: reader.result })
          });

          if (!response.ok) {
            throw new Error('Failed to generate caption');
          }

          const result = await response.json();
          setCaptionText(result[0]?.generated_text || 'No caption generated');
        } catch (error) {
          console.error('Caption generation error:', error);
          setCaptionText('Failed to generate caption');
        }
      };

      reader.onerror = () => {
        console.error('Error reading file');
        setCaptionText('Error reading image file');
      };
    } catch (error) {
      console.error('Caption generation error:', error);
      setCaptionText('Failed to generate caption');
    }
  };

  const handleProcess = async () => {
    if (!selectedImage) {
      setErrorMessage('Please select an image file.');
      return;
    }
    const email = localStorage.getItem('username');
    if (!token || !email) {
      setErrorMessage('Please log in to process images.');
      return;
    }
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('email', email);

      const serverUrl = selection === 'gold'
  ? 'https://jewellery-azbm.onrender.com/api/upload/model1'
  : selection === 'silver'
  ? 'https://jewellery-azbm.onrender.com/api/upload/model2'
  : selection === 'gold-gemstone'
  ? 'https://jewellery-azbm.onrender.com/api/upload/model3'
  : 'https://jewellery-azbm.onrender.com/api/upload/model1';

      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 503 && errorData.error.includes('resources exhausted')) {
          setErrorMessage('Model is currently busy. Please try again in a few minutes.');
          return;
        }
        if (response.status === 400) {
          if (errorData.error.includes('not appear to be a sketch')) {
            setErrorMessage('Please upload a sketch image. Photos or other types of images are not supported.');
            return;
          }
          if (errorData.error.includes('not appear to be jewelry-related')) {
            setErrorMessage('The image should be a jewelry sketch. Other types of sketches are not supported.');
            return;
          }
        }
        throw new Error(errorData.error || 'Image processing failed');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setProcessedImageUrl(imageUrl);

      // Save both sketch and generated images
      const saveImagesFormData = new FormData();
      saveImagesFormData.append('sketch', selectedImage);
      saveImagesFormData.append('generated', blob);
      saveImagesFormData.append('email', email);

      const saveResponse = await fetch('https://jewellery-azbm.onrender.com/api/images/save', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: saveImagesFormData,
      });

      if (!saveResponse.ok) {
        const saveErrorData = await saveResponse.json();
        throw new Error(saveErrorData.error || 'Failed to save images');
      }

      // Generate caption right after processing the image
      handleUploadgen();
    } catch (error) {
      console.error('Processing error:', error);
      setErrorMessage(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // Add paste event listener to the document
    document.addEventListener('paste', handlePaste);

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

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

        <Title text1="UPLOAD" text2="IMAGE" />

        {/* Model Selection Section */}
        <div className="model-selection-section">
          <Title text1="Select" text2="MODEL" />
          <div className="selection-container">
            <button
              className={`selection-button ${selection === 'gold' ? 'active' : ''}`}
              onClick={() => setSelection('gold')}
            >
              Gold
            </button>
            <button
              className={`selection-button ${selection === 'silver' ? 'active' : ''}`}
              onClick={() => setSelection('silver')}
            >
              Silver
            </button>
            <button
              className={`selection-button ${selection === 'gold-gemstone' ? 'active' : ''}`}
              onClick={() => setSelection('gold-gemstone')}
            >
              Gold Gemstone
            </button>
          </div>
        </div>

        {/* Images Display Section */}
        <div className="images-container">
          {/* Sketch Image Section */}
          <div className="image-section">
            {selectedImage ? (
              <>
                <h3>Sketch Image</h3>
                <div className="image-preview-container">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Sketch"
                    className="image-preview"
                  />
                </div>
              </>
            ) : (
              <div
                className={`image-placeholder ${dragActive ? 'drag-active' : ''}`}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <p>Drag & Drop your sketch here</p>
              </div>
            )}
          </div>

          {/* Generated Image Section */}
          <div className="image-section">
            {processedImageUrl ? (
              <>
                <h3>Generated Design</h3>
                <div className="image-preview-container">
                  {!show3DView ? (
                    <img
                      src={processedImageUrl}
                      alt="Generated"
                      className="image-preview"
                    />
                  ) : (
                    <div className="canvas-container">
                      <Canvas>
                        <OrbitControls />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <mesh>
                          <boxGeometry args={[1, 1, 1]} />
                          <meshStandardMaterial map={new THREE.TextureLoader().load(processedImageUrl)} />
                        </mesh>
                      </Canvas>
                    </div>
                  )}
                </div>
                <button 
                  className="view-3d-button"
                  onClick={() => setShow3DView(!show3DView)}
                >
                  {show3DView ? 'View 2D' : 'View 3D'}
                </button>
              </>
            ) : (
              <div className="image-placeholder">
                <p>Generated design will appear here</p>
              </div>
            )}
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          id="fileInput"
          className="file-input"
          style={{ display: 'none' }}
        />

        {/* Action Buttons */}
        <div className="button-container">
          <button 
            className="select-button"
            onClick={() => document.getElementById('fileInput').click()}
            disabled={isProcessing}
          >
            Select Sketch
          </button>
          <button
            className="upload-button"
            onClick={handleProcess}
            disabled={!selectedImage || isProcessing}
          >
            {isProcessing ? <div className="spinner"></div> : 'Generate Design'}
          </button>
        </div>

        {/* Caption Section */}
        {(captionText || isProcessing) && (
          <div className="caption-container">
            <div className="caption-title">Image Description</div>
            {isProcessing ? (
              <div className="caption-loading">
                <div className="spinner"></div>
                Generating description...
              </div>
            ) : (
              <div className="caption-text">{captionText}</div>
            )}
          </div>
        )}

        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default ImageUploader;