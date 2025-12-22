import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminItPrograms.css";

const API_URL = `${
  process.env.REACT_APP_API_URL || "http://localhost:5000/api"
}/it-programs`;

const AdminItPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState({
    title: "",
    icon: "",
    price: "",
    description: "",
    details: "",
    technologies: ""
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await axios.get(API_URL);
      setPrograms(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        technologies: form.technologies.split(",").map((t) => t.trim())
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        alert("Program updated ✅");
      } else {
        await axios.post(API_URL, payload);
        alert("Program added ✅");
      }

      setForm({
        title: "",
        icon: "",
        price: "",
        description: "",
        details: "",
        technologies: ""
      });
      setEditingId(null);
      fetchPrograms();
    } catch (err) {
      console.error(err);
      alert("Error saving program ❌");
    }
  };

  const handleEdit = (program) => {
    setEditingId(program._id);
    setForm({
      title: program.title,
      icon: program.icon,
      price: program.price,
      description: program.description,
      details: program.details,
      technologies: program.technologies.join(", ")
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Program deleted ✅");
      fetchPrograms();
    } catch (err) {
      console.error(err);
      alert("Error deleting program ❌");
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">🎓 Admin - Manage IT Programs</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="admin-form">
        <h2>{editingId ? "✏️ Edit Program" : "➕ Add Program"}</h2>
        <div className="form-grid">
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input name="icon" placeholder="Icon[Window click Windows Key + .][Control + Command + Space in MAC]" value={form.icon} onChange={handleChange} />
          <input name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input name="description" placeholder="Short Description" value={form.description} onChange={handleChange} />
          <textarea name="details" placeholder="Details" value={form.details} onChange={handleChange}></textarea>
          <input name="technologies" placeholder="Technologies (comma separated)" value={form.technologies} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">
          {editingId ? "Update Program" : "Add Program"}
        </button>
      </form>

      {/* Programs List */}
      <h2 className="section-heading">📚 Existing Programs</h2>
      <div className="programs-grid">
        {programs.map((p) => (
          <div key={p._id} className="program-card">
            <div className="program-header">
              <span className="program-icon">{p.icon}</span>
              <h3>{p.title}</h3>
            </div>
            <p className="program-price">{p.price}</p>
            <p className="program-desc">{p.description}</p>
            <p className="program-tech">
              <strong>Tech:</strong> {p.technologies.join(", ")}
            </p>
            <div className="card-actions">
              <button onClick={() => handleEdit(p)} className="btn btn-edit">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="btn btn-delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminItPrograms;
