// File: src/App.js

import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import About from './Pages/About';
import Services from './Pages/Services';
import Testimonials from './Pages/Testimonials';
import Blog from './Pages/Blog';
import FAQs from './Pages/FAQs';
import Contact from './Pages/Contact';
import CollegeConnect from './Pages/CollegeConnect';
import BenchList from './Pages/BenchList';
import FloatingWhatsApp from './Components/FloatingWhatsApp';
import Footer from './Components/Footer';
import AdminLayout from './Pages/AdminLayout';
import AdminDashboard from './Pages/AdminDashboard';
import AdminItPrograms from './Pages/AdminItPrograms';
import AdminNonItPrograms from './Pages/AdminNonItPrograms';
import AdminForms from './Components/AdminHomeForm';
import CurrentHirings from './Pages/CurrentHirings';
import AdminManageJobs from './Pages/AdminManageJobs';
import AdminViewApplications from './Pages/AdminViewApplications';
import NewBatchDashboard from './Pages/NewBatchDashboard.jsx';
import Login from './Pages/admin/Login';
import NewBatches from './Pages/NewBatches';
import ManageBlogs from './Pages/ManageBlogs';
import AdminManageCandidates from './Pages/AdminManageCandidates';
import AdminViewRequests from './Pages/AdminViewRequests';
import AdminManageManagers from './Pages/AdminManageManagers';
import AdminManageRecruiters from './Pages/AdminManageRecruiters';
import DigitalCourses from './Pages/DigitalCourses.jsx';
import PayrollServices from './Pages/PayrollServices.jsx';
import Resumemarketing from './Pages/Resumemarketing.jsx';
import Ittraining from './Pages/Ittraining.jsx';
import Nonittraining from './Pages/Nonittraining.jsx';
import ViewEnrollments from './Pages/AdminStudentEnrollment.jsx';
import InterviewTracker from './Pages/AdminInterviews.jsx';
import AdminManageCompanies from './Pages/AdminManageCompanies.jsx';
import AdminCandidateApprovals from './Pages/AdminCandidateApprovals.jsx';
import AdminInterviewApprovals from './Pages/AdminInterviewApprovals.jsx';
import PlacedCandidates from './Pages/Adminplacedcandidates.jsx';
import AdminDigitalCoursesEnrollment from './Pages/AdminDigitalCoursesEnrollment';
import AdminContactInquiries from './Pages/AdminContactInquiries';
import AdminPayrollRequests from './Pages/AdminPayrollRequests';
import AdminManageOffer from './Pages/AdminManageOffer';
import AdminBatchEnrollments from './Pages/AdminBatchEnrollments';
// Ensure ResumeWriting is correctly handled if you re-add it
 import ResumeWriting from './Pages/ResumeWriting.jsx';
import { NotificationProvider } from './context/NotificationContext';
import AdminUserPage from './Pages/AdminUserPage.jsx';
import ResumeBuilder from './Pages/ResumeBuilder.jsx'; // Make sure this path is correct
import './App.css';

const LoginPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (Cookie.get('token')) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLoginSuccess = () => {
    navigate('/admin/dashboard');
  };
  return <Login onLogin={handleLoginSuccess} />;
};

const PrivateRoute = ({ children }) => {
  return Cookie.get('token') ? children : <Navigate to='/admin' replace />;
};

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <NotificationProvider>
      <div className='App'>
        {!isAdminPage && <Navbar />}
        <div className='content'>
          <Routes>
            {/* --- Public Routes --- */}
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/services' element={<Services />}>
              {/* --- CORRECTED NESTED ROUTES FOR SERVICES --- */}
              <Route path='it-training' element={<Ittraining />} />
              <Route path='non-it-training' element={<Nonittraining />} />
               <Route path='resume-Writing' element={<ResumeWriting />} /> 
              <Route path='payroll-services' element={<PayrollServices />} />
              <Route path='resume-marketing' element={<Resumemarketing />} />
              <Route path='college-connect' element={<CollegeConnect />} />
              {/* --- ADDED THE CORRECT ROUTE FOR RESUME BUILDER HERE --- */}
              <Route path='resume-building' element={<ResumeBuilder />} />
            </Route>
            <Route path='/testimonials' element={<Testimonials />} />
            <Route path='/new-batches' element={<NewBatches />} />
            <Route path='/bench-list' element={<BenchList />} />
            <Route path='/blog' element={<Blog />} />
            <Route path='/faqs' element={<FAQs />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/college-connect' element={<CollegeConnect />} />
            <Route path='/current-hirings' element={<CurrentHirings />} />
            <Route path='/digital-courses' element={<DigitalCourses />} />
            
            {/* The standalone /resumebuilding route has been removed */}
                      
            {/* --- Admin Login Route --- */}
            <Route path='/admin' element={<LoginPage />} />

            {/* --- Protected Admin Routes --- */}
            <Route
              path='/admin'
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route path='dashboard' element={<AdminDashboard />} />
              <Route path='userPage/:id' element={<AdminUserPage />} />
              <Route path='it-programs' element={<AdminItPrograms />} />
              <Route path='non-it-programs' element={<AdminNonItPrograms />} />
              <Route path='forms' element={<AdminForms />} />
              <Route path='manage-jobs' element={<AdminManageJobs />} />
              <Route path='applications' element={<AdminViewApplications />} />
              <Route path='new-batch-dashboard' element={<NewBatchDashboard />} />
              <Route path='manage-blogs' element={<ManageBlogs />} />
              <Route path='studentenrollment' element={<ViewEnrollments />} />
              <Route path='interviews' element={<InterviewTracker />} />
              <Route path='interviews/approvals' element={<AdminInterviewApprovals />} />
              <Route path='placedcandidates' element={<PlacedCandidates />} />
              <Route path='companies' element={<AdminManageCompanies />} />
              <Route path='manage-candidates' element={<AdminManageCandidates />} />
              <Route path='candidateList' element={<AdminCandidateApprovals />} />
              <Route path='view-requests' element={<AdminViewRequests />} />
              <Route path='manage-managers' element={<AdminManageManagers />} />
              <Route path='manage-recruiters' element={<AdminManageRecruiters />} />
              <Route path='digital-courses-enrollment' element={<AdminDigitalCoursesEnrollment />} />
              <Route path='contact-inquiries' element={<AdminContactInquiries />} />
              <Route path='payroll-requests' element={<AdminPayrollRequests />} />
              <Route path='manage-offer' element={<AdminManageOffer />} />
              <Route path='batch-enrollments' element={<AdminBatchEnrollments />} />
            </Route>
          </Routes>
        </div>
        {!isAdminPage && <Footer />}
        {!isAdminPage && <FloatingWhatsApp />}
      </div>
    </NotificationProvider>
  );
}

export default App;