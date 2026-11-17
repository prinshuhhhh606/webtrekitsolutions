import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Loader2, X, Layers, Image as ImageIcon } from 'lucide-react';
import { servicesService } from '../../services/api';
import ImageUploadField from '../../components/admin/ImageUploadField';
import './AdminServicesPage.css';

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    category: 'Development',
    features: '',
    image: '',
    isFeatured: true,
  });

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await servicesService.getAll({ all: true });
      if (res.data.success) {
        setServices(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      category: 'Development',
      features: '',
      image: '',
      isFeatured: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingId(service._id);
    setFormData({
      title: service.title,
      slug: service.slug,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription || '',
      category: service.category || 'Development',
      features: Array.isArray(service.features) ? service.features.join(', ') : '',
      image: service.image || '',
      isFeatured: service.isFeatured !== false,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const payload = {
        ...formData,
        features: formData.features
          ? formData.features.split(',').map((f) => f.trim()).filter(Boolean)
          : [],
      };

      if (editingId) {
        const res = await servicesService.update(editingId, payload);
        if (res.data.success) {
          setMsg({ text: 'Service updated successfully!', type: 'success' });
        }
      } else {
        const res = await servicesService.create(payload);
        if (res.data.success) {
          setMsg({ text: 'New service created successfully!', type: 'success' });
        }
      }

      setModalOpen(false);
      fetchServices();
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Operation failed.';
      setMsg({ text: errorMsg, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await servicesService.delete(id);
      if (res.data.success) {
        setServices(services.filter((s) => s._id !== id));
        setMsg({ text: 'Service deleted successfully!', type: 'success' });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMsg({ text: 'Failed to delete service', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#fe8a04]">
            Services Management
          </span>
          <h1 className="font-heading font-extrabold text-2xl text-[#021343]">
            Digital & Tech Services
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Add, update, or remove public service offerings and descriptions.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#fe8a04] hover:bg-[#e67300] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-glow-orange transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
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

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-8 h-8 text-[#fe8a04] animate-spin mx-auto" />
          </div>
        ) : services.length === 0 ? (
          <div className="p-16 text-center text-sm text-gray-500">
            No services configured yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Service</th>
                  <th className="py-3.5 px-6 font-semibold">Category</th>
                  <th className="py-3.5 px-6 font-semibold">Short Description</th>
                  <th className="py-3.5 px-6 font-semibold">Features</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900 text-sm">{service.title}</div>
                      <div className="text-[11px] text-gray-400 font-mono">/{service.slug}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px]">
                        {service.category || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                      {service.shortDescription}
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      {service.features?.length || 0} features
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(service)}
                          className="p-1.5 text-gray-500 hover:text-[#fe8a04] hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit Service"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-[#021343]">
                {editingId ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Website Development"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. website-development"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04] bg-white"
                  >
                    <option value="Development">Development</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Consulting">Consulting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Short Summary *</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief 1-line benefit for cards..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Detailed breakdown of methodologies, deliverables and ROI..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04] resize-none"
                />
              </div>

              {/* Dual Image Upload: Option A (URL) & Option B (Local Device File) */}
              <ImageUploadField
                label="Service Illustration / Cover Image"
                value={formData.image}
                onChange={(imgUrl) => setFormData({ ...formData, image: imgUrl })}
                helperText="Upload service cover image or provide a web URL."
              />

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Features (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Feature 1, Feature 2, Feature 3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
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
                  {actionLoading ? 'Saving...' : editingId ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServicesPage;

