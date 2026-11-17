import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Users,
  Eye,
  EyeOff,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
} from 'lucide-react';
import { teamService } from '../../services/api';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { resolveImageUrl } from '../../utils/imageUrl';
import './AdminTeamPage.css';

const AdminTeamPage = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    member: null,
    loading: false,
  });

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    bio: '',
    image: '',
    linkedin: '',
    twitter: '',
    isActive: true,
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
      isActive: true,
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
      isActive: member.isActive !== false,
    });
    setModalOpen(true);
  };

  // Toggle active/inactive status
  const handleToggleStatus = async (member) => {
    const newStatus = member.isActive === false ? true : false;
    try {
      setStatusLoadingId(member._id);
      const res = await teamService.toggleStatus(member._id, newStatus);
      if (res.data.success) {
        setTeam((prev) =>
          prev.map((m) => (m._id === member._id ? { ...m, isActive: newStatus } : m))
        );
        setMsg({
          text: `Status updated: ${member.name} is now ${
            newStatus ? 'Active (Visible on public website)' : 'Inactive (Hidden from public website)'
          }`,
          type: 'success',
        });
        setTimeout(() => setMsg({ text: '', type: '' }), 4000);
      }
    } catch (err) {
      setMsg({
        text: err.response?.data?.message || 'Failed to toggle status.',
        type: 'error',
      });
    } finally {
      setStatusLoadingId(null);
    }
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (member) => {
    setDeleteModal({
      open: true,
      member,
      loading: false,
    });
  };

  // Confirm Permanent Deletion
  const handleConfirmDelete = async () => {
    if (!deleteModal.member) return;

    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      const memberId = deleteModal.member._id;
      const res = await teamService.delete(memberId);

      if (res.data.success) {
        setTeam((prev) => prev.filter((m) => m._id !== memberId));
        setMsg({
          text: `Team member "${deleteModal.member.name}" removed permanently.`,
          type: 'success',
        });
        setDeleteModal({ open: false, member: null, loading: false });
        setTimeout(() => setMsg({ text: '', type: '' }), 3500);
      }
    } catch (err) {
      setMsg({
        text: err.response?.data?.message || 'Failed to delete member.',
        type: 'error',
      });
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
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
        isActive: formData.isActive,
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
          setMsg({ text: 'New team member added to directory!', type: 'success' });
        }
      }

      setModalOpen(false);
      fetchTeam();
      setTimeout(() => setMsg({ text: '', type: '' }), 3500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Operation failed.';
      setMsg({ text: errorMsg, type: 'error' });
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
            Team Management
          </span>
          <h1 className="font-heading font-extrabold text-2xl text-[#021343]">
            Our Best Team
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage agency leadership, developers, designers, and marketing strategists with Active / Inactive visibility controls.
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
          {msg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="p-16 text-center">
          <Loader2 className="w-8 h-8 text-[#fe8a04] animate-spin mx-auto" />
        </div>
      ) : team.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 text-gray-500 text-sm">
          No team members added yet. Click "Add Team Member" above to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => {
            const isActive = member.isActive !== false;
            const isToggling = statusLoadingId === member._id;
            const photoSrc = resolveImageUrl(member.image) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

            return (
              <div
                key={member._id}
                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                  isActive ? 'border-gray-200' : 'border-amber-200 bg-amber-50/10 opacity-80'
                }`}
              >
                <div>
                  <div className="relative">
                    <img
                      src={photoSrc}
                      alt={member.name}
                      className="w-full h-56 object-cover bg-gray-100"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border shadow-xs ${
                          isActive
                            ? 'bg-emerald-500/90 text-white border-emerald-400'
                            : 'bg-gray-800/90 text-gray-200 border-gray-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-white animate-pulse' : 'bg-amber-400'
                          }`}
                        />
                        {isActive ? 'Active (Public)' : 'Inactive (Hidden)'}
                      </span>
                    </div>

                    {/* Quick Toggle Status Button on Image */}
                    <button
                      type="button"
                      disabled={isToggling}
                      onClick={() => handleToggleStatus(member)}
                      title={isActive ? 'Click to deactivate (hide from website)' : 'Click to activate (show on website)'}
                      className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md border shadow-md transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white/90 text-emerald-700 hover:bg-white hover:text-emerald-800 border-emerald-200'
                          : 'bg-white/90 text-amber-700 hover:bg-white hover:text-amber-800 border-amber-200'
                      }`}
                    >
                      {isToggling ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isActive ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-heading font-bold text-base text-[#021343]">
                        {member.name}
                      </h3>
                    </div>
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

                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                  {/* Status Toggle Switch */}
                  <button
                    type="button"
                    disabled={isToggling}
                    onClick={() => handleToggleStatus(member)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 hover:text-[#021343] cursor-pointer"
                  >
                    {isActive ? (
                      <ToggleRight className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                    <span>{isActive ? 'Active' : 'Inactive'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(member)}
                      className="p-1.5 text-gray-500 hover:text-[#fe8a04] hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(member)}
                      className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-[#021343]">
                {editingId ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
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
                  placeholder="Experience highlights, leadership qualities..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04] resize-none"
                />
              </div>

              {/* Dual Image Upload Field: Option A (URL) & Option B (Local File) */}
              <ImageUploadField
                label="Member Photo"
                required
                value={formData.image}
                onChange={(imgUrl) => setFormData({ ...formData, image: imgUrl })}
                helperText="Upload a professional team portrait from your computer or provide a web URL."
              />

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

              {/* Member Visibility Status */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="block font-bold text-gray-800">Public Website Visibility</span>
                  <span className="text-[11px] text-gray-500">
                    {formData.isActive
                      ? 'Member is Active and displayed in About Us & Team sections.'
                      : 'Member is Inactive and hidden from the public website.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className="cursor-pointer"
                >
                  {formData.isActive ? (
                    <ToggleRight className="w-7 h-7 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#fe8a04] to-[#ff5e13] text-white font-bold shadow-glow-orange cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : editingId ? 'Update Member' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Popup */}
      {deleteModal.open && deleteModal.member && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-heading font-extrabold text-lg text-[#021343]">
                Confirm Permanent Deletion
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to permanently remove{' '}
                <strong className="text-gray-900 font-bold">{deleteModal.member.name}</strong>{' '}
                ({deleteModal.member.designation}) from the team directory?
              </p>
              <p className="text-[11px] text-red-600 font-medium">
                This will delete their profile from the database and cannot be undone.
              </p>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteModal({ open: false, member: null, loading: false })}
                disabled={deleteModal.loading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-colors text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteModal.loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors text-xs cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {deleteModal.loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{deleteModal.loading ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeamPage;
