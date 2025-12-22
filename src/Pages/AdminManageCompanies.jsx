import { useState, useEffect } from 'react'
import api from '../api/axios'
import {
  FiBriefcase,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiX,
  FiRefreshCcw,
} from 'react-icons/fi' // Importing icons
import { Building2 } from 'lucide-react'

const AdminManageCompanies = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editPopup, setEditPopup] = useState(false)
  const [companyData, setCompanyData] = useState([])
  const [editCompanyFormState, setEditCompanyFormState] = useState(null) // Changed to null initially
  const [needsRefresh, setNeedsRefresh] = useState(true) // To trigger data fetching
  const [newCompany, setNewCompany] = useState({
    _id: '',
    name: '',
    email: '',
    industry: '',
    address: '',
  })

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const { data } = await api.get('/company/')
        setCompanyData(data)
      } catch (err) {
        console.error('Failed to fetch companies:', err)
      }
    }
    // Only fetch data when needsRefresh is true
    if (needsRefresh) {
      fetchCompanyData()
      setNeedsRefresh(false) // Reset after fetching
    }
  }, [needsRefresh])

  const handleAddInputChange = (e) => {
    const { name, value } = e.target
    setNewCompany((prev) => ({ ...prev, [name]: value }))
  }


  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditCompanyFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/company/register', newCompany)
      setNewCompany({ _id: '', name: '', email: '', industry: '', address: '' })
      setShowAddForm(false)
      setNeedsRefresh(true) // Trigger a data refresh
      alert('Company added successfully!') // Smooth alert would go here
    } catch (error) {
      console.error('Error adding company:', error)
      alert(
        'Failed to add company: ' +
        (error.response?.data?.message || 'Server error'),
      ) // Smooth alert would go here
    }
  }

  const handleDelete = async (companyId, companyName) => {
    if (window.confirm(`Are you sure you want to delete ${companyName}?`)) {
      try {
        await api.delete(`/company/${companyId}`)
        setNeedsRefresh(true) // Trigger a data refresh
        alert('Company deleted successfully!') // Smooth alert would go here
      } catch (error) {
        console.error('Error deleting company:', error)
        alert('Failed to delete company.') // Smooth alert would go here
      }
    }
  }

  const handlePopup = (company) => {
    setEditCompanyFormState(company)
    setEditPopup(true)
  }

  const handleUpdateCompany = async (e) => {
    e.preventDefault()
    try {
      await api.patch(
        `/company/${editCompanyFormState._id}`,
        editCompanyFormState,
      )
      setEditPopup(false)
      setNeedsRefresh(true)
      alert('Company updated successfully!') // Smooth alert would go here
    } catch (err) {
      console.error('Error updating company:', err)
      alert('Failed to update company.') // Smooth alert would go here
    }
  }

  return (
    <div className='min-h-screen w-[80vw] bg-gray-100 p-6 font-sans'>
      {/* Header Section */}
      <div className='bg-[#267edc] rounded-xl shadow-lg p-6 mb-8 flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div className='bg-white bg-opacity-20 p-3 rounded-full'>
            <Building2 />
          </div>
          <div>
            <h3 className='text-3xl font-bold text-white'>Manage Companies</h3>
            <p className='text-teal-100 text-sm'>
              Add, update, or remove company accounts from the system
            </p>
          </div>
        </div>
        <div className='text-right'>
          <p className='text-5xl font-extrabold text-white'>
            {companyData.length}
          </p>
          <p className='text-teal-100 text-sm'>Available Companies</p>{' '}
          {/* Changed text */}
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex justify-end space-x-4 mb-6'>
        <button
          onClick={() => setShowAddForm(true)}
          className='flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200'>
          <FiPlus className='mr-2' /> Add New Company
        </button>
      </div>

      {/* Add New Company Form (Popup/Modal) */}
      {showAddForm && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
          <div className='relative p-8 bg-white rounded-lg shadow-xl max-w-md w-full h-[80vh] overflow-scroll'>
            <button
              className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200'
              onClick={() => setShowAddForm(false)}>
              <FiX className='h-6 w-6' />
            </button>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
              Add New Company
            </h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label htmlFor='companyId' className='block text-sm font-medium text-gray-700'>
                  Company ID
                </label>
                <input
                  type='text'
                  id='companyId'
                  name='_id'
                  value={newCompany._id}
                  onChange={handleAddInputChange}
                  required
                  minLength={3}
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3'
                />
              </div>

              <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                  Company Name
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={newCompany.name}
                  onChange={handleAddInputChange}
                  required
                  minLength={3}
                  pattern="^[A-Za-z0-9 ]{3,}$"
                  title="Company name must be at least 3 characters and special characters are not allowed"
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3'
                />
              </div>

              <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={newCompany.email}
                  onChange={handleAddInputChange}
                  required
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  title="Please enter a valid email"
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3'
                />
              </div>

              <div>
                <label htmlFor='industry' className='block text-sm font-medium text-gray-700'>
                  Industry
                </label>
                <input
                  type='text'
                  id='industry'
                  name='industry'
                  value={newCompany.industry}
                  onChange={handleAddInputChange}
                  required
                  minLength={3}
                  title="Industry must be at least 3 characters"
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3'
                />
              </div>

              <div>
                <label htmlFor='address' className='block text-sm font-medium text-gray-700'>
                  Address
                </label>
                <textarea
                  id='address'
                  name='address'
                  value={newCompany.address}
                  onChange={handleAddInputChange}
                  required
                  minLength={5}
                  title="Address must be at least 5 characters"
                  rows='3'
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3'
                />
              </div>

              <button
                type='submit'
                className='w-full flex justify-center py-2 px-4 rounded-md bg-indigo-600 text-white'
              >
                <FiPlus className='mr-2' /> Add Company
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Edit Company Popup */}
      {editPopup && editCompanyFormState && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
          <div className='relative p-8 bg-white rounded-lg shadow-xl max-w-md w-full h-[80vh] overflow-scroll'>
            <button
              className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200'
              onClick={() => setEditPopup(false)}>
              <FiX className='h-6 w-6' />
            </button>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
              Edit Company Details
            </h2>
            <form onSubmit={handleUpdateCompany} className='space-y-4'>
              <div>
                <label
                  htmlFor='editCompanyId'
                  className='block text-sm font-medium text-gray-700'>
                  Company ID
                </label>
                <input
                  type='text'
                  id='editCompanyId'
                  name='_id'
                  value={editCompanyFormState._id}
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed sm:text-sm'
                  readOnly
                  disabled
                />
              </div>
              <div>
                <label
                  htmlFor='editName'
                  className='block text-sm font-medium text-gray-700'>
                  Company Name
                </label>
                <input
                  type='text'
                  id='editName'
                  name='name'
                  value={editCompanyFormState.name}
                  onChange={handleEditInputChange}
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='editEmail'
                  className='block text-sm font-medium text-gray-700'>
                  Email
                </label>
                <input
                  type='email'
                  id='editEmail'
                  name='email'
                  value={editCompanyFormState.email}
                  onChange={handleEditInputChange}
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='editIndustry'
                  className='block text-sm font-medium text-gray-700'>
                  Industry
                </label>
                <input
                  type='text'
                  id='editIndustry'
                  name='industry'
                  value={editCompanyFormState.industry}
                  onChange={handleEditInputChange}
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='editAddress'
                  className='block text-sm font-medium text-gray-700'>
                  Address
                </label>
                <textarea
                  id='editAddress'
                  name='address'
                  value={editCompanyFormState.address}
                  onChange={handleEditInputChange}
                  rows='3'
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm'></textarea>
              </div>
              <div className='flex justify-end space-x-3'>
                <button
                  type='button'
                  onClick={() => setEditPopup(false)}
                  className='flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200'>
                  <FiX className='mr-2' /> Cancel
                </button>
                <button
                  type='submit'
                  className='flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200'>
                  <FiRefreshCcw className='mr-2' /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Companies Table */}
      <div className='overflow-x-auto bg-white shadow-xl rounded-lg border border-gray-200'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-[#267edc]'>
            <tr>
              {['ID', 'Name', 'Email', 'Industry', 'Address', 'Actions'].map(
                (header) => (
                  <th
                    key={header}
                    className='px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider'>
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {companyData.map((company) => (
              <tr
                key={company._id}
                className='hover:bg-gray-50 transition-colors duration-200'>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800'>
                  {company._id}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  {company.name}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                  {company.email}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                  {company.industry}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                  {company.address}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-left text-sm font-medium flex items-center space-x-4'>
                  <button
                    onClick={() => handlePopup(company)}
                    className='text-indigo-600 hover:text-indigo-900 font-semibold transition-colors duration-200 flex items-center'
                    title='Edit Company'>
                    <FiEdit className='mr-1 h-4 w-4' /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(company._id, company.name)}
                    className='text-red-600 hover:text-red-900 font-semibold transition-colors duration-200 flex items-center'
                    title='Delete Company'>
                    <FiTrash2 className='mr-1 h-4 w-4' /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminManageCompanies
