import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  ChatBubbleLeftRightIcon, 
  PencilSquareIcon, 
  DocumentArrowDownIcon, 
  UserGroupIcon, 
  CalendarDaysIcon,
  StarIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  SparklesIcon,
  RocketLaunchIcon, // Icon for the new button
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const ResumeWriting = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [animated, setAnimated] = useState(false);

  const handleNavigateToContact = () => {
    navigate('/contact');
  };

  // New handler to navigate to the Resume Builder page
  const handleNavigateToResumeBuilder = () => {
    navigate('/services/resume-building');
  };

  useEffect(() => {
    setIsVisible(true);
    setAnimated(true);
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-30 animate-bounce delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-sky-200 rounded-full blur-3xl opacity-25 animate-ping delay-700"></div>
      </div>

      {/* --- Hero Section --- */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-sky-600 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center transform scale-105 animate-zoom-in-out"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-800/70 to-sky-900/70"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-300 opacity-30 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-cyan-300 opacity-40 rounded-full animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-sky-300 opacity-35 rounded-full animate-float-fast"></div>
        <div className="absolute top-1/3 right-20 w-20 h-20 bg-blue-400 opacity-30 rounded-full animate-float-slow delay-500"></div>

        <div className={`max-w-6xl mx-auto text-center px-4 relative z-10 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-8 animate-pulse hover:scale-110 transition-transform duration-300">
            <SparklesIcon className="h-5 w-5 text-yellow-300 animate-spin" />
            <span className="text-sm font-semibold text-white">Trusted by 5,000+ Professionals</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight animate-fade-in-up">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent animate-gradient-x">Get Hired</span>
            </h1>
            
            <p className="text-2xl md:text-3xl mb-12 max-w-4xl mx-auto leading-relaxed font-light text-white animate-fade-in-up delay-300">
            Professional resume writing that gets you <span className="font-bold text-yellow-300 animate-pulse">5x more interviews</span> and lands your dream job
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-2xl mx-auto animate-fade-in-up delay-500">
            {[
                { number: "98%", label: "Interview success Rate" },
                { number: "24-72h", label: "Delivery" },
                { number: "5000+", label: "Resumes Written" },
                { number: "4.9/5", label: "Client Rating" }
            ].map((stat, index) => (
                <div key={index} className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-2 animate-bounce" style={{animationDelay: `${index * 200}ms`}}>
                    {stat.number}
                </div>
                <div className="text-sm text-blue-100">{stat.label}</div>
                </div>
            ))}
            </div>
        </div>
      </section>
      
      <section className="relative py-24 px-4 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/50 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              What sets us <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Apart</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge technology with human expertise to create resumes that stand out.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Resume Writing</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Customized to your career objectives and the positions you are seeking.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-green-100 to-emerald-50 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tailored to be ATS-Friendly</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Created to be compatible with Applicant Tracking Systems that 99% of Fortune 500 companies use.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-yellow-100 to-amber-50 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">99% Client Success Rate</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Our team has demonstrated proven results across every industry and level of experience.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-pink-100 to-rose-50 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Guarantee of Excellence</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Each resume is reviewed multiple times to ensure clarity, precision, and professionalism.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-indigo-100 to-cyan-50 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">30-Day Interview Guarantee</h3>
              <p className="text-gray-600 text-sm leading-relaxed">We guarantee your resume will help you land interviews within 30 days — or we’ll rewrite it for free.</p>
            </div>
          </div>
          
          <div className="mt-12 text-center"></div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center mt-16">
            <div className="relative animate-fade-in-left">
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-700">
                <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Professional Resume" className="rounded-3xl shadow-2xl"/>
              </div>
              <div className="absolute -top-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl z-20 transform hover:scale-110 transition-all duration-300 animate-float-slow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><CheckCircleIcon className="h-6 w-6 text-blue-600" /></div>
                  <div>
                    <div className="font-bold text-gray-900">ATS Optimized</div>
                    <div className="text-sm text-gray-600">99% Success Rate</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-2xl z-20 transform hover:scale-110 transition-all duration-300 animate-float-medium delay-500">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center"><ShieldCheckIcon className="h-6 w-6 text-cyan-600" /></div>
                  <div>
                    <div className="font-bold text-gray-900">Quality Guarantee</div>
                    <div className="text-sm text-gray-600">30-Day Promise</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 animate-fade-in-right">
              {[
                { icon: <UserGroupIcon className="h-8 w-8" />, title: "Industry Expert Writers", description: "Our certified writers, with experience in leading global organizations, possess deep industry insight to craft resumes that align perfectly with what hiring managers are looking for", color: "from-blue-500 to-cyan-500", delay: "delay-100" },
                { icon: <CheckCircleIcon className="h-8 w-8" />, title: "ATS Optimization", description: "Every resume is optimized to pass through Applicant Tracking Systems used by 99% of Fortune 500 companies.", color: "from-blue-500 to-sky-500", delay: "delay-200" },
                { icon: <SparklesIcon className="h-8 w-8" />, title: "Premium Design", description: "Stand out with modern, visually appealing templates that remain clean, professional, and recruiter-friendly", color: "from-sky-500 to-blue-600", delay: "delay-300" },
                { icon: <CalendarDaysIcon className="h-8 w-8" />, title: "Fast Turnaround", description: "Receive your completed, professionally written resume within 24–72 hours", color: "from-cyan-500 to-blue-500", delay: "delay-400" }
              ].map((feature, index) => (
                <div key={index} className={`group flex gap-6 p-6 bg-gradient-to-r from-white to-blue-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-blue-100 animate-fade-in-up ${feature.delay}`}>
                  <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300`}>{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="py-24 px-4 relative bg-gradient-to-br from-blue-600 to-sky-700 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10 animate-zoom-in-out"></div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full opacity-20 animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-cyan-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-5xl font-black mb-6">Our <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">3-Step</span> Process</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">Easy, clear and focused on results — because we know how important it is to get your resume done fast.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: <DocumentArrowDownIcon className="h-12 w-12" />, title: "Tell Us Your Story", description: "Upload your existing resume and let us know what you are looking for in terms of goals, accomplishments, and positions.", image: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", color: "from-blue-500 to-cyan-500", animation: "animate-fade-in-up delay-100" },
              { step: "02", icon: <ChatBubbleLeftRightIcon className="h-12 w-12" />, title: "Expert Consultation", description: "Work one-on-one with your own professional writer to craft and polish your career message and personal brand.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyrP2DiLjt032F-X8K5WGsMC70IiRl9O6N-g&s", color: "from-sky-500 to-blue-600", animation: "animate-fade-in-up delay-200" },
              { step: "03", icon: <PencilSquareIcon className="h-12 w-12" />, title: "Download Your Resume", description: "Download your professionally written, ATS friendly resume in 24-72 hours It's good to go to start applying now.", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", color: "from-cyan-500 to-blue-500", animation: "animate-fade-in-up delay-300" }
            ].map((step, index) => (
              <div key={index} className={`group relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-105 hover:rotate-1 ${step.animation}`}>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl animate-pulse">{step.step}</div>
                <div className="mb-6 overflow-hidden rounded-2xl transform group-hover:scale-110 transition-transform duration-700"><img src={step.image} alt={step.title} className="w-full h-48 object-cover"/></div>
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white mb-6 transform group-hover:rotate-12 transition-transform duration-300`}>{step.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-blue-200 leading-relaxed">{step.description}</p>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Final CTA Section --- */}
      <section className="relative py-32 px-4 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20 animate-zoom-in-out"></div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400 opacity-20 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-cyan-400 opacity-25 rounded-full animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-sky-400 opacity-20 rounded-full animate-float-fast"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <h2 className="text-5xl md:text-7xl font-black mb-8">Ready to <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">Transform</span> Your Career?</h2>
          <p className="text-2xl md:text-3xl mb-12 max-w-3xl mx-auto leading-relaxed text-blue-200">Join thousands of professionals who landed their dream jobs with our resume writing service</p>
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {[
              { value: "24-72h", label: "Delivery Time", color: "text-blue-200" },
              { value: "98%", label: "Success Rate", color: "text-cyan-200" },
              { value: "30-Day", label: "Guarantee", color: "text-sky-200" }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20 transform hover:scale-110 transition-transform duration-300">
                <div className={`text-2xl font-black ${item.color} animate-pulse`}>{item.value}</div>
                <div className="text-sm text-blue-200">{item.label}</div>
              </div>
            ))}
          </div>

          {/* --- UPDATED BUTTONS SECTION --- */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            
            {/* --- NEW "Start My Resume" BUTTON --- */}
            <button 
              onClick={handleNavigateToResumeBuilder}
              className="group bg-white text-blue-600 font-bold py-6 px-16 rounded-2xl hover:bg-blue-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-4 text-xl shadow-lg"
            >
              <RocketLaunchIcon className="h-7 w-7 group-hover:scale-110 transition-transform" />
              Start My Resume
            </button>
            
            {/* Existing "Book Free Consultation" button */}
            <button 
              onClick={handleNavigateToContact}
              className="group bg-transparent border-2 border-white text-white font-bold py-6 px-16 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex items-center justify-center gap-4 text-xl"
            >
              <PlayCircleIcon className="h-7 w-7 group-hover:scale-110 transition-transform" />
              Book Free Consultation
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-blue-300">
            {[
              "No upfront payment required",
              "100% satisfaction guarantee",
              "Secure & confidential"
            ].map((text, index) => (
              <div key={index} className="flex items-center gap-2 transform hover:scale-110 transition-transform duration-300">
                <CheckCircleIcon className="h-5 w-5 text-cyan-400 animate-pulse" />
                {text}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>
    </div>
  );
};

export default ResumeWriting;
