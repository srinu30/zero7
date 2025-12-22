import React, { useState, useEffect, useRef } from 'react'
import {
  Edit,
  Trash2,
  UserPlus,
  XCircle,
  Loader2,
  Shield,
  Mail,
  IdCard,
  Key,
  User,
  X,
} from 'lucide-react' // Added User, X icons
import api from '../api/axios' // Using the central axios instance

export default function AdminManageManagers() {
  const [managers, setManagers] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    employeeID: '',
    email: '',
    password: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  // NEW STATE: To control the visibility of the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const modalRef = useRef(null) // Ref for the modal to handle clicks outside

  const fetchManagers = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/managers')
      setManagers(data)
      setError('') // Clear error on successful fetch
    } catch (error) {
      console.error('Failed to fetch managers:', error)
      setError('Failed to fetch managers. Please check the API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchManagers()
  }, [])

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close modal if click is outside
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        isEditModalOpen
      ) {
        // Ensure the click isn't inside any children of the form itself
        if (!event.target.closest('#edit-manager-form')) {
          closeEditModal()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isEditModalOpen]) // Depend on isEditModalOpen to re-attach listener if modal state changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      if (editingId) {
        // Ensure password is only sent if it's provided
        const dataToUpdate = { ...formData }
        if (!dataToUpdate.password) {
          delete dataToUpdate.password
        }
        await api.put(`/managers/${editingId}`, dataToUpdate)
        setSuccess('Manager updated successfully!')
      } else {
        await api.post('/managers/register', formData)
        setSuccess('Manager added successfully!')
      }
      resetForm()
      fetchManagers()
      setTimeout(() => setSuccess(''), 3000) // Clear success message after 3 seconds
      closeEditModal() // NEW: Close modal on successful submission
    } catch (error) {
      console.error('Failed to submit manager:', error)
      setError(error.response?.data?.error || 'Failed to save manager.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (manager) => {
    setFormData({
      name: manager.name,
      email: manager.email,
      employeeID: manager.employeeId,
      password: '', // Clear password field for security, user can enter new one
    })
    setEditingId(manager._id)
    setIsEditModalOpen(true) // NEW: Open the edit modal
    // No need to scroll here as the form is now in a modal
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    resetForm() // NEW: Reset form when modal is closed
    setError('') // Clear errors when modal closes
    setSuccess('') // Clear success when modal closes
  }

  const handleDelete = async (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this manager? This action cannot be undone.',
      )
    ) {
      setDeletingId(id)
      setError('')
      setSuccess('')
      try {
        await api.delete(`/managers/${id}`)
        setSuccess('Manager deleted successfully!')
        fetchManagers()
        setTimeout(() => setSuccess(''), 3000) // Clear success message after 3 seconds
      } catch (error) {
        console.error('Failed to delete manager:', error)
        setError(error.response?.data?.error || 'Failed to delete manager.')
      } finally {
        setDeletingId(null)
      }
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({ name: '', employeeID: '', email: '', password: '' })
  }

  return (
    <div className='min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans'>
      <div className='max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8'>
        {/* Header Section */}
        <div className='mb-8 p-4 bg-[#267edc] text-white rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-blue-500 rounded-full'>
              <Shield className='w-8 h-8 sm:w-10 sm:h-10' />
            </div>
            <div>
              <h3 className='text-2xl sm:text-3xl font-bold'>
                Manage Managers
              </h3>
              <p className='text-blue-200 text-sm sm:text-base'>
                Add, update, or remove manager accounts from the system
              </p>
            </div>
          </div>
          <div className='bg-blue-700/50 backdrop-blur-sm px-5 py-2 rounded-lg text-center shadow-inner'>
            <div className='text-3xl sm:text-4xl font-extrabold'>
              {managers.length}
            </div>
            <div className='text-blue-200 text-sm'>Total Managers</div>
          </div>
        </div>

        {/* Alert Messages */}
        {error &&
          !isEditModalOpen && ( // Only show global error if modal is not open
            <div
              className='mb-6 p-4 flex items-center bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm animate-fade-in'
              role='alert'>
              <XCircle className='w-5 h-5 mr-3 flex-shrink-0' />
              <span className='text-sm font-medium'>{error}</span>
            </div>
          )}

        {success &&
          !isEditModalOpen && ( // Only show global success if modal is not open
            <div
              className='mb-6 p-4 flex items-center bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-sm animate-fade-in'
              role='alert'>
              <div className='w-5 h-5 mr-3 flex-shrink-0 text-lg font-bold'>
                ✓
              </div>
              <span className='text-sm font-medium'>{success}</span>
            </div>
          )}

        {/* Add New Manager Form - only visible when not editing (and not in modal) */}
        {!editingId && (
          <form
            onSubmit={handleSubmit}
            className='mb-10 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200'>
            <div className='mb-6 pb-4 border-b border-gray-200 flex items-center justify-between'>
              <h2 className='text-xl sm:text-2xl font-semibold text-gray-800'>
                Add New Manager
              </h2>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
              <div className='relative'>
                <input
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Full Name'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>

              <div className='relative'>
                <input
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Email Address'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>

              <div className='relative'>
                <input
                  name='employeeID'
                  value={formData.employeeID}
                  onChange={handleChange}
                  placeholder='Employee ID'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>

              <div className='relative'>
                <input
                  name='password'
                  type='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Password'
                  required
                  className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700'
                />
              </div>
            </div>

            <div className='flex justify-end space-x-4'>
              <button
                type='submit'
                disabled={submitting}
                className='flex items-center px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm'>
                {submitting ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className='w-4 h-4 mr-2' />
                    Add Manager
                  </>
                )}
              </button>
            </div>
          </form>
        )}
        <br />

        {/* Managers Table Section */}
        <div className='bg-white rounded-lg shadow-md border border-gray-200'>
          <div className='p-5 border-b border-gray-200'>
            <h2 className='text-xl sm:text-2xl font-semibold text-gray-800'>
              All Managers
            </h2>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Name
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Email
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Employee ID
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {loading ? (
                  <tr>
                    <td
                      colSpan='4'
                      className='px-6 py-10 text-center text-gray-500'>
                      <div className='flex flex-col items-center justify-center'>
                        <Loader2 className='w-8 h-8 text-blue-500 animate-spin mb-3' />
                        <span className='text-lg font-medium'>
                          Loading managers...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : managers.length === 0 ? (
                  <tr>
                    <td
                      colSpan='4'
                      className='px-6 py-10 text-center text-gray-500'>
                      <div className='flex flex-col items-center justify-center'>
                        <UserPlus className='w-10 h-10 text-gray-400 mb-3' />
                        <span className='text-lg font-medium'>
                          No managers found. Add one using the form above.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  managers.map((m) => (
                    <tr
                      key={m._id}
                      className='hover:bg-gray-50 transition duration-150 ease-in-out'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {m.name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                        {m.email}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                        <span className='px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'>
                          {m.employeeId}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex items-center space-x-3'>
                          <button
                            onClick={() => handleEdit(m)}
                            className='flex items-center text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out hover:scale-105'
                            title='Edit Manager'>
                            <Edit className='w-4 h-4 mr-1' />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(m._id)}
                            disabled={deletingId === m._id}
                            className='flex items-center text-red-600 hover:text-red-900 transition duration-150 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
                            title='Delete Manager'>
                            {deletingId === m._id ? (
                              <Loader2 className='w-4 h-4 mr-1 animate-spin' />
                            ) : (
                              <Trash2 className='w-4 h-4 mr-1' />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className='p-5 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600'>
            <div className='mb-2 sm:mb-0'>
              Showing{' '}
              <strong className='font-semibold'>{managers.length}</strong> of{' '}
              <strong className='font-semibold'>{managers.length}</strong>{' '}
              managers
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Edit Manager Modal */}
      {isEditModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 animate-fade-in-scale'>
          <div
            ref={modalRef}
            className='relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6 sm:p-8 transform transition-all duration-300 scale-100 opacity-100'
            id='edit-manager-form'>
            <button
              onClick={closeEditModal}
              className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors'
              title='Close'>
              <X className='w-6 h-6' />
            </button>

            <h2 className='text-2xl font-bold text-gray-800 mb-6 border-b pb-4'>
              Edit Manager Details
            </h2>

            {/* Modal-specific Alert Messages */}
            {error && (
              <div
                className='mb-4 p-3 flex items-center bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm'
                role='alert'>
                <XCircle className='w-4 h-4 mr-2 flex-shrink-0' />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div
                className='mb-4 p-3 flex items-center bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm'
                role='alert'>
                <div className='w-4 h-4 mr-2 flex-shrink-0 text-lg font-bold'>
                  ✓
                </div>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className='grid grid-cols-1 gap-y-5 gap-x-4 mb-6'>
                <div className='relative'>
                  <label htmlFor='edit-manager-name' className='sr-only'>
                    Full Name
                  </label>
                  <input
                    id='edit-manager-name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='Full Name'
                    required
                    className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 text-sm'
                  />
                </div>

                <div className='relative'>
                  <label htmlFor='edit-manager-email' className='sr-only'>
                    Email Address
                  </label>
                  <input
                    id='edit-manager-email'
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='Email Address'
                    required
                    className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 text-sm'
                  />
                </div>

                <div className='relative'>
                  <label htmlFor='edit-manager-employeeID' className='sr-only'>
                    Employee ID
                  </label>
                  <input
                    id='edit-manager-employeeID'
                    name='employeeID'
                    value={formData.employeeID}
                    onChange={handleChange}
                    placeholder='Employee ID'
                    required
                    className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 text-sm'
                  />
                </div>

                <div className='relative'>
                  <label htmlFor='edit-manager-password' className='sr-only'>
                    New Password (Optional)
                  </label>
                  <input
                    id='edit-manager-password'
                    name='password'
                    type='password'
                    value={formData.password}
                    onChange={handleChange}
                    placeholder='New Password (Optional)'
                    className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 text-sm'
                  />
                </div>
              </div>

              <div className='flex justify-end space-x-3 mt-6'>
                <button
                  type='button'
                  onClick={closeEditModal} // Use closeEditModal to reset state
                  className='flex items-center px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 text-sm font-medium'>
                  <XCircle className='w-4 h-4 mr-2' />
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={submitting}
                  className='flex items-center px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm'>
                  {submitting ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      Updating...
                    </>
                  ) : (
                    <>
                      <UserPlus className='w-4 h-4 mr-2' />
                      Update Manager
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export { AdminManageManagers }
