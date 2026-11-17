import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Loader2, X, Briefcase, ExternalLink, IndianRupee } from 'lucide-react';
import { projectsService } from '../../services/api';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { formatINR } from '../../utils/currency';
import './AdminProjectsPage.css';

const AdminProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    client: '',
    category: 'Web Development',
    price: '₹5,500',
    image: '',
    technologies: '',
    liveUrl: '',
    isFeatured: true,
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectsService.getAll({ all: true });
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      client: '',
      category: 'Web Development',
      price: '₹5,500',
      image: '',
      technologies: '',
      liveUrl: '',
      isFeatured: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description,
      client: project.client || '',
      category: project.category || 'Web Development',
      price: project.price || '₹5,500',
      image: project.image || '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      liveUrl: project.liveUrl || '',
      isFeatured: project.isFeatured !== false,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const payload = {
        ...formData,
        price: formData.price ? formatINR(formData.price) : '₹5,500',
        technologies: formData.technologies
          ? formData.technologies.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      };

      if (editingId) {
        const res = await projectsService.update(editingId, payload);
        if (res.data.success) {
          setMsg({ text: 'Project updated successfully!', type: 'success' });
        }
      } else {
        const res = await projectsService.create(payload);
        if (res.data.success) {
          setMsg({ text: 'New project added to portfolio!', type: 'success' });
        }
      }

      setModalOpen(false);
      fetchProjects();
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to save project.';
      setMsg({ text: errorMsg, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project from your portfolio?')) return;
    try {
      const res = await projectsService.delete(id);
      if (res.data.success) {
        setProjects(projects.filter((p) => p._id !== id));
        setMsg({ text: 'Project removed successfully', type: 'success' });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMsg({ text: 'Failed to delete project', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#fe8a04]">
            Portfolio & Case Studies
          </span>
          <h1 className="font-heading font-extrabold text-2xl text-[#021343]">
            Manage Client Projects
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Display your best engineering deliverables, live demos, and case studies.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#fe8a04] hover:bg-[#e67300] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-glow-orange transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
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

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-8 h-8 text-[#fe8a04] animate-spin mx-auto" />
          </div>
        ) : projects.length === 0 ? (
          <div className="p-16 text-center text-sm text-gray-500">
            No projects in portfolio yet. Click "Add New Project" to add one!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Project</th>
                  <th className="py-3.5 px-6 font-semibold">Category</th>
                  <th className="py-3.5 px-6 font-semibold">Starting Price</th>
                  <th className="py-3.5 px-6 font-semibold">Client</th>
                  <th className="py-3.5 px-6 font-semibold">Technologies</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map((proj) => (
                  <tr key={proj._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={proj.image || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=150&q=80'}
                        alt={proj.title}
                        className="w-12 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{proj.title}</div>
                        <div className="text-[11px] text-gray-400 font-mono">/{proj.slug}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full bg-orange-50 text-[#fe8a04] font-semibold text-[11px] border border-orange-200">
                        {proj.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-[#021343]">
                      {formatINR(proj.price || 5500)}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {proj.client || 'Confidential'}
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      {proj.technologies?.slice(0, 3).join(', ')}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Live URL"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => openEditModal(proj)}
                          className="p-1.5 text-gray-500 hover:text-[#fe8a04] hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(proj._id)}
                          className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-[#021343]">
                {editingId ? 'Edit Project' : 'Add New Portfolio Project'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. OmniTrade - NextGen E-Commerce Suite"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04] bg-white"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Custom Software">Custom Software</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Starting Price (INR) *</label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="₹5,500"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04] font-semibold text-[#021343]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Client Name</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. OmniTrade Retail Ltd."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Project Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Project background, challenges overcome, and solutions..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04] resize-none"
                />
              </div>

              {/* Enhanced Image Upload: Option A (URL) & Option B (Local Device File) */}
              <ImageUploadField
                label="Project Cover Image"
                required
                value={formData.image}
                onChange={(imgUrl) => setFormData({ ...formData, image: imgUrl })}
                helperText="Upload a featured screenshot from your device or provide a public image URL."
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Technologies (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React, Node.js, MongoDB"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Live URL / Demo</label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                  />
                </div>
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
                  {actionLoading ? 'Saving...' : editingId ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjectsPage;

