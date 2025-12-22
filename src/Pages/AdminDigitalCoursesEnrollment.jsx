// File: src/Pages/AdminDigitalCoursesEnrollment.jsx

import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { GraduationCap, Loader2, ShieldX, Trash2, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AdminDigitalCoursesEnrollment = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const response = await api.get("/enrollments");
        setEnrollments(response.data);
      } catch (e) {
        console.error("Error fetching enrollments:", e);
        setError("Failed to load enrollment data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this enrollment? This action cannot be undone.")) {
      try {
        await api.delete(`/enrollments/${id}`);
        setEnrollments(enrollments.filter((enrollment) => enrollment._id !== id));
        alert("Enrollment deleted successfully!");
      } catch (err) {
        console.error("Error deleting enrollment:", err);
        alert("Failed to delete the enrollment. Please try again.");
      }
    }
  };

  // --- ADDED: Export to Excel functionality ---
  const handleExport = () => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    
    // We can format the data for a cleaner export if needed
    const formattedData = enrollments.map(e => ({
      "Course Name": e.course,
      "Student Name": e.name,
      "Email": e.email,
      "Contact": e.contact,
      "Enrolled On": new Date(e.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(data, "digital-course-enrollments" + fileExtension);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 mb-8 flex items-center justify-between text-white">
        <div className="flex items-center space-x-4">
          <div className=" bg-opacity-20 p-3 rounded-full">
            <GraduationCap size={32} />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold">Digital Courses Enrollment</h3>
            <p className="text-blue-200 text-sm">List of students who enrolled for digital courses</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl sm:text-5xl font-extrabold">{enrollments.length}</p>
          <p className="text-blue-200 text-sm">Total Enrollments</p>
        </div>
      </div>

      {/* Content Area Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* --- ADDED: Export Button --- */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:bg-gray-400"
            disabled={loading || enrollments.length === 0}
          >
            <Download size={18} className="mr-2" />
            Export to Excel
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Loader2 className="animate-spin text-blue-500" size={48} />
            <p className="mt-4">Loading Enrollments...</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 text-red-600">
            <ShieldX size={48} />
            <p className="mt-4 font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrollments.length > 0 ? (
                  enrollments.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.course}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.contact}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(student.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Enrollment"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                      No new enrollments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDigitalCoursesEnrollment;