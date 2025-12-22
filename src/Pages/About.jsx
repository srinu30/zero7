import React, { useEffect, useState } from 'react'
import './About.css'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const [stats, setStats] = useState({
    careers: 0,
    partners: 0,
    retention: 0,
  })

  // --- Start of new code for typewriter effect ---

  // Full text for the paragraphs
  const fullParagraph1 =
    'At Zero7 Technologies, we believe every career deserves a second chance and every talent deserves the right platform. Established in 2025, we specialize in IT & Non-IT Training, Payroll Process Outsourcing, Resume Marketing, and Campus Drives.'
  const fullParagraph2 =
    'Our mission is to empower individuals with skills, confidence, and opportunities while supporting organizations with trained and reliable talent.'

  // State to hold the "typed" text
  const [typedParagraph1, setTypedParagraph1] = useState('')
  const [typedParagraph2, setTypedParagraph2] = useState('')

  // useEffect to handle the typing animation for both paragraphs
  useEffect(() => {
    // Typing logic for the first paragraph
    if (typedParagraph1.length < fullParagraph1.length) {
      const timeoutId = setTimeout(() => {
        setTypedParagraph1(fullParagraph1.slice(0, typedParagraph1.length + 1))
      }, 35) // Adjust typing speed (milliseconds)
      return () => clearTimeout(timeoutId)
    }

    // Typing logic for the second paragraph (starts after the first one finishes)
    if (
      typedParagraph1.length === fullParagraph1.length &&
      typedParagraph2.length < fullParagraph2.length
    ) {
      const timeoutId = setTimeout(() => {
        setTypedParagraph2(fullParagraph2.slice(0, typedParagraph2.length + 1))
      }, 35) // Adjust typing speed (milliseconds)
      return () => clearTimeout(timeoutId)
    }
  }, [typedParagraph1, typedParagraph2])

  // --- End of new code for typewriter effect ---

  const navigate = useNavigate()

  // Animate stats dynamically
  useEffect(() => {
    let careers = 0
    let partners = 0
    let retention = 0

    const interval = setInterval(() => {
      if (careers < 5000) careers += 100
      if (partners < 120) partners += 5
      if (retention < 94) retention += 2

      setStats({
        careers: careers > 5000 ? 5000 : careers,
        partners: partners > 120 ? 120 : partners,
        retention: retention > 94 ? 94 : retention,
      })
    }, 80)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='about-page'>
      {/* Hero Section */}
      <section className='about-hero'>
        <div className='hero-overlay'>
          <h1>About Zero7 Technologies</h1>
          <p className='subheading'>
            Building bridges between ambition and opportunity in the new world
            of work
          </p>
        </div>
      </section>

      {/* Who We Are Section - MODIFIED FOR TYPEWRITER EFFECT */}
      <section className='who-we-are'>
        <div className='container'>
          <div className='section-content'>
            <div className='text-content'>
              <h2 className='text-3xl font-bold mb-4'>Who We Are</h2>
              <p className='text-lg'>
                <strong>{typedParagraph1}</strong>
                {/* Blinking cursor for the first paragraph */}
                {typedParagraph1.length < fullParagraph1.length && (
                  <span className='inline-block w-0.5 h-6 bg-gray-800 ml-1 animate-blink align-middle'></span>
                )}
              </p>
              <p className='text-lg mt-4'>
                {typedParagraph2}
                {/* Blinking cursor for the second paragraph */}
                {typedParagraph1.length === fullParagraph1.length &&
                  typedParagraph2.length < fullParagraph2.length && (
                    <span className='inline-block w-0.5 h-6 bg-gray-800 ml-1 animate-blink align-middle'></span>
                  )}
              </p>
            </div>
            <div className='image-container'>
              <img
                src='https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=1200&q=80'
                alt='Team collaboration'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Values Section */}
      <section className='vision-values'>
        <div className='container'>
          <h2>Our Core Beliefs</h2>
          <p className='section-intro'>
            These principles guide every step of our journey
          </p>

          <div className='values-grid'>
            <div className='flip-card'>
              <div className='flip-card-inner'>
                <div className='flip-card-front'>
                  <img src='/img01.jpg' alt='Potential' />
                </div>
                <div className='flip-card-back'>
                  <h3>Excellence Beyond Experience</h3>
                  <p>
                    We believe talent is everywhere. Our programs focus on
                    nurturing hidden potential rather than just credentials.
                  </p>
                </div>
              </div>
            </div>

            <div className='flip-card'>
              <div className='flip-card-inner'>
                <div className='flip-card-front'>
                  <img src='/img02.jpg' alt='Partnership' />
                </div>
                <div className='flip-card-back'>
                  <h3>Your Growth, Our Commitment</h3>
                  <p>
                    We build long-term relationships with individuals and
                    organizations—success for us means sustainable growth for
                    everyone involved.
                  </p>
                </div>
              </div>
            </div>

            <div className='flip-card'>
              <div className='flip-card-inner'>
                <div className='flip-card-front'>
                  <img src='/img03.jpg' alt='Data Meets Humanity' />
                </div>
                <div className='flip-card-back'>
                  <h3>Where Data Meets the Human Story </h3>
                  <p>
                    We use analytics and market intelligence to empower careers,
                    but we never forget the human story behind every number.
                  </p>
                </div>
              </div>
            </div>

            <div className='flip-card'>
              <div className='flip-card-inner'>
                <div className='flip-card-front'>
                  <img src='/img04.jpg' alt='Innovation' />
                </div>
                <div className='flip-card-back'>
                  <h3>Evolving Careers, Empowering Companies</h3>
                  <p>
                    Our solutions evolve with the future of work—ensuring that
                    every professional stays relevant and every company stays
                    competitive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className='stats-bar'>
        <div className='stat-item'>
          <span className='stat-number'>{stats.careers}+</span>
          <span className='stat-label'>Careers Transformed</span>
        </div>
        <div className='stat-item'>
          <span className='stat-number'>{stats.partners}+</span>
          <span className='stat-label'>Enterprise Partners</span>
        </div>
        <div className='stat-item'>
          <span className='stat-number'>{stats.retention}%</span>
          <span className='stat-label'>Placement Retention</span>
        </div>
      </section>
      {/* Why Choose Zero7 Technologies? */}
      <section className='py-16 md:py-24 bg-white'>
        <div className='container mx-auto px-6 text-center'>
          <h2 className='text-3xl md:text-5xl font-extrabold mb-12 text-blue-700 leading-tight'>
            Why Choose Zero7 Technologies?
          </h2>
          <p className='text-lg md:text-xl max-w-4xl mx-auto text-gray-700 mb-12'>
            Founded with a vision to bridge the gap between talent and
            opportunity, we are dedicated to empowering individuals and
            organizations through practical, job-ready solutions.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300'>
              <div className='text-5xl text-purple-600 mb-4 flex justify-center'>
                <i className='fas fa-handshake'></i>{' '}
                {/* Icon: Partnership/Vision */}
              </div>
              <h3 className='text-xl font-semibold mb-3'>
                Our Visionary Foundation
              </h3>
              <p className='text-gray-600'>
                Founded to bridge the gap between talent and opportunity.
              </p>
            </div>
            <div className='p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300'>
              <div className='text-5xl text-green-600 mb-4 flex justify-center'>
                <i className='fas fa-tools'></i> {/* Icon: Practical/Skills */}
              </div>
              <h3 className='text-xl font-semibold mb-3'>
                Practical, Job-Ready Training
              </h3>
              <p className='text-gray-600'>
                Focus on hands-on skills rather than just theory for immediate
                application.
              </p>
            </div>
            <div className='p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300'>
              <div className='text-5xl text-yellow-600 mb-4 flex justify-center'>
                <i className='fas fa-network-wired'></i> {/* Icon: Network */}
              </div>
              <h3 className='text-xl font-semibold mb-3'>
                Extensive Industry Network
              </h3>
              <p className='text-gray-600'>
                Strong connections with corporates, colleges, and recruiters.
              </p>
            </div>
            <div className='p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300'>
              <div className='text-5xl text-red-600 mb-4 flex justify-center'>
                <i className='fas fa-rocket'></i>{' '}
                {/* Icon: Transformation/Growth */}
              </div>
              <h3 className='text-xl font-semibold mb-3'>
                Commitment to Transformation
              </h3>
              <p className='text-gray-600'>
                Dedicated to career transformation and enhanced employability.
              </p>
            </div>
          </div>
        </div>
      </section> 
      {/* Our Services */}
      <section className='py-16 md:py-24 bg-white'>
        <div className='container mx-auto px-6 text-center'>
          <h2 className='text-3xl md:text-5xl font-extrabold mb-12 text-blue-700 leading-tight'>
            Our Comprehensive Services
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {/* Service Card 1: IT & Non-IT Training */}
            <div className='flex flex-col items-center p-8 bg-blue-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500'>
              <div className='text-6xl text-blue-600 mb-6'>
                <i className='fas fa-chalkboard-teacher'></i>
              </div>
              <h3 className='text-2xl font-bold mb-4 text-gray-800'>
                IT & Non-IT Training
              </h3>
              <p className='text-gray-700 text-center flex-grow'>
                Expert-led programs to equip you with in-demand skills, ensuring
                you are job-ready and confident.
              </p>
            </div>

            {/* Service Card 2: Payroll Process Outsourcing */}
            <div className='flex flex-col items-center p-8 bg-green-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-green-500'>
              <div className='text-6xl text-green-600 mb-6'>
                <i className='fas fa-wallet'></i>
              </div>
              <h3 className='text-2xl font-bold mb-4 text-gray-800'>
                Payroll Outsourcing
              </h3>
              <p className='text-gray-700 text-center flex-grow'>
                Simplify your operations with efficient and accurate payroll
                services, freeing you to focus on core goals.
              </p>
            </div>

            {/* Service Card 4: Resume Marketing */}
            <div className='flex flex-col items-center p-8 bg-yellow-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-yellow-500'>
              <div className='text-6xl text-yellow-600 mb-6'>
                <i className='fas fa-file-alt'></i>
              </div>
              <h3 className='text-2xl font-bold mb-4 text-gray-800'>
                Resume Marketing
              </h3>
              <p className='text-gray-700 text-center flex-grow'>
                Ensuring your profile stands out to top recruiters,
                significantly increasing your interview chances.
              </p>
            </div>

            {/* Service Card 3: College Drives & Campus Hiring */}
            <div className='flex flex-col items-center p-8 bg-purple-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-purple-500'>
              <div className='text-6xl text-purple-600 mb-6'>
                <i className='fas fa-graduation-cap'></i>
              </div>
              <h3 className='text-2xl font-bold mb-4 text-gray-800'>
                Bench <br/>Marketing
              </h3>
              <p className='text-gray-700 text-center flex-grow'>
                We showcase bench talent to maximize utilization and enable fast, seamless deployment</p>
            </div>
          </div>
        </div>
      </section>

      {/* === MODIFIED SECTION STARTS HERE === */}
      <section className='py-16 md:py-24 bg-white'>
        <div className='container mx-auto px-6'>
          <h2 className='text-3xl md:text-5xl font-extrabold mb-16 text-center text-blue-700 leading-tight'>
            Who We Empower
          </h2>
          {/* Updated grid for 3 columns on large screens */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* Card 1: For Job Seekers (Dynamic Styling) */}
            <div className='bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2'>
              <div className='text-6xl text-purple-600 mb-5'>
                <i className='fas fa-user-tie'></i>
              </div>
              <h3 className='text-2xl font-bold mb-3 text-gray-800'>
                For Job Seekers
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                We provide the tools, training, and confidence to help you land
                your next role, whether you're starting fresh, switching
                careers, or returning to work.
              </p>
            </div>

            {/* Card 2: For Companies (Dynamic Styling) */}
            <div className='bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2'>
              <div className='text-6xl text-blue-600 mb-5'>
                <i className='fas fa-building'></i>
              </div>
              <h3 className='text-2xl font-bold mb-3 text-gray-800'>
                For Companies
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                Access a pool of vetted, skilled candidates ready to contribute
                from day one. We streamline your hiring process, saving you time
                and reducing costs.
              </p>
            </div>

            {/* Card 3: For Colleges (Dynamic Styling) */}
            <div className='bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2'>
              <div className='text-6xl text-green-600 mb-5'>
                <i className='fas fa-university'></i>
              </div>
              <h3 className='text-2xl font-bold mb-3 text-gray-800'>
                For Colleges
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                Bridge the gap between academia and industry. We partner with
                you to host campus drives, connecting your students with top
                companies and boosting placement rates.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* === MODIFIED SECTION ENDS HERE === */}

      {/* Our Values */}
      <div className='min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Vision Section */}
          <div className='mt-5'>
            <div className='relative'>
              <div
                className='absolute inset-0 flex items-center'
                aria-hidden='true'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center'>
                <span className='px-3 bg-gray-50 text-lg font-bold text-gray-900'>
  Our Vision
</span>

              </div>
            </div>
            <div className='mt-10 text-center'>
              <p className='text-2xl text-gray-700 font-medium'>
                "To be a leading force in career empowerment and talent
                solutions, creating a future where every individual has the
                opportunity to achieve their professional potential."
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className='mt-20'>
            <div className='relative'>
              <div
                className='absolute inset-0 flex items-center'
                aria-hidden='true'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center'>
                <span className='px-3 bg-gray-50 text-lg font-bold text-gray-900'>
  Our Mission
</span>
              </div>
            </div>
            <div className='mt-10 text-center'>
              <p className='text-2xl text-gray-700 font-medium'>
                "To provide high-quality training and strategic staffing
                solutions that bridge skill gaps, foster career growth, and
                drive organizational success."
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className='mt-20'>
            <div className='relative'>
              <div
                className='absolute inset-0 flex items-center'
                aria-hidden='true'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center'>
                <span className='px-3 bg-gray-50 text-lg font-bold text-gray-900'>
                  Our Values
                </span>
              </div>
            </div>

            <dl className='mt-10 space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10'>
              <div className='relative'>
                <dt>
                  <div className='absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white'>
                    {/* Icon for Empowerment */}
                    <svg
                      className='h-6 w-6'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 10V3L4 14h7v7l9-11h-7z'
                      />
                    </svg>
                  </div>
                  <p className='ml-16 text-lg leading-6 font-medium text-gray-900'>
                    Empowerment
                  </p>
                </dt>
                <dd className='mt-2 ml-16 text-base text-gray-500'>
                  We believe in giving people the tools to take control of their
                  careers.
                </dd>
              </div>

              <div className='relative'>
                <dt>
                  <div className='absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white'>
                    {/* Icon for Integrity */}
                    <svg
                      className='h-6 w-6'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </div>
                  <p className='ml-16 text-lg leading-6 font-medium text-gray-900'>
                    Integrity
                  </p>
                </dt>
                <dd className='mt-2 ml-16 text-base text-gray-500'>
                  We operate with honesty and transparency in all our
                  partnerships.
                </dd>
              </div>

              <div className='relative'>
                <dt>
                  <div className='absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white'>
                    {/* Icon for Excellence */}
                    <svg
                      className='h-6 w-6'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 3v4M3 3h4M7 3h2M3 7h4m4 0h2M3 11h4m4 0h2M3 15h4m4 0h2m-4 4h4m-4 0v4m-4-4h4m4 0h2m-4 4h4'
                      />
                    </svg>
                  </div>
                  <p className='ml-16 text-lg leading-6 font-medium text-gray-900'>
                    Excellence
                  </p>
                </dt>
                <dd className='mt-2 ml-16 text-base text-gray-500'>
                  We are committed to delivering high-quality services and
                  results.
                </dd>
              </div>

              <div className='relative'>
                <dt>
                  <div className='absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white'>
                    {/* Icon for Innovation */}
                    <svg
                      className='h-6 w-6'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4.636 4.636l-.707.707M3 12H2m13.757 4.243l-.707.707M12 21v-1M4.243 15.757l.707-.707m-4.243 4.243L12 12l-6-6-6 6 6 6z'
                      />
                    </svg>
                  </div>
                  <p className='ml-16 text-lg leading-6 font-medium text-gray-900'>
                    Innovation
                  </p>
                </dt>
                <dd className='mt-2 ml-16 text-base text-gray-500'>
                  We continuously adapt our services to meet the dynamic needs
                  of the job market.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className='cta-section'>
        <h3 className='text-2xl font-bold'>Step Into the Future</h3>
        <p>
          Whether you’re a job seeker or a business looking for top talent,
          Zero7 Technologies is here to support your growth journey.
        </p>
        <div className='cta-buttons'>
          <button
            className='primary-btn'
            onClick={() => navigate('/current-hirings')}>
            Join Our Mission
          </button>
          <button
            className='secondary-btn'
            onClick={() => navigate('/bench-list')}>
            Explore Opportunities
          </button>
        </div>
       
      </section>
      <br />
    </div>
  )
}

export default About