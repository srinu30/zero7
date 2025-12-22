// File: src/components/CollegeConnect.jsx

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import heroImage from '../assets/clg-cnt.jpg'
import './CollegeConnect.css'
import './CampusHiring.css'
import {
  FiBriefcase,
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiTrendingUp,
  FiLayers,
  FiMapPin,
  FiFileText,
  FiShield,
} from 'react-icons/fi'

// --- MOCKED DATA (remains unchanged) ---
const colleges = [
  {
    title: 'MoU-based Placement Drives',
    copy: 'Structured, year-round drives with transparent reporting and one-point coordination.',
    img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1600&auto=format&fit=crop',
    bullets: [
      'MoU-based placement drives',
      'transparent KPIs & reports',
      'single-point coordination',
    ],
    icon: <FiCalendar aria-hidden='true' />,
  },
  {
    title: 'Industry Exposure & Internships',
    copy: 'Capstone projects, internships, and skill bridges designed with hiring teams.',
    img: '/industry-exposure.jpg',
    bullets: [
      'internships & live projects',
      'industry mentoring',
      'assessment to onboarding',
    ],
    icon: <FiLayers aria-hidden='true' />,
  },
  {
    title: 'Corporate Guest Lectures',
    copy: 'Leaders from industry on campus for tools, stacks, and career paths.',
    img: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?q=80&w=1600&auto=format&fit=crop',
    bullets: [
      'corporate guest lectures',
      'latest tools & stacks',
      'career guidance',
    ],
    icon: <FiUsers aria-hidden='true' />,
  },
]
const companies = [
  {
    title: 'Bulk Fresher Hiring',
    copy: 'High-intent batches from target campuses, filtered to your skill matrix.',
    badge: '2–4 week cycle',
    img: '/bulk.jpg',
    icon: <FiBriefcase aria-hidden='true' />,
  },
  {
    title: 'Pre-Screened Student Batches',
    copy: 'Aptitude, coding, and communication screens before interview day.',
    badge: 'ready to deploy',
    img: '/Batches.jpg',
    icon: <FiTrendingUp aria-hidden='true' />,
  },
  {
    title: 'Custom Recruitment Events',
    copy: 'Pre-screened talent, delivered through custom events.',
    badge: 'tailored events',
    img: '/CRP.jpg',
    icon: <FiCalendar aria-hidden='true' />,
  },
]
const steps = [
  { label: 'campus shortlisting', icon: <FiMapPin aria-hidden='true' /> },
  { label: 'MoU & scheduling', icon: <FiFileText aria-hidden='true' /> },
  {
    label: 'pre-screen & L1 tests',
    icon: <FiCheckCircle aria-hidden='true' />,
  },
  { label: 'interviews & offers', icon: <FiBriefcase aria-hidden='true' /> },
  { label: 'onboarding & MIS', icon: <FiShield aria-hidden='true' /> },
]
const partnerLogos = [
  {
    alt: 'google',
    src: 'https://similarpng.com/_next/image?url=https%3A%2F%2Fimage.similarpng.com%2Ffile%2Fsimilarpng%2Fvery-thumbnail%2F2020%2F06%2FLogo-google-icon-PNG.png&w=3840&q=75',
  },
  {
    alt: 'microsoft',
    src: 'https://img.icons8.com/color/480/microsoft.png',
  },
  {
    alt: 'ibm',
    src: 'https://www.ibm.com/brand/experience-guides/developer/b1db1ae501d522a1a4b49613fe07c9f1/01_8-bar-positive.svg',
  },
  { alt: 'amazon',
    src: 'https://img.icons8.com/color/480/amazon.png', },
  {
    alt: 'adobe',
    src: 'https://1000logos.net/wp-content/uploads/2021/04/Adobe-logo.png',
  },   
]

// --- VALIDATION FUNCTION ---
const validateForm = (data) => {
    const errors = {};
    const namePattern = /^[A-Za-z\s]{3,}$/;
    const phonePattern = /^[0-9]{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!data.collegeName || !namePattern.test(data.collegeName.trim())) {
        errors.collegeName = 'College name must contain only letters and spaces (min 3 characters).';
    }
    
    if (!data.contactPerson || !namePattern.test(data.contactPerson.trim())) {
        errors.contactPerson = 'Contact Person name must contain only letters and spaces (min 3 characters).';
    }

    if (!data.email || !emailPattern.test(data.email.trim())) {
        errors.email = 'Please enter a valid email address.';
    }

    if (!data.phone || !phonePattern.test(data.phone.trim())) {
        errors.phone = 'Phone number must be exactly 10 digits.';
    }

    if (!data.proposalType) {
        errors.proposalType = 'Proposal Type is required.';
    }

    if (!data.message || data.message.trim().length < 10) {
        errors.message = 'Message is required (min 10 characters).';
    }

    return errors;
};
// --- END VALIDATION FUNCTION ---

// --- VIEW ---
const CollegeConnect = () => {
  const navigate = useNavigate()
  const handleContactRedirect = () => navigate('/contact')

  // --- FORM STATE AND HANDLERS ---
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
  const initialFormState = {
    collegeName: '',
    contactPerson: '',
    email: '',
    phone: '',
    proposalType: '',
    message: '',
  }
  const [formData, setFormData] = useState(initialFormState)
  const [statusMessage, setStatusMessage] = useState('')
  const [errors, setErrors] = useState({}) // NEW: Errors state

  const handleChange = (e) => {
    const { name, value } = e.target
    let newValue = value;
    
    // INLINE FILTERING for name fields
    if (name === 'collegeName' || name === 'contactPerson') {
        // Allow only letters and spaces
        newValue = value.replace(/[^A-Za-z\s]/g, '');
    }
    
    // INLINE FILTERING for phone
    if (name === 'phone') {
        // Allow only digits, max 10
        newValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    }
    
    setFormData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }))
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on input
  }
  
  const handleBlur = (e) => {
    const validationErrors = validateForm(formData);
    setErrors(prev => ({ ...prev, [e.target.name]: validationErrors[e.target.name] || '' }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
        setStatusMessage('Validation failed. Please check the fields.');
        setTimeout(() => setStatusMessage(''), 5000);
        return;
    }

    setStatusMessage('Submitting...')
    try {
      await axios.post(`${API_URL}/college-proposals`, formData)
      setStatusMessage('Proposal submitted successfully! We will contact you soon.')
      setFormData(initialFormState) // Reset form
      setErrors({}); // Clear errors
      setTimeout(() => setStatusMessage(''), 5000)
    } catch (error) {
      setStatusMessage('Failed to submit proposal. Please try again.')
      console.error('Submission error:', error)
      setTimeout(() => setStatusMessage(''), 5000)
    }
  }

  // --- JSX rendering starts here ---
  return (
    <div className='college-connect'>
      {/* Hero Section */}
      <section
        className='hero'
        style={{ backgroundImage: `url(${heroImage})` }}>
        <div className='hero-overlay'>
          <h1>Welcome to College Connect</h1>
          <p>Empowering Students with Opportunities for a brighter future.</p>
          <a href='#proposal-form' className='btn-primary'>
            Get Started
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className='about'>
        <h2>About College Connect</h2>
        <p>
          College Connect is a platform designed to empower students by
          providing access to internships, training programs, workshops, and
          placement opportunities. We collaborate with colleges and universities
          to create a direct connection between academic learning and industry
          needs.
        </p>
      </section>

      {/* KEY FEATURES */}
      <section className='features'>
        <h2>Key Features</h2>
        <div className='feature-grid'>
          <div className='feature-card'>
            <h3>Internships</h3>
            <p>
              Hands-on opportunities to gain real-world industry experience.
            </p>
          </div>
          <div className='feature-card'>
            <h3>Training Programs</h3>
            <p>Specialized sessions to enhance skills and career readiness.</p>
          </div>
          <div className='feature-card'>
            <h3>Workshops</h3>
            <p>Interactive workshops conducted by industry experts.</p>
          </div>
          <div className='feature-card'>
            <h3>Placements</h3>
            <p>Connecting students with companies for their career growth.</p>
          </div>
        </div>
      </section>

      {/* Other sections (For Colleges, For Companies, Process, Logos) remain unchanged */}
      <section
        className='campus-section'
        aria-labelledby='campus-colleges-title'>
        <h2 id='campus-colleges-title' className='campus-section-title'>
          For Colleges
        </h2>
        <div className='campus-card-grid'>
          {colleges.map((c, i) => (
            <article className='campus-card' key={i} aria-label={c.title}>
              <div
                className='campus-card-media'
                role='img'
                aria-label={`${c.title} image`}
                style={{ backgroundImage: `url(${c.img})` }}
              />
              <div className='campus-card-body'>
                <div className='campus-card-icon'>{c.icon}</div>
                <h3 className='campus-card-title'>{c.title}</h3>
                <p className='campus-card-copy'>{c.copy}</p>
                <ul className='campus-card-checks'>
                  {c.bullets.map((b, j) => (
                    <li key={j}>
                      <FiCheckCircle /> <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <a href='#proposal-form' className='campus-link'>
                  Talk to Campus Team →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className='campus-section'
        aria-labelledby='campus-companies-title'>
        <h2 id='campus-companies-title' className='campus-section-title'>
          For Companies
        </h2>
        <div className='campus-card-grid'>
          {companies.map((c, i) => (
            <article className='campus-card' key={i} aria-label={c.title}>
              <div
                className='campus-card-media'
                role='img'
                aria-label={`${c.title} image`}
                style={{ backgroundImage: `url(${c.img})` }}
              />
              <div className='campus-card-body'>
                <div className='campus-card-top'>
                  <div className='campus-card-icon'>{c.icon}</div>
                  <span className='campus-badge-chip'>{c.badge}</span>
                </div>
                <h3 className='campus-card-title'>{c.title}</h3>
                <p className='campus-card-copy'>{c.copy}</p>
                <a
                  className='campus-link'
                  onClick={(e) => {
                    e.preventDefault()
                    navigate('/contact')
                  }}
                  style={{ cursor: 'pointer' }}>
                  Request Profiles →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className='campus-process'
        aria-labelledby='campus-process-title'>
        <h2 id='campus-process-title' className='campus-process-title'>
          How a Drive Works
        </h2>
        <ol className='campus-timeline'>
          {steps.map((s, i) => (
            <li key={i} className='campus-timeline-step'>
              <div className='campus-timeline-node'>{s.icon}</div>
              <p className='campus-timeline-label'>{s.label}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className='campus-logos' aria-label='partner company logos'>
        <div className='marquee-viewport'>
          <div className='marquee-track marquee-right'>
            {[
              ...partnerLogos,
              ...partnerLogos,
              ...partnerLogos,
              ...partnerLogos,
              ...partnerLogos,
            ].map((logo, i) => (
              <div className='marquee-logo' key={i}>
                <img
                  className='marquee-logo-img'
                  src={logo.src}
                  alt={logo.alt}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GET CONNECTED */}
      <section className='get-connected'>
        <h2>Get Connected</h2>
        <p>
          Want to collaborate with us? Reach out today and let’s build a future
          together.
        </p>
        <button onClick={handleContactRedirect} className='btn-secondary'>
          Contact Us
        </button>
      </section>

      {/* PROPOSAL FORM */}
      <section className='proposal-form' id='proposal-form'>
        <h2>College to Company Proposal Form</h2>
        <form onSubmit={handleSubmit}>
          
          {/* 1. College Name */}
          <div className='form-group'>
            <label htmlFor='collegeName'>College Name</label>
            <input
              type='text'
              id='collegeName'
              name='collegeName'
              placeholder='Enter your college name'
              value={formData.collegeName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={errors.collegeName ? 'input-error' : ''}
            />
            {errors.collegeName && <p className='error-text'>{errors.collegeName}</p>}
          </div>
          
          {/* 2. Contact Person */}
          <div className='form-group'>
            <label htmlFor='contactPerson'>Contact Person</label>
            <input
              type='text'
              id='contactPerson'
              name='contactPerson'
              placeholder='Enter contact person name'
              value={formData.contactPerson}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={errors.contactPerson ? 'input-error' : ''}
            />
            {errors.contactPerson && <p className='error-text'>{errors.contactPerson}</p>}
          </div>
          
          {/* 3. Email */}
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <p className='error-text'>{errors.email}</p>}
          </div>
          
          {/* 4. Phone */}
          <div className='form-group'>
            <label htmlFor='phone'>Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter 10-digit phone number"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={10}
              required
              className={errors.phone ? 'input-error' : ''}
            />
            {errors.phone && <p className='error-text'>{errors.phone}</p>}
          </div>
          
          {/* 5. Proposal Type */}
          <div className='form-group'>
            <label htmlFor='proposalType'>Proposal Type</label>
            <select
              id='proposalType'
              name='proposalType'
              value={formData.proposalType}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={errors.proposalType ? 'input-error' : ''}>
              <option value=''>-- Select --</option>
              <option value='Placements'>Placements</option>
              <option value='Technologies'>Technologies</option>
              <option value='Internships'>Internships</option>
              <option value='Other'>Other</option>
            </select>
            {errors.proposalType && <p className='error-text'>{errors.proposalType}</p>}
          </div>
          
          {/* 6. Message */}
          <div className='form-group'>
            <label htmlFor='message'>Message</label>
            <textarea
              id='message'
              name='message'
              placeholder='Write your proposal...'
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              rows="4"
              className={errors.message ? 'input-error' : ''}
            ></textarea>
            {errors.message && <p className='error-text'>{errors.message}</p>}
          </div>
          
          <button type='submit' className='btn-primary'>
            Submit Proposal
          </button>
          {statusMessage && <p className='status-message'>{statusMessage}</p>}
        </form>
      </section>
    </div>
  )
}

export default CollegeConnect
