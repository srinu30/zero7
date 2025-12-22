import React, { useState } from 'react'
import axios from 'axios'
import {
  FaCheckCircle,
  FaRocket,
  FaUserCheck,
  FaBuilding,
  FaChalkboardTeacher,
  FaUsersCog,
  FaUserTie,
  FaFileAlt,
  FaUniversity,
} from 'react-icons/fa'
import './Context.css'
import teamc from '../assets/teamc.jpg'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

export default function Context() {
  // State for popup form
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    purpose: '',
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post(`${API_URL}/forms`, formData)
      // Reset form
      setFormData({ name: '', number: '', email: '', purpose: '' })
      setShowForm(false)

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (err) {
      console.error('❌ Error submitting form:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='context-wrapper'>
      <div className='intro'>
        <h1>Igniting Careers. Empowering Businesses. Transforming Futures.</h1>
        <p className='subheading'>
          At Zero7 Technologies, we're dedicated to bridging the gap between
          talent and opportunity. Founded in 2025, our mission is to empower job
          seekers, professionals with career gaps, and those looking to
          transition into new fields by equipping them with the skills and
          support they need to thrive. We are your all-in-one solution for
          career advancement and talent acquisition.
        </p>
      </div>

      {/* Image Row with Flip Effect */}
      <div className='image-row'>
        <div
          className='flip-card'
          onClick={(e) => e.currentTarget.classList.toggle('is-flipped')}>
          <div className='flip-card-inner'>
            <div className='flip-card-front'>
              <img src={teamc} alt='Team collaboration' />
            </div>
            <div className='flip-card-back'>
              <h3>Team Collaboration</h3>
              <p>
                We believe teamwork is the foundation of success, driving
                creativity and innovation together.
              </p>
            </div>
          </div>
        </div>

        <div
          className='flip-card'
          onClick={(e) => e.currentTarget.classList.toggle('is-flipped')}>
          <div className='flip-card-inner'>
            <div className='flip-card-front'>
              <img src='/training.jpeg' alt='Training session' />
            </div>
            <div className='flip-card-back'>
              <h3>Training Programs</h3>
              <p>
                We provide world-class training sessions to empower individuals
                with new-age skills.
              </p>
            </div>
          </div>
        </div>

        <div
          className='flip-card'
          onClick={(e) => e.currentTarget.classList.toggle('is-flipped')}>
          <div className='flip-card-inner'>
            <div className='flip-card-front'>
              <img src='/growth.jpg' alt='Career growth' />
            </div>
            <div className='flip-card-back'>
              <h3>Career Growth</h3>
              <p>
                We create opportunities for continuous career growth and
                future-ready development.
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2 className='section-title'>What We Offer</h2>

      {/* Services Section */}
      <div className='service-grid'>
        <div className='service-card'>
          <div className='icon-box'>
            <FaChalkboardTeacher />
          </div>
          <h3>Industry-Focused Training Programs</h3>
          <ul>
            <li>IT & Non-IT Courses with industry experts</li>
            <li>Hands-on Projects and real-world scenarios</li>
            <li>100% Placement Support with our partner network</li>
            <li>Certification guidance and exam preparation</li>
            <li>Continuous learning and skill upgrade paths</li>
          </ul>
        </div>

        <div className='service-card'>
          <div className='icon-box'>
            <FaUsersCog />
          </div>
          <h3>Payroll and Staffing Services</h3>
          <ul>
            <li>Hassle-free payroll management for companies of all sizes</li>
            <li>Contractor payment support and compliance management</li>
            <li>Flexible staffing solutions for project-based needs</li>
            <li>Employee benefits administration</li>
            <li>Multi-state payroll tax compliance</li>
          </ul>
        </div>

        <div className='service-card'>
          <div className='icon-box'>
            <FaUserTie />
          </div>
          <h3>Job-Ready Support</h3>
          <ul>
            <li>Bench Recruitment for immediate placement</li>
            <li>Resume Marketing to top employers</li>
            <li>Interview Preparation with mock sessions</li>
            <li>Career counseling and path guidance</li>
            <li>Soft skills and communication training</li>
          </ul>
        </div>

        <div className='service-card'>
          <div className='icon-box'>
            <FaUniversity />
          </div>
          <h3>Campus Hiring Drives</h3>
          <ul>
            <li>College Collaborations for talent pipeline</li>
            <li>Bulk Hiring Campaigns for large organizations</li>
            <li>Internship-to-Hire Programs for experience and evaluation</li>
            <li>Career fair organization and management</li>
            <li>Industry-academia partnership programs</li>
          </ul>
        </div>

        <div className='service-card'>
          <div className='icon-box'>
            <FaFileAlt />
          </div>
          <h3>Resume Marketing Services</h3>
          <ul>
            <li>Professional resume creation tailored to your target roles</li>
            <li>Resume distribution across leading job portals</li>
            <li>Keyword optimization for better ATS visibility</li>
            <li>Customized cover letters for impactful applications</li>
            <li>Personalized guidance to improve job search results</li>
          </ul>
        </div>

        <div className='service-card'>
          <div className='icon-box'>
            <FaUniversity />
          </div>
          <h3>College Connect</h3>
          <ul>
            <li>
              Bridging the gap between students and industry opportunities
            </li>
            <li>Campus recruitment drives and placement support</li>
            <li>Skill development workshops and career guidance</li>
            <li>Internship programs with top companies</li>
            <li>Networking sessions with industry experts</li>
          </ul>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='why-choose-us'>
        <h2 className='section-title'>Why Choose Us</h2>
        <div className='features-grid'>
          <div className='feature-card'>
            <div className='feature-icon'>
              <FaRocket />
            </div>
            <h3>Placement-Driven Approach</h3>
            <ul>
              <li>
                <FaCheckCircle /> Dedicated placement cell
              </li>
              <li>
                <FaCheckCircle /> 300+ recruiter network
              </li>
              <li>
                <FaCheckCircle /> Weekly interview opportunities
              </li>
              <li>
                <FaCheckCircle /> Personalized career roadmap
              </li>
              <li>
                <FaCheckCircle /> Post-placement support
              </li>
            </ul>
          </div>

          <div className='feature-card'>
            <div className='feature-icon'>
              <FaUserCheck />
            </div>
            <h3>Real-Time Projects & Expert Mentorship</h3>
            <ul>
              <li>
                <FaCheckCircle /> Project-based training
              </li>
              <li>
                <FaCheckCircle /> Corporate trainers with{' '}
              </li>
              <li>
                <FaCheckCircle /> Industry-relevant curriculum
              </li>
              <li>
                <FaCheckCircle /> One-on-one mentorship sessions
              </li>
              <li>
                <FaCheckCircle /> Portfolio development guidance
              </li>
            </ul>
          </div>

          <div className='feature-card'>
            <div className='feature-icon'>
              <FaBuilding />
            </div>
            <h3>Trusted by Companies & Colleges</h3>
            <ul>
              <li>
                <FaCheckCircle /> Partnerships with 50+ institutions
              </li>
              <li>
                <FaCheckCircle /> Corporate tie-ups across IT & Non-IT
              </li>
              <li>
                <FaCheckCircle /> Proven track record of success
              </li>
              <li>
                <FaCheckCircle /> Industry recognition and awards
              </li>
              <li>
                <FaCheckCircle /> Long-standing reputation
              </li>
            </ul>
          </div>
        </div>

        {/* Career Consultation Button + Popup */}
        {/* <div className='career-consultation'>
          <h3>Ready to Transform Your Career?</h3>
          <p>Schedule a free consultation with our career experts</p>
          <button
            className='btn-primary btn-large'
            onClick={() => setShowForm(true)}>
            <FaRocket /> Schedule Free Career Consultation
          </button>
        </div> */}

        {/* ✅ Success Notification */}
        {/* {showSuccess && (
          <div className='success-message'>
            🎉 Your consultation request has been submitted successfully! Our
            team will contact you soon.
          </div>
        )} */}

        {/* Popup Form */}
        {/* {showForm && (
          <div className='popup-form-overlay'>
            <div className='popup-form'>
              <h2>Free Career Consultation</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type='text'
                  name='name'
                  placeholder='Your Name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type='tel'
                  name='number'
                  placeholder='Your Number'
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
                <input
                  type='email'
                  name='email'
                  placeholder='Your Email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name='purpose'
                  placeholder='Purpose of Consultation'
                  value={formData.purpose}
                  onChange={handleChange}
                  required></textarea>

                <div className='form-actions'>
                  <button
                    type='submit'
                    className='btn-primary'
                    disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    type='button'
                    className='btn-secondary'
                    onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )} */}
      </div>

      {/* Testimonials */}
      <div className='testimonial-section'>
        <h2 className='section-title'>Success Stories</h2>
        <p className='section-subtitle'>
          Hear from our candidates and partners about their experiences
        </p>

        <div className='testimonial-grid'>
          {/* Testimonial 1 */}
          <div className='testimonial-card' style={{ animationDelay: '0.1s' }}>
            <div className='testimonial-image'>
              <img src='https://i.postimg.cc/FKrqsthG/IMG-20251018-131705.jpg' alt='Manikraj' />
              <div className='quote-icon'>"</div>
            </div>
            <div className='testimonial-content'>
              <p className='testimonial-text'>
                Manikraj, CEO of Eden Software Consulting, brings visionary leadership and deep industry expertise to every project his team undertakes
              </p>
              <div className='testimonial-author'>
                <span className='testimonial-name'>Manikraj</span>
                <span className='testimonial-role'>
                  CEO
                </span>
              </div>
              <div className='testimonial-rating'>
                {Array(5)
                  .fill()
                  .map((_, i) => (
                    <span key={i} className='star'>
                      ★
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className='testimonial-card' style={{ animationDelay: '0.2s' }}>
            <div className='testimonial-image'>
              <img src='https://i.postimg.cc/L8bfhLpL/IMG-20251018-132027.jpg' alt='Vindhya' />
              <div className='quote-icon'>"</div>
            </div>
            <div className='testimonial-content'>
              <p className='testimonial-text'>
                As a hiring manager, I've found their pre-screened candidates to
                be exceptionally well-prepared. It's cut our recruitment time by
                half.
              </p>
              <div className='testimonial-author'>
                <span className='testimonial-name'>Vindhya</span>
                <span className='testimonial-role'>
                  HR Director
                </span>
              </div>
              <div className='testimonial-rating'>
                {Array(5)
                  .fill()
                  .map((_, i) => (
                    <span key={i} className='star'>
                      ★
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className='testimonial-card' style={{ animationDelay: '0.3s' }}>
            <div className='testimonial-image'>
              <img
                src='https://i.postimg.cc/L5Sqds3s/IMG-20251018-122137.jpg'
                alt='Arjun Kapoor'
              />
              <div className='quote-icon'>"</div>
            </div>
            <div className='testimonial-content'>
              <p className='testimonial-text'>
                With the expert guidance of our AI/ML trainer, Sri Devi, students were able to master complex concepts and build real-world projects with confidence.
              </p>
              <div className='testimonial-author'>
                <span className='testimonial-name'>Sridevi</span>
                <span className='testimonial-role'>
                  AIML
                </span>
              </div>
              <div className='testimonial-rating'>
                {Array(4)
                  .fill()
                  .map((_, i) => (
                    <span key={i} className='star'>
                      ★
                    </span>
                  ))}
                <span className='star'>☆</span>
              </div>
            </div>
          </div>

          {/* Testimonial 4 */}
          <div className='testimonial-card' style={{ animationDelay: '0.3s' }}>
            <div className='testimonial-image'>
              <img
                src='https://i.postimg.cc/CKDLFg13/IMG-20251018-122331.jpg'
                alt='Arjun Kapoor'
              />
              <div className='quote-icon'>"</div>
            </div>
            <div className='testimonial-content'>
              <p className='testimonial-text'>
                With the expert guidance of our Data Analytics trainer,students developed strong skills in data analysis, visualization, and tools like Excel and SQL.
              </p>
              <div className='testimonial-author'>
                <span className='testimonial-name'>Swetha</span>
                <span className='testimonial-role'>
                  Data Analytics
                </span>
              </div>
              <div className='testimonial-rating'>
                {Array(4)
                  .fill()
                  .map((_, i) => (
                    <span key={i} className='star'>
                      ★
                    </span>
                  ))}
                <span className='star'>☆</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
