import React, { useState, useRef, useEffect } from 'react'
import api from '../api/axios'
import './Nonittraining.css'

const Nonittraining = () => {
  const [expandedCard, setExpandedCard] = useState(null)
  const [nonItTrainings, setNonItTrainings] = useState([])
  const cardRefs = useRef({})

  const nonItPrograms = [
    {
      id: 1,
      title: 'HR Management',
      description: 'Modern HR practices and talent management',
      icon: '👥',
      details:
        'This program provides a comprehensive understanding of Human Resource Management in a corporate environment. You will learn recruitment processes, onboarding, performance evaluations, HR analytics, and compliance practices. Placement assistance is provided for HR roles in startups and MNCs.',
      skills: [
        'Recruitment',
        'Employee Engagement',
        'HR Analytics',
        'Compliance',
        'Payroll Tools',
      ],
    },
    {
      id: 2,
      title: 'Digital Marketing',
      description: 'Master SEO, social media, and online campaigns',
      icon: '📱',
      details:
        'This course equips you with strategies and tools for SEO, SEM, social media, and paid campaigns. Includes projects on Google Ads, Facebook Ads, and content marketing, preparing you for roles in agencies or freelance opportunities.',
      skills: [
        'SEO',
        'SEM',
        'Google Ads',
        'Content Marketing',
        'Social Media Strategy',
      ],
    },
    {
      id: 3,
      title: 'Business Analysis',
      description: 'Develop strategic business insights',
      icon: '📈',
      details:
        'The program trains you to act as a bridge between business and IT teams. Learn requirement gathering, process modeling, documentation best practices, and agile business analysis using Jira and Confluence. Placement support for BA and PMO roles.',
      skills: [
        'Requirement Gathering',
        'Process Mapping',
        'Data Analysis',
        'MS Visio',
        'Jira',
      ],
    },
    {
      id: 4,
      title: 'Finance & Payroll',
      description: 'Financial management and payroll systems',
      icon: '💰',
      details:
        'Hands-on program covering payroll compliance, tax calculations, and financial reporting. Includes training on Tally ERP and advanced Excel. Placement support for finance and payroll executive roles.',
      skills: [
        'Payroll Processing',
        'Taxation',
        'Financial Reporting',
        'Tally',
        'Excel',
      ],
    },
    {
      id: 5,
      title: 'Project Management',
      description: 'Lead and deliver successful projects',
      icon: '📊',
      details:
        'Covers project lifecycle management, Agile, Scrum, risk management, budgeting, and stakeholder communication. Includes case studies and PMP/Scrum certification prep. Placement-focused leadership workshops included.',
      skills: [
        'Agile',
        'Scrum',
        'Risk Management',
        'Project Scheduling',
        'MS Project',
      ],
    },
    {
      id: 6,
      title: 'Sales & Marketing',
      description: 'Boost business growth through sales expertise',
      icon: '💼',
      details:
        'Enhance your ability to design and execute effective sales and marketing campaigns. Includes CRM training, negotiation skills, customer acquisition strategies, and roleplays. Placement support with corporate tie-ups.',
      skills: [
        'CRM',
        'Negotiation',
        'B2B Sales',
        'Customer Acquisition',
        'Communication',
      ],
    },
    {
      id: 7,
      title: 'Bench Sales Recruiter',
      description: 'Specialized training for IT staffing & US recruitment',
      icon: '🧑‍💼',
      details:
        'Learn the complete lifecycle of US IT staffing and bench sales. Covers sourcing, negotiation, rate discussion, and closing deals with vendors and clients. Placement support with staffing firms and consulting companies.',
      skills: [
        'US Staffing',
        'Bench Sales',
        'Vendor Management',
        'Client Negotiation',
        'ATS Tools',
      ],
    },
    {
      id: 8,
      title: 'HR Recruiter',
      description: 'End-to-end recruitment and hiring strategies',
      icon: '📝',
      details:
        'Covers sourcing, screening, interviewing, and onboarding candidates. Learn ATS usage, recruitment portals, negotiation techniques, and talent acquisition strategies. Placement assistance in HR recruitment roles across industries.',
      skills: [
        'Talent Acquisition',
        'Interviewing',
        'ATS Tools',
        'Onboarding',
        'Recruitment Portals',
      ],
    },
  ]

  const toggleCard = (id) => {
    setExpandedCard((prev) => (prev === id ? null : id))
  }
  const fetchNonItData = async () => {
    const data = await api.get('/non-it-programs')
    const res = data.data
    console.log(res)
    setNonItTrainings(res)
  }

  useEffect(() => {
    if (expandedCard && cardRefs.current[expandedCard]) {
      cardRefs.current[expandedCard].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
    fetchNonItData()
  }, [expandedCard])

  return (
    <div className='nonittraining-container'>
      {/* Hero Section */}
      <section className='nonit-hero'>
        <div className='nonit-hero-content'>
          <h1>Non-IT Training & Placement Services</h1>
          <p>
            Explore industry-demanded courses with 100% placement assistance in
            top companies.
          </p>
        </div>
      </section>

      {/* Programs Section */}
      <section className='nonit-programs-section'>
        <h2 className='section-heading'>Our Non-IT Programs</h2>
        <p className='section-subheading'>
          Explore specialized non-IT training courses designed for career growth
          with placement-focused outcomes.
        </p>

        <div className='nonit-courses-grid'>
          {nonItTrainings &&
            nonItTrainings.map((course) => (
              <div
                key={course._id}
                ref={(el) => (cardRefs.current[course._id] = el)}
                className={`nonit-course-card ${
                  expandedCard === course._id ? 'expanded' : ''
                }`}>
                <div className='nonit-course-icon'>{course.icon}</div>
                <h3 className='nonit-course-title'>{course.title}</h3>
                <p className='nonit-course-description'>{course.description}</p>
                <p className='text-xl text-red-400 mb-3 font-bold'>
                  ₹{course.price}
                </p>

                <button
                  className='nonit-learn-more-btn'
                  onClick={() => toggleCard(course._id)}
                  aria-expanded={expandedCard === course._id}
                  aria-controls={`details-${course._id}`}>
                  {expandedCard === course._id ? 'Show Less' : 'Learn More'}
                </button>

                {expandedCard === course._id && (
                  <div
                    id={`details-${course._id}`}
                    className='nonit-course-details'>
                    <p>{course.details}</p>
                    <p>
                      <span className='text-xl font-bold'>Duration: </span>
                      <span className='text-lg text-blue-600 font-500'>
                        {course.duration} Months
                      </span>
                    </p>

                    <h4>Skills You’ll Gain:</h4>
                    <div className='tech-badge-container'>
                      {course.skills.map((skill, index) => (
                        <span
                          key={index}
                          className={`nonit-tech-badge gradient-${
                            (index % 6) + 1
                          }`}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className='placement-info'>
                      <h4>Placement Assistance:</h4>
                      <div className='placement-points'>
                        <span>Resume building & mock interviews</span>
                        <span>Certification guidance</span>
                        <span>Interview opportunities with top firms</span>
                        <span>Career mentorship sessions</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}

export default Nonittraining
