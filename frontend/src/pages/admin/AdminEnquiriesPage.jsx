import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox,
  Trash2,
  CheckCircle,
  Clock,
  Filter,
  Loader2,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Search,
  Eye,
  FileText,
  Save,
  X,
  ExternalLink,
  MessageSquare,
  Building2,
  DollarSign,
  Briefcase,
  HelpCircle,
  Tag,
  Send,
} from 'lucide-react';
import { enquiriesService } from '../../services/api';
import './AdminEnquiriesPage.css';

const servicesList = [
  'All',
  'Website Development',
  'Web Application Development',
  'E-commerce Development',
  'Mobile App Development',
  'Digital Marketing',
  'SEO Services',
  'Social Media Marketing',
  'UI/UX Design',
  'Business Consultancy',
  'Other',
];

const statusList = ['All', 'New', 'Contacted', 'In Progress', 'Converted', 'Closed'];
const typeList = ['All', 'General', 'Service', 'Quote', 'Consultation', 'Project'];

const AdminEnquiriesPage = () => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterService, setFilterService] = useState('All');
  const [filterType, setFilterType] = useState('All');

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    inProgress: 0,
    converted: 0,
    closed: 0,
  });

  // Modal State for Viewing / Editing Notes
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [editFollowUpDate, setEditFollowUpDate] = useState('');

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus !== 'All') params.status = filterStatus;
      if (filterService !== 'All') params.service = filterService;
      if (filterType !== 'All') params.enquiryType = filterType;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await enquiriesService.getAll(params);
      if (res.data.success) {
        setEnquiries(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await enquiriesService.getStats();
      if (res.data.success && res.data.stats) {
        const s = res.data.stats;
        setStats({
          total: s.totalEnquiries || 0,
          new: s.newEnquiries || 0,
          contacted: s.contactedEnquiries || 0,
          inProgress: s.inProgressEnquiries || 0,
          converted: s.convertedEnquiries || 0,
          closed: s.closedEnquiries || 0,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEnquiries();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [filterStatus, filterService, filterType, searchQuery]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setActionLoading(true);
      const res = await enquiriesService.updateStatus(id, { status: newStatus });
      if (res.data.success) {
        setEnquiries(
          enquiries.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
        }
        setMsg({ text: `Status updated to "${newStatus}"`, type: 'success' });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
        fetchStats();
      }
    } catch (err) {
      setMsg({ text: 'Failed to update status', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    try {
      setActionLoading(true);
      const res = await enquiriesService.updateStatus(selectedEnquiry._id, {
        adminNotes: editNotes,
        priority: editPriority,
        nextFollowUpDate: editFollowUpDate || null,
      });
      if (res.data.success) {
        setEnquiries(
          enquiries.map((e) =>
            e._id === selectedEnquiry._id
              ? {
                  ...e,
                  adminNotes: editNotes,
                  priority: editPriority,
                  nextFollowUpDate: editFollowUpDate || null,
                }
              : e
          )
        );
        setSelectedEnquiry((prev) => ({
          ...prev,
          adminNotes: editNotes,
          priority: editPriority,
          nextFollowUpDate: editFollowUpDate || null,
        }));
        setMsg({ text: 'Internal admin notes & follow-up saved successfully', type: 'success' });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMsg({ text: 'Failed to save admin notes', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await enquiriesService.delete(id);
      if (res.data.success) {
        setEnquiries(enquiries.filter((e) => e._id !== id));
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry(null);
        }
        setMsg({ text: 'Enquiry deleted successfully', type: 'success' });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
        fetchStats();
      }
    } catch (err) {
      setMsg({ text: 'Failed to delete enquiry', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const openDetailsModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setEditNotes(enquiry.adminNotes || '');
    setEditPriority(enquiry.priority || 'Medium');
    setEditFollowUpDate(
      enquiry.nextFollowUpDate
        ? new Date(enquiry.nextFollowUpDate).toISOString().split('T')[0]
        : ''
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#fe8a04]">
            Lead Management System
          </span>
          <h1 className="font-heading font-extrabold text-2xl text-[#021343]">
            Enquiry Management Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track customer requirements, respond with quotations, and manage leads from New to Converted.
          </p>
        </div>

        {/* Quick Refresh */}
        <button
          onClick={() => {
            fetchEnquiries();
            fetchStats();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Metrics Bar with Clickable Status Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => setFilterStatus('All')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filterStatus === 'All'
              ? 'bg-[#021343] text-white border-[#021343] shadow-md'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">Total Leads</div>
          <div className="text-2xl font-black mt-1">{stats.total}</div>
        </button>

        <button
          onClick={() => setFilterStatus('New')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filterStatus === 'New'
              ? 'bg-amber-500 text-white border-amber-500 shadow-md'
              : 'bg-white border-gray-200 text-amber-700 hover:border-amber-300'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">● New</div>
          <div className="text-2xl font-black mt-1">{stats.new}</div>
        </button>

        <button
          onClick={() => setFilterStatus('Contacted')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filterStatus === 'Contacted'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-white border-gray-200 text-blue-700 hover:border-blue-300'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">● Contacted</div>
          <div className="text-2xl font-black mt-1">{stats.contacted}</div>
        </button>

        <button
          onClick={() => setFilterStatus('In Progress')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filterStatus === 'In Progress'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md'
              : 'bg-white border-gray-200 text-purple-700 hover:border-purple-300'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">● In Progress</div>
          <div className="text-2xl font-black mt-1">{stats.inProgress}</div>
        </button>

        <button
          onClick={() => setFilterStatus('Converted')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filterStatus === 'Converted'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'bg-white border-gray-200 text-emerald-700 hover:border-emerald-300'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">● Converted</div>
          <div className="text-2xl font-black mt-1">{stats.converted}</div>
        </button>

        <button
          onClick={() => setFilterStatus('Closed')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filterStatus === 'Closed'
              ? 'bg-gray-700 text-white border-gray-700 shadow-md'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">● Closed</div>
          <div className="text-2xl font-black mt-1">{stats.closed}</div>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, company..."
            className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04]"
          />
        </div>

        {/* Service filter */}
        <div className="sm:col-span-4">
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#fe8a04]"
          >
            {servicesList.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'Filter by Service: All' : s}
              </option>
            ))}
          </select>
        </div>

        {/* Enquiry Type filter */}
        <div className="sm:col-span-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#fe8a04]"
          >
            {typeList.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'Filter by Type: All' : `Type: ${t}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {msg.text && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
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

      {/* Enquiries Feed / Table */}
      {loading ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-sm">
          <Loader2 className="w-8 h-8 text-[#fe8a04] animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Loading customer enquiries...</p>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-sm space-y-2">
          <Inbox className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-gray-700">No Enquiries Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {searchQuery || filterStatus !== 'All' || filterService !== 'All'
              ? 'No enquiries match your current filter and search criteria.'
              : 'When visitors submit an enquiry from the website, it will automatically appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq._id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Card Header: Client Identity & Quick Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#021343] text-[#fe8a04] font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
                    {(enq.fullName || enq.name)?.[0]?.toUpperCase() || 'C'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-base text-[#021343]">
                        {enq.fullName || enq.name}
                      </h3>
                      {enq.companyName && (
                        <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                          {enq.companyName}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                      <a
                        href={`tel:${enq.phone}`}
                        className="inline-flex items-center gap-1 text-[#021343] hover:text-[#fe8a04] font-medium transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#fe8a04]" />
                        <span>{enq.phone}</span>
                      </a>
                      <span>•</span>
                      <a
                        href={`mailto:${enq.email}`}
                        className="inline-flex items-center gap-1 text-gray-600 hover:text-[#021343] transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{enq.email}</span>
                      </a>
                      {enq.preferredContactMethod && enq.preferredContactMethod !== 'Any' && (
                        <>
                          <span>•</span>
                          <span className="text-[11px] text-gray-500">
                            Prefers: <strong>{enq.preferredContactMethod}</strong>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Switcher & Action Buttons */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                    disabled={actionLoading}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-full border focus:outline-none cursor-pointer ${
                      enq.status === 'New'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : enq.status === 'Contacted'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : enq.status === 'In Progress'
                        ? 'bg-purple-50 text-purple-800 border-purple-300'
                        : enq.status === 'Converted'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-gray-100 text-gray-800 border-gray-300'
                    }`}
                  >
                    <option value="New">● New</option>
                    <option value="Contacted">● Contacted</option>
                    <option value="In Progress">● In Progress</option>
                    <option value="Converted">● Converted</option>
                    <option value="Closed">● Closed</option>
                  </select>

                  <button
                    onClick={() => openDetailsModal(enq)}
                    className="p-2 text-gray-600 hover:text-[#021343] hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                    title="View Full Details & Notes"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(enq._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete Enquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Requirement Summary & Metadata Pills */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    Service: {enq.service}
                  </span>
                  {enq.enquiryType && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                      Type: {enq.enquiryType}
                    </span>
                  )}
                  {enq.budget && enq.budget !== 'Not Decided Yet' && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Budget: {enq.budget}
                    </span>
                  )}
                  {enq.timeline && enq.timeline !== 'Just Exploring' && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                      Timeline: {enq.timeline}
                    </span>
                  )}
                  {enq.relatedProject && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                      Ref Project: {enq.relatedProject}
                    </span>
                  )}
                  {enq.priority && (
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        enq.priority === 'Urgent'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : enq.priority === 'High'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      Priority: {enq.priority}
                    </span>
                  )}
                  {enq.nextFollowUpDate && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-600" />
                      Follow-up: {new Date(enq.nextFollowUpDate).toLocaleDateString('en-IN')}
                    </span>
                  )}
                  <span className="text-[11px] text-gray-400 ml-auto flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(enq.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>

                <div className="bg-[#f8fafc] p-4 rounded-xl text-xs text-gray-700 leading-relaxed border border-gray-100">
                  <span className="font-bold text-gray-900 block mb-1">Requirements:</span>
                  {enq.projectDescription || enq.message}
                </div>

                {enq.adminNotes && (
                  <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <FileText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-800 text-[11px]">Admin Internal Notes:</strong>
                      {enq.adminNotes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details & Admin Notes Modal */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedEnquiry(null);
          }}
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#fe8a04]">
                  Enquiry ID: {selectedEnquiry._id}
                </span>
                <h2 className="font-heading font-black text-xl text-[#021343]">
                  {selectedEnquiry.fullName || selectedEnquiry.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Contact Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={`tel:${selectedEnquiry.phone}`}
                className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2.5 text-xs font-bold text-blue-800 hover:bg-blue-100 transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Call: {selectedEnquiry.phone}</span>
              </a>

              <a
                href={`mailto:${selectedEnquiry.email}?subject=Webtrek IT Solutions - Quotation for ${selectedEnquiry.service}`}
                className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-2.5 text-xs font-bold text-purple-800 hover:bg-purple-100 transition-colors"
              >
                <Mail className="w-4 h-4 text-purple-600" />
                <span>Email Customer</span>
              </a>

              <a
                href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=Hello ${encodeURIComponent(
                  selectedEnquiry.fullName || selectedEnquiry.name
                )}, thank you for your enquiry with Webtrek IT Solutions regarding ${encodeURIComponent(
                  selectedEnquiry.service
                )}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <Send className="w-4 h-4 text-emerald-600" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Detailed Spec Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div>
                <span className="text-gray-400 font-semibold block mb-0.5">Service:</span>
                <strong className="text-gray-900">{selectedEnquiry.service}</strong>
              </div>
              <div>
                <span className="text-gray-400 font-semibold block mb-0.5">Enquiry Type:</span>
                <strong className="text-gray-900">{selectedEnquiry.enquiryType || 'General'}</strong>
              </div>
              <div>
                <span className="text-gray-400 font-semibold block mb-0.5">Company:</span>
                <strong className="text-gray-900">{selectedEnquiry.companyName || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-gray-400 font-semibold block mb-0.5">Budget:</span>
                <strong className="text-gray-900">{selectedEnquiry.budget || 'Not Decided'}</strong>
              </div>
              <div>
                <span className="text-gray-400 font-semibold block mb-0.5">Timeline:</span>
                <strong className="text-gray-900">{selectedEnquiry.timeline || 'Exploring'}</strong>
              </div>
              <div>
                <span className="text-gray-400 font-semibold block mb-0.5">Contact Method:</span>
                <strong className="text-gray-900">{selectedEnquiry.preferredContactMethod || 'Any'}</strong>
              </div>
              {selectedEnquiry.sourcePage && (
                <div className="col-span-2 sm:col-span-3">
                  <span className="text-gray-400 font-semibold block mb-0.5">Source Page:</span>
                  <span className="text-gray-700 font-mono text-[11px]">{selectedEnquiry.sourcePage}</span>
                </div>
              )}
            </div>

            {/* Project Requirements text */}
            <div>
              <h4 className="text-xs font-bold text-gray-700 mb-1.5">Full Requirements / Message:</h4>
              <div className="bg-[#f8fafc] p-4 rounded-2xl text-xs text-gray-800 leading-relaxed border border-gray-200/60 whitespace-pre-wrap">
                {selectedEnquiry.projectDescription || selectedEnquiry.message}
              </div>
            </div>

            {/* CRM Follow-up & Priority Management */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-orange-50/50 p-4 rounded-2xl border border-orange-200/60">
              <div>
                <label className="text-xs font-bold text-[#021343] block mb-1">
                  Lead Priority:
                </label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#fe8a04]"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Urgent">🔥 Urgent Priority</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#021343] block mb-1">
                  Next Follow-Up Date:
                </label>
                <input
                  type="date"
                  value={editFollowUpDate}
                  onChange={(e) => setEditFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#fe8a04]"
                />
              </div>
            </div>

            {/* Editable Admin Internal Notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">
                  Internal Admin Notes & Follow-up History:
                </label>
                <span className="text-[10px] text-gray-400">Visible only to admin team</span>
              </div>
              <textarea
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="e.g. Called client on 16th Nov. Sent quotation for E-commerce package (₹45,000). Awaiting contract sign-off..."
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04] focus:ring-2 focus:ring-[#fe8a04]/20 resize-none"
              ></textarea>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/admin/quotations', {
                      state: {
                        enquiryId: selectedEnquiry._id,
                        clientName: selectedEnquiry.fullName || selectedEnquiry.name,
                        clientEmail: selectedEnquiry.email,
                        clientPhone: selectedEnquiry.phone,
                        companyName: selectedEnquiry.companyName || '',
                        service: selectedEnquiry.service,
                        projectDescription: selectedEnquiry.projectDescription || selectedEnquiry.message,
                      },
                    });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#fe8a04] hover:bg-[#e07700] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Quotation for Client</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={actionLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-[#021343] hover:bg-[#021343]/90 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Notes & Follow-up</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiriesPage;
