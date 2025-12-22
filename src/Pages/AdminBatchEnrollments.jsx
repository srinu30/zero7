// File: src/Pages/AdminBatchEnrollments.jsx

import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { ClipboardList, Loader2, ShieldX, Trash2, Download } from 'lucide-react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const AdminBatchEnrollments = () => {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true)
        const response = await api.get('/batch-enrollments')
        setEnrollments(response.data)
      } catch (e) {
        console.error('Error fetching enrollments:', e)
        setError('Failed to load enrollment data.')
      } finally {
        setLoading(false)
      }
    }
    fetchEnrollments()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      try {
        await api.delete(`/batch-enrollments/${id}`)
        setEnrollments(enrollments.filter((item) => item._id !== id))
      } catch (err) {
        console.error('Error deleting enrollment:', err)
        alert('Failed to delete the enrollment.')
      }
    }
  }

  const handleExport = () => {
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    const formattedData = enrollments.map((item) => ({
      Name: item.name,
      Contact: `${item.phone}, ${item.email}`,
      Course: item.selectedCourse,
      'Enrollment Type': item.programType,
      Message: item.message || 'N/A',
      'Submitted On': new Date(item.createdAt).toLocaleString(),
    }))

    const ws = XLSX.utils.json_to_sheet(formattedData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    saveAs(data, 'enrollments' + fileExtension)
  }

  return (
    <div className='p-4 sm:p-6 bg-gray-50 min-h-full'>
      <div className='bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 mb-8 flex items-center justify-between text-white'>
        <div className='flex items-center space-x-4'>
          <div className='bg-opacity-20 p-3 rounded-full'>
            <ClipboardList size={28} />
          </div>
          <div>
            <h3 className='text-2xl sm:text-3xl font-bold'>
              Batch Demo Enrollments
            </h3>
            <p className='text-blue-200 text-sm'>
              Registrations from the 'New Batches' page
            </p>
          </div>
        </div>
        <div className='text-right'>
          <p className='text-3xl sm:text-5xl font-extrabold'>
            {enrollments.length}
          </p>
          <p className='text-blue-200 text-sm'>Total Registrations</p>
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-lg p-6'>
        <div className='flex justify-end mb-4'>
          <button
            onClick={handleExport}
            className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center space-x-2 transition duration-300 ease-in-out'>
            <Download size={20} />
            <span>Export to Excel</span>
          </button>
        </div>
        {loading && (
          <div className='flex justify-center py-16'>
            <Loader2 className='animate-spin text-blue-500' size={48} />
          </div>
        )}
        {error && (
          <div className='text-center py-16 text-red-600'>
            <ShieldX size={48} className='mx-auto' />
            <p className='mt-4 font-semibold'>{error}</p>
          </div>
        )}
        {!loading && !error && (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Contact
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Course
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Enrollment Type
                  </th>
                  {/* --- 1. ADDED: New header for the Message column --- */}
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Message
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Submitted On
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {enrollments.length > 0 ? (
                  enrollments.map((item) => (
                    <tr key={item._id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {item.name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                        {item.phone}
                        <br />
                        <span className='text-xs text-gray-500'>
                          {item.email}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                        {item.selectedCourse}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                        {item.programType}
                      </td>
                      {/* --- 2. ADDED: New data cell to display the message --- */}
                      <td className='px-6 py-4 text-sm text-gray-600 max-w-xs whitespace-pre-wrap'>
                        {item.message || 'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className='text-red-600 hover:text-red-800'
                          title='Delete Enrollment'>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  // --- 3. UPDATED: Colspan increased to 7 to match new column count ---
                  <tr>
                    <td
                      colSpan='7'
                      className='px-6 py-10 text-center text-gray-500'>
                      No batch enrollments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBatchEnrollments
