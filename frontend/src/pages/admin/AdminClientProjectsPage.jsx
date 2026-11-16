import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Briefcase,
  Search,
  Calendar,
  Users,
  Clock,
  CheckSquare,
} from 'lucide-react';
import { clientProjectsService } from '../../services/api';
import './AdminClientProjectsPage.css';

const deliveryStatuses = ['All', 'Planning', 'In Progress', 'Review', 'Completed', 'On Hold'];

const AdminClientProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    budget: '₹45,000',
    startDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'In Progress',
    progressPercent: 30,
    assignedTeam: 'MERN Engineering Team',
    internalNotes: '',
  });

  const fetchClientProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await clientProjectsService.getAll(params);
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
    fetchClientProjects();
  }, [statusFilter, searchQuery]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      projectName: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      budget: '₹45,000',
      startDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'In Progress',
      progressPercent: 30,
      assignedTeam: 'MERN Engineering Team',
      internalNotes: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingId(proj._id);
    setFormData({
      projectName: proj.projectName,
      clientName: proj.clientName,
      clientEmail: proj.clientEmail,
      clientPhone: proj.clientPhone,
      budget: proj.budget || '',
      startDate: proj.startDate ? proj.startDate.split('T')[0] : '',
      expectedDeliveryDate: proj.expectedDeliveryDate ? proj.expectedDeliveryDate.split('T')[0] : '',
      status: proj.status || 'In Progress',
      progressPercent: proj.progressPercent || 0,
      assignedTeam: proj.assignedTeam || 'MERN Engineering Team',
      internalNotes: proj.internalNotes || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      if (editingId) {
        const res = await clientProjectsService.update(editingId, formData);
        if (res.data.success) {
          setMsg({ text: 'Client delivery project updated successfully!', type: 'success' });
        }
      } else {
        const res = await clientProjectsService.create(formData);
        if (res.data.success) {
          setMsg({ text: 'Client delivery project created!', type: 'success' });
        }
      }

      setModalOpen(false);
      fetchClientProjects();
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      setMsg({
        text: err.response?.data?.message || 'Failed to save delivery project.',
        type: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this delivery project?')) return;
    try {
      setActionLoading(true);
      const res = await clientProjectsService.delete(id);
      if (res.data.success) {
        setProjects(projects.filter((p) => p._id !== id));
        setMsg({ text: 'Project deleted successfully.', type: 'success' });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMsg({ text: 'Failed to delete project.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#fe8a04]">
            Operations & Execution
          </span>
          <h1 className="font-heading font-extrabold text-2xl text-[#021343]">
            Client Project Delivery Tracking
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Internal tracking for active client contracts, milestones, team assignments, and progress.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#021343] hover:bg-[#fe8a04] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Delivery Project</span>
        </button>
      </div>

      {msg.text && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by project name, client name, or email..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04]"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#fe8a04]"
          >
            {deliveryStatuses.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'Filter by Status: All' : `Status: ${s}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Cards List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-200">
          <Loader2 className="w-8 h-8 text-[#fe8a04] animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Loading delivery projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 space-y-2">
          <CheckSquare className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-gray-700">No Delivery Projects Active</h3>
          <p className="text-xs text-gray-400">Click "New Delivery Project" to onboard and track client delivery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      p.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : p.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : p.status === 'Review'
                        ? 'bg-purple-100 text-purple-800'
                        : p.status === 'Planning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {p.status}
                  </span>
                  <span className="font-extrabold text-[#fe8a04] text-xs">{p.budget}</span>
                </div>

                <h3 className="font-heading font-bold text-base text-[#021343] mb-1">
                  {p.projectName}
                </h3>
                <div className="text-xs text-gray-600 font-semibold mb-3">
                  {p.clientName} <span className="text-gray-400 text-[11px] font-normal">({p.clientEmail})</span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 my-3">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-[#fe8a04]">{p.progressPercent || 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#fe8a04] to-[#ff5e13] rounded-full"
                      style={{ width: `${p.progressPercent || 0}%` }}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 space-y-1 border-t pt-3">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#fe8a04]" />
                    <span>Assigned: <strong>{p.assignedTeam}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Target: {p.expectedDeliveryDate ? new Date(p.expectedDeliveryDate).toLocaleDateString() : 'TBD'}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(p)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-[#021343] hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Edit / Update Progress
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-heading font-extrabold text-xl text-[#021343]">
                {editingId ? 'Update Client Project' : 'New Client Project'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="e.g. Skyline Real Estate Web Application"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Client Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Client Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Client Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Contract Budget</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="₹50,000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Progress: {formData.progressPercent}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.progressPercent}
                    onChange={(e) => setFormData({ ...formData, progressPercent: Number(e.target.value) })}
                    className="w-full mt-2 accent-[#fe8a04]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Delivery Date</label>
                  <input
                    type="date"
                    value={formData.expectedDeliveryDate}
                    onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Assigned Team / Lead</label>
                  <input
                    type="text"
                    value={formData.assignedTeam}
                    onChange={(e) => setFormData({ ...formData, assignedTeam: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Internal Notes</label>
                <textarea
                  rows={3}
                  value={formData.internalNotes}
                  onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                  placeholder="Milestone progress, repo links, client feedback..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#021343] hover:bg-[#fe8a04] text-white font-bold transition-colors cursor-pointer"
                >
                  {actionLoading ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClientProjectsPage;

