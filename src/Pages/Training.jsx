import React from 'react';
import './Training.css'; // updated CSS filename to match component name

const Training = () => {
  // IT Programs data
  const itPrograms = [
    {
      id: 1,
      title: "Full Stack Development",
      description: "Master front-end and back-end technologies",
      price: "₹15,000",
      icon: "💻"
    },
    {
      id: 2,
      title: "Cloud & DevOps",
      description: "Learn cloud infrastructure and CI/CD pipelines",
      price: "₹40,000",
      icon: "☁️"
    },
    {
      id: 3,
      title: "Data Science & AI",
      description: "Explore machine learning and data analysis",
      price: "₹45,000",
      icon: "📊"
    },
    {
      id: 4,
      title: "Software Testing",
      description: "Become an expert in QA and automation",
      price: "₹30,000",
      icon: "🔍"
    }
  ];

  // Non-IT Programs data
  const nonItPrograms = [
    {
      id: 5,
      title: "HR Management",
      description: "Modern HR practices and talent management",
      price: "₹25,000",
      icon: "👥"
    },
    {
      id: 6,
      title: "Digital Marketing",
      description: "Master SEO, social media, and online campaigns",
      price: "₹28,000",
      icon: "📱"
    },
    {
      id: 7,
      title: "Business Analysis",
      description: "Develop strategic business insights",
      price: "₹32,000",
      icon: "📈"
    },
    {
      id: 8,
      title: "Finance & Payroll",
      description: "Financial management and payroll systems",
      price: "₹27,000",
      icon: "💰"
    }
  ];

  return (
    <div className="digital-courses-container">
      <header className="page-header">
        <h1>Digital Courses</h1>
        <p>Enhance your skills with our industry-relevant programs</p>
      </header>

      <section className="programs-section">
        <h2>IT Programs</h2>
        <div className="courses-grid">
          {itPrograms.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="programs-section">
        <h2>Non-IT Programs</h2>
        <div className="courses-grid">
          {nonItPrograms.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
};

// Reusable Course Card Component
const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
      <div className="course-icon">{course.icon}</div>
      <h3 className="course-title">{course.title}</h3>
      <p className="course-description">{course.description}</p>
      <div className="course-price">{course.price}</div>
      <button className="learn-more-btn">Learn More</button>
    </div>
  );
};

export default Training;
