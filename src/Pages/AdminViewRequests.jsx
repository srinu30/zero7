// File: src/Pages/AdminViewRequests.jsx

import React, { useState, useEffect, useMemo } from 'react'
import {
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Calendar,
  Building,
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  Search,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import api from '../api/axios'
import './AdminViewRequests.css'

export default function AdminViewRequests() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [message, setMessage] = useState(null)

  // --- NEW: State for filtering, searching, and sorting ---
  const [filterStatus, setFilterStatus] = useState('all') // 'all', 'pending', 'approved', 'rejected'
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc',
  })

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/request-info')
      setRequests(data)
    } catch (err) {
      setError('Failed to fetch requests. Please try again.')
      console.error('Fetch requests error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleApprove = async (requestId) => {
    setActionLoading(`approve-${requestId}`)
    try {
      await api.put(`/request-info/${requestId}`, { status: 'approved' })
      setRequests(
        requests.map((req) =>
          req._id === requestId ? { ...req, status: 'approved' } : req,
        ),
      )
      showMessage('Request approved successfully!', 'success')
    } catch (err) {
      console.error('Approve request error:', err)
      showMessage('Failed to approve request. Please try again.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (requestId) => {
    setActionLoading(`reject-${requestId}`)
    try {
      await api.put(`/request-info/${requestId}`, { status: 'rejected' })
      setRequests(
        requests.map((req) =>
          req._id === requestId ? { ...req, status: 'rejected' } : req,
        ),
      )
      showMessage('Request rejected successfully!', 'success')
    } catch (err) {
      console.error('Reject request error:', err)
      showMessage('Failed to reject request. Please try again.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (requestId) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this request? This action cannot be undone.',
      )
    ) {
      return
    }

    setActionLoading(`delete-${requestId}`)
    try {
      await api.delete(`/request-info/${requestId}`)
      setRequests(requests.filter((req) => req._id !== requestId))
      showMessage('Request deleted successfully!', 'success')
      if (selectedRequest && selectedRequest._id === requestId) {
        setSelectedRequest(null)
      }
    } catch (err) {
      console.error('Delete request error:', err)
      showMessage('Failed to delete request. Please try again.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  // --- NEW: Memoized calculation for filtering and sorting requests ---
  const filteredAndSortedRequests = useMemo(() => {
    let processedRequests = [...requests]

    // 1. Filter by status
    if (filterStatus !== 'all') {
      if (filterStatus === 'pending') {
        processedRequests = processedRequests.filter(
          (req) => !req.status || req.status === 'pending',
        )
      } else {
        processedRequests = processedRequests.filter(
          (req) => req.status === filterStatus,
        )
      }
    }

    // 2. Filter by search term
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase()
      processedRequests = processedRequests.filter(
        (req) =>
          req.candidateName.toLowerCase().includes(lowercasedTerm) ||
          req.companyName.toLowerCase().includes(lowercasedTerm) ||
          req.contactPerson.toLowerCase().includes(lowercasedTerm),
      )
    }

    // 3. Sort
    if (sortConfig.key) {
      processedRequests.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return processedRequests
  }, [requests, filterStatus, searchTerm, sortConfig])

  // --- NEW: Handler for changing sort column ---
  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return { class: 'status-approved', text: 'Approved' }
      case 'rejected':
        return { class: 'status-rejected', text: 'Rejected' }
      default:
        return { class: 'status-pending', text: 'Pending' }
    }
  }

  const getStatusCounts = () => {
    const pending = requests.filter(
      (req) => !req.status || req.status === 'pending',
    ).length
    const approved = requests.filter((req) => req.status === 'approved').length
    const rejected = requests.filter((req) => req.status === 'rejected').length
    return { pending, approved, rejected, total: requests.length }
  }

  const statusCounts = getStatusCounts()

  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null
    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={14} />
    ) : (
      <ChevronDown size={14} />
    )
  }

  if (isLoading)
    return (
      <div className='requests-container'>
        <div className='table-loading'>
          <div className='loading-spinner'></div>
        </div>
      </div>
    )

  if (error)
    return (
      <div className='requests-container'>
        <div className='message-toast message-error'>{error}</div>
      </div>
    )

  return (
    <div className='requests-container'>
      <div className='requests-header'>
        <h3 className='text-xl font-bold'>Candidate Information Requests</h3>
        <div className='header-stats'>
          <div className='stat-card'>
            <span className='text-white font-bold text-xl'>
              {statusCounts.total}
            </span>
            <span className='text-white'>Total</span>
          </div>
          <div className='stat-card pending'>
            <span className='text-white font-bold text-xl'>
              {statusCounts.pending}
            </span>
            <span className='text-white'>Pending</span>
          </div>
          <div className='stat-card approved'>
            <span className='text-white font-bold text-xl'>
              {statusCounts.approved}
            </span>
            <span className='text-white'>Approved</span>
          </div>
          <div className='stat-card rejected'>
            <span className='text-white font-bold text-xl'>
              {statusCounts.rejected}
            </span>
            <span className='text-white'>Rejected</span>
          </div>
        </div>
      </div>

      {message && (
        <div className={`message-toast message-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* --- NEW: Filter and Search Controls --- */}
      <div className='requests-controls'>
        <div className='filter-buttons'>
          <button
            className={filterStatus === 'all' ? 'active' : ''}
            onClick={() => setFilterStatus('all')}>
            All ({requests.length})
          </button>
          <button
            className={filterStatus === 'pending' ? 'active' : ''}
            onClick={() => setFilterStatus('pending')}>
            Pending ({statusCounts.pending})
          </button>
          <button
            className={filterStatus === 'approved' ? 'active' : ''}
            onClick={() => setFilterStatus('approved')}>
            Approved ({statusCounts.approved})
          </button>
          <button
            className={filterStatus === 'rejected' ? 'active' : ''}
            onClick={() => setFilterStatus('rejected')}>
            Rejected ({statusCounts.rejected})
          </button>
        </div>
        <div className='search-bar'>
          <Search size={18} className='search-icon' />
          <input
            type='text'
            placeholder='Search by name, company...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className='requests-table-wrapper'>
        <table className='requests-table'>
          <thead>
            <tr>
              <th onClick={() => handleSort('createdAt')}>
                Date Received <SortIndicator columnKey='createdAt' />
              </th>
              <th onClick={() => handleSort('status')}>
                Status <SortIndicator columnKey='status' />
              </th>
              <th onClick={() => handleSort('candidateName')}>
                Candidate Name <SortIndicator columnKey='candidateName' />
              </th>
              <th onClick={() => handleSort('companyName')}>
                Company <SortIndicator columnKey='companyName' />
              </th>
              <th onClick={() => handleSort('contactPerson')}>
                Contact Person <SortIndicator columnKey='contactPerson' />
              </th>
              <th>Requirement</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedRequests.length === 0 ? (
              <tr>
                <td colSpan='7' className='empty-state'>
                  <FileText size={48} />
                  <h3>No requests match your criteria</h3>
                  <p>Try adjusting your search or filter.</p>
                </td>
              </tr>
            ) : (
              filteredAndSortedRequests.map((req) => {
                const statusBadge = getStatusBadge(req.status)
                const isPending = !req.status || req.status === 'pending'
                const currentAction = actionLoading?.split('-')[0]
                const currentId = actionLoading?.split('-')[1]

                return (
                  <tr
                    key={req._id}
                    className={statusBadge.class.replace('status-', 'row-')}>
                    <td>
                      <div>
                        <Calendar size={14} style={{ color: '#9ca3af' }} />
                        {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${statusBadge.class}`}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td>
                      <div>
                        <User size={14} style={{ color: '#9ca3af' }} />
                        {req.candidateName}
                      </div>
                    </td>
                    <td>
                      <div>
                        <Building size={14} style={{ color: '#9ca3af' }} />
                        {req.companyName}
                      </div>
                    </td>
                    <td>{req.contactPerson}</td>
                    <td
                      className='requirement-cell'
                      title={req.requirementDetails}>
                      {req.requirementDetails}
                    </td>
                    <td>
                      <div className='actions-cell-container'>
                        <button
                          className='action-btn action-view'
                          title='View Details'
                          onClick={() => setSelectedRequest(req)}>
                          <Eye size={16} />
                        </button>
                        <button
                          className={`action-btn action-approve ${
                            currentAction === 'approve' && currentId === req._id
                              ? 'loading'
                              : ''
                          }`}
                          title='Approve Request'
                          onClick={() => handleApprove(req._id)}
                          disabled={!isPending || actionLoading}>
                          <CheckCircle size={16} />
                        </button>
                        <button
                          className={`action-btn action-reject ${
                            currentAction === 'reject' && currentId === req._id
                              ? 'loading'
                              : ''
                          }`}
                          title='Reject Request'
                          onClick={() => handleReject(req._id)}
                          disabled={!isPending || actionLoading}>
                          <XCircle size={16} />
                        </button>
                        <button
                          className={`action-btn action-delete ${
                            currentAction === 'delete' && currentId === req._id
                              ? 'loading'
                              : ''
                          }`}
                          title='Delete Request'
                          onClick={() => handleDelete(req._id)}
                          disabled={actionLoading}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div className='modal-overlay' onClick={() => setSelectedRequest(null)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <button
              className='modal-close-btn'
              onClick={() => setSelectedRequest(null)}>
              &times;
            </button>
            <h3>Request for: {selectedRequest.candidateName}</h3>
            <p>
              <strong>Status:</strong>
              <span
                className={`status-badge ${
                  getStatusBadge(selectedRequest.status).class
                }`}>
                {getStatusBadge(selectedRequest.status).text}
              </span>
            </p>
            <p>
              <strong>
                <Building size={16} /> Company:
              </strong>
              {selectedRequest.companyName}
            </p>
            <p>
              <strong>
                <User size={16} /> Contact Person:
              </strong>
              {selectedRequest.contactPerson} ({selectedRequest.designation})
            </p>
            <p>
              <strong>
                <Mail size={16} /> Email:
              </strong>
              <a href={`mailto:${selectedRequest.email}`}>
                {selectedRequest.email}
              </a>
            </p>
            <p>
              <strong>
                <Phone size={16} /> Phone:
              </strong>
              <a href={`tel:${selectedRequest.phone}`}>
                {selectedRequest.phone}
              </a>
            </p>
            <p>
              <strong>
                <Globe size={16} /> Website:
              </strong>
              <a
                href={selectedRequest.website}
                target='_blank'
                rel='noopener noreferrer'>
                {selectedRequest.website || 'N/A'}
              </a>
            </p>
            <hr />
            <p>
              <strong>Requirement Details:</strong>{' '}
              {selectedRequest.requirementDetails}
            </p>
            <p>
              <strong>Number of Positions:</strong>{' '}
              {selectedRequest.numberOfPositions}
            </p>
            <p>
              <strong>Budget / CTC:</strong> {selectedRequest.budget || 'N/A'}
            </p>
            <p>
              <strong>Additional Notes:</strong>{' '}
              {selectedRequest.notes || 'N/A'}
            </p>
            <small>
              Received on:{' '}
              {new Date(selectedRequest.createdAt).toLocaleString()}
            </small>
            <div className='modal-actions'>
              {(!selectedRequest.status ||
                selectedRequest.status === 'pending') && (
                <>
                  <button
                    className='modal-action-btn modal-approve'
                    onClick={() => {
                      handleApprove(selectedRequest._id)
                      setSelectedRequest(null)
                    }}>
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button
                    className='modal-action-btn modal-reject'
                    onClick={() => {
                      handleReject(selectedRequest._id)
                      setSelectedRequest(null)
                    }}>
                    <XCircle size={14} /> Reject
                  </button>
                </>
              )}
              <button
                className='modal-action-btn modal-delete'
                onClick={() => {
                  handleDelete(selectedRequest._id)
                  setSelectedRequest(null)
                }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}