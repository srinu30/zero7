// File: src/Pages/NewBatchDashboard.jsx

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx'
import { FiEdit, FiTrash2 } from 'react-icons/fi' // Added FiTrash2
import { X } from 'lucide-react'
import api from '../api/axios'

const API_URL = process.env.REACT_APP_API_URL

export default function NewBatchDashboard() {
  const [batches, setBatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editPopup, setEditPopup] = useState(false)
  const [batch, setBatch] = useState(null)
  // --- MODIFICATION: State for selected rows ---
  const [selectedBatches, setSelectedBatches] = useState([])

  const [newBatch, setNewBatch] = useState({
    course: '',
    demoDate: '',
    batchStartDate: '',
    duration: '',
    mode: '',
    trainer: '',
  })

  const fetchBatches = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${API_URL}/batches`)
      setBatches(response.data)
      setSelectedBatches([]) // Reset selection on fetch
    } catch (error) {
      console.error('Failed to fetch batches:', error)
      alert('Could not fetch batches.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBatches()
  }, [])

  const handleChange = (e) =>
    setNewBatch({ ...newBatch, [e.target.name]: e.target.value })

  const handleEditChange = (e) => {
    setBatch({ ...batch, [e.target.name]: e.target.value })
  }

  const handleAddBatch = async (e) => {
    e.preventDefault()
    if (
      !newBatch.course ||
      !newBatch.batchStartDate ||
      !newBatch.duration ||
      !newBatch.mode ||
      !newBatch.trainer
    ) {
      alert('Please fill all required fields.')
      return
    }
    try {
      const response = await axios.post(`${API_URL}/batches`, newBatch)
      setBatches([response.data, ...batches])
      setNewBatch({
        course: '',
        demoDate: '',
        batchStartDate: '',
        duration: '',
        mode: '',
        trainer: '',
      })
      alert('Batch added successfully!')
    } catch (error) {
      console.error('Failed to add batch:', error)
      alert('Error adding new batch.')
    }
  }

  const handleDeleteBatch = async (id) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      try {
        await axios.delete(`${API_URL}/batches/${id}`)
        setBatches(batches.filter((b) => b._id !== id))
      } catch (error) {
        console.error('Failed to delete batch:', error)
        alert('Error deleting batch.')
      }
    }
  }

  // --- MODIFICATION: Handler for deleting selected batches ---
  const handleDeleteSelectedBatches = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedBatches.length} selected batches?`,
      )
    ) {
      try {
        // This assumes your backend can handle an array of IDs in the request body
        // Or you can loop and send delete requests one by one
        await Promise.all(
          selectedBatches.map((id) => axios.delete(`${API_URL}/batches/${id}`)),
        )
        alert('Selected batches deleted successfully!')
        fetchBatches() // Refreshes the list and clears selection
      } catch (error) {
        console.error('Failed to delete selected batches:', error)
        alert('Error deleting selected batches.')
      }
    }
  }

  // --- MODIFICATION: Handlers for row selection ---
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allBatchIds = batches.map((b) => b._id)
      setSelectedBatches(allBatchIds)
    } else {
      setSelectedBatches([])
    }
  }

  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      setSelectedBatches((prev) => [...prev, id])
    } else {
      setSelectedBatches((prev) => prev.filter((batchId) => batchId !== id))
    }
  }

  const handleExport = () => {
    const dataToExport = batches.map(
      ({ course, demoDate, batchStartDate, duration, mode, trainer }) => ({
        Course: course,
        'Demo Date': demoDate
          ? new Date(demoDate).toLocaleDateString('en-CA')
          : '',
        'Batch Start Date': batchStartDate
          ? new Date(batchStartDate).toLocaleDateString('en-CA')
          : '',
        Duration: duration,
        Mode: mode,
        Trainer: trainer,
      }),
    )

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Batches')
    XLSX.writeFile(workbook, 'NewBatchesData.xlsx')
  }

  const handleImport = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array', cellDates: true })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json(worksheet)

      const formattedBatches = json.map((row) => ({
        course: row.Course,
        demoDate: row['Demo Date'],
        batchStartDate: row['Batch Start Date'],
        duration: row.Duration,
        mode: row.Mode,
        trainer: row.Trainer,
      }))

      if (
        window.confirm(
          `Found ${formattedBatches.length} batches to import. Do you want to proceed?`,
        )
      ) {
        try {
          await axios.post(`${API_URL}/batches/bulk`, formattedBatches)
          alert('Batches imported successfully!')
          fetchBatches()
        } catch (error) {
          console.error('Failed to import batches:', error)
          alert('Error importing batches.')
        }
      }
    }
    reader.readAsArrayBuffer(file)
    event.target.value = null
  }

  const handleCloseModal = () => {
    setEditPopup(false)
    setBatch(null)
  }

  const handlePopup = (batchToEdit) => {
    const formattedBatch = {
      ...batchToEdit,
      demoDate: batchToEdit.demoDate
        ? new Date(batchToEdit.demoDate).toISOString().split('T')[0]
        : '',
      batchStartDate: batchToEdit.batchStartDate
        ? new Date(batchToEdit.batchStartDate).toISOString().split('T')[0]
        : '',
    }
    setBatch(formattedBatch)
    setEditPopup(true)
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    try {
      await api.patch(`/batches/${batch._id}`, batch)
      setEditPopup(false)
      fetchBatches()
    } catch (error) {
      console.error('Failed to update batch:', error)
      alert('Error updating batch.')
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8'>
      <h2 className='text-4xl font-extrabold text-center text-indigo-800 mb-8'>
        🎓 New Batch Dashboard
      </h2>

      <div className='bg-white shadow-lg rounded-lg p-6 mb-8 max-w-4xl mx-auto'>
        <h3 className='text-2xl font-bold text-indigo-700 mb-6'>
          ➕ Add New Batch
        </h3>
        <form onSubmit={handleAddBatch} className='space-y-5'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <input type='text' name='course' placeholder='Course Name *' value={newBatch.course} onChange={handleChange} required className='p-3 border rounded-md' />
            <input type='text' name='trainer' placeholder='Trainer Name *' value={newBatch.trainer} onChange={handleChange} required className='p-3 border rounded-md' />
            <div className='relative'>
              <label className='absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600'>Demo Date (Optional)</label>
              <input type='date' name='demoDate' value={newBatch.demoDate} onChange={handleChange} className='p-3 border rounded-md w-full' />
            </div>
            <div className='relative'>
              <label className='absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600'>Batch Start Date *</label>
              <input type='date' name='batchStartDate' value={newBatch.batchStartDate} onChange={handleChange} required className='p-3 border rounded-md w-full' />
            </div>
            <input type='text' name='duration' placeholder='Duration (e.g., 6 Weeks) *' value={newBatch.duration} onChange={handleChange} required className='p-3 border rounded-md' />
            <input type='text' name='mode' placeholder='Mode (e.g., Online) *' value={newBatch.mode} onChange={handleChange} required className='p-3 border rounded-md' />
          </div>
          <button type='submit' className='w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 font-semibold'>
            Add Batch
          </button>
        </form>
      </div>

      {editPopup && batch && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg shadow-xl w-full max-w-lg p-6'>
            <div className='flex justify-between items-center border-b pb-3 mb-5'>
              <h3 className='text-2xl font-semibold'>Edit Batch</h3>
              <button onClick={handleCloseModal} className='text-gray-500 hover:text-gray-800'><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmitEdit} className='space-y-4'>
                <input name='course' value={batch.course} onChange={handleEditChange} required className='p-2 w-full border rounded-lg' />
                <input name='trainer' value={batch.trainer} onChange={handleEditChange} required className='p-2 w-full border rounded-lg' />
                <div className='relative'><label className='absolute -top-2 left-2 bg-white px-1 text-xs'>Demo Date</label><input name='demoDate' type='date' value={batch.demoDate} onChange={handleEditChange} className='p-2 w-full border rounded-lg'/></div>
                <div className='relative'><label className='absolute -top-2 left-2 bg-white px-1 text-xs'>Batch Start Date *</label><input name='batchStartDate' type='date' value={batch.batchStartDate} onChange={handleEditChange} required className='p-2 w-full border rounded-lg'/></div>
                <input name='duration' value={batch.duration} onChange={handleEditChange} required placeholder="Duration" className='p-2 w-full border rounded-lg' />
                <input name='mode' value={batch.mode} onChange={handleEditChange} required placeholder="Mode" className='p-2 w-full border rounded-lg' />
                <div className='flex justify-end space-x-4 mt-6'>
                    <button type='button' className='px-5 py-2 border rounded-lg hover:bg-gray-100' onClick={handleCloseModal}>Cancel</button>
                    <button type='submit' className='px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700'>Update Batch</button>
                </div>
            </form>
          </div>
        </div>
      )}

      <div className='bg-white shadow-lg rounded-lg p-6 max-w-7xl mx-auto'>
        <div className='flex flex-col sm:flex-row justify-between items-center mb-4'>
          <h3 className='text-2xl font-bold text-indigo-700 mb-4 sm:mb-0'>📋 All Batches</h3>
          <div className='flex gap-3'>
            {/* --- MODIFICATION: Delete Selected Button --- */}
            {selectedBatches.length > 0 && (
              <button
                onClick={handleDeleteSelectedBatches}
                className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-medium flex items-center gap-2'>
                <FiTrash2 />
                Delete Selected ({selectedBatches.length})
              </button>
            )}
            <label htmlFor='import-excel' className='bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-green-700 text-sm font-medium'>Import</label>
            <input id='import-excel' type='file' accept='.xlsx, .xls' onChange={handleImport} className='hidden' />
            <button onClick={handleExport} className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium'>Export</button>
          </div>
        </div>
        {isLoading ? (<p className='text-center py-8'>Loading batches...</p>) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-100'>
                <tr>
                  {/* --- MODIFICATION: Select All Checkbox --- */}
                  <th className='px-4 py-3'>
                    <input
                      type='checkbox'
                      className='form-checkbox h-4 w-4 text-indigo-600'
                      onChange={handleSelectAll}
                      checked={
                        batches.length > 0 &&
                        selectedBatches.length === batches.length
                      }
                    />
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase'>Course</th>
                  <th className='px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase'>Demo Date</th>
                  <th className='px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase'>Batch Start Date</th>
                  <th className='px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase'>Duration</th>
                  <th className='px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase'>Mode</th>
                  <th className='px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase'>Trainer</th>
                  <th className='px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase'>Action</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {batches.length > 0 ? (batches.map((batch) => (
                  <tr key={batch._id} className={`hover:bg-gray-50 ${selectedBatches.includes(batch._id) ? 'bg-indigo-50' : ''}`}>
                    {/* --- MODIFICATION: Individual Row Checkbox --- */}
                    <td className='px-4 py-3'>
                      <input
                        type='checkbox'
                        className='form-checkbox h-4 w-4 text-indigo-600'
                        checked={selectedBatches.includes(batch._id)}
                        onChange={(e) => handleSelectOne(e, batch._id)}
                      />
                    </td>
                    <td className='px-4 py-3 text-sm font-medium'>{batch.course}</td>
                    <td className='px-4 py-3 text-sm'>{batch.demoDate ? new Date(batch.demoDate).toLocaleDateString('en-GB') : 'N/A'}</td>
                    <td className='px-4 py-3 text-sm'>{batch.batchStartDate ? new Date(batch.batchStartDate).toLocaleDateString('en-GB') : 'N/A'}</td>
                    <td className='px-4 py-3 text-sm'>{batch.duration}</td>
                    <td className='px-4 py-3 text-sm'>{batch.mode}</td>
                    <td className='px-4 py-3 text-sm'>{batch.trainer}</td>
                    <td className='px-4 py-3 flex items-center gap-4'>
                      <button onClick={() => handlePopup(batch)} className='text-indigo-600 hover:text-indigo-900 flex items-center'><FiEdit className='mr-1 h-4 w-4' /> Edit</button>
                      <button onClick={() => handleDeleteBatch(batch._id)} className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-xs'>Delete</button>
                    </td>
                  </tr>
                ))) : (
                  <tr><td colSpan='8' className='text-center py-6 text-gray-500'>No batches found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}