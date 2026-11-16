import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  FileText,
  Printer,
  Download,
  Search,
  DollarSign,
  Calendar,
  Send,
  Building2,
} from 'lucide-react';
import { quotationsService, enquiriesService } from '../../services/api';
import './AdminQuotationsPage.css';

const quotationStatuses = ['All', 'Draft', 'Sent', 'Accepted', 'Rejected'];

const AdminQuotationsPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    companyName: '',
    title: 'Website Development & Digital Transformation Quotation',
    description: 'Custom full-stack web application engineering, SEO architecture, and cloud deployment.',
    items: [
      { description: 'Responsive Full-Stack Web Development', quantity: 1, price: 25000 },
      { description: 'Search Engine Optimization (SEO) & Analytics Setup', quantity: 1, price: 5000 },
    ],
    taxPercent: 18,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    termsAndConditions: '1. 50% advance upon project sign-off.\n2. 50% upon successful delivery and deployment.\n3. Includes 30 days of free bug-fix warranty.',
    status: 'Draft',
    notes: '',
  });

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await quotationsService.getAll(params);
      if (res.data.success) {
        setQuotations(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [statusFilter, searchQuery]);

  const openNewModal = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      companyName: '',
      title: 'Website Development & Digital Transformation Quotation',
      description: 'Custom full-stack web application engineering, SEO architecture, and cloud deployment.',
      items: [
        { description: 'Responsive Full-Stack Web Development', quantity: 1, price: 25000 },
        { description: 'Search Engine Optimization (SEO) & Analytics Setup', quantity: 1, price: 5000 },
      ],
      taxPercent: 18,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      termsAndConditions: '1. 50% advance upon project sign-off.\n2. 50% upon successful delivery and deployment.\n3. Includes 30 days of free bug-fix warranty.',
      status: 'Draft',
      notes: '',
    });
    setModalOpen(true);
  };

  const addItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }],
    }));
  };

  const removeItemRow = (index) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, items: updated }));
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0);
  };

  const calculateTotal = () => {
    const sub = calculateSubtotal();
    const tax = (sub * Number(formData.taxPercent || 0)) / 100;
    return sub + tax;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const res = await quotationsService.create(formData);
      if (res.data.success) {
        setMsg({ text: 'Quotation generated successfully!', type: 'success' });
        setModalOpen(false);
        fetchQuotations();
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMsg({
        text: err.response?.data?.message || 'Failed to generate quotation.',
        type: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setActionLoading(true);
      const res = await quotationsService.update(id, { status: newStatus });
      if (res.data.success) {
        setQuotations(
          quotations.map((q) => (q._id === id ? { ...q, status: newStatus } : q))
        );
        if (selectedQuotation && selectedQuotation._id === id) {
          setSelectedQuotation((prev) => ({ ...prev, status: newStatus }));
        }
        setMsg({ text: `Status updated to ${newStatus}`, type: 'success' });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMsg({ text: 'Failed to update status', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quotation?')) return;
    try {
      setActionLoading(true);
      const res = await quotationsService.delete(id);
      if (res.data.success) {
        setQuotations(quotations.filter((q) => q._id !== id));
        setMsg({ text: 'Quotation deleted successfully.', type: 'success' });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMsg({ text: 'Failed to delete quotation.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const openPreview = (quote) => {
    setSelectedQuotation(quote);
    setPrintModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#fe8a04]">
            Commercial Management
          </span>
          <h1 className="font-heading font-extrabold text-2xl text-[#021343]">
            Quotation & Estimate Generator
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create professional commercial proposals, line-item pricing, tax breakdowns, and PDF downloads.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 bg-[#021343] hover:bg-[#fe8a04] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Quotation</span>
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
            placeholder="Search by quote number, client name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04]"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#fe8a04]"
          >
            {quotationStatuses.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'Filter by Status: All' : `Status: ${s}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quotations List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-200">
          <Loader2 className="w-8 h-8 text-[#fe8a04] animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Loading quotations...</p>
        </div>
      ) : quotations.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 space-y-2">
          <FileText className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-gray-700">No Quotations Found</h3>
          <p className="text-xs text-gray-400">Generate a new quotation for an enquiry or client to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Quote #</th>
                  <th className="py-3.5 px-6 font-semibold">Client Name</th>
                  <th className="py-3.5 px-6 font-semibold">Title & Items</th>
                  <th className="py-3.5 px-6 font-semibold">Total (INR)</th>
                  <th className="py-3.5 px-6 font-semibold">Status</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {quotations.map((q) => (
                  <tr key={q._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#021343]">
                      {q.quotationNumber}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900">{q.customerName}</div>
                      <div className="text-[11px] text-gray-400">{q.customerEmail} • {q.customerPhone}</div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-semibold text-gray-800 line-clamp-1">{q.title}</div>
                      <div className="text-[11px] text-gray-400">{q.items?.length || 0} line items</div>
                    </td>
                    <td className="py-4 px-6 font-black text-[#fe8a04] text-sm">
                      ₹{q.total?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={q.status}
                        onChange={(e) => handleStatusUpdate(q._id, e.target.value)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border cursor-pointer ${
                          q.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : q.status === 'Sent'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : q.status === 'Draft'
                            ? 'bg-gray-100 text-gray-700 border-gray-300'
                            : 'bg-red-50 text-red-700 border-red-300'
                        }`}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openPreview(q)}
                          className="px-3 py-1.5 bg-[#021343] hover:bg-[#fe8a04] text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View / Print</span>
                        </button>
                        <button
                          onClick={() => handleDelete(q._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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

      {/* Create Quotation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-heading font-extrabold text-xl text-[#021343]">
                  Generate Commercial Proposal & Quotation
                </h3>
                <p className="text-xs text-gray-500">Define line items, deliverables, and tax rates.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Customer Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="client@gmail.com"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Customer Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+91 90398 11558"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. TechCorp Solutions"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Quotation Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04]"
                  />
                </div>
              </div>

              {/* Line Items Builder */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-gray-700">Project Deliverables & Line Items</label>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="text-xs font-bold text-[#fe8a04] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2 border p-3 rounded-2xl bg-gray-50/60">
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-6">
                        <input
                          type="text"
                          required
                          placeholder="Item Description (e.g. Custom React Frontend)"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          min="0"
                          required
                          placeholder="Price (₹)"
                          value={item.price}
                          onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Calculations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">GST / Tax (%)</label>
                  <input
                    type="number"
                    value={formData.taxPercent}
                    onChange={(e) => setFormData({ ...formData, taxPercent: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Validity Date</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-[#021343] text-white rounded-xl flex flex-col justify-center">
                  <span className="text-[10px] text-gray-300 font-medium">Grand Total (Inc. Tax)</span>
                  <span className="text-lg font-black text-[#fe8a04]">
                    ₹{calculateTotal().toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Terms & Conditions</label>
                <textarea
                  rows={2}
                  value={formData.termsAndConditions}
                  onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none"
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
                  {actionLoading ? 'Creating...' : 'Save & Generate Quote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable / Downloadable Quotation Viewer */}
      {printModalOpen && selectedQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4 print:hidden">
              <span className="text-xs font-bold text-gray-400">Official Webtrek Proposal</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#021343] text-white rounded-xl text-xs font-bold hover:bg-[#fe8a04] transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setPrintModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Sheet */}
            <div className="p-6 bg-white border border-gray-200 rounded-2xl space-y-6 text-gray-800">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                <div>
                  <h2 className="font-heading font-black text-2xl text-[#021343]">
                    WEBTREK<span className="text-[#fe8a04]">.</span>
                  </h2>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
                    IT Solutions & Digital Services
                  </span>
                  <div className="text-xs text-gray-500 mt-2">
                    328 Patnipura, Main Road, Indore<br />
                    webtrekitsolutions@gmail.com • +91 90398 11558
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#fe8a04]">
                    Commercial Proposal
                  </span>
                  <div className="font-heading font-black text-lg text-[#021343]">
                    {selectedQuotation.quotationNumber}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Date: {new Date(selectedQuotation.createdAt).toLocaleDateString()}<br />
                    Valid Until: {new Date(selectedQuotation.validUntil).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div className="bg-[#f8fafc] p-4 rounded-xl border border-gray-100 flex justify-between text-xs">
                <div>
                  <span className="font-bold text-gray-500 uppercase tracking-wider">Prepared For:</span>
                  <div className="font-bold text-sm text-[#021343] mt-0.5">{selectedQuotation.customerName}</div>
                  {selectedQuotation.companyName && (
                    <div className="text-gray-600 font-semibold">{selectedQuotation.companyName}</div>
                  )}
                  <div className="text-gray-500">{selectedQuotation.customerEmail} • {selectedQuotation.customerPhone}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-500 uppercase tracking-wider">Status:</span>
                  <div className="font-bold text-[#fe8a04] uppercase mt-0.5">{selectedQuotation.status}</div>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <h4 className="font-heading font-bold text-sm text-[#021343] mb-2">{selectedQuotation.title}</h4>
                <p className="text-xs text-gray-500 mb-4">{selectedQuotation.description}</p>

                <table className="w-full text-xs">
                  <thead className="bg-[#f8fafc] text-gray-600 uppercase border-y">
                    <tr>
                      <th className="py-2.5 px-3 text-left">Item Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedQuotation.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-3 font-medium text-gray-800">{item.description}</td>
                        <td className="py-3 px-3 text-center">{item.quantity}</td>
                        <td className="py-3 px-3 text-right">₹{item.price?.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3 text-right font-bold">₹{item.amount?.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1.5 text-xs text-right border-t pt-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-bold">₹{selectedQuotation.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST ({selectedQuotation.taxPercent}%):</span>
                    <span className="font-bold">₹{selectedQuotation.taxAmount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[#021343] border-t pt-1.5">
                    <span>Grand Total:</span>
                    <span className="text-[#fe8a04]">₹{selectedQuotation.total?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="border-t pt-4 text-[11px] text-gray-500 space-y-1">
                <span className="font-bold text-gray-700 block">Terms & Conditions:</span>
                <p className="whitespace-pre-line leading-relaxed">{selectedQuotation.termsAndConditions}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuotationsPage;

