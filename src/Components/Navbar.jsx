import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faChevronUp,
  faBars,
  faTimes,
  faImages, // icon is available if needed
} from '@fortawesome/free-solid-svg-icons'
import './Navbar.css'
import { Rss } from 'lucide-react'

const Navbar = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isTrainingOpen, setIsTrainingOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (isMobileMenuOpen) {
      setIsServicesOpen(false)
      setIsTrainingOpen(false)
    }
  }

  const toggleServices = () => {
    if (window.innerWidth <= 960) {
      setIsServicesOpen(!isServicesOpen)
      setIsTrainingOpen(false)
    }
  }

  const toggleTraining = (e) => {
    e.stopPropagation()
    if (window.innerWidth <= 960) {
      setIsTrainingOpen(!isTrainingOpen)
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setIsServicesOpen(false)
    setIsTrainingOpen(false)
  }

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        {/* Logo */}
        <NavLink to='/' className='navbar-logo' onClick={closeMobileMenu}>
          <img
            src='/Logo6.jpg'
            alt='Zero7 Technologies Logo'
            className='logo-img'
          />
        </NavLink>

        {/* Mobile menu icon */}
        <div className='mobile-menu-icon' onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </div>

        {/* Nav menu */}
        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className='nav-item'>
            <NavLink
              to='/'
              className={({ isActive }) =>
                isActive ? 'nav-links active-link' : 'nav-links'
              }
              onClick={closeMobileMenu}>
              Home
            </NavLink>
          </li>

          <li className='nav-item'>
            <NavLink
              to='/about'
              className={({ isActive }) =>
                isActive ? 'nav-links active-link' : 'nav-links'
              }
              onClick={closeMobileMenu}>
              About Us
            </NavLink>
          </li>

          {/* Services */}
          <li
            className={`nav-item services-item ${isServicesOpen ? 'open' : ''}`}
            onMouseEnter={() =>
              window.innerWidth > 960 && setIsServicesOpen(true)
            }
            onMouseLeave={() =>
              window.innerWidth > 960 && setIsServicesOpen(false)
            }
            onClick={toggleServices}>
            <div className='nav-links'>
              Services
              <FontAwesomeIcon
                icon={isServicesOpen ? faChevronUp : faChevronDown}
                className='dropdown-icon'
              />
            </div>

            <ul className={`services-dropdown ${isServicesOpen ? 'show' : ''}`}>
              {/* Training submenu */}
              <li
                className={`training-submenu ${isTrainingOpen ? 'open' : ''}`}
                onMouseEnter={() =>
                  window.innerWidth > 960 && setIsTrainingOpen(true)
                }
                onMouseLeave={() =>
                  window.innerWidth > 960 && setIsTrainingOpen(false)
                }
                onClick={toggleTraining}>
                <div className='dropdown-link'>
                  Training
                  <FontAwesomeIcon
                    icon={isTrainingOpen ? faChevronUp : faChevronDown}
                    className='submenu-icon'
                  />
                </div>

                <ul
                  className={`training-dropdown ${
                    isTrainingOpen ? 'show' : ''
                  }`}>
                  <li>
                    <NavLink
                      to='/services/it-training'
                      className={({ isActive }) =>
                        isActive
                          ? 'dropdown-link active-dropdown'
                          : 'dropdown-link'
                      }
                      onClick={closeMobileMenu}>
                      IT Training
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to='/services/non-it-training'
                      className={({ isActive }) =>
                        isActive
                          ? 'dropdown-link active-dropdown'
                          : 'dropdown-link'
                      }
                      onClick={closeMobileMenu}>
                      Non-IT Training
                    </NavLink>
                  </li>
                </ul>
              </li>

              {/* Digital Courses */}
              <li>
                <NavLink
                  to='/digital-courses'
                  className={({ isActive }) =>
                    isActive ? 'dropdown-link active-dropdown' : 'dropdown-link'
                  }
                  onClick={closeMobileMenu}>
                  Digital Courses
                </NavLink>
              </li>

              {/* Resume Writing */}
              <li>
                <NavLink
                  to='/services/resume-writing'
                  className={({ isActive }) =>
                    isActive ? 'dropdown-link active-dropdown' : 'dropdown-link'
                  }
                  onClick={closeMobileMenu}>
                  Resume Writing
                </NavLink>
              </li>
              
              {/* --- CORRECT RESUME BUILDING LINK --- */}
           

              <li>
                <NavLink
                  to='/services/payroll-services'
                  className={({ isActive }) =>
                    isActive ? 'dropdown-link active-dropdown' : 'dropdown-link'
                  }
                  onClick={closeMobileMenu}>
                  Payroll Services
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/services/resume-marketing'
                  className={({ isActive }) =>
                    isActive ? 'dropdown-link active-dropdown' : 'dropdown-link'
                  }
                  onClick={closeMobileMenu}>
                  Resume Marketing
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/services/college-connect'
                  className={({ isActive }) =>
                    isActive ? 'dropdown-link active-dropdown' : 'dropdown-link'
                  }
                  onClick={closeMobileMenu}>
                  College Connect
                </NavLink>
              </li>
            </ul>
          </li>

          <li className='nav-item'>
            <NavLink
              to='/new-batches'
              className={({ isActive }) =>
                isActive ? 'nav-links active-link' : 'nav-links'
              }
              onClick={closeMobileMenu}>
              New Batches
            </NavLink>
          </li>

          <li className='nav-item'>
            <NavLink
              to='/bench-list'
              className={({ isActive }) =>
                isActive ? 'nav-links active-link' : 'nav-links'
              }
              onClick={closeMobileMenu}>
              Bench List
            </NavLink>
          </li>

          <li className='nav-item'>
            <NavLink
              to='/current-hirings'
              className={({ isActive }) =>
                isActive ? 'nav-links active-link' : 'nav-links'
              }
              onClick={closeMobileMenu}>
              Current Hirings
            </NavLink>
          </li>

          <li className='nav-item'>
            <NavLink
              to='/contact'
              className={({ isActive }) =>
                isActive ? 'nav-links active-link' : 'nav-links'
              }
              onClick={closeMobileMenu}>
              Contact Us
            </NavLink>
          </li>

          {/* Blog – shows icon but keeps route */}
          <li className='nav-item'>
            <NavLink
              to='/blog'
              className={({ isActive }) =>
                isActive ? 'nav-links active-link' : 'nav-links'
              }
              onClick={closeMobileMenu}>
              <img
                src='https://cdn-icons-png.flaticon.com/512/10026/10026257.png'
                alt='blog-posts'
                style={{ height: '40px', width: '40px' }}
              />
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar