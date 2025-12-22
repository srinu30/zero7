import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaEdit, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [gallery, setGallery] = useState(['', '', '']); // <-- ADDED: State for gallery images
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const clearMessages = () => {
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 4000);
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs`);
      setBlogs(response.data);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
      setErrorMessage('Failed to load blogs.');
      clearMessages();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImageUrl('');
    setGallery(['', '', '']); // <-- ADDED: Reset gallery state
    setEditingId(null);
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setTitle(blog.title);
    setDescription(blog.description);
    setImageUrl(blog.imageUrl);
    // Ensure gallery has 3 elements, padding with empty strings if needed
    const galleryUrls = [...(blog.gallery || []), '', '', ''].slice(0, 3);
    setGallery(galleryUrls); // <-- ADDED: Populate gallery fields
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // --- HANDLER for gallery input changes ---
  const handleGalleryChange = (index, value) => {
    const newGallery = [...gallery];
    newGallery[index] = value;
    setGallery(newGallery);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!title || !description || !imageUrl) {
      setErrorMessage('Title, Description, and Main Image URL are required.');
      clearMessages();
      return;
    }

    setLoading(true);
    // Filter out empty strings from gallery before sending
    const blogData = { title, description, imageUrl, gallery: gallery.filter(url => url) };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/blogs/${editingId}`, blogData);
        setSuccessMessage('Blog post updated successfully!');
      } else {
        await axios.post(`${API_URL}/blogs`, blogData);
        setSuccessMessage('Blog post added successfully!');
      }
      resetForm();
      fetchBlogs();
    } catch (err) {
      console.error('Failed to submit blog:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to submit blog. Please try again.');
    } finally {
      setLoading(false);
      clearMessages();
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/blogs/${id}`);
      setBlogs(blogs.filter(blog => blog._id !== id));
      setSuccessMessage('Blog deleted successfully!');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to delete blog.');
    } finally {
      clearMessages();
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <div className='max-w-5xl mx-auto'>
        <h2 className='text-4xl font-extrabold text-center text-gray-800 mb-8'>Manage Blogs</h2>

        {/* Form Section */}
        <div className='w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-12'>
          <h3 className='text-2xl font-semibold text-gray-700 mb-6'>
            {editingId ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h3>
          
          {successMessage && <div className='flex items-center bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded'><FaCheckCircle className='mr-2' /><p>{successMessage}</p></div>}
          {errorMessage && <div className='flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded'><FaExclamationCircle className='mr-2' /><p>{errorMessage}</p></div>}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <input type='text' placeholder='Blog Title' value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500' />
            <textarea placeholder='Blog Description' value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500' rows="4" />
            <input type='url' placeholder='Main Image URL' value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} disabled={loading} className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500' />
            
            {/* --- ADDED: Gallery Image Inputs --- */}
            <div className='space-y-2 pt-2'>
              <h4 className='font-semibold text-gray-600'>Gallery Images (up to 3)</h4>
              {[0, 1, 2].map(index => (
                <input
                  key={index}
                  type='url'
                  placeholder={`Gallery Image URL ${index + 1}`}
                  value={gallery[index]}
                  onChange={(e) => handleGalleryChange(index, e.target.value)}
                  disabled={loading}
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                />
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <button type='submit' disabled={loading} className='flex-grow p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition'>
                {loading ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Post' : 'Add Post')}
              </button>
              {editingId && <button type='button' onClick={resetForm} className='p-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition'>Cancel</button>}
            </div>
          </form>
        </div>

        {/* Existing Posts Section */}
        <div>
          <h3 className='text-3xl font-bold text-gray-800 mb-6'>Your Blog Posts</h3>
          {blogs.length > 0 ? (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {blogs.map((blog) => (
                <div key={blog._id} className='bg-white border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col'>
                  <img src={blog.imageUrl} alt={blog.title} className='w-full h-48 object-cover' />
                  <div className='p-4 flex flex-col flex-grow'>
                    <h4 className='text-xl font-semibold text-gray-800 mb-2 truncate'>{blog.title}</h4>
                    <p className='text-gray-700 text-sm mb-4 flex-grow line-clamp-3'>{blog.description}</p>
                    <div className="flex space-x-2 mt-auto">
                      <button onClick={() => handleEdit(blog)} className='flex items-center justify-center w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded text-sm transition'><FaEdit className='mr-1' /> Edit</button>
                      <button onClick={() => handleDelete(blog._id)} className='flex items-center justify-center w-full py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded text-sm transition'><FaTrashAlt className='mr-1' /> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (<p className='text-center text-gray-600 text-lg'>No blogs found. Add one above!</p>)}
        </div>
      </div>
    </div>
  );
}