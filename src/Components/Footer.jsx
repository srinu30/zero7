import React, { useState } from 'react'   // ← added useState
import './Footer.css'
import { Link } from 'react-router-dom'
import emailjs from "emailjs-com";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaPaperPlane,
} from 'react-icons/fa'

const Footer = () => {
  const [email, setEmail] = useState("")       // ← added
  const [message, setMessage] = useState("")   // ← added
  const [error, setError] = useState("")       // ← added

  const scrollToTop = () => {
    window.scrollTo(0, 0)
  
  }

  const handleSubscribe = () => {
    setMessage("");
    setError("");
  
    if (!email.trim()) {
      setError("Please enter an email.");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }
  
    emailjs.send(
    "service_0n8kogp",   
    "template_g5g21rq",
      { user_email: email },
      "z8beadXfRJD3nBw6U"
    )
    .then(() => {
      setMessage("Subscription successful! Check your email.");
      setEmail("");
    })
    .catch((err) => {
      console.error(err);
      setError("Failed to send email. Try again.");
    });
  };

  return (
    <footer className='footer'>
      <div className='footer-container'>

        {/* Company Info + Social */}
        <div className='footer-section'>
          <h3 className='footer-title'>Zero7 Technologies</h3>
          <p className='tagline'>
            Crafting unforgettable digital experiences with innovative
            solutions. Your vision, our expertise.
          </p>

          <div className='social-icons'>
            <a href='https://www.facebook.com/share/19SF32cFPT/' target='_blank' rel='noreferrer' aria-label='Facebook'>
              <FaFacebookF />
            </a>
            <a href='https://www.instagram.com/zero7technologies?igsh=cmt1amJvaG40Ym8z' target='_blank' rel='noreferrer' aria-label='Instagram'>
              <FaInstagram />
            </a>
            <a href='https://www.linkedin.com/company/zero7technologies/' target='_blank' rel='noreferrer' aria-label='LinkedIn'>
              <FaLinkedin />
            </a>
            <a href='https://wa.me/918919801095' target='_blank' rel='noreferrer' aria-label='WhatsApp'>
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className='footer-section'>
          <h3 className='footer-title'>Quick Links</h3>
          <ul>
            <li><Link to='/services/it-training' onClick={scrollToTop}>IT Training</Link></li>
            <li><Link to='/services/non-it-training' onClick={scrollToTop}>Non-IT Training</Link></li>
            <li><Link to='/digital-courses' onClick={scrollToTop}>Digital Courses</Link></li>
            <li><Link to='/services/resume-marketing' onClick={scrollToTop}>Resume Marketing</Link></li>
            <li><Link to='/services/payroll-services' onClick={scrollToTop}>Payroll Services</Link></li>
            <li><Link to='/services/college-connect' onClick={scrollToTop}>College Connect</Link></li>
          </ul>
        </div>

        {/* Action Links */}
        <div className='footer-section'>
          <h3 className='footer-title'>Action Links</h3>
          <ul>
            <li><Link to='/' onClick={scrollToTop}>Home</Link></li>
            <li><Link to='/about' onClick={scrollToTop}>About Us</Link></li>
            <li><Link to='/new-batches' onClick={scrollToTop}>New Batches</Link></li>
            <li><Link to='/bench-list' onClick={scrollToTop}>Bench List</Link></li>
            <li><Link to='/current-hirings' onClick={scrollToTop}>Current Hirings</Link></li>
            <li><Link to='/contact' onClick={scrollToTop}>Contact Us</Link></li>
            <li><Link to='/blog' onClick={scrollToTop}>Blog</Link></li>
          </ul>
        </div>

        {/* Subscribe */}
        <div className='footer-section'>
          <h3 className='footer-title'>Stay Connected</h3>
          <p>Subscribe for insights, latest trends, and exclusive updates.</p>

          <div className='subscribe-box'>
            <input
              type='email'
              placeholder='Your Email Address'
              value={email}                           // ← added
              onChange={(e) => setEmail(e.target.value)}  // ← added
            />
            <button className='send-btn' onClick={handleSubscribe}>   {/* ← updated */}
              <FaPaperPlane />
            </button>
          </div>

          {message && <p className='success-msg'>{message}</p>}   {/* ← added */}
          {error && <p className='error-msg'>{error}</p>}         {/* ← added */}
        </div>
      </div>

      <div className='footer-bottom'>
        <p>© 2025 Zero7 Technologies. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
