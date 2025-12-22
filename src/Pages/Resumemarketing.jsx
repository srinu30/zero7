// File: src/Pages/Resumemarketing.jsx

import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";

const Resumemarketing = () => {
  const [animatedIcons, setAnimatedIcons] = useState([false, false, false]);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisAnimations, setAnalysisAnimations] = useState({
    score: false,
    sections: false,
    keywords: false,
    recommendations: false
  });
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimatedIcons([true, false, false]), 300);
    const t2 = setTimeout(() => setAnimatedIcons([true, true, false]), 600);
    const t3 = setTimeout(() => setAnimatedIcons([true, true, true]), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    if (analysisResult) {
      const timer1 = setTimeout(() => setAnalysisAnimations(prev => ({...prev, score: true})), 300);
      const timer2 = setTimeout(() => setAnalysisAnimations(prev => ({...prev, sections: true})), 800);
      const timer3 = setTimeout(() => setAnalysisAnimations(prev => ({...prev, keywords: true})), 1300);
      const timer4 = setTimeout(() => setAnalysisAnimations(prev => ({...prev, recommendations: true})), 1800);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [analysisResult]);

  const acceptTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  const maxSizeMB = 5;

  const validateFile = (f) => {
    if (!acceptTypes.includes(f.type)) return "Only PDF & DOCX are allowed.";
    if (f.size > maxSizeMB * 1024 * 1024) return `Max Size ${maxSizeMB} MB`;
    return null;
  };

  const pickFile = (f) => {
    const err = validateFile(f);
    if (err) { alert(err); return; }
    setFile(f);
    setAnalysisResult(null);
    setShowTemplates(false);
    setAnalysisAnimations({
      score: false,
      sections: false,
      keywords: false,
      recommendations: false
    });
  };

  const onInputChange = (e) => {
    if (e.target.files?.[0]) pickFile(e.target.files[0]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) pickFile(f);
  };

  const startUpload = async () => {
    if (!file) { inputRef.current?.focus(); return; }
    setUploading(true);
    setProgress(0);
    setAnalysisResult(null);
    setShowTemplates(false);

    const formData = new FormData();
    formData.append('resumeFile', file); 

    try {
      const response = await api.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      setTimeout(() => {
        setAnalysisResult(response.data);
        setUploading(false);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }, 1200);

    } catch (error) {
      console.error("Upload failed:", error);
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      alert(`Error: ${errorMessage}`);
      setUploading(false);
      setProgress(0);
    }
  };

  const handleShowTemplates = () => setShowTemplates(!showTemplates);

  const templates = [
    { id: 1, name: "Classic ATS Template", img: "/templates/template1.png", description: "Clean, traditional format preferred by corporate ATS systems" },
    { id: 2, name: "Modern ATS Template", img: "/templates/template2.png", description: "Contemporary design with optimal keyword placement" },
    { id: 3, name: "Executive ATS Template", img: "/templates/template3.png", description: "Professional layout for senior-level positions" },
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getScoreBadge = (score) => {
    if (score >= 85) return { text: "🎉 Excellent ATS Score!", class: "excellent" };
    if (score >= 75) return { text: "👍 Great ATS Score", class: "great" };
    if (score >= 65) return { text: "✅ Good ATS Score", class: "good" };
    return { text: "💡 Room for Improvement", class: "improve" };
  };

  const AnimatedScoreCircle = ({ score, size = 160 }) => {
    const [animatedScore, setAnimatedScore] = useState(0);
    
    useEffect(() => {
      if (analysisAnimations.score) {
        let start = 0;
        const duration = 1500;
        const startTime = Date.now();
        
        const animate = () => {
          const now = Date.now();
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentScore = Math.floor(score * easeOutQuart);
          
          setAnimatedScore(currentScore);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      }
    }, [analysisAnimations.score, score]);

    const circumference = 2 * Math.PI * 68;
    const strokeDashoffset = circumference * (1 - animatedScore / 100);

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 160 160" className="transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="68"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          <circle
            cx="80"
            cy="80"
            r="68"
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            className="transition-all duration-1500 ease-out"
            style={{ strokeDashoffset }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div 
              className="text-4xl font-bold transition-all duration-500"
              style={{ color: getScoreColor(score) }}
            >
              {animatedScore}
            </div>
            <div className="text-sm text-gray-500 mt-1">SCORE</div>
          </div>
        </div>
        
        {analysisAnimations.score && (
          <>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-float"
                style={{
                  backgroundColor: getScoreColor(score),
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.3}s`,
                  opacity: 0.6
                }}
              />
            ))}
          </>
        )}
      </div>
    );
  };

  const AnimatedSectionBar = ({ section, score, delay = 0 }) => {
    const [animatedWidth, setAnimatedWidth] = useState(0);

    useEffect(() => {
      if (analysisAnimations.sections) {
        setTimeout(() => {
          setAnimatedWidth(score);
        }, delay);
      }
    }, [analysisAnimations.sections, score, delay]);

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-800 text-lg capitalize">
            {section.replace(/([A-Z])/g, ' $1')}
          </h4>
          <span 
            className="font-bold text-xl transition-all duration-1000"
            style={{ color: getScoreColor(score) }}
          >
            {animatedWidth}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ 
              width: `${animatedWidth}%`, 
              backgroundColor: getScoreColor(score),
            }}
          >
            <div className="absolute inset-0 bg-white animate-pulse opacity-20"></div>
          </div>
        </div>
      </div>
    );
  };

  const AnimatedKeywordTag = ({ keyword, type, index }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      if (analysisAnimations.keywords) {
        setTimeout(() => {
          setVisible(true);
        }, index * 80);
      }
    }, [analysisAnimations.keywords, index]);

    return (
      <span
        className={`
          inline-block px-4 py-2 rounded-full text-sm font-medium m-1 transition-all duration-500 transform cursor-pointer
          ${visible 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-50 translate-y-4'
          }
          ${type === 'found' 
            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 hover:from-green-200 hover:to-emerald-200 hover:scale-110 shadow-sm' 
            : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200 hover:from-red-200 hover:to-pink-200 hover:scale-110 shadow-sm'
          }
        `}
      >
        {keyword}
      </span>
    );
  };

  const AnimatedRecommendationCard = ({ rec, index }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      if (analysisAnimations.recommendations) {
        setTimeout(() => {
          setVisible(true);
        }, index * 200);
      }
    }, [analysisAnimations.recommendations, index]);

    return (
      <div
        className={`
          bg-white rounded-2xl p-6 shadow-lg border-l-4 transition-all duration-700 transform hover:scale-105
          ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
        `}
        style={{ borderLeftColor: getPriorityColor(rec.priority) }}
      >
        <div className="flex items-center justify-between mb-3">
          <span 
            className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
            style={{ backgroundColor: getPriorityColor(rec.priority) }}
          >
            {rec.priority.toUpperCase()}
          </span>
          <span className="text-sm text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">{rec.category}</span>
        </div>
        <h5 className="font-semibold text-gray-800 text-lg mb-2">{rec.message}</h5>
        <p className="text-gray-600">{rec.suggestion}</p>
        
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-2000 ease-out"
            style={{ 
              width: visible ? '100%' : '0%',
              backgroundColor: getPriorityColor(rec.priority)
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            Advanced Resume Analysis & ATS Optimization
          </h1>
          <p className="text-lg text-center text-gray-600 mt-2 max-w-3xl mx-auto">
            Comprehensive Resume Marketing — Optimized for ATS Systems + Human Recruiters
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Why Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Comprehensive Resume Analysis?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get detailed insights into how your resume performs in today's competitive job market
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18zM3.75 6.75h4.5a.75.75 0 100-1.5h-4.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM9 15.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">ATS Compatibility Score</h3>
              <p className="text-gray-600 text-center">
                Detailed analysis of how well your resume parses through Applicant Tracking Systems with section-by-section scoring.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Industry-Specific Keywords</h3>
              <p className="text-gray-600 text-center">
                Targeted keyword analysis for your specific industry with missing essential skills identification.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Personalized Recommendations</h3>
              <p className="text-gray-600 text-center">
                Actionable insights with priority-based suggestions to improve your resume's effectiveness.
              </p>
            </div>
          </div>
        </section>

        {/* How Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Comprehensive Analysis Process</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                animatedIcons[0] ? 'bg-blue-100 scale-110 rotate-0' : 'bg-gray-100 scale-90 rotate-180'
              }`}>
                <svg className={`w-10 h-10 transition-all duration-500 ${
                  animatedIcons[0] ? 'text-blue-600 scale-100' : 'text-gray-400 scale-50'
                }`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Deep Resume Parsing</h3>
              <p className="text-gray-600">
                Extract contact info, education, experience, skills, certifications, and achievements with semantic analysis.
              </p>
            </div>

            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                animatedIcons[1] ? 'bg-green-100 scale-110 rotate-0' : 'bg-gray-100 scale-90 rotate-180'
              }`}>
                <svg className={`w-10 h-10 transition-all duration-500 ${
                  animatedIcons[1] ? 'text-green-600 scale-100' : 'text-gray-400 scale-50'
                }`} fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Multi-Dimensional Scoring</h3>
              <p className="text-gray-600">
                Comprehensive scoring across contact info, education, experience, keywords, achievements, and formatting.
              </p>
            </div>

            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                animatedIcons[2] ? 'bg-purple-100 scale-110 rotate-0' : 'bg-gray-100 scale-90 rotate-180'
              }`}>
                <svg className={`w-10 h-10 transition-all duration-500 ${
                  animatedIcons[2] ? 'text-purple-600 scale-100' : 'text-gray-400 scale-50'
                }`} fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Industry-Specific Insights</h3>
              <p className="text-gray-600">
                Automatic industry detection and targeted recommendations based on your career field and experience level.
              </p>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Upload Your Resume for Comprehensive Analysis</h2>
            </div>
            
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div
                className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragging ? 'border-blue-500 bg-blue-50 scale-105' : 
                  file ? 'border-green-500 bg-green-50' : 
                  'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
              >
                <div className={`w-20 h-20 mx-auto mb-6 transition-all duration-300 ${
                  isDragging ? 'scale-110 text-blue-500' : 
                  file ? 'text-green-500' : 'text-gray-400'
                }`}>
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {file ? 'Resume Selected!' : 'Drop your resume here or click to browse'}
                </h3>
                <p className="text-gray-600">
                  Supports PDF and DOCX files up to {maxSizeMB}MB
                </p>
                <input
                  type="file"
                  ref={inputRef}
                  onChange={onInputChange}
                  accept={acceptTypes.join(",")}
                  className="hidden"
                />
              </div>

              {file && (
                <div className="mt-6 bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{file.name}</div>
                      <div className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFile(null)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              )}

              <button
                className={`w-full mt-6 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  !file || uploading 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg'
                }`}
                onClick={startUpload}
                disabled={!file || uploading}
              >
                {uploading ? `Analyzing... ${progress}%` : "Start Comprehensive Analysis"}
              </button>

              {uploading && (
                <div className="mt-6">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-3 bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-300 rounded-full relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white animate-pulse opacity-30"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {['Parsing Resume', 'Analyzing Content', 'Generating Insights'].map((step, index) => (
                      <div key={step} className="text-center">
                        <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                          progress > (index * 33) ? 'bg-green-400 animate-pulse' : 'bg-gray-300'
                        }`}></div>
                        <p className="text-sm text-gray-600">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Analysis Results */}
        {analysisResult && (
          <section ref={resultsRef} className="mb-20">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                <h2 className="text-4xl font-bold text-center mb-2">Comprehensive Resume Analysis Results</h2>
                <p className="text-center text-blue-100 text-lg">Your resume has been analyzed with advanced ATS algorithms</p>
              </div>

              <div className="p-8">
                {/* Score Overview */}
                <div className="flex flex-col lg:flex-row items-center justify-between mb-12">
                  <div className={`transition-all duration-1000 transform ${
                    analysisAnimations.score ? 'scale-100 rotate-0' : 'scale-50 rotate-180'
                  }`}>
                    <AnimatedScoreCircle score={analysisResult.overallScore} />
                  </div>
                  <div className={`text-center lg:text-left mt-8 lg:mt-0 transition-all duration-1000 delay-500 ${
                    analysisAnimations.score ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">Overall ATS Score</h3>
                    <p className="text-gray-600 mb-6 max-w-md text-lg">Your resume's compatibility with Applicant Tracking Systems</p>
                    <div className={`inline-block px-6 py-3 rounded-full text-white font-bold text-lg mb-6 transition-all duration-1000 shadow-lg ${
                      analysisAnimations.score ? 'scale-100' : 'scale-0'
                    } ${
                      getScoreBadge(analysisResult.overallScore).class === 'excellent' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      getScoreBadge(analysisResult.overallScore).class === 'great' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                      getScoreBadge(analysisResult.overallScore).class === 'good' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      'bg-gradient-to-r from-red-500 to-pink-500'
                    }`}>
                      {getScoreBadge(analysisResult.overallScore).text}
                    </div>
                    <div className="flex gap-4 justify-center lg:justify-start">
                      <span className="bg-white/80 backdrop-blur-sm text-blue-800 px-4 py-2 rounded-full text-sm font-semibold border border-blue-200">
                        Industry: {analysisResult.industry}
                      </span>
                      <span className="bg-white/80 backdrop-blur-sm text-purple-800 px-4 py-2 rounded-full text-sm font-semibold border border-purple-200">
                        Level: {analysisResult.jobLevel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-3 mb-8 justify-center">
                  {['overview', 'sections', 'keywords', 'recommendations', 'extracted'].map((tab) => (
                    <button
                      key={tab}
                      className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                        activeTab === tab 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-96">
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(analysisResult.sectionScores).map(([section, score], index) => (
                        <AnimatedSectionBar
                          key={section}
                          section={section}
                          score={score}
                          delay={index * 200}
                        />
                      ))}
                    </div>
                  )}

                  {activeTab === 'sections' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {Object.entries(analysisResult.sectionScores).map(([section, score], index) => (
                        <div
                          key={section}
                          className={`bg-white rounded-2xl p-6 shadow-xl border transition-all duration-1000 transform hover:scale-105 ${
                            analysisAnimations.sections ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                          }`}
                          style={{ transitionDelay: `${index * 150}ms` }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-bold text-gray-800 capitalize">
                              {section.replace(/([A-Z])/g, ' $1')}
                            </h4>
                            <div 
                              className="text-2xl font-bold"
                              style={{ color: getScoreColor(score) }}
                            >
                              {score}/100
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                            <div
                              className="h-4 rounded-full transition-all duration-2000 ease-out"
                              style={{ 
                                width: `${score}%`, 
                                backgroundColor: getScoreColor(score),
                              }}
                            />
                          </div>
                          <p className="text-gray-600">
                            {section === 'contactInfo' && 'Contact information completeness and accessibility'}
                            {section === 'education' && 'Education section strength and relevance'}
                            {section === 'experience' && 'Work experience quality and impact demonstration'}
                            {section === 'skills' && 'Skills section optimization and technical proficiency'}
                            {section === 'keywords' && 'Industry keyword usage and strategic placement'}
                            {section === 'formatting' && 'Document structure, formatting, and ATS compatibility'}
                            {section === 'achievements' && 'Quantifiable achievements and measurable impact'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'keywords' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-100">
                        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                          <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                          Keywords Found ({analysisResult.keywordsFound.length})
                        </h4>
                        <div className="flex flex-wrap">
                          {analysisResult.keywordsFound.map((keyword, index) => (
                            <AnimatedKeywordTag
                              key={index}
                              keyword={keyword}
                              type="found"
                              index={index}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-red-100">
                        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                          <span className="w-3 h-3 bg-red-400 rounded-full mr-3 animate-pulse"></span>
                          Keywords Missing ({analysisResult.keywordsMissing.length})
                        </h4>
                        <div className="flex flex-wrap">
                          {analysisResult.keywordsMissing.map((keyword, index) => (
                            <AnimatedKeywordTag
                              key={index}
                              keyword={keyword}
                              type="missing"
                              index={index}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'recommendations' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {analysisResult.recommendations.map((rec, index) => (
                        <AnimatedRecommendationCard
                          key={index}
                          rec={rec}
                          index={index}
                        />
                      ))}
                    </div>
                  )}

                  {activeTab === 'extracted' && analysisResult.extractedData && (
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h4>
                          <div className="space-y-3">
                            {[
                              { label: 'Name', value: analysisResult.extractedData.name },
                              { label: 'Email', value: analysisResult.extractedData.email },
                              { label: 'Phone', value: analysisResult.extractedData.phone },
                              { label: 'Location', value: analysisResult.extractedData.location }
                            ].map((item, index) => (
                              <div key={item.label} className="flex justify-between items-center py-3 border-b border-gray-200">
                                <span className="font-semibold text-gray-600">{item.label}:</span>
                                <span className={`font-medium ${item.value ? 'text-green-600' : 'text-red-500'}`}>
                                  {item.value || 'Not found'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {analysisResult.extractedData.skills.technical.length > 0 && (
                          <div>
                            <h4 className="text-xl font-bold text-gray-800 mb-4">Technical Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.extractedData.skills.technical.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200 hover:scale-105 transition-transform duration-300"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Templates Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">ATS-Optimized Resume Templates</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Professionally designed templates that maximize ATS compatibility
            </p>
          </div>
          
          <div className="text-center mb-8">
            <button 
              onClick={handleShowTemplates}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {showTemplates ? "Hide Templates" : "View Recommended Templates"}
            </button>
          </div>

          {showTemplates && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {templates.map((template) => (
                <div key={template.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm">Template Preview</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{template.name}</h4>
                    <p className="text-gray-600 mb-4">{template.description}</p>
                    <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200">
                      Use This Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Resumemarketing;
