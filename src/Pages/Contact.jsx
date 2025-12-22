import React, { useState, useEffect } from 'react'
import axios from 'axios' // Import axios to make HTTP requests
import './Contact.css'

const Contact = () => {
  // The API URL for your backend
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

  // Your existing state for form data remains the same
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  })

  // --- ADDED: New state to handle submission status and user feedback ---
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  // -----------------------------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    
     if (name === 'name') {
    const cleaned = value.replace(/[^A-Za-z\s'.-]/g, ''); 
    setFormData({
      ...formData,
      [name]: cleaned,
    });
    return;
  }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // --- UPDATED: The handleSubmit function is now connected to the backend ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatusMessage('Sending your message...')

    try {
      // The form data is sent to your backend endpoint
      await axios.post(`${API_URL}/contact-inquiries`, formData)

      setStatusMessage(
        'Thank you for your inquiry! We will get back to you soon.',
      )

      // Reset form on success
      setFormData({
        name: '',
        email: '',
        service: '',
        message: '',
      })

      // Clear the message after 5 seconds
      setTimeout(() => setStatusMessage(''), 5000)
    } catch (error) {
      console.error('Form submission error:', error)
      setStatusMessage('An error occurred. Please try again later.')
      // Clear the error message after 5 seconds
      setTimeout(() => setStatusMessage(''), 5000)
    } finally {
      // This runs whether the submission succeeds or fails
      setIsSubmitting(false)
    }
  }
  // ----------------------------------------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='contact-container'>
      <header className='contact-header'>
        <h1>Let's Connect</h1>
      </header>

      <div className='contact-content'>
        <div className='contact-details'>
          <h2>Contact Details</h2>
          <div className='contact-info'>
            <div className='contact-item'>
              <i className='fas fa-phone'></i>
              <span>6304244117 / 89198 01095</span>
            </div>
            <div className='contact-item'>
              <i className='fas fa-envelope'></i>
              <span>info@zero7technologies.com</span>
            </div>

            <div className='contact-item'>
              <i className='fas fa-map-marker-alt'></i>
              <span>
                201, 2nd floor, Spline Arcade, Opp Rajugari Biryani
                <br />
                Ayyappa Society Main Road, Madhapur
                <br />
                Hyderabad, Telangana, 500081
              </span>
            </div>
          </div>

          <div className='map-container'>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.279330956011!2d78.38993397331942!3d17.446339601107837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9167790c2429%3A0xe761ca87ad0d7005!2sSpline%20Arcade!5e0!3m2!1sen!2sin!4v1756298878073!5m2!1sen!2sin'
              width='100%'
              height='250'
              style={{ border: 0 }}
              allowFullScreen=''
              loading='lazy'
              title='Company Location Map'></iframe>
          </div>
        </div>

        <div className='inquiry-form'>
          <h2>Quick Inquiry Form</h2>
          {/* The form now correctly uses the updated handleSubmit function */}
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <input
  type='text'
  name='name'
  placeholder='Your Name'
  value={formData.name}
  onChange={handleChange}
  pattern="^[A-Za-z][A-Za-z\s'.-]{1,}$"
  title="Name should contain only letters and must be at least 2 characters."
  required
/>

            </div>
            <div className='form-group'>
              <input
                type='email'
                pattern='^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
                name='email'
                placeholder='Your Email'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <select
                name='service'
                value={formData.service}
                onChange={handleChange}
                required>
                <option value=''>Select a Service</option>
                {/* --- UPDATED: Changed values to be more descriptive --- */}
                <option value='Training'>Training</option>
                <option value='Payroll Services'>Payroll Services</option>
                <option value='Resume Marketing'>Resume Marketing</option>
                <option value='Campus Hiring'>Campus Hiring</option>
                <option value='Technical Support'>Technical Support</option>
              </select>
            </div>
            <div className='form-group'>
              <textarea
                name='message'
                placeholder='Your Message'
                rows='5'
                value={formData.message}
                onChange={handleChange}
                required></textarea>
            </div>
            {/* The button is now disabled during submission */}
            <button
              type='submit'
              className='submit-btn'
              disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            {/* Display feedback message to the user */}
            {statusMessage && <p className='status-message'>{statusMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
