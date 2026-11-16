import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Loader2, X, Users } from 'lucide-react';
import { teamService } from '../../services/api';
import './AdminTeamPage.css';

const AdminTeamPage = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    bio: '',
    image: '',
    linkedin: '',
    twitter: '',
  });

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await teamService.getAll({ all: true });
      if (res.data.success) {
        setTeam(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      designation: '',
      bio: '',
      image: '',
      linkedin: '',
      twitter: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingId(member._id);
    setFormData({
      name: member.name,
      designation: member.designation,
      bio: member.bio || '',
      image: member.image || '',
      linkedin: member.socialLinks?.linkedin || '',
      twitter: member.socialLinks?.twitter || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const payload = {
        name: formData.name,
        designation: formData.designation,
        bio: formData.bio,
        image: formData.image,
        socialLinks: {
          linkedin: formData.linkedin,
          twitter: formData.twitter,
        },
      };

      if (editingId) {
        const res = await teamService.update(editingId, payload);
        if (res.data.success) {
          setMsg({ text: 'Team member updated successfully!', type: 'success' });
        }
      } else {
        const res = await teamService.create(payload);
        if (res.data.success) {
          setMsg({ text: 'Team member added successfully!', type: 'success' });
        }
      }

      setModalOpen(false);
      fetchTeam();
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Operation failed.';
      setMsg({ text: errorMsg, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this team member?')) return;
    try {
      const res = await teamService.delete(id);
      if (res.data.success) {
        setTeam(team.filter((t) => t._id !== id));
        setMsg({ text: 'Team member removed', type: 'success' });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMsg({ text: 'Failed to delete member', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#fe8a04]">
            Team Management
          </span>
          <h1 className="font-heading font-extrabold text-2xl text-[#021343]">
            Our Best Team
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage company leadership, senior engineers, designers, and marketing strategists.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#fe8a04] hover:bg-[#e67300] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-glow-orange transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
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

      {/* Grid */}
      {loading ? (
        <div className="p-16 text-center">
          <Loader2 className="w-8 h-8 text-[#fe8a04] animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-56 object-cover bg-gray-100"
                />
                <div className="p-5">
                  <h3 className="font-heading font-bold text-base text-[#021343]">
                    {member.name}
                  </h3>
                  <p className="text-xs text-[#fe8a04] font-semibold mt-0.5">
                    {member.designation}
                  </p>
                  {member.bio && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">Team Profile</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(member)}
                    className="p-1.5 text-gray-500 hover:text-[#fe8a04] rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="p-1.5 text-gray-500 hover:text-red-500 rounded-lg transition-colors"
                    title="Delete"
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
                {editingId ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Priyanshu Rathore"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Designation / Role *</label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. Founder & Managing Director"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Bio / Summary</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Experience highlights, key achievements..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04] resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Photo Image URL *</label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Twitter / X</label>
                  <input
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    placeholder="https://twitter.com/..."
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
                  {actionLoading ? 'Saving...' : editingId ? 'Update Member' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeamPage;

