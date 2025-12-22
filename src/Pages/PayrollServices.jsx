// File: src/Pages/PayrollServices.jsx

import React, { useState } from 'react'
import {
  FaMoneyCheckAlt,
  FaFileInvoiceDollar,
  FaUserTie,
  FaCogs,
} from 'react-icons/fa'
import api from '../api/axios' // Import your central API instance
import './PayrollServices.css'

const PayrollServices = () => {
  // --- ADDED: State to manage the form inputs and submission status ---
  const [formData, setFormData] = useState({ name: '', email: '', company: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // --- ADDED: Function to handle form submission to the backend ---
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Send the form data to your new backend endpoint
      await api.post('/payroll-consultations', formData)

      alert(
        'Thank you! Your request for a free consultation has been submitted successfully.',
      )
      setFormData({ name: '', email: '', company: '' }) // Reset the form after success
    } catch (error) {
      console.error('Error submitting consultation request:', error)
      const errorMessage =
        error.response?.data?.message ||
        'There was an error submitting your request. Please try again.'
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className='ps-wrapper'>
      {/* 1. Hero Section */}
      <section className='ps-hero'>
        <div className='ps-hero-content'>
          <h1>Simplify Payroll. Empower Your Workforce.</h1>
          <p>
            Simplify your business operations with our efficient and accurate
            payroll services. We handle everything from salary processing to
            compliance, allowing you to focus on your core business goals.
          </p>
          <a href='#consultation' className='ps-btn'>
            Request Free Payroll Consultation
          </a>
        </div>
        <div className='ps-hero-img'>
          <img
            src='https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=1200&auto=format&fit=crop'
            alt='Payroll team at work'
          />
        </div>
      </section>

      {/* 2. What We Offer */}
      <section className='ps-offer'>
        <div className='ps-section-head'>
          <h2>What We Offer</h2>
        </div>
        <div className='ps-grid'>
          <div className='ps-card'>
            <div className='ps-icon-circle'>
              <FaMoneyCheckAlt />
            </div>
            <h3>Salary Processing</h3>
            <p>Accurate payroll for in-house and remote staff.</p>
          </div>
          <div className='ps-card'>
            <div className='ps-icon-circle'>
              <FaFileInvoiceDollar />
            </div>
            <h3>Tax & Compliance</h3>
            <p>Manage TDS, ESI, PF, and statutory filings with ease.</p>
          </div>
          <div className='ps-card'>
            <div className='ps-icon-circle'>
              <FaUserTie />
            </div>
            <h3>Contractor Support</h3>
            <p>Flexible payroll for freelancers and contractors.</p>
          </div>
          <div className='ps-card'>
            <div className='ps-icon-circle'>
              <FaCogs />
            </div>
            <h3>Custom Setup</h3>
            <p>Tailored payroll for startups and SMEs.</p>
          </div>
        </div>
      </section>

      {/* 3. Benefits & CTA */}
      <section className='ps-benefits' id='consultation'>
        <div className='ps-benefits-img'>
          <img
            src='https://images.unsplash.com/photo-1523958203904-cdcb402031fd?q=80&w=1200&auto=format&fit=crop'
            alt='Happy business team'
          />
        </div>
        <div className='ps-benefits-content'>
          <h2>Benefits for Employers</h2>
          <ul>
            <li>Save time, reduce errors</li>
            <li>Stay compliant with labor laws</li>
            <li>Focus on core business</li>
          </ul>

          {/* --- UPDATED: Form is now fully functional --- */}
          <form className='ps-form' onSubmit={handleFormSubmit}>
            <input
              type='text'
              name='name'
              pattern='^[A-Za-z\s]{3,}$'
              placeholder='Your name'
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type='email'
              pattern='^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
              name='email'
              placeholder='Work email'
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type='text'
              name='company'
              pattern='^[A-Za-z\s]{3,}$'
              placeholder='Company'
              value={formData.company}
              onChange={handleInputChange}
              required
            />
            <button
              type='submit'
              className='ps-btn ps-btn-full'
              disabled={isSubmitting}>
              {isSubmitting
                ? 'Submitting...'
                : 'Request Free Payroll Consultation'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default PayrollServices
