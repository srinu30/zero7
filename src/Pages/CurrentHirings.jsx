import React, { useState, useEffect, useRef } from 'react'
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useSpring 
} from 'framer-motion'
import api from '../api/axios' 
import Pagination from '../Components/Pagination'
import {
  Briefcase, User, Phone, Mail, MapPin, FileText,
  Clock, IndianRupee, ArrowDownCircle, Search, CheckCircle, X,
  ChevronRight, Sparkles
} from 'lucide-react'
import './CurrentHirings.css'

// --- MAGNETIC BUTTON COMPONENT ---
const MagneticButton = ({ children, onClick }) => {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
  const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const center = { x: left + width / 2, y: top + height / 2 }
    const distance = { x: clientX - center.x, y: clientY - center.y }
    
    x.set(distance.x * 0.35)
    y.set(distance.y * 0.35)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.button
      ref={ref}
      className="cta-button magnetic-btn"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}

const CurrentHirings = () => {
  // --- STATE ---
  const [jobPositions, setJobPositions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Form & Modal
  const [applyData, setApplyData] = useState({
    name: '', contact: '', email: '', experience: '',
    currentSalary: '', expectedSalary: '', location: '', resume: '',
  })
  const [showModal, setShowModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const jobsSectionRef = useRef(null)

  const scrollToJobs = () => {
    jobsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // --- API CALL ---
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/jobs')
        const sortedJobs = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )
        setJobPositions(sortedJobs)
      } catch (err) {
        console.error('Error fetching jobs:', err)
        setError('Could not load job listings.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchJobs()
  }, [])

  // --- HANDLERS ---
  const handleApplyClick = (job) => { setSelectedJob(job); setShowModal(true); }
  const handleCloseModal = () => { setShowModal(false); setTimeout(() => setSelectedJob(null), 300); }

  // const handleApplyChange = (e) => { const { name, value } = e.target;

  // let newValue = value;

  // if (name === 'name' || name === 'location') {
  //   // Allows letters and spaces (regex: ^[a-zA-Z\s]*$)
  //   if (!/^[a-zA-Z\s]*$/.test(value)) {
  //     return; // Do not update state if invalid character is typed
  //   }
  // }

  // if (name === 'contact') {
  //   // Allows only digits (regex: /^\d*$/)
  //   if (!/^\d*$/.test(value)) {
  //     return;
  //   }
   
  //   if (value.length > 10) {
  //     newValue = value.slice(0, 10); 
  //   }
  // }

  // if (name === 'experience' || name === 'currentSalary' || name === 'expectedSalary') {
  //   if (!/^\d*\.?\d*$/.test(value)) {
  //     return;
  //   }
  // }

  // setApplyData((prev) => ({ ...prev, [name]: value })); }
  const handleApplyChange = (e) => {
  const { name, value } = e.target;
  let newValue = value; 

  // 1. Validation for Name (Letters and Spaces only)
  if (name === 'name') {
    // Allows letters and spaces only
    if (!/^[a-zA-Z\s]*$/.test(value)) {
      return; 
    }
  }

  // 2. Validation for Contact Number (Exactly 10 Digits only)
  if (name === 'contact') {
    // Allows only digits to be typed
    if (!/^\d*$/.test(value)) {
      return; 
    }
    // Enforce max length of 10 digits
    if (value.length > 10) {
      newValue = value.slice(0, 10); // Truncate value to 10 characters
    }
  }

  // 3. Validation for Experience (Numbers, Decimal, and letters like 'yrs', 'years')
  if (name === 'experience') {
    // Allows: numbers, decimal points, letters (a-z, A-Z), and spaces. 
    // This supports inputs like '5', '5.5', '5.5 years', or '5 yrs'.
    if (!/^[a-zA-Z0-9\s.\-]*$/.test(value)) { 
      return; 
    }
  }

  // 4. Validation for Location (Letters, Spaces, Commas, Hyphens, and Numbers for addresses)
  // Location is typically flexible, so we use a permissive check to allow
  // letters, spaces, commas, and numbers for city names, pin codes, etc.
  if (name === 'location') {
    if (!/^[a-zA-Z0-9\s,\-\/]*$/.test(value)) {
      return; 
    }
  }

  // 5. Validation for Salary Fields (Numbers and optional one decimal point/comma)
  if (name === 'currentSalary' || name === 'expectedSalary') {
    // Allows digits, period/dot, and comma. 
    // This allows formats like 30000, 3.5, or 3,50,000.
    if (!/^\d*[,.\d]*$/.test(value)) {
      return; 
    }
  }
  
  // 6. All other fields (email, resume) are handled by the browser's input type checks (type="email", type="url")
  // and do not need real-time character input restriction.

  // Final update to state
  setApplyData((prev) => ({ ...prev, [name]: newValue }));
};
  

  const handleApplySubmit = async (e) => {
    e.preventDefault(); setIsSubmitting(true);
    if (!selectedJob || !applyData.resume) { alert('Please provide a link to your resume.'); setIsSubmitting(false); return; }
    try {
      const posted = await api.post('/applications', { ...applyData, jobId: selectedJob._id });
      alert(`${posted.data.message}`);
      setApplyData({ name: '', contact: '', email: '', experience: '', currentSalary: '', expectedSalary: '', location: '', resume: '' });
      handleCloseModal();
    } catch (error) { alert('Error submitting application. Please try again.'); } finally { setIsSubmitting(false); }
  }

  const daysAgo = (dateString) => {
    const posted = new Date(dateString)
    const diffDays = Math.floor((new Date() - posted) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return '1 day ago'
    return `${diffDays} days ago`
  }

  const handlePageChange = (page) => { setCurrentPage(page) }
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedJobs = jobPositions.slice(startIndex, startIndex + itemsPerPage)

  // --- ANIMATIONS ---
  const slideInLeft = { hidden: { x: -200, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 50, damping: 20, duration: 1 } } }
  const slideInRight = { hidden: { x: 200, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 50, damping: 20, duration: 1 } } }
  const slideInUp = { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut", delay: 0.5 } } }

  // --- DATA FOR PROCESS SECTION ---
  const processSteps = [
    { 
      id: "01", 
      title: "Application", 
      icon: <FileText size={28}/>, 
      desc: "Begin your journey by submitting your resume. We look for passion, technical excellence, and the potential to innovate." 
    },
    { 
      id: "02", 
      title: "Screening", 
      icon: <Search size={28}/>, 
      desc: "Our talent team reviews your profile. Shortlisted candidates undergo a technical assessment and a cultural fit discussion." 
    },
    { 
      id: "03", 
      title: "Onboarding", 
      icon: <CheckCircle size={28}/>, 
      desc: "Receive an offer and a warm welcome! We ensure a seamless integration into your new team with full mentorship support." 
    }
  ];

  return (
    <div className="modern-hiring-page">
      
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text-container">
            <h1 className="hero-title">
              <motion.span variants={slideInLeft} initial="hidden" animate="visible" className="title-part">Zero7</motion.span>
              {" "}
              <motion.span variants={slideInRight} initial="hidden" animate="visible" className="title-part">Technologies</motion.span>
            </h1>
            <motion.p variants={slideInUp} initial="hidden" animate="visible" className="hero-subtitle">
              Building bridges between ambition and opportunity in the new world of work
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1 } }} style={{ marginTop: '40px' }}>
              <MagneticButton onClick={scrollToJobs}>
                View Openings <ArrowDownCircle size={18} />
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. INTRO SECTION */}
      <section className="intro-section">
        <motion.div 
          className="intro-container"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="pill-label">
            <Sparkles size={20} className="sparkle-icon"/> WE ARE HIRING!
          </div>
          <h2 className="intro-text">
            At Zero7 Technologies, we connect professionals with top companies. <br />
            Explore our open positions and apply.
          </h2>
        </motion.div>
      </section>

      {/* 3. PREMIUM PROCESS SECTION */}
      <section className="process-section">
        <div className="section-header">
          <h2 className="serif-title">OUR HIRING PROCESS</h2>
          <div className="title-underline"></div>
        </div>
        
        {/* Connecting Line Container */}
        <div className="process-container">
          <div className="connecting-line"></div>
          
          <div className="process-grid">
            {processSteps.map((step, i) => (
              <motion.div 
                key={i} 
                className="process-card-wrapper"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.2, type: "spring", stiffness: 50 }}
              >
                <motion.div 
                  className="process-card"
                  whileHover={{ 
                    y: -15, 
                    boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)" 
                  }}
                >
                  <div className="card-gradient-overlay"></div>
                  
                  {/* Huge Number */}
                  <div className="big-number">{step.id}</div>
                  
                  <motion.div 
                    className="icon-circle"
                    whileHover={{ scale: 1.1, rotate: 10, backgroundColor: "#3b82f6", color: "#fff" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {step.icon}
                  </motion.div>
                  
                  <div className="card-content">
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </motion.div>
                
                {/* Dot on the line */}
                <div className="timeline-dot"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. JOBS SECTION */}
      <section className="jobs-section" ref={jobsSectionRef}>
        <div className="container">
          <div className="jobs-header">
            <h2>Available Positions</h2>
            <p>Find your next big opportunity below.</p>
          </div>

          {isLoading ? (
            <div className="loading-state">Loading positions...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : (
            <div className="table-container glass-panel">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Posted</th>
                    <th>Role</th>
                    <th>Industry</th>
                    <th>Experience</th>
                    <th>Skills</th>
                    <th>Salary</th>
                    <th>Location</th>
                    <th className="align-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedJobs.length > 0 ? paginatedJobs.map((job) => (
                    <tr key={job._id} className="job-row">
                      <td>
                        <div className="role-cell">
                          <span className="time-badge">{daysAgo(job.createdAt)}</span>
                        </div>
                      </td>
                      <td className="font-medium">{job.role}</td>
                      <td>{job.industry || 'N/A'}</td>
                      <td>{job.exp}</td>
                      <td className="skills-cell">{job.skills}</td>
                      <td>{job.salary}</td>
                      <td>{job.location}</td>
                      <td className="align-right">
                        <button 
                          className="action-btn btn-apply"
                          onClick={() => handleApplyClick(job)}
                        >
                          Apply
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="8" className="no-data">No jobs available right now.</td></tr>
                  )}
                </tbody>
              </table>
              <div className="pagination-wrapper">
                 <Pagination
                    currentPage={currentPage}
                    totalItems={jobPositions.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={setItemsPerPage}
                    itemsPerPageOptions={[5, 10, 20]}
                  />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* POPUP MODAL */}
      <AnimatePresence>
        {showModal && selectedJob && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1, transition: { type: 'spring', damping: 25 } }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
            >
              <div className="modal-header">
                <div className="modal-title-wrap">
                  <Briefcase size={20} className="text-primary"/>
                  <div>
                    <h3 className="modal-title">Apply for {selectedJob.role}</h3>
                    <p className="modal-subtitle">Share your details below</p>
                  </div>
                </div>
                <button className="close-icon-btn" onClick={handleCloseModal}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleApplySubmit} className="modal-form">
                <div className="grid-form">
                  <div className="input-wrap"><User size={18} className="input-icon"/><input type="text" name="name" placeholder="Your Name" value={applyData.name} onChange={handleApplyChange} required/></div>
                  <div className="input-wrap"><Phone size={18} className="input-icon"/><input type="tel" name="contact" placeholder="Contact Number" value={applyData.contact} onChange={handleApplyChange} required/></div>
                  <div className="input-wrap"><Mail size={18} className="input-icon"/><input type="email" name="email" placeholder="Email Address" value={applyData.email} onChange={handleApplyChange} required/></div>
                  <div className="input-wrap"><Clock size={18} className="input-icon"/><input type="text" name="experience" placeholder="Experience (in years)" value={applyData.experience} onChange={handleApplyChange} required/></div>
                  <div className="input-wrap"><IndianRupee size={18} className="input-icon"/><input type="text" name="currentSalary" placeholder="Current Salary (Optional)" value={applyData.currentSalary} onChange={handleApplyChange}/></div>
                  <div className="input-wrap"><IndianRupee size={18} className="input-icon"/><input type="text" name="expectedSalary" placeholder="Expected Salary (Optional)" value={applyData.expectedSalary} onChange={handleApplyChange}/></div>
                  <div className="input-wrap full"><MapPin size={18} className="input-icon"/><input type="text" name="location" placeholder="Your Location" value={applyData.location} onChange={handleApplyChange} required/></div>
                  <div className="input-wrap full"><FileText size={18} className="input-icon"/><input type="url" name="resume" placeholder="Paste link to your Resume (e.g., Google Drive)" value={applyData.resume} onChange={handleApplyChange} required/></div>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Application'}</button>
                  <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CurrentHirings
