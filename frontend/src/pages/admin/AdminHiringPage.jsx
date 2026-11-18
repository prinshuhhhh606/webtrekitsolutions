import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Download,
  Search,
  Filter,
  FileText,
  AlertTriangle,
  RefreshCw,
  Eye,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { careersService } from '../../services/api';
import { useWebsite } from '../../context/WebsiteContext';
import './AdminHiringPage.css';

const AdminHiringPage = () => {
  const { isHiringActive, setHiringActiveState } = useWebsite();
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'applications'

  // Master Hiring Status State
  const [hiringStatusLoading, setHiringStatusLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Job Openings State
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    department: 'Engineering',
    location: 'Indore, MP (Hybrid / Onsite)',
    type: 'Full-time',
    experience: '1-3 Years',
    salaryRange: 'Competitive',
    description: '',
    requirements: '',
    responsibilities: '',
    openingsCount: 1,
    isActive: true,
  });
  const [savingJob, setSavingJob] = useState(false);

  // Candidate Applications State
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);

  // Delete Confirm Modal State
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    type: null, // 'job' or 'application'
    id: null,
    title: '',
  });

  const showToast = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Fetch initial data
  const fetchStatus = async () => {
    try {
      const res = await careersService.getStatus();
      if (res.data.success) {
        const active = Boolean(res.data.isHiringActive);
        setHiringActiveState(active);
      }
    } catch (err) {
      console.error('Failed to load hiring status', err);
    }
  };

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      const res = await careersService.getJobs({ all: 'true' });
      if (res.data.success && res.data.data) {
        setJobs(res.data.data);
      }
    } catch (err) {
      showToast('Failed to load job listings.', 'error');
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setAppsLoading(true);
      const res = await careersService.getApplications({
        status: appStatusFilter !== 'All' ? appStatusFilter : undefined,
        search: appSearch || undefined,
      });
      if (res.data.success && res.data.data) {
        setApplications(res.data.data);
      }
    } catch (err) {
      showToast('Failed to load applications.', 'error');
    } finally {
      setAppsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchJobs();
    fetchApplications();
  }, []);

  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [appStatusFilter, appSearch]);

  // Master Toggle Handler
  const handleToggleHiringStatus = async () => {
    const nextState = !isHiringActive;
    try {
      setHiringStatusLoading(true);
      const res = await careersService.updateStatus({
        isHiringActive: nextState,
        hiringStatus: nextState ? 'active' : 'inactive',
      });

      if (res.data.success) {
        setHiringActiveState(nextState);

        // Broadcast to other tabs & components
        try {
          const bc = new BroadcastChannel('webtrek_hiring_channel');
          bc.postMessage({ type: 'HIRING_STATUS_CHANGED', isHiringActive: nextState });
          bc.close();
        } catch (_) {}

        window.dispatchEvent(
          new CustomEvent('webtrek:hiring_status_changed', {
            detail: { isHiringActive: nextState },
          })
        );

        showToast(
          nextState
            ? "Hiring is now ACTIVE! 'We're Hiring' button is visible on website navbar."
            : "Hiring is now INACTIVE! 'We're Hiring' button is hidden from website navbar.",
          'success'
        );
      } else {
        showToast(res.data.message || 'Failed to update hiring status.', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error updating hiring status.', 'error');
    } finally {
      setHiringStatusLoading(false);
    }
  };

  // Job Modal Handlers
  const handleOpenJobModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setJobFormData({
        title: job.title || '',
        department: job.department || 'Engineering',
        location: job.location || 'Indore, MP (Hybrid / Onsite)',
        type: job.type || 'Full-time',
        experience: job.experience || '1-3 Years',
        salaryRange: job.salaryRange || 'Competitive',
        description: job.description || '',
        requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
        responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '',
        openingsCount: job.openingsCount || 1,
        isActive: job.isActive !== undefined ? job.isActive : true,
      });
    } else {
      setEditingJob(null);
      setJobFormData({
        title: '',
        department: 'Engineering',
        location: 'Indore, MP (Hybrid / Onsite)',
        type: 'Full-time',
        experience: '1-3 Years',
        salaryRange: 'Competitive',
        description: '',
        requirements: '',
        responsibilities: '',
        openingsCount: 1,
        isActive: true,
      });
    }
    setIsJobModalOpen(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    if (!jobFormData.title.trim() || !jobFormData.description.trim()) {
      showToast('Title and Description are required.', 'error');
      return;
    }

    try {
      setSavingJob(true);
      if (editingJob) {
        const res = await careersService.updateJob(editingJob._id, jobFormData);
        if (res.data.success) {
          showToast('Job posting updated successfully!');
          setIsJobModalOpen(false);
          fetchJobs();
        }
      } else {
        const res = await careersService.createJob(jobFormData);
        if (res.data.success) {
          showToast('Job posting created successfully!');
          setIsJobModalOpen(false);
          fetchJobs();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving job.', 'error');
    } finally {
      setSavingJob(false);
    }
  };

  const handleToggleJobActive = async (job) => {
    try {
      const res = await careersService.updateJob(job._id, { isActive: !job.isActive });
      if (res.data.success) {
        showToast(`Job ${job.isActive ? 'deactivated' : 'activated'} successfully.`);
        fetchJobs();
      }
    } catch (err) {
      showToast('Failed to update job status.', 'error');
    }
  };

  // Delete Handlers
  const handleConfirmDelete = async () => {
    if (!deleteConfirm.id) return;

    try {
      if (deleteConfirm.type === 'job') {
        const res = await careersService.deleteJob(deleteConfirm.id);
        if (res.data.success) {
          showToast('Job posting deleted.');
          fetchJobs();
        }
      } else if (deleteConfirm.type === 'application') {
        const res = await careersService.deleteApplication(deleteConfirm.id);
        if (res.data.success) {
          showToast('Candidate application deleted.');
          fetchApplications();
          if (selectedApp?._id === deleteConfirm.id) setSelectedApp(null);
        }
      }
    } catch (err) {
      showToast('Deletion failed.', 'error');
    } finally {
      setDeleteConfirm({ show: false, type: null, id: null, title: '' });
    }
  };

  // Application Status Change Handler
  const handleAppStatusChange = async (appId, newStatus) => {
    try {
      const res = await careersService.updateApplicationStatus(appId, { status: newStatus });
      if (res.data.success) {
        showToast(`Candidate status updated to "${newStatus}".`);
        fetchApplications();
        if (selectedApp?._id === appId) {
          setSelectedApp((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      showToast('Failed to update candidate status.', 'error');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Under Review':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Shortlisted':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Interviewing':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'Hired':
        return 'bg-teal-500/15 text-teal-300 border-teal-500/30';
      case 'Rejected':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-gray-500/15 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="admin-hiring-container space-y-6">
      {/* Toast Notification */}
      {notification.show && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-sm font-semibold transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-950 border-emerald-600 text-emerald-200'
              : 'bg-rose-950 border-rose-600 text-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#021343] flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-[#fe8a04]" />
            Hiring & Careers Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Control live hiring button visibility on website navbar, manage job openings, and review candidate applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/careers"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span>Preview Careers Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#fe8a04]" />
          </a>
        </div>
      </div>

      {/* Master Toggle Card */}
      <div className="hiring-master-card p-6 rounded-2xl bg-gradient-to-r from-[#021343] to-[#0a2368] text-white shadow-xl border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2.5">
              <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-[#fe8a04]/25 text-[#fe8a04] border border-[#fe8a04]/40">
                Master Control
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isHiringActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                Status: {isHiringActive ? 'Active (Live on Website)' : 'Inactive (Hidden)'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Website Navbar "We're Hiring" Button Control
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              When <strong>Active</strong>, the glowing "We're Hiring" button appears dynamically in the header navigation on all desktop and mobile screens. When <strong>Inactive</strong>, it is immediately hidden.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/15 shrink-0">
            <div className="text-right">
              <div className="text-sm font-bold">
                {isHiringActive ? 'Hiring Active' : 'Hiring Inactive'}
              </div>
              <div className="text-xs text-gray-300">
                {isHiringActive ? 'Navbar button is ON' : 'Navbar button is OFF'}
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={handleToggleHiringStatus}
              disabled={hiringStatusLoading}
              className={`hiring-switch ${isHiringActive ? 'active' : ''}`}
              title="Toggle Website Hiring Status"
            >
              <span className="hiring-switch-handle">
                {hiringStatusLoading && (
                  <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'jobs'
              ? 'bg-[#021343] text-white shadow-md'
              : 'text-gray-600 hover:text-[#021343] hover:bg-gray-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Job Openings ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'applications'
              ? 'bg-[#021343] text-white shadow-md'
              : 'text-gray-600 hover:text-[#021343] hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidate Applications ({applications.length})</span>
        </button>
      </div>

      {/* TAB 1: Job Openings CMS */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-gray-800">Available Job Positions</h3>
            <button
              onClick={() => handleOpenJobModal(null)}
              className="inline-flex items-center gap-2 bg-[#fe8a04] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#ff9500] shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Position</span>
            </button>
          </div>

          {jobsLoading ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-gray-200">
              <RefreshCw className="w-6 h-6 text-[#fe8a04] animate-spin mx-auto mb-2" />
              <span className="text-sm text-gray-500">Loading positions...</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-gray-200">
              <Briefcase className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-gray-800">No Job Openings Created Yet</h4>
              <p className="text-xs text-gray-500 mt-1">
                Click "Add New Position" above to publish your first career opening.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fe8a04]/10 text-[#fe8a04] border border-[#fe8a04]/20">
                        {job.department}
                      </span>
                      <button
                        onClick={() => handleToggleJobActive(job)}
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full transition-colors ${
                          job.isActive
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {job.isActive ? 'Active' : 'Draft'}
                      </button>
                    </div>

                    <h4 className="text-base font-bold text-gray-900 mb-1.5">{job.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-3 mb-4">{job.description}</p>

                    <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{job.type} • {job.experience}</span>
                      </div>
                      {job.salaryRange && (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                          <span>💰 {job.salaryRange}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenJobModal(job)}
                      className="p-2 text-gray-600 hover:text-[#021343] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Position"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          show: true,
                          type: 'job',
                          id: job._id,
                          title: job.title,
                        })
                      }
                      className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Position"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Candidate Applications */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search candidate name, email..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#fe8a04]"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <button
              onClick={fetchApplications}
              className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-1.5 self-end sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {appsLoading ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-gray-200">
              <RefreshCw className="w-6 h-6 text-[#fe8a04] animate-spin mx-auto mb-2" />
              <span className="text-sm text-gray-500">Loading applications...</span>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-gray-200">
              <Users className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-gray-800">No Candidate Applications Found</h4>
              <p className="text-xs text-gray-500 mt-1">
                Applications submitted through the Careers page will appear here.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-[11px] font-bold tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3.5">Candidate</th>
                      <th className="px-5 py-3.5">Applied Position</th>
                      <th className="px-5 py-3.5">Contact Details</th>
                      <th className="px-5 py-3.5">Resume Document</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50/75 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-gray-900">{app.name}</div>
                          <div className="text-xs text-gray-500">
                            Applied {new Date(app.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-800">{app.position}</div>
                          {app.experience && (
                            <div className="text-xs text-gray-500">Exp: {app.experience}</div>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="text-gray-900 font-medium">{app.phone}</div>
                          <div className="text-xs text-gray-500">{app.email}</div>
                        </td>

                        <td className="px-5 py-4">
                          {app.resumeUrl ? (
                            <a
                              href={app.resumeUrl.startsWith('http') ? app.resumeUrl : `${window.location.origin}${app.resumeUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#021343]/5 text-[#021343] font-semibold text-xs hover:bg-[#fe8a04]/15 hover:text-[#fe8a04] transition-colors border border-gray-200"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Resume</span>
                              <Download className="w-3 h-3 ml-0.5" />
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">No file</span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <select
                            value={app.status}
                            onChange={(e) => handleAppStatusChange(app._id, e.target.value)}
                            className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusBadgeClass(
                              app.status
                            )}`}
                          >
                            <option value="New">New</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Hired">Hired</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="p-1.5 text-gray-500 hover:text-[#021343] hover:bg-gray-100 rounded-lg transition-colors"
                              title="View Application Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  show: true,
                                  type: 'application',
                                  id: app._id,
                                  title: `${app.name} (${app.position})`,
                                })
                              }
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Application"
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
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Job Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h3 className="text-xl font-bold text-gray-900">
                {editingJob ? 'Edit Job Posting' : 'Create New Job Position'}
              </h3>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MERN Full Stack Developer"
                    value={jobFormData.title}
                    onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#fe8a04]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={jobFormData.department}
                    onChange={(e) => setJobFormData({ ...jobFormData, department: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#fe8a04]"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Management">Management</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Job Type
                  </label>
                  <select
                    value={jobFormData.type}
                    onChange={(e) => setJobFormData({ ...jobFormData, type: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#fe8a04]"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1-3 Years"
                    value={jobFormData.experience}
                    onChange={(e) => setJobFormData({ ...jobFormData, experience: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#fe8a04]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Openings
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={jobFormData.openingsCount}
                    onChange={(e) =>
                      setJobFormData({ ...jobFormData, openingsCount: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#fe8a04]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Indore, MP (Hybrid / Onsite)"
                    value={jobFormData.location}
                    onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#fe8a04]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹6,00,000 - ₹10,00,000 P.A."
                    value={jobFormData.salaryRange}
                    onChange={(e) => setJobFormData({ ...jobFormData, salaryRange: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#fe8a04]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Job Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Comprehensive description of the role and scope..."
                  value={jobFormData.description}
                  onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#fe8a04]"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Requirements (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Proficiency in React.js and Node.js&#10;Experience with REST APIs&#10;Good team communication"
                  value={jobFormData.requirements}
                  onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#fe8a04]"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Responsibilities (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Build high-performance web applications&#10;Participate in code reviews"
                  value={jobFormData.responsibilities}
                  onChange={(e) => setJobFormData({ ...jobFormData, responsibilities: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#fe8a04]"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="jobIsActive"
                  checked={jobFormData.isActive}
                  onChange={(e) => setJobFormData({ ...jobFormData, isActive: e.target.checked })}
                  className="rounded text-[#fe8a04] focus:ring-[#fe8a04] h-4 w-4"
                />
                <label htmlFor="jobIsActive" className="text-sm font-semibold text-gray-800 cursor-pointer">
                  Publish position immediately (Active)
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingJob}
                  className="px-6 py-2 text-sm font-bold bg-[#fe8a04] text-white hover:bg-[#ff9500] rounded-xl shadow-md transition-colors"
                >
                  {savingJob ? 'Saving...' : editingJob ? 'Save Changes' : 'Create Position'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Application View Drawer / Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Candidate Details</h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-800">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Full Name</span>
                <span className="text-base font-bold text-gray-900">{selectedApp.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Phone</span>
                  <a href={`tel:${selectedApp.phone}`} className="text-[#fe8a04] font-semibold hover:underline">
                    {selectedApp.phone}
                  </a>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email</span>
                  <a href={`mailto:${selectedApp.email}`} className="text-[#021343] font-semibold hover:underline break-all">
                    {selectedApp.email}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Position</span>
                  <span className="font-semibold">{selectedApp.position}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Experience</span>
                  <span>{selectedApp.experience || 'Not specified'}</span>
                </div>
              </div>

              {selectedApp.currentCompany && (
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Current Company</span>
                  <span>{selectedApp.currentCompany}</span>
                </div>
              )}

              {selectedApp.expectedSalary && (
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Expected CTC</span>
                  <span className="text-emerald-600 font-semibold">{selectedApp.expectedSalary}</span>
                </div>
              )}

              {selectedApp.coverNote && (
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Cover Note / Links</span>
                  <p className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-700 whitespace-pre-line">
                    {selectedApp.coverNote}
                  </p>
                </div>
              )}

              <div className="pt-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Resume File</span>
                {selectedApp.resumeUrl ? (
                  <a
                    href={selectedApp.resumeUrl.startsWith('http') ? selectedApp.resumeUrl : `${window.location.origin}${selectedApp.resumeUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#021343] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#04206e] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download / Open Attached Resume</span>
                  </a>
                ) : (
                  <span className="text-xs text-gray-400">No resume attached</span>
                )}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Confirm Deletion</h3>
            </div>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm({ show: false, type: null, id: null, title: '' })}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 text-sm font-bold bg-rose-600 text-white hover:bg-rose-700 rounded-xl shadow-md transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHiringPage;
