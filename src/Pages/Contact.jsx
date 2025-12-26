import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Contact.css'

const Contact = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'name') {
      const cleaned = value.replace(/[^A-Za-z\s'.-]/g, '')
      setFormData({ ...formData, [name]: cleaned })
      return
    }
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatusMessage('Sending your message...')

    try {
      await axios.post(`${API_URL}/contact-inquiries`, formData)
      setStatusMessage('Thank you! We will get back to you soon.')
      setFormData({ name: '', email: '', service: '', message: '' })
      setTimeout(() => setStatusMessage(''), 5000)
    } catch (error) {
      console.error('Error:', error)
      setStatusMessage('An error occurred. Please try again later.')
      setTimeout(() => setStatusMessage(''), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='contact-wrapper'>
      <div className='contact-header'>
        <h1>Let’s Connect</h1>
        <div className='header-line'></div>
        <p>We’d love to hear from you. Reach out anytime.</p>
      </div>

      <div className='contact-grid'>
        {/* LEFT CARD - Contact Details */}
        <div className='contact-card'>
          <h2>Contact Details</h2>
          <div className='card-line'></div>

          <div className='contact-rows-container'>
            <div className='contact-row'>
              <div className='icon-box'>
                <i className='fas fa-phone'></i>
              </div>
              <span>6304244117 / 89198 01095</span>
            </div>

            <div className='contact-row'>
              <div className='icon-box'>
                <i className='fas fa-envelope'></i>
              </div>
              <span>info@zero7technologies.com</span>
            </div>

            <div className='contact-row'>
              <div className='icon-box'>
                <i className='fas fa-map-marker-alt'></i>
              </div>
              <span>
                Ground Floor Shanmukha Empires
                <br />
                83 Ayyappa Society Main Road, Madhapur
                <br />
                Hyderabad, Telangana
              </span>
            </div>
          </div>

          <div className='map-box'>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d237.89256318873484!2d78.39182793785751!3d17.44625912878081!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa7477a72b9083c7f%3A0xb5e513691e0dc3d9!2sZero7%20Technologies!5e0!3m2!1sen!2sin!4v1766383432242!5m2!1sen!2sin'
              loading='lazy'
              title='Zero7 Location'></iframe>
          </div>
        </div>

        {/* RIGHT CARD - Form */}
        <div className='form-card'>
          <h2>Quick Inquiry</h2>
          <div className='card-line'></div>

          <form onSubmit={handleSubmit}>
            <div className='input-group'>
              <input
                type='text'
                name='name'
                placeholder='Your Name'
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className='input-group'>
              <input
                type='email'
                name='email'
                placeholder='Your Email'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className='input-group'>
              <select
                name='service'
                value={formData.service}
                onChange={handleChange}
                required>
                <option value=''>Select Service</option>
                <option value='Training'>Training</option>
                <option value='Payroll Services'>Payroll Services</option>
                <option value='Resume Marketing'>Resume Marketing</option>
                <option value='Campus Hiring'>Campus Hiring</option>
              </select>
            </div>

            <div className='input-group'>
              <textarea
                rows='4'
                name='message'
                placeholder='Your Message'
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type='submit' className='submit-btn' disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {statusMessage && <p className='status'>{statusMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
