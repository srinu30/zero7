import React, { useEffect, useState } from "react";
import api from "../api/axios"; // Use your central axios instance
import * as XLSX from "xlsx"; // Import the xlsx library
import { Trash2 } from "lucide-react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AdminCandidateEnrollment = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEnrollments, setSelectedEnrollments] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/candidate-enrollment");
      setEnrollments(data);
    } catch (e) {
      console.error("Error fetching enrollments:", e);
      setError("Failed to load enrollments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleExportToExcel = () => {
    // Remove internal fields like _id and __v before exporting
    const dataToExport = enrollments.map(({ _id, __v, ...rest }) => rest);

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enrollments");
    XLSX.writeFile(workbook, "CandidateEnrollments.xlsx");
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedEnrollments(enrollments.map((e) => e._id));
    } else {
      setSelectedEnrollments([]);
    }
  };

  const handleSelectRow = (e, id) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedEnrollments((prev) => [...prev, id]);
    } else {
      setSelectedEnrollments((prev) => prev.filter((item) => item !== id));
    }
  };

  // Ensure selectAll state syncs if user manually selects/deselects all
  useEffect(() => {
    if (enrollments.length > 0 && selectedEnrollments.length === enrollments.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedEnrollments, enrollments]);

  const handleDelete = async (id) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/candidate-enrollment/${id}`);
          // Update state locally to avoid full reload if preferred, or just re-fetch
          setEnrollments(enrollments.filter(enrollment => enrollment._id !== id));
          setSelectedEnrollments(selectedEnrollments.filter(itemId => itemId !== id));
          MySwal.fire('Deleted!', 'The enrollment has been deleted.', 'success');
        } catch (error) {
          console.error('Failed to delete enrollment:', error);
          MySwal.fire('Error', 'Failed to delete enrollment.', 'error');
        }
      }
    });
  };

  const handleDeleteSelected = async () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${selectedEnrollments.length} enrollments. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete them!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Using Promise.all to delete individually if no bulk endpoint exists
          await Promise.all(
            selectedEnrollments.map((id) => api.delete(`/candidate-enrollment/${id}`))
          );
          fetchEnrollments(); // Re-fetch to ensure sync
          setSelectedEnrollments([]);
          setSelectAll(false);
          MySwal.fire('Deleted!', 'The selected enrollments have been deleted.', 'success');
        } catch (error) {
          console.error('Failed to delete selected enrollments:', error);
          MySwal.fire('Error', 'Failed to delete some or all selected enrollments.', 'error');
        }
      }
    });
  };

  return (
    // Main container with padding and a light background
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header section with flex layout to space out title and button */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Candidate Enrollments
        </h2>
        <div className="flex gap-3">
            {selectedEnrollments.length > 0 && (
                <button
                    onClick={handleDeleteSelected}
                    className="flex items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
                >
                    <Trash2 size={18} className="mr-2" />
                    Delete Selected ({selectedEnrollments.length})
                </button>
            )}
            {/* Export Button with blue theme, hover effects, and transitions */}
            <button
              onClick={handleExportToExcel}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
            >
              Export to Excel
            </button>
        </div>
      </div>

      {/* Conditional Rendering for Loading and Error States */}
      {loading && <p className="text-center text-gray-500">Loading enrollments...</p>}
      {error && <div className="p-4 text-center bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {/* Table section, rendered when not loading and no error */}
      {!loading && !error && (
        // Wrapper to handle table overflow on small screens and add a shadow/border
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg bg-white">
          <table className="w-full text-sm text-left text-gray-500">
            {/* Table Header */}
            <thead className="text-xs text-white uppercase bg-blue-500">
              <tr>
                <th scope="col" className="px-6 py-3">
                    <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                </th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Contact</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Location</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Skills</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {enrollments.length > 0 ? (
                enrollments.map((enrollment) => (
                  // Table Row with alternating background colors (zebra striping) and a bottom border
                  <tr
                    key={enrollment._id}
                    className={`border-b ${
                        selectedEnrollments.includes(enrollment._id)
                          ? "bg-blue-50"
                          : "odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                      }`}
                  >
                    <td className="px-6 py-4">
                        <input
                            type="checkbox"
                            checked={selectedEnrollments.includes(enrollment._id)}
                            onChange={(e) => handleSelectRow(e, enrollment._id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {enrollment.name}
                    </td>
                    <td className="px-6 py-4">{enrollment.contact}</td>
                    <td className="px-6 py-4">{enrollment.email}</td>
                    <td className="px-6 py-4">{enrollment.location}</td>
                    <td className="px-6 py-4">{enrollment.role}</td>
                    <td className="px-6 py-4">{enrollment.skills}</td>
                    <td className="px-6 py-4">
                        <button
                            onClick={() => handleDelete(enrollment._id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                // Message shown when there are no enrollments
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                    No new enrollments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCandidateEnrollment;