// File: src/Pages/AdminManageCandidates.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Edit, Trash2, Download, Upload, PlusCircle, X, Loader2, Users, XCircle, ChevronLeft, ChevronRight,
} from 'lucide-react';
import api from '../api/axios';
import Cookie from 'js-cookie';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './AdminManageCandidates.css';

const MySwal = withReactContent(Swal);

// --- Validation Function (Defined outside for cleanliness) ---
const validateForm = (data) => {
  const errors = {};
  const namePattern = /^[A-Za-z\s]+$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phonePattern = /^[6-9]\d{9}$/;
  const expPattern = /^\d+(\.\d+)?$/;

  // 1. Candidate Name
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Candidate Name is required.';
  } else if (!namePattern.test(data.name.trim())) {
    errors.name = 'Name can only contain alphabets and spaces.';
  }

  // 2. Candidate Surname
  if (!data.surname || data.surname.trim() === '') {
    errors.surname = 'Candidate Surname is required.';
  } else if (!namePattern.test(data.surname.trim())) {
    errors.surname = 'Surname can only contain alphabets and spaces.';
  }

  // 3. Role
  if (!data.role || data.role.trim() === '') {
    errors.role = 'Role is required.';
  }

  // 4. Skills
  if (!data.skills || data.skills.trim() === '') {
    errors.skills = 'Skills are required (comma-separated).';
  }

  // 5. Experience
  const expValue = data.exp.toString().trim();
  if (!expValue) {
    errors.exp = 'Experience is required.';
  } else if (!expPattern.test(expValue) || parseFloat(expValue) < 0) {
    errors.exp = 'Experience must be a positive number (years).';
  }

  // 6. Location
  if (!data.location || data.location.trim() === '') {
    errors.location = 'Location is required.';
  }

  // 7. Email Address
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email Address is required.';
  } else if (!emailPattern.test(data.email.trim())) {
    errors.email = 'Enter a valid email address (e.g., user@domain.com).';
  }

  // 8. Phone Number
  if (!data.phone || data.phone.trim() === '') {
    errors.phone = 'Phone Number is required.';
  } else if (!phonePattern.test(data.phone.trim())) {
    errors.phone = 'Phone must be a valid 10-digit number starting with 6, 7, 8, or 9.';
  }

  return errors;
};
// --- End Validation Function ---


export default function AdminManageCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    surname: '',
    role: '',
    skills: '',
    exp: '',
    location: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({}); // NEW STATE FOR VALIDATION ERRORS
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [importing, setImporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const fileInputRef = useRef(null);

  // Utility alert
  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
    setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
  };

  // Fetch all candidates
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/candidates/');
      setCandidates(data);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
      showAlert('error', 'Failed to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch recruiter (from cookie)
  const fetchRecruiter = () => {
    const data = Cookie.get('user');
    if (data) {
      const res = JSON.parse(data);
      setUserId(res.id);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchRecruiter();
  }, []);

  // Input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // INLINE FILTERING: Name/Surname - allow only alphabets and spaces
    if (name === 'name' || name === 'surname') {
        if (!/^[A-Za-z\s]*$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
    // Clear error on change for immediate user feedback
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Blur handler for per-field validation feedback
  const handleBlur = (e) => {
    const { name } = e.target;
    const validationErrors = validateForm(formData);
    // Only set the error for the field that was blurred
    setErrors(prev => ({ ...prev, [name]: validationErrors[name] || '' }));
  };


  // Modal openers/closers
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      userId,
      name: '',
      surname: '',
      role: '',
      skills: '',
      exp: '',
      location: '',
      email: '',
      phone: '',
    });
    setErrors({}); // Clear errors when opening
    setShowModal(true);
  };

  const handleOpenEditModal = (candidate) => {
    setFormData({
      userId: candidate.userId,
      name: candidate.name,
      surname: candidate.surname,
      role: candidate.role,
      skills: candidate.skills,
      exp: candidate.exp,
      location: candidate.location,
      email: candidate.email,
      phone: candidate.phone,
    });
    setEditingId(candidate._id);
    setErrors({}); // Clear errors when opening
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSubmitting(false);
    setErrors({}); // Clear errors on close
  };

  // Add/Edit submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
        console.log('Form validation failed:', validationErrors);
        return; // STOP submission on error
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/candidates/${editingId}`, formData);
        showAlert('success', 'Candidate updated successfully!');
      } else {
        await api.post('/candidates', formData);
        showAlert('success', 'Candidate added successfully!');
      }
      handleCloseModal();
      fetchCandidates();
    } catch (error) {
      console.error('Failed to submit candidate:', error);
      showAlert('error', error.response?.data?.message || 'Failed to save candidate.');
    } finally {
      setSubmitting(false);
    }
  };

  // Single delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      setDeletingId(id);
      try {
        await api.delete(`/candidates/${id}`);
        fetchCandidates();
        showAlert('success', 'Candidate deleted successfully!');
      } catch (error) {
        console.error('Failed to delete candidate:', error);
        showAlert('error', 'Failed to delete candidate.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Bulk delete selected candidates
  const handleDeleteSelected = async () => {
    if (selectedCandidates.length === 0) return;
    if (!window.confirm(`Delete ${selectedCandidates.length} selected candidates?`)) return;

    try {
      await Promise.all(selectedCandidates.map((id) => api.delete(`/candidates/${id}`)));
      fetchCandidates();
      setSelectedCandidates([]);
      setSelectAll(false);
      showAlert('success', 'Selected candidates deleted successfully!');
    } catch (error) {
      console.error('Bulk delete failed:', error);
      showAlert('error', 'Failed to delete selected candidates.');
    }
  };

  // Select/Deselect single candidate
  const handleSelectCandidate = (e, id) => {
    if (e.target.checked) {
      setSelectedCandidates((prev) => [...prev, id]);
    } else {
      setSelectedCandidates((prev) => prev.filter((cid) => cid !== id));
      setSelectAll(false);
    }
  };

  // Select/Deselect all candidates on current page
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      const allIds = currentCandidates.map((c) => c._id);
      setSelectedCandidates(allIds);
    } else {
      setSelectedCandidates([]);
    }
  };

  // Export Excel
  const exportToExcel = () => {
    try {
      const dataToExport = candidates.map(
        ({ candidateId, name, surname, role, skills, exp, location, email, phone }) => ({
          'Candidate ID': candidateId,
          Name: name,
          Surname: surname,
          Role: role,
          Skills: skills,
          'Experience (Years)': exp,
          Location: location,
          Email: email,
          Phone: phone,
        })
      );
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates');
      XLSX.writeFile(workbook, `candidates-export-${new Date().toISOString().split('T')[0]}.xlsx`);
      showAlert('success', 'Data exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      showAlert('error', 'Failed to export data.');
    }
  };

  // Import Excel
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.match(/\.(xlsx|xls)$/)) {
      showAlert('error', 'Please select a valid Excel file.');
      return;
    }
    setImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const workbook = XLSX.read(event.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);

          if (data.length === 0) throw new Error('Excel file is empty.');

          const formattedData = data.map((item, index) => {
            if (!item.Name || !item.Role || !item.Email) {
              throw new Error(`Row ${index + 2}: Missing required fields (Name, Role, Email)`);
            }
            return {
              userId,
              name: String(item.Name || '').trim(),
              surname: String(item.Surname || '').trim(),
              role: String(item.Role || '').trim(),
              skills: String(item.Skills || '').trim(),
              exp: String(item['Experience (Years)'] || 0),
              location: String(item.Location || '').trim(),
              email: String(item.Email || '').trim().toLowerCase(),
              phone: String(item.Phone || '').trim(),
            };
          });

          await api.post('/candidates/bulk', formattedData);
          fetchCandidates();
          showAlert('success', `${formattedData.length} candidates imported successfully!`);
        } catch (innerError) {
          showAlert('error', `Import failed: ${innerError.message}`);
        } finally {
          setImporting(false);
        }
      };
      reader.readAsBinaryString(file);
    } catch {
      showAlert('error', 'Failed to read the file.');
      setImporting(false);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current && !importing) fileInputRef.current.click();
  };

  // Pagination logic
  const totalPages = Math.ceil(candidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCandidates = candidates.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="loading-spinner-icon animate-spin" />
      </div>
    );
  }

  return (
    <div className="candidates-page">
      {/* ADDED: Inline styles for max-width and margin to reduce size and align UI */}
      <div className="candidates-container" style={{ maxWidth: '1200px', margin: '0 auto', width: '95%' }}>
        {/* HEADER */}
        <div className="page-header">
          <div className="header-content">
            <Users className="header-icon" />
            <div>
              <h3 className="header-title">Manage Candidates</h3>
              <p className="header-subtitle">Add, update, or remove bench candidates</p>
            </div>
          </div>
          <div className="stats-box">
            <div className="stats-number">{candidates.length}</div>
            <div className="stats-label">Available Candidates</div>
          </div>
        </div>

        {/* ALERT */}
        {alertMessage.message && (
          <div className={`app-alert ${alertMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {alertMessage.type === 'error' ? <XCircle className="alert-icon" /> : <div className="alert-icon-success">✓</div>}
            <span className="alert-message">{alertMessage.message}</span>
          </div>
        )}

        {/* MAIN CARD */}
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">All Candidates</h2>
            <div className="actions-group">
              {selectedCandidates.length > 0 && (
                <button onClick={handleDeleteSelected} className="btn btn-danger">
                  <Trash2 size={18} /> Delete ({selectedCandidates.length})
                </button>
              )}
              <button type="button" onClick={triggerFileInput} disabled={importing} className="btn btn-purple">
                <Upload size={18} /> {importing ? 'Importing...' : 'Import'}
              </button>
              <input type="file" ref={fileInputRef} hidden accept=".xlsx, .xls" onChange={handleImport} disabled={importing} />
              <button onClick={exportToExcel} className="btn btn-success">
                <Download size={18} /> Export
              </button>
              <button onClick={handleOpenAddModal} className="btn btn-primary">
                <PlusCircle size={18} /> Add New
              </button>
            </div>
          </div>

          {/* TABLE */}
          {/* ADDED: overflowX: auto to prevent table from breaking out of the card */}
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
                  <th>Candidate ID</th>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Role</th>
                  <th>Skills</th>
                  <th>Experience</th>
                  <th>Location</th>
                  <th>Recruiter</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCandidates.map((c) => (
                  <tr key={c._id} className={selectedCandidates.includes(c._id) ? 'selected-row' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(c._id)}
                        onChange={(e) => handleSelectCandidate(e, c._id)}
                      />
                    </td>
                    <td>{c.candidateId || 'N/A'}</td>
                    <td>{c.name}</td>
                    <td>{c.surname || 'N/A'}</td>
                    <td>{c.role}</td>
                    <td>{c.skills || 'N/A'}</td>
                    <td>{c.exp} years</td>
                    <td>{c.location}</td>
                    <td>{c.userName || 'N/A'}</td>
                    <td>
                      <div className="actions-cell">
                        <button onClick={() => handleOpenEditModal(c)} className="btn-icon btn-edit">
                          <Edit size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          disabled={deletingId === c._id}
                          className="btn-icon btn-delete"
                        >
                          {deletingId === c._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="pagination-controls">
            <div className="pagination-summary">
              Showing <strong>{startIndex + 1}</strong> - <strong>{Math.min(endIndex, candidates.length)}</strong> of{' '}
              <strong>{candidates.length}</strong>
            </div>
            {totalPages > 1 && (
              <div className="pagination-buttons">
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                  <ChevronLeft size={18} />
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Candidate' : 'Add New Candidate'}</h2>
              <button onClick={handleCloseModal} className="modal-close-btn">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-info-text">
                {editingId ? 'Candidate ID cannot be changed' : 'Candidate ID will be auto-generated'}
              </div>

              {/* 1. Candidate Name */}
              <div className="form-group">
                <input
                  name="name"
                  pattern="[A-Za-z\s]*"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Candidate Name"
                  required
                  title="Name can only contain alphabets and spaces."
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                />
                {errors.name && <small className="error-text">{errors.name}</small>}
              </div>
              
              {/* 2. Candidate Surname */}
              <div className="form-group">
                <input
                  name="surname"
                  pattern="[A-Za-z\s]*"
                  value={formData.surname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Candidate Surname"
                  required
                  title="Surname can only contain alphabets and spaces."
                  className={`form-input ${errors.surname ? 'input-error' : ''}`}
                />
                {errors.surname && <small className="error-text">{errors.surname}</small>}
              </div>

              {/* 3. Role */}
              <div className="form-group">
                <input
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Role"
                  required
                  className={`form-input ${errors.role ? 'input-error' : ''}`}
                />
                {errors.role && <small className="error-text">{errors.role}</small>}
              </div>

              {/* 4. Skills (comma-separated) */}
              <div className="form-group">
                <input
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Skills (comma-separated)"
                  required
                  className={`form-input ${errors.skills ? 'input-error' : ''}`}
                />
                {errors.skills && <small className="error-text">{errors.skills}</small>}
              </div>

              {/* 5. Experience (Years) */}
              <div className="form-group">
                <input
                  name="exp"
                  type="number"
                  value={formData.exp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Experience (Years)"
                  required
                  min="0"
                  step="0.1"
                  title="Enter a positive number for experience in years."
                  className={`form-input ${errors.exp ? 'input-error' : ''}`}
                />
                {errors.exp && <small className="error-text">{errors.exp}</small>}
              </div>
              
              {/* 6. Location */}
              <div className="form-group">
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Location"
                  required
                  className={`form-input ${errors.location ? 'input-error' : ''}`}
                />
                {errors.location && <small className="error-text">{errors.location}</small>}
              </div>

              {/* 7. Email Address */}
              <div className="form-group">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Email Address"
                  required
                  title="Enter a valid email address."
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && <small className="error-text">{errors.email}</small>}
              </div>

              {/* 8. Phone Number */}
              <div className="form-group">
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Phone Number"
                  required
                  pattern="^[6-9]\d{9}$"
                  minLength="10"
                  maxLength="10"
                  title="Enter a valid 10-digit phone number starting with 6, 7, 8, or 9"
                  className={`form-input ${errors.phone ? 'input-error' : ''}`}
                />
                {errors.phone && <small className="error-text">{errors.phone}</small>}
              </div>


              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }}   // blue
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" /> Processing...
                    </>
                  ) : (
                    <>{editingId ? 'Update Candidate' : 'Add Candidate'}</>
                  )}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
