// CampusHiring.jsx
import React from "react";
import "./CampusHiring.css";
import {
  FiBriefcase,
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiTrendingUp,
  FiClock,
  FiLayers,
  FiMapPin,
  FiFileText,
  FiShield,
} from "react-icons/fi";

/* -------------------- DATA -------------------- */
/* All images below are thematically aligned:
   - MoU/handshake, lecture hall, coding test, interview panels, career fair. */

// For Colleges
const colleges = [
  {
    title: "MoU-based Placement Drives",
    copy:
      "Structured, year-round drives with transparent reporting and one-point coordination.",
    // MoU/handshake
    img:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1600&auto=format&fit=crop",
    bullets: [
      "MoU-based placement drives",
      "transparent KPIs & reports",
      "single-point coordination",
    ],
    icon: <FiCalendar aria-hidden="true" />,
  },
  {
    title: "Industry Exposure & Internships",
    copy:
      "Capstone projects, internships, and skill bridges designed with hiring teams.",
    // students coding / lab work
    img:
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=1600&auto=format&fit=crop",
    bullets: [
      "internships & live projects",
      "industry mentoring",
      "assessment to onboarding",
    ],
    icon: <FiLayers aria-hidden="true" />,
  },
  {
    title: "Corporate Guest Lectures",
    copy:
      "Leaders from industry on campus for tools, stacks, and career paths.",
    // lecture hall / audience
    img:
      "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?q=80&w=1600&auto=format&fit=crop",
    bullets: [
      "corporate guest lectures",
      "latest tools & stacks",
      "career guidance",
    ],
    icon: <FiUsers aria-hidden="true" />,
  },
];

// For Companies
const companies = [
  
  {
    title: "Bulk Fresher Hiring",
    copy: "High-intent batches from target campuses, filtered to your skill matrix.",
    badge: "2–4 week cycle",
    img: "/bulk.jpg", // ✅ from public folder
    icon: <FiBriefcase aria-hidden="true" />,
  },
  {
    title: "Pre-Screened Student Batches",
    copy: "Aptitude, coding, and communication screens before interview day.",
    badge: "ready to deploy",
    img: "/Batches.jpg",
    icon: <FiTrendingUp aria-hidden="true" />,
  },
  {
    title: "Custom Recruitment Events",
    copy: "Hackathons, case marathons, and assessment centers.",
    badge: "tailored events",
    img: "/CRP.jpg",
    icon: <FiCalendar aria-hidden="true" />,
  },
];



// Timeline (icons)
const steps = [
  { label: "campus shortlisting", icon: <FiMapPin aria-hidden="true" /> },
  { label: "MoU & scheduling", icon: <FiFileText aria-hidden="true" /> },
  { label: "pre-screen & L1 tests", icon: <FiCheckCircle aria-hidden="true" /> },
  { label: "interviews & offers", icon: <FiBriefcase aria-hidden="true" /> },
  { label: "onboarding & MIS", icon: <FiShield aria-hidden="true" /> },
];

// 24 colorful logos (Clearbit) — reliable + fast
const partnerLogos = [
  { alt: "google", src: "https://logo.clearbit.com/google.com" },
  { alt: "microsoft", src: "https://logo.clearbit.com/microsoft.com" },
  { alt: "ibm", src: "https://logo.clearbit.com/ibm.com" },
  { alt: "amazon", src: "https://logo.clearbit.com/amazon.com" },
  { alt: "adobe", src: "https://logo.clearbit.com/adobe.com" },
  { alt: "intel", src: "https://logo.clearbit.com/intel.com" },
  { alt: "cisco", src: "https://logo.clearbit.com/cisco.com" },
  { alt: "shopify", src: "https://logo.clearbit.com/shopify.com" },
  { alt: "facebook", src: "https://logo.clearbit.com/facebook.com" },
  { alt: "linkedin", src: "https://logo.clearbit.com/linkedin.com" },
  { alt: "twitter", src: "https://logo.clearbit.com/twitter.com" },
  { alt: "tesla", src: "https://logo.clearbit.com/tesla.com" },
  { alt: "uber", src: "https://logo.clearbit.com/uber.com" },
  { alt: "airbnb", src: "https://logo.clearbit.com/airbnb.com" },
  { alt: "spotify", src: "https://logo.clearbit.com/spotify.com" },
  { alt: "netflix", src: "https://logo.clearbit.com/netflix.com" },
  { alt: "slack", src: "https://logo.clearbit.com/slack.com" },
  { alt: "zoom", src: "https://logo.clearbit.com/zoom.us" },
  { alt: "oracle", src: "https://logo.clearbit.com/oracle.com" },
  { alt: "paypal", src: "https://logo.clearbit.com/paypal.com" },
  { alt: "salesforce", src: "https://logo.clearbit.com/salesforce.com" },
  { alt: "sap", src: "https://logo.clearbit.com/sap.com" },
  { alt: "dell", src: "https://logo.clearbit.com/dell.com" },
  { alt: "hpe", src: "https://logo.clearbit.com/hpe.com" },
];

/* -------------------- VIEW -------------------- */

export default function CampusHiring() {
  return (
    <main className="campus-page" role="main">
      {/* HERO (image url set in CSS for easy swapping) */}
      <section className="campus-hero" aria-label="Campus hiring hero section">
        <div
          className="campus-hero-media"
          role="img"
          aria-label="career fair and campus placement interaction"
        />
        <div className="campus-hero-overlay" aria-hidden="true" />
        <div className="campus-hero-content">
          <h1 className="campus-hero-title">Building Careers, Campus by Campus</h1>
          <p className="campus-hero-tagline">
            End-to-end campus hiring that connects colleges, companies, and careers.
          </p>
          <div className="campus-hero-ctas">
            <a href="#partner" className="campus-btn campus-btn-primary" aria-label="Partner With Us">
              Partner With Us
            </a>
            <a href="#book-drive" className="campus-btn campus-btn-outline" aria-label="Book a Drive">
              Book a Drive
            </a>
          </div>

          <ul className="campus-trust-badges" aria-label="trust badges">
            <li className="campus-badge"><FiUsers aria-hidden="true" /><span>pan-india coverage</span></li>
            <li className="campus-badge"><FiClock aria-hidden="true" /><span>fast turnaround</span></li>
            <li className="campus-badge"><FiCheckCircle aria-hidden="true" /><span>pre-screened talent</span></li>
          </ul>
        </div>
      </section>

      {/* FOR COLLEGES */}
      <section className="campus-section" aria-labelledby="campus-colleges-title">
        <h2 id="campus-colleges-title" className="campus-section-title">For Colleges</h2>
        <div className="campus-card-grid">
          {colleges.map((c, i) => (
            <article className="campus-card" key={i} aria-label={c.title}>
              <div
                className="campus-card-media"
                role="img"
                aria-label={`${c.title} image`}
                style={{ backgroundImage: `url(${c.img})` }}
              />
              <div className="campus-card-body">
                <div className="campus-card-icon" aria-hidden="true">{c.icon}</div>
                <h3 className="campus-card-title">{c.title}</h3>
                <p className="campus-card-copy">{c.copy}</p>
                <ul className="campus-card-checks">
                  {c.bullets.map((b, j) => (
                    <li key={j}>
                      <FiCheckCircle aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <a href="#partner" className="campus-link">Talk to Campus Team →</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FOR COMPANIES */}
      <section className="campus-section" aria-labelledby="campus-companies-title">
        <h2 id="campus-companies-title" className="campus-section-title">For Companies</h2>
        <div className="campus-card-grid">
          {companies.map((c, i) => (
            <article className="campus-card" key={i} aria-label={c.title}>
              <div
                className="campus-card-media"
                role="img"
                aria-label={`${c.title} image`}
                style={{ backgroundImage: `url(${c.img})` }}
              />
              <div className="campus-card-body">
                <div className="campus-card-top">
                  <div className="campus-card-icon" aria-hidden="true">{c.icon}</div>
                  <span className="campus-badge-chip" aria-label="badge">{c.badge}</span>
                </div>
                <h3 className="campus-card-title">{c.title}</h3>
                <p className="campus-card-copy">{c.copy}</p>
                <a href="#book-drive" className="campus-link">Request Profiles →</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PROCESS STRIP */}
      <section className="campus-process" aria-labelledby="campus-process-title">
        <h2 id="campus-process-title" className="campus-process-title">How a Drive Works</h2>
        <ol className="campus-timeline" aria-label="drive process timeline">
          {steps.map((s, i) => (
            <li key={i} className="campus-timeline-step">
              <div className="campus-timeline-node" aria-hidden="true">{s.icon}</div>
              <p className="campus-timeline-label">{s.label}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* LOGO STRIP — one-row marquee moving left → right */}
      <section className="campus-logos" aria-label="partner company logos">
        <div className="marquee-viewport">
          <div className="marquee-track marquee-right">
            {[...partnerLogos, ...partnerLogos].map((logo, i) => (
              <div className="marquee-logo" key={i}>
                <img
                  className="marquee-logo-img"
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://dummyimage.com/120x36/e9eef6/6b7280.png&text=" +
                      encodeURIComponent(logo.alt);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
