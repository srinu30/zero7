import React, { useState, useEffect } from 'react'
import api from '../api/axios'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Cookie from 'js-cookie'
import Swal from 'sweetalert2'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Setup the localizer by providing the moment Object
const localizer = momentLocalizer(moment)

const InterviewTracker = () => {
  const [interviewData, setInterviewData] = useState([])
  const [calendarEvents, setCalendarEvents] = useState([])
  const [candidateOptions, setCandidateOptions] = useState([])
  const [companyOptions, setCompanyOptions] = useState([])
  const [jobOptions, setJobOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState({})
  const [userRole, setUserRole] = useState({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentEditInterview, setCurrentEditInterview] = useState(null)

  const [showCandidateDetailsModal, setShowCandidateDetailsModal] =
    useState(false)
  const [selectedCandidateDetails, setSelectedCandidateDetails] = useState(null)
  // New state for alerts
  const [alertedInterviews, setAlertedInterviews] = useState(new Set())

  // New state for the upcoming interviews modal
  const [showUpcomingModal, setShowUpcomingModal] = useState(false)

  // State for notification bell
  const [upcomingAlerts, setUpcomingAlerts] = useState([])
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false)

  const fetchInterviews = async () => {
    try {
      setLoading(true)
      const response = await api.get('/interview')
      setInterviewData(response.data)

      console.log(response.data)
      const events = response.data.map((interview) => ({
        title: `${interview.candidateName} @ ${interview.companyName}`,
        start: new Date(interview.date),
        end: new Date(interview.date),
        allDay: true,
        resource: {
          ...interview,
          candidateEmail:
            interview.candidateEmail || 'no-email-provided@example.com',
        },
      }))
      setCalendarEvents(events)
    } catch (error) {
      console.error('Error fetching interviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserInterviews = async (id) => {
    try {
      setLoading(true)
      const response = await api.get(`/interview/user/${id}`)
      setInterviewData(response.data)

      console.log(response.data)
      const events = response.data.map((interview) => ({
        title: `${interview.candidateName} @ ${interview.companyName}`,
        start: new Date(interview.date),
        end: new Date(interview.date),
        allDay: true,
        resource: {
          ...interview,
          candidateEmail:
            interview.candidateEmail || 'no-email-provided@example.com',
        },
      }))
      setCalendarEvents(events)
    } catch (error) {
      console.error('Error fetching interviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOptions = async () => {
    try {
      const response = await api.get('/interview/search')
      console.log(response.data)
      setCandidateOptions(response.data.candidates)
      setCompanyOptions(response.data.companies)
      setJobOptions(response.data.jobs)
    } catch (error) {
      console.error('Error fetching options:', error)
    }
  }

  useEffect(() => {
    fetchOptions()
    const data = Cookie.get('user')
    const res = JSON.parse(data)
    res.role === 'Admin' ? fetchInterviews() : fetchUserInterviews(res.id)
    setUserRole(res.role)
    setUser(res.id)
  }, [showAddForm])

  // Check for upcoming interviews every minute
  useEffect(() => {
    const checkUpcomingInterviews = () => {
      const now = new Date()
      const upcoming = interviewData.filter(
        (interview) =>
          interview.status === 'Scheduled' &&
          new Date(interview.date) - now > 0 &&
          new Date(interview.date) - now <= 15 * 60 * 1000,
      )

      setUpcomingAlerts(upcoming)
    }

    checkUpcomingInterviews()
    const intervalId = setInterval(checkUpcomingInterviews, 60000)
    return () => clearInterval(intervalId)
  }, [interviewData])

  const [newInterview, setNewInterview] = useState({
    candidateName: '',
    companyName: '',
    job: '',
    status: 'Scheduled',
    interviewLevel: '',
    date: '',
  })

  const [editStatus, setEditStatus] = useState('')
  const [editInterviewLevel, setEditInterviewLevel] = useState('')
  const [editinterviewtiming, seteditinterviewtiming] = useState()

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'Completed':
        return 'bg-green-100 text-green-800 border border-green-200'
      case 'Pending Feedback':
        return 'bg-amber-100 text-amber-800 border border-amber-200'
      case 'Offer Extended':
        return 'bg-purple-100 text-purple-800 border border-purple-200'
      case 'Rejected':
        return 'bg-red-100 text-red-800 border border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  const getStatusDot = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-500'
      case 'Completed':
        return 'bg-green-500'
      case 'Pending Feedback':
        return 'bg-amber-500'
      case 'Offer Extended':
        return 'bg-purple-500'
      case 'Rejected':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTodaysInterviews = () => {
    const today = new Date()
    return interviewData.filter((interview) => {
      const interviewDate = new Date(interview.date)
      return (
        interviewDate.getDate() === today.getDate() &&
        interviewDate.getMonth() === today.getMonth() &&
        interviewDate.getFullYear() === today.getFullYear()
      )
    })
  }

  const handleAddInputChange = async (e) => {
    const { name, value } = e.target
    if (name === 'companyName') {
      const jobs = await api.get(`interview/jobSearch/${value}`)
      const data = await jobs.data.jobs
      setJobOptions(data)
    }
    setNewInterview((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    if (
      !newInterview.candidateName ||
      !newInterview.companyName ||
      !newInterview.job ||
      !newInterview.date
    ) {
      alert('Please fill in all fields.')
      return
    }

    setSubmitting(true)
    const sendInterview = {
      userId: user,
      candidateId: newInterview.candidateName,
      jobId: newInterview.job,
      status: newInterview.status,
      companyId: newInterview.companyName,
      date: newInterview.date,
    }

    try {
      await api.post('/interview', sendInterview)
      setShowAddForm(false)
      setNewInterview({
        candidateName: '',
        companyName: '',
        job: '',
        status: 'Scheduled',
        interviewLevel: '',
        date: '',
      })
    } catch (error) {
      console.error('Error adding interview:', error)
      alert(
        'Failed to add interview. ' + (error.response?.data || 'Server Error'),
      )
    } finally {
      setSubmitting(false)
    }
  }

  const openEditModal = (interview) => {
    setCurrentEditInterview(interview)
    setEditStatus(interview.status)
    setEditInterviewLevel(interview.interviewLevel)
    setShowEditModal(true)
  }

  const handleEditStatusChange = (e) => {
    setEditStatus(e.target.value)
  }

  const handleEditInteviewLevelChange = (e) => {
    setEditInterviewLevel(e.target.value)
  }

  const handleEditInteviewtimingChange = (e) => {
    seteditinterviewtiming(e.target.value)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!currentEditInterview) return

    setSubmitting(true)
    try {
      await api.patch(`/interview/${currentEditInterview._id}`, {
        status: editStatus,
        interviewLevel: editInterviewLevel,
        date: editinterviewtiming,
        approvalStatus: 'pending',
      })
      setShowEditModal(false)
      setCurrentEditInterview(null)
      userRole === 'Admin' ? fetchInterviews() : fetchUserInterviews(user)
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status.')
    } finally {
      setSubmitting(false)
    }
  }

  const eventStyleGetter = (event) => {
    const status = event.resource?.status
    let backgroundColor = '#3174ad'

    switch (status) {
      case 'Completed':
        backgroundColor = '#10b981'
        break
      case 'Pending Feedback':
        backgroundColor = '#f59e0b'
        break
      case 'Offer Extended':
        backgroundColor = '#8b5cf6'
        break
      case 'Rejected':
        backgroundColor = '#ef4444'
        break
      default:
        backgroundColor = '#3b82f6'
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        padding: '2px 8px',
      },
    }
  }

  const handleEventClick = (event) => {
    setSelectedCandidateDetails(event.resource)
    setShowCandidateDetailsModal(true)
  }

  // --- New function to handle mail generation and opening ---
  const handleSendMail = (mailType, candidate, interviewDetails) => {
    const interviewDate = new Date(interviewDetails.date)
    const formattedDate = interviewDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const formattedTime = interviewDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

    let subject = ''
    let body = ''

    const commonDetails = `
Interview Details:
━━━━━━━━━━━━━━━━━
📅 Date: ${formattedDate}
🕐 Time: ${formattedTime}
💼 Position: ${interviewDetails.jobRole}
🏢 Company: ${interviewDetails.companyName}
📊 Interview Level: ${interviewDetails.interviewLevel}
`

    switch (mailType) {
      case 'schedule':
        subject = `Interview Confirmation - ${interviewDetails.jobRole} Position at ${interviewDetails.companyName}`
        body = `Dear ${candidate.candidateName},

We are pleased to confirm your interview for the ${interviewDetails.jobRole} position at ${interviewDetails.companyName}.
${commonDetails}
Please ensure you:
• Keep your resume and relevant documents handy
• Prepare questions you'd like to ask about the role

If you need to reschedule or have any questions, please let us know as soon as possible.

We look forward to speaking with you!

Best regards,
Zero7 Technologies
Recruitment Team`
        break
      case 'selected':
        subject = `Congratulations! - Offer for ${interviewDetails.jobRole} Position at ${interviewDetails.companyName}`
        body = `Dear ${candidate.candidateName},

We are thrilled to inform you that you have been selected for the ${interviewDetails.jobRole} position at ${interviewDetails.companyName}!

We were very impressed with your skills and experience during the interview process. We believe you will be a great asset to our team.

We will be in touch shortly with a formal offer letter and details regarding your compensation and benefits.

In the meantime, if you have any questions, please feel free to reach out.

Congratulations once again!

Best regards,
Zero7 Technologies
Recruitment Team`
        break
      case 'reschedule':
        subject = `Reschedule Request - Interview for ${interviewDetails.jobRole} Position at ${interviewDetails.companyName}`
        body = `Dear ${candidate.candidateName},

We would like to inform you that your interview for the ${interviewDetails.jobRole} position at ${interviewDetails.companyName} needs to be rescheduled.

We apologize for any inconvenience this may cause. Please let us know your availability for a new interview slot. We are flexible and will do our best to accommodate your schedule.

Proposed New Details (Tentative):
${commonDetails}
Please reply to this email with your preferred times or if you have any questions.

Thank you for your understanding.

Best regards,
Zero7 Technologies
Recruitment Team`
        break
      case 'rejected':
        subject = `Update on your application for ${interviewDetails.jobRole} Position at ${interviewDetails.companyName}`
        body = `Dear ${candidate.candidateName},

Thank you for your interest in the ${interviewDetails.jobRole} position at ${interviewDetails.companyName} and for taking the time to interview with us.

We appreciate you sharing your experience and qualifications. We had a large number of highly qualified applicants, and after careful consideration, we have decided to move forward with other candidates whose qualifications more closely matched the specific requirements of this role at this time.

This was a very competitive search, and we wish you the best in your job search and future endeavors.

Best regards,
Zero7 Technologies
Recruitment Team`
        break
      default:
        subject = `Regarding your application at ${interviewDetails.companyName}`
        body = `Dear ${candidate.candidateName},

Regarding your application for the ${interviewDetails.jobRole} position at ${interviewDetails.companyName}.

Best regards,
Zero7 Technologies
Recruitment Team`
    }

    const encodedSubject = encodeURIComponent(subject)
    const encodedBody = encodeURIComponent(body)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${candidate.candidateEmail}&su=${encodedSubject}&body=${encodedBody}`
    window.open(gmailUrl, '_blank')
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto'></div>
          <p className='mt-4 text-lg text-gray-600'>Loading interviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen w-[80vw] bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12 relative'>
          {' '}
          {/* Added relative for alarm positioning */}
          <h1 className='text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
            Interview Tracker
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Manage candidate interviews, track status, and schedule meetings in
            one place
          </p>
          {/* Notification Bell Icon - Repositioned and enhanced */}
          {upcomingAlerts.length > 0 && (
            <div className='absolute top-0 right-0 mt-2 mr-2 z-50'>
              {' '}
              {/* Adjusted positioning */}
              <button
                onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
                className='relative p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 animate-ring-pulse'>
                {' '}
                {/* Custom animation */}
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'></path>
                </svg>
                <span className='absolute -top-1 -right-1 bg-yellow-400 text-red-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse'>
                  {upcomingAlerts.length}
                </span>
              </button>
              {/* Alerts Dropdown */}
              {showAlertsDropdown && (
                <div className='absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto'>
                  <div className='p-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50'>
                    <h4 className='font-bold text-gray-800 flex items-center'>
                      <svg
                        className='w-5 h-5 mr-2 text-red-500'
                        fill='currentColor'
                        viewBox='0 0 20 20'>
                        <path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z'></path>
                      </svg>
                      Upcoming Interviews (Next 15 min)
                    </h4>
                  </div>
                  <div className='divide-y divide-gray-100'>
                    {upcomingAlerts.map((interview) => {
                      const now = new Date()
                      const minutesLeft = Math.ceil(
                        (new Date(interview.date) - now) / 60000,
                      )
                      return (
                        <div
                          key={interview._id}
                          className='p-4 hover:bg-gray-50 transition-colors duration-150'>
                          <div className='flex items-start justify-between'>
                            <div className='flex-1'>
                              <p className='font-semibold text-gray-900'>
                                {interview.candidateName}
                              </p>
                              <p className='text-sm text-gray-600 mt-1'>
                                {interview.jobRole}
                              </p>
                              <p className='text-sm text-gray-500'>
                                {interview.companyName}
                              </p>
                              <p className='text-xs text-gray-400 mt-1'>
                                {new Date(interview.date).toLocaleTimeString(
                                  [],
                                  {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  },
                                )}
                              </p>
                            </div>
                            <div className='ml-3 flex-shrink-0'>
                              <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800'>
                                {minutesLeft} min
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {[
            'Scheduled',
            'Completed',
            'Pending Feedback',
            'Offer Extended',
            'placed',
          ].map((status) => (
            <div
              key={status}
              className='bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>{status}</p>
                  <p className='text-2xl font-bold text-gray-900 mt-1'>
                    {
                      interviewData.filter((item) => item.status === status)
                        .length
                    }
                  </p>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${getStatusDot(
                    status,
                  )}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons Container */}
        <div className='flex justify-between items-center mb-8'>
          <h2 className='text-2xl font-bold text-gray-800'>
            Interview Schedule
          </h2>
          <div className='flex space-x-4 items-center'>
            {/* Today Interviews Button */}
            <button
              onClick={() => setShowUpcomingModal(true)}
              className='group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'>
              <span className='flex items-center'>
                <svg
                  className='w-5 h-5 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'></path>
                </svg>
                Today Interviews
              </span>
            </button>

            {/* Add New Interview Button */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className='group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
              <span className='flex items-center'>
                {showAddForm ? (
                  <>
                    <svg
                      className='w-5 h-5 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                    Hide Form
                  </>
                ) : (
                  <>
                    <svg
                      className='w-5 h-5 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 4v16m8-8H4'
                      />
                    </svg>
                    Add New Interview
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Add Interview Form */}
        {showAddForm && (
          <div className='mb-8 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-300 animate-fade-in'>
            <div className='flex items-center mb-6'>
              <div className='w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-4'></div>
              <h3 className='text-2xl font-bold text-gray-800'>
                Schedule New Interview
              </h3>
            </div>
            <form
              onSubmit={handleAddSubmit}
              className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label
                  htmlFor='candidateName'
                  className='block text-sm font-semibold text-gray-700'>
                  Candidate Name
                </label>
                <select
                  id='candidateName'
                  name='candidateName'
                  value={newInterview.candidateName}
                  onChange={handleAddInputChange}
                  className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm'>
                  <option value=''>Select a Candidate</option>
                  {candidateOptions.map((candidate) => (
                    <option key={candidate._id} value={candidate._id}>
                      {candidate.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='space-y-2'>
                <label
                  htmlFor='companyName'
                  className='block text-sm font-semibold text-gray-700'>
                  Company Name
                </label>
                <select
                  id='companyName'
                  name='companyName'
                  value={newInterview.companyName}
                  onChange={handleAddInputChange}
                  className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm'>
                  <option value=''>Select a Company</option>
                  {companyOptions.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='space-y-2'>
                <label
                  htmlFor='job'
                  className='block text-sm font-semibold text-gray-700'>
                  Select Job
                </label>
                <select
                  id='job'
                  name='job'
                  value={newInterview.job}
                  onChange={handleAddInputChange}
                  className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm'>
                  <option value=''>Select a Job</option>
                  {jobOptions &&
                    jobOptions.map((job) => (
                      <option key={job._id} value={job._id}>
                        {job.role}
                      </option>
                    ))}
                </select>
              </div>

              <div className='space-y-2'>
                <label
                  htmlFor='date'
                  className='block text-sm font-semibold text-gray-700'>
                  Interview Date
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={newInterview.date}
                  onChange={handleAddInputChange}
                  min={new Date().toISOString().slice(0, 16)}   // blocks past date & past time
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                  required
                />

              </div>

              <div className='lg:col-span-2 space-y-2'>
                <label
                  htmlFor='status'
                  className='block text-sm font-semibold text-gray-700'>
                  Status
                </label>
                <select
                  id='status'
                  name='status'
                  value={newInterview.status}
                  onChange={handleAddInputChange}
                  className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm'>
                  <option value='Scheduled'>Scheduled</option>
                  <option value='Completed'>Completed</option>
                  <option value='Pending Feedback'>Pending Feedback</option>
                  <option value='Offer Extended'>Offer Extended</option>
                  <option value='Rejected'>Rejected</option>
                </select>
              </div>
              <div className='lg:col-span-2 space-y-2'>
                <label
                  htmlFor='interviewLevel'
                  className='block text-sm font-semibold text-gray-700'>
                  Interview Level
                </label>
                <select
                  id='interviewLevel'
                  name='interviewLevel'
                  value={newInterview.interviewLevel}
                  onChange={handleAddInputChange}
                  className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm'>
                  <option value='L1' default>
                    L1
                  </option>
                  <option value='L2'>L2</option>
                  <option value='L3'>L3</option>
                  <option value='L4'>L4</option>
                  <option value='L5'>L5</option>
                  <option value='HR'>HR Round</option>
                </select>
              </div>

              <div className='lg:col-span-2 flex space-x-4 pt-4'>
                <button
                  type='button'
                  onClick={() => setShowAddForm(false)}
                  className='flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm'>
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={submitting}
                  className='flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg'>
                  {submitting ? (
                    <span className='flex items-center justify-center'>
                      <svg
                        className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'>
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                      Scheduling...
                    </span>
                  ) : (
                    'Schedule Interview'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Interviews Table */}
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gradient-to-r from-gray-50 to-gray-100'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Candidate Name
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Company
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Job Role
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Interview Level
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Date
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {interviewData.map((interview) => (
                  <tr
                    key={interview._id}
                    className='hover:bg-gray-50 transition-colors duration-150'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg'>
                          {interview.candidateName.charAt(0)}
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-semibold text-gray-900'>
                            {interview.candidateName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900 font-medium'>
                        {interview.companyName}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-600'>
                        {interview.jobRole}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          interview.status,
                        )}`}>
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(
                            interview.status,
                          )}`}></span>
                        {interview.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-600'>
                        {interview.interviewLevel}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                      {new Date(interview.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <button
                        onClick={() => openEditModal(interview)}
                        className='text-indigo-600 hover:text-indigo-900 font-semibold transition-colors duration-200 flex items-center'>
                        <svg
                          className='w-4 h-4 mr-1'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                          />
                        </svg>
                        Edit Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calendar Section */}
        <div className='bg-white rounded-2xl shadow-xl p-6 border border-gray-100'>
          <div className='flex items-center mb-6'>
            <div className='w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-4'></div>
            <h3 className='text-2xl font-bold text-gray-800'>
              Interview Calendar
            </h3>
          </div>
          <div className='rounded-xl overflow-hidden border border-gray-200'>
            <div style={{ height: '400px' }}>
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor='start'
                endAccessor='end'
                style={{ height: '100%' }}
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day']}
                popup
                onSelectEvent={handleEventClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Status Modal */}
      {showEditModal && currentEditInterview && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4'>
          <div className='relative w-full max-w-md mx-auto'>
            <div className='relative bg-white rounded-2xl shadow-2xl transform transition-all duration-300 scale-100'>
              <div className='p-6 border-b border-gray-200'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-xl font-bold text-gray-800'>
                    Update Interview Status
                  </h3>
                  <button
                    className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'
                    onClick={() => setShowEditModal(false)}>
                    <svg
                      className='w-5 h-5 text-gray-500'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>
                <p className='text-gray-600 mt-2'>
                  for{' '}
                  <span className='font-semibold text-indigo-600'>
                    {currentEditInterview.candidateName}
                  </span>
                </p>
              </div>
              <form onSubmit={handleEditSubmit} className='p-6'>
                <div className='mb-6'>
                  <label
                    htmlFor='editStatus'
                    className='block text-sm font-semibold text-gray-700 mb-3'>
                    Select New Status
                  </label>
                  <select
                    id='editStatus'
                    name='editStatus'
                    value={editStatus}
                    onChange={handleEditStatusChange}
                    className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm'>
                    <option value='Scheduled'>Scheduled</option>
                    <option value='Completed'>Completed</option>
                    <option value='Pending Feedback'>Pending Feedback</option>
                    <option value='placed'>PLACED</option>
                    <option value='Offer Extended'>Offer Extended</option>
                    <option value='Rejected'>Rejected</option>
                  </select>
                </div>
                <div className='mb-6'>
                  <label
                    htmlFor='editInterviewLevel'
                    className='block text-sm font-semibold text-gray-700 mb-3'>
                    Select New Interview Level
                  </label>
                  <select
                    id='editInterviewLevel'
                    name='editInterviewLevel'
                    value={editInterviewLevel}
                    onChange={handleEditInteviewLevelChange}
                    className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm'>
                    <option value='L1'>L1</option>
                    <option value='L2'>L2</option>
                    <option value='L3'>L3</option>
                    <option value='L4'>L4</option>
                    <option value='L5'>L5</option>
                    <option value='HR'>HR Round</option>
                    <option value='PLACED'>PLACED</option>
                  </select>

                  <label
                    htmlFor='date'
                    className='block text-sm font-semibold text-gray-700 mt-4'>
                    Interview Date
                  </label>
                  <input
                    type='datetime-local'
                    id='date'
                    name='date'
                    value={editinterviewtiming}
                    onChange={handleEditInteviewtimingChange}
                    className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm'
                    required
                  />
                </div>
                <div className='flex space-x-4'>
                  <button
                    type='button'
                    onClick={() => setShowEditModal(false)}
                    className='flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm'>
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={submitting}
                    className='flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none'>
                    {submitting ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Details Pop-up Modal */}
      {showCandidateDetailsModal && selectedCandidateDetails && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-60 backdrop-blur-sm p-4'>
          <div className='relative w-full max-w-md mx-auto'>
            <div className='relative bg-white rounded-2xl shadow-2xl transform transition-all duration-300 scale-100'>
              <div className='p-6 border-b border-gray-200'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-xl font-bold text-gray-800'>
                    Candidate Details
                  </h3>
                  <button
                    className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'
                    onClick={() => setShowCandidateDetailsModal(false)}>
                    <svg
                      className='w-5 h-5 text-gray-500'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className='p-6 space-y-4 text-gray-700'>
                <p>
                  <span className='font-semibold'>Candidate Name:</span>{' '}
                  {selectedCandidateDetails.candidateName}
                </p>
                <p>
                  <span className='font-semibold'>Email:</span>{' '}
                  <a
                    href={`mailto:${selectedCandidateDetails.candidateEmail}`}
                    className='text-indigo-600 hover:underline'>
                    {selectedCandidateDetails.candidateEmail}
                  </a>
                </p>
                <p>
                  <span className='font-semibold'>Company:</span>{' '}
                  {selectedCandidateDetails.companyName}
                </p>
                <p>
                  <span className='font-semibold'>Job Role:</span>{' '}
                  {selectedCandidateDetails.jobRole}
                </p>
                <p>
                  <span className='font-semibold'>Interview Level:</span>{' '}
                  {selectedCandidateDetails.interviewLevel}
                </p>
                <p>
                  <span className='font-semibold'>Status:</span>{' '}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      selectedCandidateDetails.status,
                    )}`}>
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(
                        selectedCandidateDetails.status,
                      )}`}></span>
                    {selectedCandidateDetails.status}
                  </span>
                </p>
                <p>
                  <span className='font-semibold'>Date & Time:</span>{' '}
                  {new Date(selectedCandidateDetails.date).toLocaleString(
                    'en-US',
                    {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    },
                  )}
                </p>
              </div>
              <div className='p-6 border-t border-gray-200 flex justify-end'>
                <button
                  onClick={() => {
                    Swal.fire({
                      title: `Which mail do you want to send to "${selectedCandidateDetails.candidateName}"?`,
                      html: `
          <div class="grid grid-cols-2 gap-4 mt-4">
    <button id="scheduleMail" class="swal2-styled swal2-confirm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">📅 Schedule Interview Mail</button>
    <button id="selectedMail" class="swal2-styled swal2-confirm bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">✅ Selected Mail</button>
    <button id="rescheduleMail" class="swal2-styled swal2-confirm bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">🔄 Reschedule Mail</button>
    <button id="rejectedMail" class="swal2-styled swal2-confirm bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">❌ Rejected Mail</button>
</div>
                      `,
                      showCancelButton: true,
                      showConfirmButton: false, // Hide the default confirm button
                      focusConfirm: false,
                      preConfirm: () => {
                        // This won't be called as we're not using the default confirm button
                      },
                      didOpen: () => {
                        document
                          .getElementById('scheduleMail')
                          .addEventListener('click', () => {
                            handleSendMail(
                              'schedule',
                              selectedCandidateDetails,
                              selectedCandidateDetails,
                            )
                            Swal.close()
                          })
                        document
                          .getElementById('selectedMail')
                          .addEventListener('click', () => {
                            handleSendMail(
                              'selected',
                              selectedCandidateDetails,
                              selectedCandidateDetails,
                            )
                            Swal.close()
                          })
                        document
                          .getElementById('rescheduleMail')
                          .addEventListener('click', () => {
                            handleSendMail(
                              'reschedule',
                              selectedCandidateDetails,
                              selectedCandidateDetails,
                            )
                            Swal.close()
                          })
                        document
                          .getElementById('rejectedMail')
                          .addEventListener('click', () => {
                            handleSendMail(
                              'rejected',
                              selectedCandidateDetails,
                              selectedCandidateDetails,
                            )
                            Swal.close()
                          })
                      },
                    })
                  }}
                  className='px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center'>
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    />
                  </svg>
                  Send Confirmation Mail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Interviews Modal */}
      {showUpcomingModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4'>
          <div className='relative w-full max-w-2xl mx-auto'>
            <div className='relative bg-white rounded-2xl shadow-2xl transform transition-all duration-300 scale-100'>
              <div className='p-6 border-b border-gray-200'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-xl font-bold text-gray-800'>
                    Today's Interviews
                  </h3>
                  <button
                    className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'
                    onClick={() => setShowUpcomingModal(false)}>
                    <svg
                      className='w-5 h-5 text-gray-500'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className='p-6 max-h-[60vh] overflow-y-auto'>
                {getTodaysInterviews().length > 0 ? (
                  <ul className='space-y-4'>
                    {getTodaysInterviews().map((interview) => (
                      <li
                        key={interview._id}
                        className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
                        <div className='flex justify-between items-center'>
                          <div>
                            <p className='font-semibold text-lg text-gray-800'>
                              {interview.candidateName}
                            </p>
                            <p className='text-sm text-gray-600'>
                              {interview.jobRole} at {interview.companyName}
                            </p>
                          </div>
                          <div className='text-right'>
                            <p className='font-medium text-indigo-600'>
                              {new Date(interview.date).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(
                                interview.status,
                              )}`}>
                              {interview.status}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='text-center text-gray-500 py-8'>
                    No interviews scheduled for today.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InterviewTracker
