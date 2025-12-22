import React, { useState, useEffect } from 'react'
import api from '../api/axios' // Assuming this path is correct for your setup
import * as XLSX from 'xlsx'
import {
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
} from 'react-icons/fa' // Importing icons

const PlacedCandidates = () => {
  const [placedCandidates, setPlacedCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10) // Show 10 rows per page for table layout

  const fetchPlacedCandidates = async () => {
    try {
      setLoading(true)
      const response = await api.get('/interview')
      // Filter only placed candidates
      const placed = response.data.filter(
        (interview) => interview.status?.toLowerCase() === 'placed',
      )
      setPlacedCandidates(placed)
    } catch (error) {
      console.error('Error fetching placed candidates:', error)
      // Optionally handle error state in UI
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlacedCandidates()
  }, [])

  // Pagination logic
  const totalPages = Math.ceil(placedCandidates.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCandidates = placedCandidates.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const exportToExcel = () => {
    // Prepare data for export
    const exportData = placedCandidates.map((candidate) => ({
      'Candidate Name': candidate.candidateName,
      Company: candidate.companyName,
      'Job Role': candidate.jobRole,
      Level: candidate.interviewLevel,
      'Date Placed': new Date(candidate.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      Status: 'PLACED',
    }))

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData)

    // Create workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Placed Candidates')

    // Generate file name with current date
    const fileName = `placed_candidates_${
      new Date().toISOString().split('T')[0]
    }.xlsx`

    // Save file
    XLSX.writeFile(wb, fileName)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100'>
        <div className='text-center p-8 bg-white rounded-lg shadow-xl'>
          <div className='animate-spin h-14 w-14 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4'></div>
          <p className='text-lg text-gray-700 font-semibold'>
            Loading placed candidates...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen  p-6 sm:p-10'>
      {/* Header */}
      <header className='flex flex-col sm:flex-row justify-between items-center mb-8 p-4 bg-white rounded-xl shadow-md border border-gray-100'>
        <div className='flex items-center mb-4 sm:mb-0'>
          <FaCheckCircle className='text-green-500 text-3xl mr-3' />
          <h1 className='text-3xl font-extrabold text-gray-800'>
            Placed Candidates
          </h1>
        </div>
        <div className='flex items-center gap-4'>
          <button
            onClick={exportToExcel}
            className='flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white transition duration-200'>
            <FaDownload className='mr-2' />
            Export
          </button>
          <div className='flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-lg shadow-sm'>
            <span className='mr-2'>Total Placed:</span>
            <span className='text-2xl'>{placedCandidates.length}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className='max-w-7xl mx-auto'>
        {placedCandidates.length === 0 ? (
          <div className='text-center py-20 bg-white rounded-xl shadow-md border border-gray-100'>
            <p className='text-2xl text-gray-600 font-medium'>
              No placed candidates yet. Keep up the great work!
            </p>
          </div>
        ) : (
          <>
            <div className='overflow-x-auto mb-8'>
              <table className='min-w-full bg-white rounded-xl shadow-lg border border-gray-200'>
                <thead>
                  <tr className='bg-gray-50 border-b border-gray-200'>
                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>
                      <div className='flex items-center'>Candidate Name</div>
                    </th>
                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>
                      <div className='flex items-center'>Company</div>
                    </th>
                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>
                      <div className='flex items-center'>Job Role</div>
                    </th>
                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>
                      <div className='flex items-center'>Salary</div>
                    </th>
                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>
                      <div className='flex items-center'>Date of Joining</div>
                    </th>
                    <th className='py-4 px-6 text-left text-sm font-semibold text-gray-700'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {currentCandidates.map((candidate, index) => (
                    <tr
                      key={candidate._id}
                      className={`hover:bg-gray-50 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}>
                      <td className='py-4 px-6'>
                        <div className='text-sm font-semibold text-gray-800'>
                          {candidate.candidateName}
                        </div>
                      </td>
                      <td className='py-4 px-6'>
                        <div className='text-sm text-gray-700'>
                          {candidate.companyName}
                        </div>
                      </td>
                      <td className='py-4 px-6'>
                        <div className='text-sm text-gray-700'>
                          {candidate.jobRole}
                        </div>
                      </td>
                      <td className='py-4 px-6'>
                        <div className='text-sm text-gray-700'>
                          {candidate.salary}
                        </div>
                      </td>
                      <td className='py-4 px-6'>
                        <div className='text-sm text-gray-700'>
                          {new Date(candidate.date).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            },
                          )}
                        </div>
                      </td>
                      <td className='py-4 px-6'>
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                          PLACED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages >= 1 && (
              <div className='bg-white rounded-xl shadow-md border border-gray-100 p-6'>
                <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                  {/* Items per page selector and info */}
                  <div className='flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600'>
                    <div className='flex items-center gap-2'>
                      <span>Show:</span>
                      <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className='border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                      <span>per page</span>
                    </div>
                    <div>
                      Showing{' '}
                      <strong className='font-semibold'>
                        {placedCandidates.length === 0 ? 0 : startIndex + 1}
                      </strong>{' '}
                      -{' '}
                      <strong className='font-semibold'>
                        {Math.min(endIndex, placedCandidates.length)}
                      </strong>{' '}
                      of{' '}
                      <strong className='font-semibold'>
                        {placedCandidates.length}
                      </strong>{' '}
                      placed candidates
                    </div>
                  </div>

                  {/* Simple Pagination Controls - Previous/Next Only */}
                  <div className='flex items-center gap-4'>
                    {/* Previous Page Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className='flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200'>
                      <FaChevronLeft className='mr-2' />
                      Previous Page
                    </button>

                    {/* Current Page Info */}
                    <span className='text-sm text-gray-600'>
                      Page {currentPage} of {totalPages}
                    </span>

                    {/* Next Page Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className='flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200'>
                      Next Page
                      <FaChevronRight className='ml-2' />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default PlacedCandidates
