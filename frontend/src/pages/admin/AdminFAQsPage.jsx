import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Loader2, X, HelpCircle } from 'lucide-react';
import { faqsService } from '../../services/api';
import './AdminFAQsPage.css';

const AdminFAQsPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
  });

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await faqsService.getAll({ all: true });
      if (res.data.success) {
        setFaqs(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      question: '',
      answer: '',
      category: 'General',
    });
    setModalOpen(true);
  };

  const openEditModal = (faq) => {
    setEditingId(faq._id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      if (editingId) {
        const res = await faqsService.update(editingId, formData);
        if (res.data.success) {
          setMsg({ text: 'FAQ updated successfully!', type: 'success' });
        }
      } else {
        const res = await faqsService.create(formData);
        if (res.data.success) {
          setMsg({ text: 'New FAQ created!', type: 'success' });
        }
      }

      setModalOpen(false);
      fetchFaqs();
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Operation failed.';
      setMsg({ text: errorMsg, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ question?')) return;
    try {
      const res = await faqsService.delete(id);
      if (res.data.success) {
        setFaqs(faqs.filter((f) => f._id !== id));
        setMsg({ text: 'FAQ deleted', type: 'success' });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMsg({ text: 'Failed to delete FAQ', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#fe8a04]">
            Help & Knowledge
          </span>
          <h1 className="font-heading font-extrabold text-2xl text-[#021343]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage public FAQs categorized by Web Development, SEO, and Pricing.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#fe8a04] hover:bg-[#e67300] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-glow-orange transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
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
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-8 h-8 text-[#fe8a04] animate-spin mx-auto" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="p-16 text-center text-sm text-gray-500">
            No FAQs found. Click "Add New FAQ" to create one.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {faqs.map((faq) => (
              <div
                key={faq._id}
                className="p-6 hover:bg-gray-50/80 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#fe8a04] px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 inline-block">
                    {faq.category || 'General'}
                  </span>
                  <h3 className="font-heading font-bold text-base text-[#021343]">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal(faq)}
                    className="p-2 text-gray-500 hover:text-[#fe8a04] hover:bg-orange-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq._id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-[#021343]">
                {editingId ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04] bg-white"
                >
                  <option value="General">General</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Mobile Apps">Mobile Apps</option>
                  <option value="Pricing & Support">Pricing & Support</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. What services does Webtrek IT Solutions offer?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Answer *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Clear and detailed answer for visitors..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04] resize-none"
                />
              </div>

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
                  {actionLoading ? 'Saving...' : editingId ? 'Update FAQ' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFAQsPage;

