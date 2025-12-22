import React, { useState, useEffect, useRef } from 'react'
import api from '../api/axios'
import './Ittraining.css'

const Ittraining = () => {
  const [expandedId, setExpandedId] = useState(null)
  const [itTrainings, setItTrainings] = useState([])
  const cardRefs = useRef({})

  const itPrograms = [
    {
      id: 1,
      title: 'Full Stack Development',
      icon: '💻',
      description:
        'End-to-end development training for both frontend and backend applications.',
      details:
        'This program covers everything from HTML, CSS, and JavaScript to advanced React, Node.js, Express, and MongoDB. Includes project work and deployment on cloud platforms. Placement support with IT startups and MNCs.',
      technologies: [
        'HTML5',
        'CSS3',
        'JavaScript',
        'React.js',
        'Node.js',
        'Express.js',
        'MongoDB',
        'Git',
        'REST APIs',
      ],
    },
    {
      id: 2,
      title: 'Cloud & DevOps',
      icon: '☁️',
      description:
        'Automating infrastructure and application deployment on cloud platforms.',
      details:
        'Hands-on training on AWS, Azure, and CI/CD pipelines. Work with Docker, Kubernetes, Jenkins, and Terraform. Includes certification guidance and guaranteed interview opportunities.',
      technologies: [
        'AWS',
        'Azure',
        'Docker',
        'Kubernetes',
        'Jenkins',
        'Terraform',
        'GitHub Actions',
      ],
    },
    {
      id: 3,
      title: 'Data Science & AI',
      icon: '📊',
      description:
        'Extract insights from data and build intelligent AI-powered applications.',
      details:
        'Complete Data Science lifecycle training, covering Python, ML, DL, and real-time analytics. Placement assistance with analytics firms and product companies.',
      technologies: [
        'Python',
        'Pandas',
        'NumPy',
        'Scikit-learn',
        'TensorFlow',
        'Keras',
        'Matplotlib',
        'PowerBI',
      ],
    },
    {
      id: 4,
      title: 'Software Testing & QA',
      icon: '🔍',
      description:
        'Manual and automated testing to ensure high-quality software delivery.',
      details:
        'Covers manual testing, Selenium automation, API testing, and Agile testing strategies. Includes ISTQB certification prep and placement with QA service companies.',
      technologies: [
        'Selenium',
        'JUnit',
        'TestNG',
        'Postman',
        'JMeter',
        'Cypress',
        'Appium',
      ],
    },
    {
      id: 5,
      title: 'Cybersecurity & Ethical Hacking',
      icon: '🛡️',
      description:
        'Securing systems and networks against modern cyber threats.',
      details:
        'Hands-on labs on penetration testing, cryptography, and firewalls. Includes CEH prep and placement support in cybersecurity companies.',
      technologies: [
        'Kali Linux',
        'Wireshark',
        'Metasploit',
        'Burp Suite',
        'Nmap',
        'Firewalls',
        'Cryptography',
      ],
    },
    {
      id: 6,
      title: 'Mobile App Development',
      icon: '📱',
      description:
        'Build innovative mobile apps for Android and iOS platforms.',
      details:
        'Learn Android (Java/Kotlin), iOS (Swift), and cross-platform frameworks like Flutter and React Native. Includes real-world projects and placement tie-ups.',
      technologies: [
        'Java',
        'Kotlin',
        'Swift',
        'Flutter',
        'React Native',
        'Firebase',
        'SQLite',
      ],
    },
    {
      id: 7,
      title: 'Artificial Intelligence with ChatGPT & LLMs',
      icon: '🤖',
      description:
        'Work with Large Language Models (LLMs) to create next-gen AI solutions.',
      details:
        'Learn NLP, Generative AI, and LLM fine-tuning. Includes building AI chatbots and enterprise integrations with placement support in AI-focused firms.',
      technologies: [
        'OpenAI API',
        'LangChain',
        'Python',
        'Transformers',
        'Hugging Face',
        'Vector Databases',
      ],
    },
    {
      id: 8,
      title: 'UI/UX Design',
      icon: '🎨',
      description: 'Design creative and user-centric digital experiences.',
      details:
        'UI/UX design principles, wireframing, usability testing, and design tools. Placement assistance for UI/UX roles with startups and design studios.',
      technologies: [
        'Figma',
        'Adobe XD',
        'Sketch',
        'InVision',
        'Photoshop',
        'Illustrator',
      ],
    },
    {
      id: 9,
      title: 'Blockchain & Web3 Development',
      icon: '⛓️',
      description: 'Create decentralized applications and smart contracts.',
      details:
        'Hands-on training on Ethereum, Solidity, and Web3 frameworks. Includes real-world projects like DApps and NFTs with placement support in Web3 startups.',
      technologies: [
        'Ethereum',
        'Solidity',
        'Web3.js',
        'Metamask',
        'Polygon',
        'IPFS',
        'Truffle Suite',
      ],
    },
  ]

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }
  const fetchItData = async () => {
    const data = await api.get('/it-programs')
    const res = data.data
    console.log(res)
    setItTrainings(res)
  }

  useEffect(() => {
    if (expandedId && cardRefs.current[expandedId]) {
      cardRefs.current[expandedId].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
    fetchItData()
  }, [expandedId])

  // We will rotate through 6 gradients
  const gradientClasses = [
    'gradient-1',
    'gradient-2',
    'gradient-3',
    'gradient-4',
    'gradient-5',
    'gradient-6',
  ]

  return (
    <div className='ittraining-container'>
      {/* Hero Banner */}
      <section className='it-hero'>
        <div className='it-hero-content'>
          <h1>IT Training & Placement Services</h1>
          <p>
            Learn industry-ready skills with certification support, real-world
            projects, and guaranteed interview opportunities.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className='it-programs-section'>
        <h2 className='section-heading'>Our Training Programs</h2>
        <p className='section-subheading'>
          Explore our specialized IT training courses designed with
          placement-focused outcomes.
        </p>

        <div className='it-courses-grid'>
          {itTrainings &&
            itTrainings.map((course) => (
              <div
                key={course._id}
                ref={(el) => (cardRefs.current[course._id] = el)}
                className={`it-course-card ${
                  expandedId === course._id ? 'expanded' : ''
                }`}>
                <div className='it-course-icon'>{course.icon}</div>
                <h3 className='it-course-title'>{course.title}</h3>
                <p className='it-course-description'>{course.description}</p>
                <p className='text-xl text-red-400 mb-3 font-bold'>
                  ₹{course.price}
                </p>

                <button
                  className='it-learn-more-btn'
                  onClick={() => toggleExpand(course._id)}>
                  {expandedId === course._id ? 'Show Less' : 'Learn More'}
                </button>

                {expandedId === course._id && (
                  <div className='it-course-details'>
                    <p>{course.details}</p>

                    {/* Technologies Covered */}
                    {course.technologies && course.technologies.length > 0 && (
                      <>
                        <h4>Technologies Covered:</h4>
                        <div className='tech-badge-container'>
                          {course.technologies.map((tech, index) => {
                            // pick gradient class by index rotation
                            const gradientClass =
                              gradientClasses[index % gradientClasses.length]
                            return (
                              <span
                                key={index}
                                className={`it-tech-badge ${gradientClass}`}>
                                {tech}
                              </span>
                            )
                          })}
                        </div>
                      </>
                    )}

                    <div className='placement-info'>
                      <h4>Placement Assistance:</h4>
                      <div className='placement-points'>
                        <span>Resume building & mock interviews</span>
                        <span>Certification guidance</span>
                        <span>
                          Interview opportunities with IT firms & MNCs
                        </span>
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

export default Ittraining
