// RegistrationPage.jsx
import React, { useState } from 'react';
import './RegistrationPage.css';

const RegistrationPage = ({ isOpen, onClose, courses }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    selectedCourse: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to a server
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        selectedCourse: '',
        message: ''
      });
      onClose();
    }, 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        {submitted ? (
          <div className="success-message">
            <h2>Thank You!</h2>
            <p>Your registration for the demo of <strong>{formData.selectedCourse}</strong> has been received.</p>
            <p>We will contact you shortly at {formData.email}.</p>
          </div>
        ) : (
          <>
            <h2>Register for a Free Demo</h2>
            <p>Fill in your details to register for a demo class</p>
            
            <form onSubmit={handleSubmit} className="registration-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="selectedCourse">Select Course *</label>
                <select
                  id="selectedCourse"
                  name="selectedCourse"
                  value={formData.selectedCourse}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select a Course --</option>
                  {courses.map((course, index) => (
                    <option key={index} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
              
              <button type="submit" className="submit-button">Register for Demo</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RegistrationPage;