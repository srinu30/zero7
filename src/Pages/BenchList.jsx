import React, { useState, useEffect } from 'react'
import api from '../api/axios' // Use your central axios instance
import Pagination from '../Components/Pagination'
import './BenchList.css'

const BenchList = () => {
  const [showForm, setShowForm] = useState(false)
  const [activeStep, setActiveStep] = useState(null); 
  const [stats, setStats] = useState({
    candidates: 0,
    clients: 0,
    placements: 0,
  })
  const [openFAQ, setOpenFAQ] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [placed, setPlaced] = useState([])

  // State for the "Request Info" popup form
  const [requestFormData, setRequestFormData] = useState({
    candidateName: '',
    companyName: '',
    website: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    requirementDetails: '',
    numberOfPositions: 1,
    budget: '',
    notes: '',
  })
  const [isRequesting, setIsRequesting] = useState(false)

  // State for the public "Candidate Enrollment" form
  const [enrollmentFormData, setEnrollmentFormData] = useState({
    name: '',
    contact: '',
    email: '',
    location: '',
    role: '',
    skills: '',
  })
  const [isEnrolling, setIsEnrolling] = useState(false)

  // -------------------------------------------------------------------------
  // VALIDATION HANDLERS
  // -------------------------------------------------------------------------

  // Fixes Bug 6 (10 Digits) & Bug 7 (Alphabets Only)
  const handleEnrollmentChange = (e) => {
    const { name, value } = e.target

    if (name === 'contact') {
      // Allow only numbers and max 10 digits while typing
      if (/^[0-9]*$/.test(value) && value.length <= 10) {
        setEnrollmentFormData({ ...enrollmentFormData, [name]: value })
      }
    } else if (['location', 'role', 'skills', 'name'].includes(name)) {
      // Allow only alphabets and spaces
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setEnrollmentFormData({ ...enrollmentFormData, [name]: value })
      }
    } else {
      setEnrollmentFormData({ ...enrollmentFormData, [name]: value })
    }
  }

  const handleEnrollmentSubmit = async (e) => {
    e.preventDefault()

    // Bug 6 Fix: Strict check for exactly 10 digits on submit
    if (enrollmentFormData.contact.length !== 10) {
      alert('Validation Error: Contact number must be exactly 10 digits.')
      return
    }

    setIsEnrolling(true)
    try {
      await api.post('/candidate-enrollment', enrollmentFormData)
      alert('Enrollment submitted successfully! Our team will get in touch. ✅')
      setEnrollmentFormData({
        name: '',
        contact: '',
        email: '',
        location: '',
        role: '',
        skills: '',
      })
    } catch (error) {
      console.error('Error submitting enrollment:', error)
      const errorMessage = error.response?.data?.message || 'Failed to submit enrollment. Please try again.'
      alert(`Error: ${errorMessage} ❌`)
    } finally {
      setIsEnrolling(false)
    }
  }

  // Fixes Bugs 1, 2, 3, 4, 5

  const handleRequestFormChange = (e) => {
  const { name, value } = e.target

  if (name === 'contactPerson' || name === 'designation') {
    // Allows alphabets and spaces (including leading/trailing spaces)
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setRequestFormData((prev) => ({ ...prev, [name]: value }))
    }
  } 
  
  // New logic for Company Name
  else if (name === 'companyName') {
    // Matches the stricter pattern for Company Name (letters and single internal spaces)
    // You might need a slightly simpler regex if company names can be complex
    // This one enforces letters/spaces similar to contactPerson/designation:
    if (/^[a-zA-Z\s]*$/.test(value)) {
       setRequestFormData((prev) => ({ ...prev, [name]: value }))
    }
    
    // OR, if you want to strictly match the HTML pattern:
    // if (/^[A-Za-z\s]*$/.test(value)) { 
    //    // Further check for leading/trailing spaces if necessary, but this is a start
    // }

  }
  
  // Logic for Phone Number (now includes length check)
  else if (name === 'phone' || name === 'budget' || name === 'numberOfPositions') {
    // Allows numbers only
    if (/^[0-9]*$/.test(value)) {
      
      // For phone, also check if the value length exceeds 10 digits
      if (name === 'phone' && value.length > 10) {
        // Do nothing (don't update state if it goes over 10)
        return
      }
      
      setRequestFormData((prev) => ({ ...prev, [name]: value }))
    }
  } 
  
  // All other fields (e.g., email, website)
  else {
    setRequestFormData((prev) => ({ ...prev, [name]: value }))
  }
}

  const handleRequestSubmit = async (e) => {
    e.preventDefault()
    setIsRequesting(true)
    try {
      const payload = {
        ...requestFormData,
        candidateName: selectedCandidate.name,
      }
      await api.post('/request-info', payload)
      alert('Request submitted successfully! Our team will get back to you shortly.')
      setSelectedCandidate(null)
      setRequestFormData({
        candidateName: '',
        companyName: '',
        website: '',
        contactPerson: '',
        designation: '',
        email: '',
        phone: '',
        requirementDetails: '',
        numberOfPositions: 1,
        budget: '',
        notes: '',
      })
    } catch (err) {
      console.error('Failed to submit request:', err)
      alert('There was an error submitting your request. Please try again.')
    } finally {
      setIsRequesting(false)
    }
  }

  // -------------------------------------------------------------------------
  // PAGINATION & EFFECTS
  // -------------------------------------------------------------------------

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items)
    setCurrentPage(1)
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCandidates = candidates.slice(startIndex, endIndex)

  const fetchPlaced = async () => {
    try {
      const response = await api.get('/interview')
      const placedCandidates = response.data.filter(
        (interview) => interview.status?.toLowerCase() === 'placed'
      )
      setPlaced(placedCandidates)
    } catch (error) {
      console.log('Error fetching placed candidates', error)
    }
  }

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await api.get('/candidates')
        setCandidates(data)
      } catch (error) {
        console.error('Failed to fetch candidates:', error)
      }
    }
    fetchCandidates()
    fetchPlaced()

    let c = 0,
      cl = 0,
      p = 0
    const interval = setInterval(() => {
      c = Math.min(c + 5, 250)
      cl = Math.min(cl + 3, 120)
      p = Math.min(p + 10, 500)
      setStats({ candidates: c, clients: cl, placements: p })
      if (c === 250 && cl === 120 && p === 500) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [])

  const faqs = [
    {
      q: 'What is Bench Marketing?',
      a: 'Bench marketing involves promoting available bench candidates to clients by showcasing their skills, experience, and availability. It includes outreach through calls, emails, and LinkedIn networking to match candidates with open roles. The process focuses on building vendor relationships, understanding market demand, and optimizing resumes for quick submissions. Effective bench marketing helps reduce idle time and improves placement success.',
    },
    {
      q: 'How does Resume Marketing work?',
      a: 'Resume marketing involves promoting a candidate’s profile to hiring managers, vendors, and clients by highlighting their skills, experience, and project expertise. Recruiters distribute the resume through job portals, email outreach, and LinkedIn to match relevant openings. They fine-tune the resume based on market needs and actively follow up with vendors for interview closures. The goal is to secure maximum visibility and quick placement.',
    },
    {
      q: 'Is there any fee involved?',
      a: 'Most staffing companies and consultancies do not charge any upfront fee for resume marketing or placement. They earn through client billing once the candidate is placed, so its typically free for consultants. Some third-party marketing agencies may charge, but this is optional and not required. Always verify terms before signing with any vendor.',
    },
    {
      q: 'How long does it take to get placed?',
      a: 'Placement time varies based on skills, market demand, location, and the quality of the resume. Some candidates get interviews within days, while niche or low-demand skills may take weeks. Active marketing, strong communication skills, and quick response improve placement speed. On average, it may take anywhere from 1 to 6 weeks depending on the profile.'
    },
  ]

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='bench-page'>
      
      {/* 1. TICKER SECTION */}
      <div>
        {placed.length !== 0 && (
          <p>
            🎉 Congratulations:{' '}
            <strong>
              {placed.length > 0
                ? `${placed[0].candidateName} is placed as ${placed[0].jobRole} `
                : ''}
            </strong>
          </p>
        )}
      </div>

      {/* 2. HERO SECTION */}
      <section className='hero-section'>
        <img
          src='./bench-banner.jpg'
          alt='Bench List Banner'
          className='hero-image'
        />
        <div className='overlay'>
          <h1>Zero7 Technologies List</h1>
          <p>
            Building bridges between ambition and opportunity in the new world of work
          </p>
          <button className="view-openings-btn" onClick={() => {
            document.querySelector('.candidates-section').scrollIntoView({ behavior: 'smooth' });
          }}>
            View Openings ↓
          </button>
        </div>
      </section>

      {/* 3. SECOND TICKER */}
      <div>
        {placed.slice(0, 5).map((can) => (
          <span className='mr-12' key={can._id}>
            🎉 Congratulations: {can.candidateName} is placed as {can.jobRole}
          </span>
        ))}
      </div>

      
      {/* 4. STATS SECTION WITH UPDATED IMAGES */}
      <section className='stats-section'>
        
        {/* Card 1: Candidates (KEPT SAME - Team/Collaboration) */}
        <div 
          className='stat-card' 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" }}
        >
          <div className="stat-content">
            <div className="stat-icon">
              <i className="fa fa-users"></i>
            </div>
            <h2>{stats.candidates}+</h2>
            <p>Candidates Available</p>
          </div>
        </div>

        {/* Card 2: Clients (NEW - Skyscrapers/Corporate World) */}
        <div 
          className='stat-card' 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" }}
        >
          <div className="stat-content">
            <div className="stat-icon">
              <i className="fa fa-briefcase"></i>
            </div>
            <h2>{stats.clients}+</h2>
            <p>Clients Served</p>
          </div>
        </div>

       {/* Card 3: Placements (NEW IMAGE - Clear Handshake/Deal) */}
       <div 
          className='stat-card' 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
            backgroundPosition: 'center center' /* Ensures the handshake stays in the middle */
          }}
        >
          <div className="stat-content">
            <div className="stat-icon">
              <i className="fa fa-trophy"></i>
            </div>
            <h2>{stats.placements}+</h2>
            <p>Placements Done</p>
          </div>
        </div>

      </section>
      {/* 5. CANDIDATES TABLE SECTION */}
      <section className='candidates-section'>
        <h2>AVAILABLE CANDIDATES</h2>
        <div className='candidate-table-wrapper'>
          <table className='candidate-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Skills</th>
                <th>Experience</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCandidates.length > 0 ? (
                paginatedCandidates.map((c) => (
                  <tr key={c._id}>
                    <td title={c.name}>{c.name}</td>
                    <td title={c.role}>{c.role}</td>
                    <td>{c.skills}</td>
                    <td>{c.exp} Years</td>
                    <td>{c.location}</td>
                    <td>
                      <button
                        className='bg-gradient-to-tr from-[#0f62fe] to-[#00bfff] text-white p-2 text-sm rounded-xl'
                        onClick={() => setSelectedCandidate(c)}>
                        Request Info
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan='7'
                    style={{ textAlign: 'center', padding: '20px' }}>
                    No candidates available at this time.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {candidates.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={candidates.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[5, 10, 20, 50]}
            />
          )}
        </div>

        {/* --- POPUP REQUEST FORM (With Bug Fixes) --- */}
        {selectedCandidate && (
          <div className='popup-form-overlay'>
            <div className='popup-form'>
              <h2>
                Request Info for <strong>{selectedCandidate.name}</strong>
              </h2>
              <p className="form-subtitle">Please provide your company details to proceed.</p>
              
              <form onSubmit={handleRequestSubmit}>
                
                {/* Bug 1: Company Name Required */}
                <div className='form-group'>
                  <i className='fa fa-building icon-left'></i>

                  <input
                    type='text'
                    name='companyName'
                    placeholder='Company Name'
                    required
                     pattern="[A-Za-z\s]+"
                    value={requestFormData.companyName}
                    onChange={handleRequestFormChange}
                    title="Please enter a valid name (letters and single spaces only, no leading/trailing spaces)"
                  />

                </div>

                <div className='form-group'>
                  <i className='fa fa-globe icon-left'></i>
                  <input
                    type='url'
                    name='website'
                    placeholder='Website / LinkedIn Profile (optional)'
                    value={requestFormData.website}
                    onChange={handleRequestFormChange}

                  />
                </div>

                {/* Bug 2: Contact Person Alphabets Only */}
                <div className='form-group'>
                  <i className='fa fa-user icon-left'></i>
                  <input
                    type='text'
                    name='contactPerson'
                    placeholder='Contact Person Name'
                    required
                    value={requestFormData.contactPerson}
                    onChange={handleRequestFormChange}
                    pattern="[A-Za-z\s]+"
                    title="Please enter a valid name (Alphabets only)"
                  />
                </div>

                {/* Bug 3: Designation Alphabets Only */}
                <div className='form-group'>
                  <i className='fa fa-id-badge icon-left'></i>
                  <input
                    type='text'
                    name='designation'
                    placeholder='Designation / Role'
                    required
                    value={requestFormData.designation}
                    onChange={handleRequestFormChange}
                    pattern="[A-Za-z\s]+"
                    title="Please enter a valid designation (Alphabets only)"
                  />
                </div>

                <div className='form-group'>
                  <i className='fa fa-envelope icon-left'></i>
                  <input
                    type='email'
                    name='email'
                    placeholder='Official Email ID'
                    required
                    value={requestFormData.email}
                    onChange={handleRequestFormChange}
                  />
                </div>

                {/* Bug 4: Phone Numbers Only */}
                <div className='form-group'>
                  <i className='fa fa-phone icon-left'></i>
                  <input
                    type='tel'
                    name='phone'
                    placeholder='Phone Number'
                    required
                    value={requestFormData.phone}
                    onChange={handleRequestFormChange}
                    pattern="^\d{10}$"
                    title="Please enter valid numbers only"
                  />
                </div>

                <div className="form-group">
                  <textarea
                    name='requirementDetails'
                    placeholder='Requirement Details: Skills, Job Location, Mode, etc.'
                    rows='3'
                    required
                    value={requestFormData.requirementDetails}
                    onChange={handleRequestFormChange}></textarea>
                </div>

                <div className='form-row'>
                  <div className='form-group half'>
                    <input
                      type='number'
                      name='numberOfPositions'
                      placeholder='No. of Positions'
                      required
                      min='1'
                      value={requestFormData.numberOfPositions}
                      onChange={handleRequestFormChange}
                    />
                  </div>
                  
                  {/* Bug 5: Budget Numbers Only */}
                  <div className='form-group half'>
                    <input
                      type='text'
                      name='budget'
                      placeholder='Budget / CTC (Numbers Only)'
                      value={requestFormData.budget}
                      onChange={handleRequestFormChange}
                      pattern="[0-9]+"
                      title="Please enter valid numbers only"
                    />
                  </div>
                </div>

                <div className='form-group'>
                  <textarea
                    name='notes'
                    placeholder='Additional Notes / Comments (optional)'
                    rows='2'
                    value={requestFormData.notes}
                    onChange={handleRequestFormChange}></textarea>
                </div>

                <label className='checkbox'>
                  <input type='checkbox' required /> I confirm the details are
                  for genuine hiring purposes.
                </label>

                <div className='form-actions'>
                  <button
                    type='submit'
                    className='btn-gradient'
                    disabled={isRequesting}>
                    {isRequesting ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <button
                    type='button'
                    className='btn-cancel'
                    onClick={() => setSelectedCandidate(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* 6. INFO CARDS (Flip Cards) */}
      <section className='extra-section'>
        <h2>Why Choose Our Bench Program?</h2>
        <div className='info-cards'>
          <div className='flip-card'>
            <div className='flip-card-inner'>
              <div className='flip-card-front'>
                <img src='/faster.jpg' alt='Faster Hiring' />
                <h3>Faster Hiring</h3>
              </div>
              <div className='flip-card-back'>
                <p>
                  Our candidates are pre-screened, ensuring clients save time in
                  recruitment.
                </p>
              </div>
            </div>
          </div>
          <div className='flip-card'>
            <div className='flip-card-inner'>
              <div className='flip-card-front'>
                <img src='/trusted.jpg' alt='Trusted Network' />
                <h3>Trusted Network</h3>
              </div>
              <div className='flip-card-back'>
                <p>
                  Strong tie-ups with MNCs and startups to connect talent with
                  opportunity.
                </p>
              </div>
            </div>
          </div>
          <div className='flip-card'>
            <div className='flip-card-inner'>
              <div className='flip-card-front'>
                <img src='/support.jpg' alt='Support' />
                <h3>End-to-End Support</h3>
              </div>
              <div className='flip-card-back'>
                <p>
                  From resume marketing to interview prep, we guide you at every
                  step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 7. ENROLLMENT FORM (Bug 6 & 7 Fixes) */}
      <section className='form-section'>
        <h2>CANDIDATE ENROLLMENT FORM</h2>
        <form onSubmit={handleEnrollmentSubmit} className='enrollment-form'>
          
          {/* Bug 7: Name Alphabets Only */}
          <input
            type='text'
            name='name'
            placeholder='Your Name'
            value={enrollmentFormData.name}
            onChange={handleEnrollmentChange}
            required
            pattern='^[A-Za-z\s]+$'
            title='Name must contain only alphabets'
          />
          
          {/* Bug 6: Contact Exact 10 Digits */}
          <input
            type="text"
            name="contact"
            placeholder="Contact Number (10 Digits)"
            value={enrollmentFormData.contact}
            onChange={handleEnrollmentChange}
            required
            maxLength={10}
            pattern="[0-9]{10}"
            title="Please enter exactly 10 digits"
          />
          
          <input
            type='email'
            name='email'
            placeholder='Email Address'
            value={enrollmentFormData.email}
            onChange={handleEnrollmentChange}
            required
            pattern='^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            title='Enter a valid email address'
          />
          
          {/* Bug 7: Location Alphabets Only */}
          <input
            type='text'
            name='location'
            placeholder='Your Location'
            value={enrollmentFormData.location}
            onChange={handleEnrollmentChange}
            required
            pattern='^[A-Za-z\s]+$'
            title='Location must contain only alphabets'
          />
          
          {/* Bug 7: Role Alphabets Only */}
          <input
            type='text'
            name='role'
            placeholder='Your Role (e.g., Frontend Developer)'
            value={enrollmentFormData.role}
            onChange={handleEnrollmentChange}
            required
            pattern='^[A-Za-z\s]+$'
            title='Role must contain only alphabets'
          />
          
          {/* Bug 7: Skills Alphabets Only */}
          <input
            type='text'
            name='skills'
            placeholder='Your Skills (e.g., React, Node)'
            value={enrollmentFormData.skills}
            onChange={handleEnrollmentChange}
            required
            pattern='^[A-Za-z\s]+$'
            title='Skills must contain only alphabets'
          />
          
          <button
            className='bg-blue-500 py-3 px-2 text-white rounded-lg'
            type='submit'
            disabled={isEnrolling}>
            {isEnrolling ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </section>

{/* 8. PROCESS SECTION (Icons Fixed) */}
<section className='process-section'>
        <h2>OUR HIRING PROCESS</h2>
        <div className='process-container'>
          
          {/* Step 1: Application */}
          <div 
            className={`process-card ${activeStep === 1 ? 'active' : ''}`}
            onClick={() => setActiveStep(1)}
          >
            <div className='icon-bubble'>
              {/* Fixed Icon: Removed -o */}
              <i className="fa fa-file-text"></i>
            </div>
            <h3>Application</h3>
            <p>Submit your resume & details.</p>
          </div>

          {/* Step 2: Screening */}
          <div 
            className={`process-card ${activeStep === 2 ? 'active' : ''}`}
            onClick={() => setActiveStep(2)}
          >
            <div className='icon-bubble'>
              <i className="fa fa-search"></i>
            </div>
            <h3>Screening</h3>
            <p>We review your profile carefully.</p>
          </div>

          {/* Step 3: Interviews */}
          <div 
            className={`process-card ${activeStep === 3 ? 'active' : ''}`}
            onClick={() => setActiveStep(3)}
          >
            <div className='icon-bubble'>
              {/* Changed Icon: fa-users is more reliable for interviews */}
              <i className="fa fa-users"></i>
            </div>
            <h3>Interviews</h3>
            <p>Technical & HR rounds with clients.</p>
          </div>

          {/* Step 4: Onboarding */}
          <div 
            className={`process-card ${activeStep === 4 ? 'active' : ''}`}
            onClick={() => setActiveStep(4)}
          >
            <div className='icon-bubble'>
              {/* Fixed Icon: Removed -o */}
              <i className="fa fa-check-circle"></i>
            </div>
            <h3>Onboarding</h3>
            <p>Offer release & final placement.</p>
          </div>

        </div>
      </section>
      {/* 9. FAQ SECTION */}
      <section className='faq'>
        <h2>Frequently Asked Questions</h2>
        {faqs.map((f, i) => (
          <div className={`faq-item ${openFAQ === i ? 'open' : ''}`} key={i}>
            <button
              className='faq-question'
              onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
              {f.q} <span>{openFAQ === i ? '−' : '+'}</span>
            </button>
            <div className='faq-answer'>
              <p>{f.a}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 10. MANAGEMENT POPUP */}
      {showForm && (
        <div className='popup-form-overlay'>
          <div className='popup-form'>
            <h2>Connect with Management</h2>
            <form>
              <div className='form-group'>
                <input type='text' placeholder='Your Name' required />
              </div>
              <div className='form-group'>
                <input type='email' placeholder='Your Email' required />
              </div>
              <div className='form-group'>
                <input type='tel' placeholder='Your Contact Number' required />
              </div>
              <div className='form-group'>
                <textarea placeholder='Your Query / Purpose' required></textarea>
              </div>
              <div className='form-actions'>
                <button type='submit' className='btn-gradient'>
                  Submit
                </button>
                <button
                  type='button'
                  onClick={() => setShowForm(false)}
                  className='btn-secondary'>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BenchList
