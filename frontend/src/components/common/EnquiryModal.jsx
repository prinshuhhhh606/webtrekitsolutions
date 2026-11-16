import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  Building2,
  Phone,
  Mail,
  User,
  Clock,
  DollarSign,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useWebsite } from '../../context/WebsiteContext';
import { enquiriesService } from '../../services/api';
import './EnquiryModal.css';

const serviceOptions = [
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

const budgetOptions = [
  'Under ₹10,000',
  '₹10,000 – ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  'Above ₹1,00,000',
  'Not Decided Yet',
];

const timelineOptions = [
  'Immediately',
  'Within 1 Week',
  'Within 1 Month',
  'Within 2–3 Months',
  'Just Exploring',
];

const contactMethodOptions = [
  { label: 'Any Method', value: 'Any' },
  { label: 'Phone Call', value: 'Phone' },
  { label: 'WhatsApp', value: 'WhatsApp' },
  { label: 'Email', value: 'Email' },
];

const EnquiryModal = () => {
  const { isModalOpen, modalOptions, closeEnquiryModal } = useWebsite();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    companyName: '',
    service: 'Website Development',
    projectDescription: '',
    budget: 'Not Decided Yet',
    timeline: 'Just Exploring',
    preferredContactMethod: 'Any',
    enquiryType: 'General',
    relatedProject: '',
    sourcePage: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Sync modal options whenever modal opens
  useEffect(() => {
    if (isModalOpen && modalOptions) {
      setFormData((prev) => ({
        ...prev,
        service: modalOptions.service || prev.service || 'Website Development',
        enquiryType: modalOptions.enquiryType || 'General',
        relatedProject: modalOptions.relatedProject || '',
        sourcePage: modalOptions.sourcePage || (typeof window !== 'undefined' ? window.location.pathname : ''),
      }));
      setSuccess(false);
      setError('');
      setFieldErrors({});
    }
  }, [isModalOpen, modalOptions]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeEnquiryModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeEnquiryModal]);

  if (!isModalOpen) return null;

  const validateInputs = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required';
    }

    // Phone validation (digits check)
    const phoneDigits = formData.phone.replace(/[^0-9]/g, '');
    if (!formData.phone.trim()) {
      errs.phone = 'Phone Number is required';
    } else if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      errs.phone = 'Please enter a valid phone number (8-15 digits)';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email Address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.projectDescription.trim()) {
      errs.projectDescription = 'Project Description / Requirements is required';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        name: formData.fullName,
        message: formData.projectDescription,
      };

      const res = await enquiriesService.create(payload);
      if (res.data.success) {
        setSuccess(true);
        // Reset form while keeping service selection
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          companyName: '',
          service: modalOptions?.service || 'Website Development',
          projectDescription: '',
          budget: 'Not Decided Yet',
          timeline: 'Just Exploring',
          preferredContactMethod: 'Any',
          enquiryType: 'General',
          relatedProject: '',
          sourcePage: '',
        });
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Unable to submit enquiry. Please verify your connection or try again shortly.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeEnquiryModal();
      }}
    >
      <div className="modal-dialog max-w-2xl" role="dialog" aria-modal="true">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#fe8a04] text-[11px] font-bold uppercase tracking-wider mb-1 border border-[#fe8a04]/30">
              <Sparkles className="w-3 h-3" />
              <span>
                {success
                  ? 'Submission Confirmed'
                  : formData.enquiryType === 'Quote'
                  ? 'Request a Quotation'
                  : formData.enquiryType === 'Consultation'
                  ? 'Free Consultation'
                  : formData.enquiryType === 'Project'
                  ? 'Start a Similar Project'
                  : 'Webtrek IT Solutions'}
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
              {success ? 'Thank You!' : "Let's Discuss Your Project"}
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              {success
                ? 'Your project enquiry has been submitted successfully.'
                : 'Tell us about your requirements and our team will get in touch with you.'}
            </p>
          </div>
          <button
            onClick={closeEnquiryModal}
            className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {success ? (
            /* Success Feedback View */
            <div className="py-8 sm:py-12 text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md ring-8 ring-emerald-50">
                <CheckCircle className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <div className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-200">
                  Enquiry Submitted Successfully!
                </div>
                <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#021343] tracking-tight">
                  Thank You!
                </h1>
                <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto leading-relaxed pt-1">
                  Your project enquiry has been submitted successfully. Our team will contact you soon.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={closeEnquiryModal}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#fe8a04] to-[#ff5e13] text-white font-bold text-sm shadow-glow-orange hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Back to Website</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Enquiry Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-600">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Related Project Pill if clicked from project */}
              {formData.relatedProject && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                  <span>
                    Selected Project Reference: <strong>{formData.relatedProject}</strong>
                  </span>
                  <span className="text-[11px] font-bold text-amber-700 uppercase">
                    Similar Scope
                  </span>
                </div>
              )}

              {/* Row 1: Full Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border ${
                        fieldErrors.fullName ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                      } focus:outline-none focus:border-[#fe8a04] focus:ring-2 focus:ring-[#fe8a04]/20 transition-all`}
                    />
                  </div>
                  {fieldErrors.fullName && (
                    <span className="text-[11px] text-red-500 mt-1 block">
                      {fieldErrors.fullName}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 90398 11558"
                      className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border ${
                        fieldErrors.phone ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                      } focus:outline-none focus:border-[#fe8a04] focus:ring-2 focus:ring-[#fe8a04]/20 transition-all`}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <span className="text-[11px] text-red-500 mt-1 block">
                      {fieldErrors.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 2: Email Address & Company Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@example.com"
                      className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border ${
                        fieldErrors.email ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                      } focus:outline-none focus:border-[#fe8a04] focus:ring-2 focus:ring-[#fe8a04]/20 transition-all`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <span className="text-[11px] text-red-500 mt-1 block">
                      {fieldErrors.email}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Company Name <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Sharma Enterprises"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04] focus:ring-2 focus:ring-[#fe8a04]/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Service Interested In */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Service Interested In <span className="text-red-500">*</span>
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04] focus:ring-2 focus:ring-[#fe8a04]/20 transition-all bg-white"
                >
                  {serviceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 4: Budget Range & Expected Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Budget Range <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04] focus:ring-2 focus:ring-[#fe8a04]/20 transition-all bg-white"
                    >
                      {budgetOptions.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Expected Project Timeline <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04] focus:ring-2 focus:ring-[#fe8a04]/20 transition-all bg-white"
                    >
                      {timelineOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 5: Preferred Contact Method */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Preferred Contact Method <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {contactMethodOptions.map((method) => (
                    <button
                      type="button"
                      key={method.value}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, preferredContactMethod: method.value }))
                      }
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center cursor-pointer ${
                        formData.preferredContactMethod === method.value
                          ? 'border-[#fe8a04] bg-[#fe8a04]/10 text-[#fe8a04] font-bold shadow-sm'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 6: Project Description / Requirements */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Project Description / Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="projectDescription"
                  rows={3}
                  value={formData.projectDescription}
                  onChange={handleChange}
                  placeholder="Tell us about your project goals, features needed, or timeline requirements..."
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                    fieldErrors.projectDescription ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                  } focus:outline-none focus:border-[#fe8a04] focus:ring-2 focus:ring-[#fe8a04]/20 transition-all resize-none`}
                ></textarea>
                {fieldErrors.projectDescription && (
                  <span className="text-[11px] text-red-500 mt-1 block">
                    {fieldErrors.projectDescription}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="modal-submit-btn cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Enquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Enquiry</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;
