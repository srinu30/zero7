// File: src/Pages/AdminViewApplications.jsx

import React, { useEffect, useState } from 'react'
import api from '../api/axios' // Use your central axios instance
import './AdminViewApplications.css'

const AdminViewApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get('/applications')
        // Sort data by most recent submission first
        const sortedData = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )
        setApplications(sortedData)
      } catch (err) {
        console.error('Failed to fetch applications:', err)
        setError(
          'Failed to load applications. Please ensure the backend is running and the endpoint is correct.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, []) // Empty array ensures this runs only once on component mount

  // Function to handle the "Reject" action, which deletes the application
  const handleReject = async (id) => {
    try {
      const confirmReject = window.confirm(
        'Are you sure you want to reject and delete this application? This action cannot be undone.',
      )
      if (!confirmReject) return

      // Send a DELETE request to the backend API
      await api.delete(`/applications/${id}`)
      // Immediately remove the application from the local state to update the UI
      setApplications((prev) => prev.filter((app) => app._id !== id))
      alert('Application rejected and removed successfully.')
    } catch (err) {
      console.error('Failed to reject application:', err)
      alert('Failed to reject the application. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className='loading-spinner-container'>
        <div className='spinner'></div>
        <p>Loading applications...</p>
      </div>
    )
  }

  if (error) {
    return <p className='error-message'>{error}</p>
  }

  return (
    <div className='admin-applications w-[80vw]'>
      <h2>Job Applications</h2>
      <div className='table-wrapper'>
        <table className='applications-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Experience</th>
              <th>Current Salary</th>
              <th>Expected Salary</th>
              <th>Location</th>
              <th>Job Role</th>
              <th>Resume</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <tr key={app._id}>
                  <td>{app.name || 'N/A'}</td>
                  <td>{app.contact || 'N/A'}</td>
                  <td>{app.email || 'N/A'}</td>
                  <td>{app.experience || 'N/A'}</td>
                  <td>{app.currentSalary || 'N/A'}</td>
                  <td>{app.expectedSalary || 'N/A'}</td>
                  <td>{app.location || 'N/A'}</td>
                  {/* Use optional chaining in case a job was deleted */}
                  <td>{app.jobId?.role || 'Job Not Found'}</td>
                  <td>
                    {app.resume ? (
                      <a
                        href={app.resume}
                        target='_blank'
                        rel='noopener noreferrer'
                        style={{
                          color: '#007bff',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.textDecoration = 'underline')
                        }
                        onMouseOut={(e) =>
                          (e.target.style.textDecoration = 'none')
                        }>
                        View Resume
                      </a>
                    ) : (
                      <span style={{ color: 'gray', fontStyle: 'italic' }}>
                        N/A
                      </span>
                    )}
                  </td>

                  <td>
                    <button
                      style={{
                        color: 'red',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                      }}
                      className='reject-button'
                      onClick={() => handleReject(app._id)}>
                      Remove Application
                    </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                {/* Corrected colSpan to match the 10 columns */}
                <td colSpan='10'>No applications yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminViewApplications
