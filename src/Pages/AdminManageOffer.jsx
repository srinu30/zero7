// File: src/Pages/AdminManageOffer.jsx

import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Gift, Loader2 } from "lucide-react";

const AdminManageOffer = () => {
  const [formData, setFormData] = useState({ heading: '', paragraph: '', imageUrl: '', isActive: true });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchCurrentOffer = async () => {
      try {
        setLoading(true);
        // We fetch the latest offer regardless of status for the admin panel
        const response = await api.get("/offers/latest-admin"); // Assumes a new admin route, or just fetch all and take first
        if (response.data) {
          setFormData(response.data);
        }
      } catch (e) {
        console.error("No existing offer found, using defaults.", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentOffer();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');
    try {
      await api.post("/offers", formData);
      setStatusMessage("Offer updated successfully!");
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      console.error("Error saving offer:", err);
      setStatusMessage("Failed to update offer. Please try again.");
      setTimeout(() => setStatusMessage(''), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-full">
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl shadow-lg p-6 mb-8 flex items-center space-x-4 text-white">
        <div className=" bg-opacity-20 p-3 rounded-full"><Gift size={28} /></div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold">Manage Homepage Offer</h3>
          <p className="text-teal-100 text-sm">Update the special offer section displayed on the public homepage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- ADDED: The On/Off Toggle Switch --- */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
              <label htmlFor="isActive" className="text-lg font-semibold text-gray-800">
                Show Offer on Homepage
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  className="sr-only peer"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>

            {/* Your existing form fields */}
            <div>
              <label htmlFor="heading" className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
              <input type="text" name="heading" id="heading" value={formData.heading} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"  />
            </div>
            <div>
              <label htmlFor="paragraph" className="block text-sm font-medium text-gray-700 mb-1">Paragraph</label>
              <textarea name="paragraph" id="paragraph" rows="5" value={formData.paragraph} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500" ></textarea>
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
            <div className="flex items-center justify-between">
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-gray-400">
                {isSubmitting && <Loader2 className="animate-spin h-5 w-5 mr-3" />}
                {isSubmitting ? "Saving..." : "Save Offer"}
              </button>
              {statusMessage && <p className={`text-sm font-semibold ${statusMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{statusMessage}</p>}
            </div>
          </form>
        </div>

        {/* Live Preview Section */}
        <div className={`bg-white rounded-xl shadow-lg p-6 transition-opacity duration-500 ${formData.isActive ? 'opacity-100' : 'opacity-40'}`}>
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Live Preview ({formData.isActive ? "Visible" : "Hidden"})</h4>
            {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Offer Preview" className="w-full h-48 object-cover rounded-lg mb-4 shadow-md" />
            ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">Image Preview</div>
            )}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.heading || "Your Heading Here"}</h2>
            <p className="text-gray-600">{formData.paragraph || "Your descriptive paragraph will appear here."}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminManageOffer;