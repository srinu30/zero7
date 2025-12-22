import React, { useState } from 'react'
import './DigitalCourses.css'
import {
  FaLaptopCode,
  FaCloud,
  FaChartLine,
  FaBug,
  FaUsers,
  FaMobileAlt,
  FaBriefcase,
  FaMoneyBill,
  FaStar,
  FaRegStar,
  FaClock,
  FaSignal,
  FaClosedCaptioning,
  FaGlobe,
  FaPalette,
  FaBullhorn,
} from 'react-icons/fa'
import api from '../api/axios' // Import your central axios instance
import { DatabaseBackup } from 'lucide-react'

// ================= IT Courses =================
const itCourses = [
  {
    title: 'Full Stack Development',
    desc: 'Master front-end and back-end technologies',
    icon: <FaLaptopCode />,
    category: 'IT',
    rating: 4.7,
    reviews: 1250,
    duration: '6 months',
    level: 'Intermediate',
    subtitles: true,
    bestseller: true,
    updated: 'Updated Aug 2025',
    moreInfo: [
      'HTML, CSS, JavaScript, React, Node.js',
      'Database: MongoDB & MySQL',
      'Deploying applications to cloud platforms',
      'Authentication & Security best practices',
    ],
  },
  {
    title: 'Cloud & DevOps',
    desc: 'Learn cloud infrastructure and CI/CD pipelines',
    icon: <FaCloud />,
    category: 'IT',
    rating: 4.6,
    reviews: 980,
    duration: '5 months',
    level: 'Intermediate',
    subtitles: true,
    bestseller: false,
    updated: 'Updated Aug 2025',
    moreInfo: [
      'AWS, Azure, Docker, Kubernetes',
      'CI/CD pipelines with Jenkins',
      'Hands-on cloud labs & projects',
      'Real-world deployment strategies',
    ],
  },
  {
    title: 'Data Science & AI',
    desc: 'Explore machine learning and data analysis',
    icon: <FaChartLine />,
    category: 'IT',
    rating: 4.9,
    reviews: 2100,
    duration: '7 months',
    level: 'Advanced',
    subtitles: true,
    bestseller: true,
    updated: 'Updated Aug 2025',
    moreInfo: [
      'Python, Machine Learning, Deep Learning',
      'Visualization with Tableau',
      'Natural Language Processing (NLP)',
      'Portfolio projects with real datasets',
    ],
  },
  {
    title: 'Software Testing',
    desc: 'Become an expert in QA and automation',
    icon: <FaBug />,
    category: 'IT',
    rating: 4.5,
    reviews: 650,
    duration: '4 months',
    level: 'Beginner',
    subtitles: true,
    bestseller: false,
    updated: 'Updated Aug 2025',
    moreInfo: [
      'Manual Testing & Automation',
      'Selenium, JUnit, TestNG frameworks',
      'Industry-level project training',
      'Automation best practices',
    ],
  },
  {
    title: 'Cybersecurity',
    desc: 'Defend against modern cyber threats',
    icon: <FaGlobe />,
    category: 'IT',
    rating: 4.8,
    reviews: 890,
    duration: '5 months',
    level: 'Intermediate',
    subtitles: true,
    bestseller: true,
    updated: 'Updated Sep 2025',
    moreInfo: [
      'Network Security & Firewalls',
      'Ethical Hacking & Pen Testing',
      'Incident Response & Risk Management',
      'Security Certifications Prep',
    ],
  },
  {
    title: 'Mobile App Development',
    desc: 'Build modern apps for Android & iOS',
    icon: <FaMobileAlt />,
    category: 'IT',
    rating: 4.6,
    reviews: 780,
    duration: '6 months',
    level: 'Intermediate',
    subtitles: true,
    bestseller: false,
    updated: 'Updated Sep 2025',
    moreInfo: [
      'React Native, Flutter',
      'App Deployment on Play Store & App Store',
      'API Integration & Push Notifications',
      'Performance Optimization',
    ],
  },
]

// ================= Non-IT Courses =================
const nonItCourses = [
  {
    title: 'HR Management',
    desc: 'Modern HR practices and talent management',
    icon: <FaUsers />,
    category: 'Non-IT',
    rating: 4.6,
    reviews: 720,
    duration: '4 months',
    level: 'Beginner',
    subtitles: false,
    bestseller: false,
    updated: 'Updated Aug 2025',
    moreInfo: [
      'Recruitment & Talent Acquisition',
      'Payroll & Labor Laws',
      'Employee engagement strategies',
      'Performance management systems',
    ],
  },
  {
    title: 'Digital Marketing',
    desc: 'Master SEO, social media, and online campaigns',
    icon: <FaBullhorn />,
    category: 'Non-IT',
    rating: 4.7,
    reviews: 1100,
    duration: '5 months',
    level: 'Intermediate',
    subtitles: true,
    bestseller: true,
    updated: 'Updated Aug 2025',
    moreInfo: [
      'SEO, SEM, Google Ads, Analytics',
      'Social Media Campaigns',
      'Email & Influencer Marketing',
      'Capstone digital project',
    ],
  },
  {
    title: 'Business Analysis',
    desc: 'Develop strategic business insights',
    icon: <FaBriefcase />,
    category: 'Non-IT',
    rating: 4.4,
    reviews: 500,
    duration: '4 months',
    level: 'Intermediate',
    subtitles: false,
    bestseller: false,
    updated: 'Updated Aug 2025',
    moreInfo: [
      'Requirement Gathering & Agile',
      'Use Cases, Jira Tools',
      'Case Studies with industry data',
      'Business solution design',
    ],
  },
  {
    title: 'Finance & Payroll',
    desc: 'Financial management and payroll systems',
    icon: <FaMoneyBill />,
    category: 'Non-IT',
    rating: 4.3,
    reviews: 430,
    duration: '6 months',
    level: 'Beginner',
    subtitles: false,
    bestseller: false,
    updated: 'Updated Aug 2025',
    moreInfo: [
      'Tally, GST, Income Tax',
      'Payroll Processing',
      'Financial compliance & reporting',
      'Placement Assistance',
    ],
  },
  {
    title: 'Entrepreneurship',
    desc: 'Learn how to start and scale businesses',
    icon: <FaBriefcase />,
    category: 'Non-IT',
    rating: 4.5,
    reviews: 390,
    duration: '5 months',
    level: 'Intermediate',
    subtitles: true,
    bestseller: true,
    updated: 'Updated Sep 2025',
    moreInfo: [
      'Business Models & Strategies',
      'Fundraising & Investor Pitching',
      'Marketing for Startups',
      'Scaling Operations',
    ],
  },
  {
    title: 'Graphic Design',
    desc: 'Master modern design tools & branding',
    icon: <FaPalette />,
    category: 'Non-IT',
    rating: 4.7,
    reviews: 640,
    duration: '4 months',
    level: 'Beginner',
    subtitles: true,
    bestseller: false,
    updated: 'Updated Sep 2025',
    moreInfo: [
      'Photoshop, Illustrator, Figma',
      'Logo & Branding Projects',
      'UI/UX Design Basics',
      'Portfolio Development',
    ],
  },
]

const allCourses = [...itCourses, ...nonItCourses]

// ================= Star Rating Component =================
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className='flex flex-row items-center justify-center'>
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className='star filled' />
      ))}
      {hasHalfStar && <FaRegStar className='star half' />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className='star empty' />
      ))}
      <span className='rating-value'>{rating}</span>
    </div>
  )
}

// ================= DigitalCourses Main Component =================
const DigitalCourses = () => {
  const [filter, setFilter] = useState('All')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredCourses =
    filter === 'All'
      ? allCourses
      : allCourses.filter((c) => c.category === filter)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // --- UPDATED: This function now saves data to your backend ---
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!selectedCourse) {
      alert('No course selected. Please try again.')
      return
    }

    setIsSubmitting(true)

    const payload = {
      ...formData,
      course: selectedCourse.title, // Add the course title to the payload
    }

    try {
      // Send the data to your '/api/enrollments' endpoint
      await api.post('/enrollments', payload)

      alert(`Enrollment for ${selectedCourse.title} submitted successfully!`)
      setSelectedCourse(null) // Close the form
      setFormData({ name: '', email: '', contact: '', message: '' }) // Reset the form
    } catch (error) {
      console.error('Error submitting enrollment:', error)
      const errorMessage =
        error.response?.data?.message ||
        'There was an error submitting your request.'
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='digital-courses-container compact'>
      {/* Header */}
      <section className='course-section compact'>
      
        <h2>Our Digital Courses</h2>
        <p className='subtitle'>
          Choose from IT and Non-IT programs designed to upgrade your skills
        </p>

        {/* Filter Buttons */}
        <div className='filter-buttons compact'>
          {['All', 'IT', 'Non-IT'].map((cat, idx) => (
            <button
              key={idx}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Course Grid */}
      <section className='course-section compact'>
        <div className='course-grid'>
          {filteredCourses.map((course, idx) => (
            <div key={idx} className={`course-card ${course.category}`}>
              <div className='course-main'>
                <div className='course-icon'>{course.icon}</div>
                <h3>{course.title}</h3>
                <p className='desc'>{course.desc}</p>
                <div className='rating-container'>
                  <StarRating rating={course.rating} />
                  <span className='reviews'>
                    ({course.reviews.toLocaleString()})
                  </span>
                </div>
                {course.bestseller && (
                  <div className='bestseller-badge'>Bestseller</div>
                )}
              </div>

              {/* Hover Info */}
              <div className='course-hover-info'>
                <h4>{course.title}</h4>
                <div className='bestseller-updated'>
                  {course.bestseller && (
                    <span className='bestseller-badge'>Bestseller</span>
                  )}
                  <span className='updated-text'>{course.updated}</span>
                </div>
                <div className='course-meta'>
                  <div className='meta-item'>
                    <FaClock className='icon' /> <span>{course.duration}</span>
                  </div>
                  <div className='meta-item'>
                    <FaSignal className='icon' /> <span>{course.level}</span>
                  </div>
                  {course.subtitles && (
                    <div className='meta-item'>
                      <FaClosedCaptioning className='icon' />{' '}
                      <span>Subtitles</span>
                    </div>
                  )}
                </div>
                <div className='learning-objectives'>
                  <h5>What you'll learn</h5>
                  <ul>
                    {course.moreInfo.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>

                <div className='hover-footer'>
                  {selectedCourse?.title === course.title ? (
                    <form
                      className='buy-form active'
                      onSubmit={handleFormSubmit}>
                      <label>Your Name</label>
                     <input
  type='text'
  name='name'
  placeholder='Enter your name'
  value={formData.name}
  onChange={(e) => {
    // Allow only alphabets & spaces
    const onlyLetters = e.target.value.replace(/[^A-Za-z ]/g, '')
    setFormData({ ...formData, name: onlyLetters })
  }}
  pattern='[A-Za-z ]{3,}'
  title='Name must contain at least 3 letters and only alphabets are allowed.'
  required
/>

                      <label>Email</label>
                      <input
  type='email'
  name='email'
  pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}'
  title='Please enter a valid email address.'
  placeholder='Enter your email'
  value={formData.email}
  onChange={handleInputChange}
  required
/>

                      <label>Contact</label>
                      <input
  type='text'
  name='contact'
  pattern='[0-9]{10}'
  maxLength='10'
  title='Contact number must be exactly 10 digits.'
  placeholder='Enter your contact'
  value={formData.contact}
  onChange={(e) => {
    // Prevent non-digit input
    const onlyNums = e.target.value.replace(/\D/g, '')
    setFormData({ ...formData, contact: onlyNums })
  }}
  required
/>


                      <label>Message</label>
                      <textarea
                        name='message'
                        placeholder='Your Message'
                        value={formData.message}
                        onChange={handleInputChange}></textarea>
                      <button type='submit' className='submit-btn'>
                        Submit
                      </button>
                    </form>
                  ) : (
                    <button
                      className='add-to-cart-btn'
                      onClick={() => setSelectedCourse(course)}>
                      Buy Course
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default DigitalCourses
