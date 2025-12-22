import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Shield,
  IdCard,
  ArrowLeft,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Edit2,
} from 'lucide-react'
import Cookie from 'js-cookie'
import api from '../api/axios'

const AdminUserPage = () => {
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetForm, setResetForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)
  const [showEditNameModal, setShowEditNameModal] = useState(false)
  const [editNameForm, setEditNameForm] = useState({ name: '' })
  const [editNameLoading, setEditNameLoading] = useState(false)
  const [editNameError, setEditNameError] = useState('')
  const [editNameSuccess, setEditNameSuccess] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

  const fetchUserDetails = async (userId) => {
    try {
      setLoading(true)
      const res = await api.get(`/user/${userId}`)
      setUser(res.data)
    } catch (err) {
      setError('Failed to fetch user details')
      console.error('Error fetching user:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchUserDetails(id)
    }
  }, [id])

  useEffect(() => {
    if (user.email && showResetModal) {
      setResetForm((prev) => ({ ...prev, email: user.email }))
    }
  }, [user.email, showResetModal])

  const handleEdit = () => {
    // Navigate to edit page or open edit modal
    console.log('Edit user:', user._id)
  }

  const openResetModal = () => {
    setShowResetModal(true)
    setResetError('')
    setResetSuccess(false)
    setResetForm({
      email: user.email || '',
      password: '',
      confirmPassword: '',
    })
  }

  const closeResetModal = () => {
    setShowResetModal(false)
    setResetForm({ email: '', password: '', confirmPassword: '' })
    setResetError('')
    setResetSuccess(false)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handleResetFormChange = (e) => {
    const { name, value } = e.target
    setResetForm((prev) => ({ ...prev, [name]: value }))
    setResetError('')
  }

  const validateResetForm = () => {
    if (!resetForm.email) {
      setResetError('Email is required')
      return false
    }
    if (!resetForm.password) {
      setResetError('New password is required')
      return false
    }
    if (resetForm.password.length < 6) {
      setResetError('Password must be at least 6 characters long')
      return false
    }
    if (resetForm.password !== resetForm.confirmPassword) {
      setResetError('Passwords do not match')
      return false
    }
    return true
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (!validateResetForm()) return

    try {
      setResetLoading(true)
      setResetError('')

      // API call to reset password
      await api.post(`/user/reset-password`, {
        email: resetForm.email,
        password: resetForm.password,
      })

      setResetSuccess(true)
      setTimeout(() => {
        closeResetModal()
      }, 2000)
    } catch (err) {
      setResetError(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setResetLoading(false)
    }
  }

  const openEditNameModal = () => {
    setShowEditNameModal(true)
    setEditNameForm({ name: user.name || '' })
    setEditNameError('')
    setEditNameSuccess(false)
  }

  const closeEditNameModal = () => {
    setShowEditNameModal(false)
    setEditNameForm({ name: '' })
    setEditNameError('')
    setEditNameSuccess(false)
  }

  const handleEditNameChange = (e) => {
    const { value } = e.target
    setEditNameForm({ name: value })
    setEditNameError('')
  }

  const handleEditName = async (e) => {
    e.preventDefault()

    if (!editNameForm.name.trim()) {
      setEditNameError('Name is required')
      return
    }

    try {
      setEditNameLoading(true)
      setEditNameError('')

      // API call to update user name
      const response = await api.patch(`/user/${id}`, {
        name: editNameForm.name.trim(),
      })
      console.log(response.data)
      Cookie.set('user', JSON.stringify(response.data))

      // Update local user state
      setUser((prev) => ({ ...prev, name: editNameForm.name.trim() }))
      setEditNameSuccess(true)

      setTimeout(() => {
        closeEditNameModal()
      }, 1500)
    } catch (err) {
      setEditNameError(err.response?.data?.message || 'Failed to update name')
    } finally {
      setEditNameLoading(false)
    }
  }

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'recruiter':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'hr':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-96'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
        <div className='text-red-600 text-lg font-semibold'>{error}</div>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className='mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'>
          Back to Users
        </button>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Header */}
      <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
        <div className='flex items-center justify-between mb-4'>
          <button
            onClick={() => navigate(-1)}
            className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors'>
            <ArrowLeft className='h-5 w-5' />
            Back
          </button>
        </div>

        <div className='flex items-start gap-6'>
          {/* Avatar */}
          <div className='bg-blue-100 rounded-full p-4'>
            <User className='h-16 w-16 text-blue-600' />
          </div>

          {/* User Info */}
          <div className='flex-1'>
            <div className='flex items-center gap-3 mb-2'>
              <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
                {user.name || 'Unknown User'}
                <button
                  onClick={openEditNameModal}
                  className='p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors'
                  title='Edit name'>
                  <Edit2 className='h-5 w-5' />
                </button>
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(
                  user.role,
                )}`}>
                {user.role || 'No Role'}
              </span>
            </div>
            <p className='text-gray-600 text-lg'>
              {user.email || 'No email provided'}
            </p>
            <p className='text-sm text-gray-500 mt-1'>
              Employee ID: {user.employeeId || 'Not assigned'}
            </p>
          </div>
        </div>
      </div>

      {/* User Details Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Contact Information */}
        <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='bg-green-100 p-2 rounded-lg'>
              <Mail className='h-6 w-6 text-green-600' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900'>
              Contact Information
            </h3>
          </div>

          <div className='space-y-4'>
            <div className='flex items-start gap-3'>
              <Mail className='h-5 w-5 text-gray-400 mt-1' />
              <div>
                <p className='text-sm text-gray-500'>Email Address</p>
                <p className='font-medium text-gray-900'>
                  {user.email || 'Not provided'}
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <IdCard className='h-5 w-5 text-gray-400 mt-1' />
              <div>
                <p className='text-sm text-gray-500'>Employee ID</p>
                <p className='font-medium text-gray-900'>
                  {user.employeeId || 'Not assigned'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Role & Permissions */}
        <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='bg-purple-100 p-2 rounded-lg'>
              <Shield className='h-6 w-6 text-purple-600' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900'>
              Role & Permissions
            </h3>
          </div>

          <div className='space-y-4'>
            <div className='flex items-start gap-3'>
              <Shield className='h-5 w-5 text-gray-400 mt-1' />
              <div>
                <p className='text-sm text-gray-500'>User Role</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(
                    user.role,
                  )}`}>
                  {user.role || 'No Role Assigned'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>
          Quick Actions
        </h2>
        <div className='flex flex-wrap gap-3'>
          <button
            onClick={openResetModal}
            className='flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200'>
            <Shield className='h-4 w-4' />
            Reset Password
          </button>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              {/* Modal Header */}
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-xl font-semibold text-gray-900'>
                  Reset Password
                </h3>
                <button
                  onClick={closeResetModal}
                  className='text-gray-400 hover:text-gray-600 transition-colors'>
                  <X className='h-6 w-6' />
                </button>
              </div>

              {/* Success Message */}
              {resetSuccess && (
                <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3'>
                  <CheckCircle className='h-5 w-5 text-green-600' />
                  <div>
                    <p className='text-green-800 font-medium'>
                      Password Reset Successful!
                    </p>
                    <p className='text-green-700 text-sm'>
                      The user's password has been updated.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {resetError && (
                <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3'>
                  <div>
                    <p className='text-red-800 font-medium'>Error</p>
                    <p className='text-red-700 text-sm'>{resetError}</p>
                  </div>
                </div>
              )}

              {/* Reset Form */}
              <form onSubmit={handleResetPassword} className='space-y-4'>
                {/* Email Field */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Email Address
                  </label>
                  <div className='relative'>
                    <input
                      type='email'
                      name='email'
                      value={resetForm.email}
                      onChange={handleResetFormChange}
                      className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                      placeholder='Enter email address'
                      required
                    />
                  </div>
                </div>

                {/* New Password Field */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    New Password
                  </label>
                  <div className='relative'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name='password'
                      value={resetForm.password}
                      onChange={handleResetFormChange}
                      className='w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                      placeholder='Enter new password'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                      {showPassword ? (
                        <EyeOff className='h-5 w-5' />
                      ) : (
                        <Eye className='h-5 w-5' />
                      )}
                    </button>
                  </div>
                  <p className='text-xs text-gray-500 mt-1'>
                    Password must be at least 6 characters long
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Confirm New Password
                  </label>
                  <div className='relative'>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name='confirmPassword'
                      value={resetForm.confirmPassword}
                      onChange={handleResetFormChange}
                      className='w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                      placeholder='Confirm new password'
                      required
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                      {showConfirmPassword ? (
                        <EyeOff className='h-5 w-5' />
                      ) : (
                        <Eye className='h-5 w-5' />
                      )}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex gap-3 pt-4'>
                  <button
                    type='button'
                    onClick={closeResetModal}
                    className='flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium'
                    disabled={resetLoading}>
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={resetLoading || resetSuccess}
                    className='flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
                    {resetLoading ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                        Resetting...
                      </>
                    ) : resetSuccess ? (
                      <>
                        <CheckCircle className='h-4 w-4' />
                        Success!
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Name Modal */}
      {showEditNameModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl max-w-md w-full'>
            <div className='p-6'>
              {/* Modal Header */}
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-xl font-semibold text-gray-900'>
                  Edit User Name
                </h3>
                <button
                  onClick={closeEditNameModal}
                  className='text-gray-400 hover:text-gray-600 transition-colors'>
                  <X className='h-6 w-6' />
                </button>
              </div>

              {/* Success Message */}
              {editNameSuccess && (
                <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3'>
                  <CheckCircle className='h-5 w-5 text-green-600' />
                  <div>
                    <p className='text-green-800 font-medium'>
                      Name Updated Successfully!
                    </p>
                    <p className='text-green-700 text-sm'>
                      The user's name has been updated.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {editNameError && (
                <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3'>
                  <AlertCircle className='h-5 w-5 text-red-600' />
                  <div>
                    <p className='text-red-800 font-medium'>Error</p>
                    <p className='text-red-700 text-sm'>{editNameError}</p>
                  </div>
                </div>
              )}

              {/* Edit Name Form */}
              <form onSubmit={handleEditName} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Full Name
                  </label>
                  <div className='relative'>
                    <input
                      type='text'
                      name='name'
                      value={editNameForm.name}
                      onChange={handleEditNameChange}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                      placeholder='Enter full name'
                      required
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex gap-3 pt-4'>
                  <button
                    type='button'
                    onClick={closeEditNameModal}
                    className='flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium'
                    disabled={editNameLoading}>
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={editNameLoading || editNameSuccess}
                    className='flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
                    {editNameLoading ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                        Updating...
                      </>
                    ) : editNameSuccess ? (
                      <>
                        <CheckCircle className='h-4 w-4' />
                        Updated!
                      </>
                    ) : (
                      'Update Name'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUserPage
