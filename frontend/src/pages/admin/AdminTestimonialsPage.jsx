import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Loader2, X, Star } from 'lucide-react';
import { testimonialsService } from '../../services/api';
import ImageUploadField from '../../components/admin/ImageUploadField';
import './AdminTestimonialsPage.css';

const AdminTestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    clientName: '',
    company: '',
    designation: '',
    avatar: '',
    feedback: '',
    rating: 5,
  });

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await testimonialsService.getAll({ all: true });
      if (res.data.success) {
        setTestimonials(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      clientName: '',
      company: '',
      designation: 'Managing Director',
      avatar: '',
      feedback: '',
      rating: 5,
    });
    setModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingId(t._id);
    setFormData({
      clientName: t.clientName,
      company: t.company || '',
      designation: t.designation || '',
      avatar: t.avatar || '',
      feedback: t.feedback,
      rating: t.rating || 5,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      if (editingId) {
        const res = await testimonialsService.update(editingId, formData);
        if (res.data.success) {
          setMsg({ text: 'Testimonial updated successfully!', type: 'success' });
        }
      } else {
        const res = await testimonialsService.create(formData);
        if (res.data.success) {
          setMsg({ text: 'New testimonial added!', type: 'success' });
        }
      }

      setModalOpen(false);
      fetchTestimonials();
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Operation failed.';
      setMsg({ text: errorMsg, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this client testimonial?')) return;
    try {
      const res = await testimonialsService.delete(id);
      if (res.data.success) {
        setTestimonials(testimonials.filter((t) => t._id !== id));
        setMsg({ text: 'Testimonial deleted', type: 'success' });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMsg({ text: 'Failed to delete testimonial', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#fe8a04]">
            Social Proof
          </span>
          <h1 className="font-heading font-extrabold text-2xl text-[#021343]">
            Client Testimonials & Reviews
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Display endorsements from founders, CEOs, and business partners.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#fe8a04] hover:bg-[#e67300] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-glow-orange transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {msg.text && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {msg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="p-16 text-center">
          <Loader2 className="w-8 h-8 text-[#fe8a04] animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#fe8a04] text-[#fe8a04]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">Verified</span>
                </div>
                <p className="text-xs text-gray-600 italic leading-relaxed mb-6">
                  "{item.feedback}"
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#021343]">
                    {item.clientName}
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    {item.designation}{item.company ? ` • ${item.company}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-gray-500 hover:text-[#fe8a04] rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 text-gray-500 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-[#021343]">
                {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Sunil Aggarwal"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Apex Logistics Ltd."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Chief Executive Officer"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Review Feedback *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  placeholder="Client review comments on website, delivery, or digital marketing..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04] resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04] bg-white"
                >
                  <option value={5}>★★★★★ 5 Stars</option>
                  <option value={4}>★★★★ 4 Stars</option>
                  <option value={3}>★★★ 3 Stars</option>
                </select>
              </div>

              {/* Dual Image Upload: Option A (URL) & Option B (Local Device File) */}
              <ImageUploadField
                label="Client Avatar Photo"
                value={formData.avatar}
                onChange={(imgUrl) => setFormData({ ...formData, avatar: imgUrl })}
                helperText="Upload client portrait from device or enter web URL."
              />

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#fe8a04] to-[#ff5e13] text-white font-bold shadow-glow-orange cursor-pointer"
                >
                  {actionLoading ? 'Saving...' : editingId ? 'Update Review' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonialsPage;

