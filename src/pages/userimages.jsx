import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './userimages.css';

const UserImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserImages();
  }, []);

  const fetchUserImages = async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem('username');
      if (!email) {
        setError('Please log in to view your images');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3001/api/images/my-images', {
        params: { email },
        withCredentials: true
      });
      setImages(response.data);
      localStorage.setItem('imageCount', response.data.length.toString());
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch images');
      setLoading(false);
      console.error('Error fetching images:', err);
    }
  };

  const handleDelete = async (imageId) => {
    if (!imageId) {
      console.error('No image ID provided');
      return;
    }

    try {
      const email = localStorage.getItem('username');
      if (!email) {
        setError('Please log in to delete images');
        return;
      }

      const confirmed = window.confirm('Are you sure you want to delete this image?');
      if (!confirmed) return;

      await axios.delete(`http://localhost:3001/api/images/delete/${imageId}`, {
        params: { email },
        withCredentials: true
      });

      const updatedImages = images.filter(img => img._id !== imageId);
      setImages(updatedImages);
      localStorage.setItem('imageCount', updatedImages.length.toString());
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete image. Please try again.');
    }
  };

  const handleDownload = (image, type) => {
    try {
      // Create a download link
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${type === 'sketch' ? image.sketch_image : image.generated_image}`;
      link.download = `jewelry-${type}-${new Date(image.timestamp).toISOString().split('T')[0]}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading image:', err);
      alert('Failed to download image. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (images.length === 0) return <div className="no-images">No images found</div>;

  return (
    <div className="user-images-container">
      <h2 key="header">Your Generated Images</h2>
      <div className="images-list">
        {images.map((image) => (
          <div key={`image-pair-${image._id}`} className="image-pair">
            <div className="image-info">
              <div key={`sketch-${image._id}`} className="image-item sketch">
                <h4 key={`sketch-header-${image._id}`}>Original Sketch</h4>
                <img 
                  key={`sketch-image-${image._id}`}
                  src={`data:image/jpeg;base64,${image.sketch_image}`} 
                  alt="Original sketch" 
                />
                <div className="image-actions">
                  <button 
                    key={`download-sketch-${image._id}`}
                    className="download-btn"
                    onClick={() => handleDownload(image, 'sketch')}
                  >
                    Download Sketch
                  </button>
                </div>
              </div>
              <div key={`generated-${image._id}`} className="image-item generated">
                <h4 key={`generated-header-${image._id}`}>Generated Design</h4>
                <img 
                  key={`generated-image-${image._id}`}
                  src={`data:image/jpeg;base64,${image.generated_image}`} 
                  alt="Generated design" 
                />
                <div className="image-actions">
                  <button 
                    key={`download-generated-${image._id}`}
                    className="download-btn"
                    onClick={() => handleDownload(image, 'generated')}
                  >
                    Download Design
                  </button>
                </div>
              </div>
            </div>
            <div key={`footer-${image._id}`} className="image-footer">
              <div key={`timestamp-${image._id}`} className="image-timestamp">
                Created: {new Date(image.timestamp).toLocaleString()}
              </div>
              <button 
                key={`delete-${image._id}`}
                className="delete-btn"
                onClick={() => handleDelete(image._id)}
              >
                Delete Image Pair
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserImages;
