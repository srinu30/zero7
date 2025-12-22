// File: src/Pages/Blog.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Blog.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// --- Modal Component for Blog Details ---
const BlogModal = ({ blog, onClose }) => {
  const [viewerImage, setViewerImage] = useState(null); // State for full-screen image viewer

  if (!blog) return null;

  // --- Full-screen Image Viewer Component ---
  const ImageViewer = ({ src, onCloseViewer }) => (
    <div className="image-viewer-backdrop" onClick={onCloseViewer}>
      <button className="image-viewer-close" onClick={onCloseViewer}>&times;</button>
      <div className="image-viewer-content">
        <img src={src} alt="Full screen view" className="image-viewer-img" />
      </div>
    </div>
  );

  return (
    <>
      <div className="blog-modal-backdrop" onClick={onClose}>
        <div className="blog-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="blog-modal-close" onClick={onClose}>&times;</button>
          <h2>{blog.title}</h2>
          <p className="modal-description">{blog.description}</p>
          
          {/* Gallery Section */}
          {blog.gallery && blog.gallery.length > 0 && (
            <div className="blog-modal-gallery">
              <h3>Gallery</h3>
              <div className="gallery-grid">
                {blog.gallery.map((imgUrl, index) => (
                  <div key={index} className="gallery-image-container" onClick={() => setViewerImage(imgUrl)}>
                    <img src={imgUrl} alt={`Gallery image ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Render the image viewer if an image is selected */}
      {viewerImage && <ImageViewer src={viewerImage} onCloseViewer={() => setViewerImage(null)} />}
    </>
  );
};


const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/blogs`);
        setBlogs(response.data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleReadMore = (blog) => {
    setSelectedBlog(blog);
  };

  const handleCloseModal = () => {
    setSelectedBlog(null);
  };

  const handleSubscribe = () => {
    alert('Opening newsletter subscription form');
  };

  return (
    <div className="blog-container">
      <header className="blog-header">
        <h1>Insights, Tips & Career Resources</h1>
        <p>Build authority with useful content.</p>
      </header>

      <div className="blog-grid">
        {loading ? (
          <p>Loading posts...</p>
        ) : (
          blogs.map((blog) => (
            <div className="blog-card" key={blog._id}>
              <div className="card-image">
                <img src={blog.imageUrl} alt={blog.title} />
                <div className="image-overlay"></div>
              </div>
              <div className="card-content">
                <h3>{blog.title}</h3>
                <p>{blog.description}</p>
                <button 
                  className="blog-read-more" 
                  onClick={() => handleReadMore(blog)}
                  aria-label={`Read more about ${blog.title}`}
                >
                  Read More <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="blog-cta-section">
        <div className="blog-cta-content">
          <h2>Stay Updated with Our Latest Insights</h2>
          <p>Subscribe to our newsletter and never miss out on career tips, industry trends, and professional advice.</p>
          <button className="blog-cta-button" onClick={handleSubscribe}>
            Subscribe to Newsletter
          </button>
        </div>
      </div>
      
      <BlogModal blog={selectedBlog} onClose={handleCloseModal} />
    </div>
  );
};

export default Blog;