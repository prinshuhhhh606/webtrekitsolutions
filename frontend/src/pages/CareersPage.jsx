import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  Award,
  Send,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  DollarSign,
  HeartHandshake,
  Laptop,
} from 'lucide-react';
import { careersService } from '../services/api';
import { useWebsite } from '../context/WebsiteContext';
import './CareersPage.css';

const CareersPage = () => {
  const { websiteName, isHiringActive } = useWebsite();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('All');
  const [expandedJobId, setExpandedJobId] = useState(null);

  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [activeJobForApply, setActiveJobForApply] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    currentCompany: '',
    expectedSalary: '',
    coverNote: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch jobs
  useEffect(() => {
    const fetchJobList = async () => {
      try {
        setLoading(true);
        const res = await careersService.getJobs({ department: selectedDept });
        if (res.data.success && res.data.data) {
          setJobs(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load jobs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobList();
  }, [selectedDept]);

  const handleOpenApplyModal = (job = null) => {
    setActiveJobForApply(job);
    setFormData((prev) => ({
      ...prev,
      position: job ? job.title : 'General Application',
    }));
    setSubmitSuccess(false);
    setSubmitError('');
    setIsApplyModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['pdf', 'doc', 'docx'];
    const ext = file.name.split('.').pop().toLowerCase();

    if (!allowed.includes(ext)) {
      setSubmitError('Invalid file type! Please upload a PDF, DOC, or DOCX document.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSubmitError('File size exceeds 5MB limit. Please upload a smaller file.');
      return;
    }

    setSubmitError('');
    setResumeFile(file);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.position.trim()) {
      setSubmitError('Please fill in all required fields (Name, Email, Phone, Position).');
      return;
    }

    if (!resumeFile) {
      setSubmitError('Please attach your Resume document (PDF, DOC, DOCX).');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('email', formData.email.trim());
      data.append('phone', formData.phone.trim());
      data.append('position', formData.position.trim());
      if (activeJobForApply?._id) {
        data.append('jobId', activeJobForApply._id);
      }
      data.append('experience', formData.experience.trim());
      data.append('currentCompany', formData.currentCompany.trim());
      data.append('expectedSalary', formData.expectedSalary.trim());
      data.append('coverNote', formData.coverNote.trim());
      data.append('resume', resumeFile);

      const res = await careersService.apply(data);
      if (res.data.success) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          position: '',
          experience: '',
          currentCompany: '',
          expectedSalary: '',
          coverNote: '',
        });
        setResumeFile(null);
      } else {
        setSubmitError(res.data.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || 'Something went wrong while submitting. Please check your network and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const perks = [
    {
      icon: Laptop,
      title: 'Modern Tech Stack',
      desc: 'Work on cutting-edge stacks: React, Node, Express, MongoDB, Cloud Architectures, and Next.js.',
    },
    {
      icon: DollarSign,
      title: 'Competitive Compensation',
      desc: 'Industry-leading salary packages with high performance bonuses and regular milestone appraisals.',
    },
    {
      icon: Compass,
      title: 'Flexible & Hybrid Work',
      desc: 'Balanced work culture with flexible timings and hybrid onsite/remote collaboration choices.',
    },
    {
      icon: Award,
      title: 'Continuous Learning',
      desc: 'Sponsored courses, workshops, hackathons, and direct mentorship from veteran full-stack engineers.',
    },
    {
      icon: Users,
      title: 'Supportive Team Culture',
      desc: 'Zero-hierarchy environment where your ideas matter and creative problem solving is celebrated.',
    },
    {
      icon: HeartHandshake,
      title: 'Work-Life Harmony',
      desc: 'Generous leave policies, celebratory dinners, team retreats, and health-first working practices.',
    },
  ];

  const departments = ['All', 'Engineering', 'Design', 'Marketing'];

  return (
    <div className="careers-page-wrapper">
      {/* Hero Section */}
      <section className="careers-hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fe8a04]/15 border border-[#fe8a04]/30 text-[#fe8a04] text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Join Our Growing Team</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Build The Future Of Digital Innovation With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fe8a04] to-[#ffaa40]">
              {websiteName}
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We are looking for creative thinkers, passionate developers, and visionaries eager to shape high-impact web and mobile solutions for global clients.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#open-positions" className="careers-primary-cta">
              <span>Explore Open Positions</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => handleOpenApplyModal(null)}
              className="careers-secondary-cta"
            >
              <Send className="w-4 h-4" />
              <span>Direct Resume Drop</span>
            </button>
          </div>
        </div>
      </section>

      {/* Perks / Why Choose Us */}
      <section className="py-16 sm:py-24 bg-[#020b24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Why You'll Love Working With Us
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-300">
              We empower our team members with the tools, freedom, and encouragement to do their career's best work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {perks.map((perk, idx) => {
              const Icon = perk.icon;
              return (
                <div key={idx} className="careers-perk-card">
                  <div className="careers-perk-icon-wrapper">
                    <Icon className="w-6 h-6 text-[#fe8a04]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{perk.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{perk.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="open-positions" className="py-16 sm:py-24 bg-[#030919] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-[#fe8a04] text-xs font-bold uppercase tracking-wider mb-2">
                <Briefcase className="w-4 h-4" />
                <span>Job Openings</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Available Career Opportunities
              </h2>
              <p className="text-sm sm:text-base text-gray-300 mt-2">
                Find the role that matches your skills and start your journey with us.
              </p>
            </div>

            {/* Department Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    selectedDept === dept
                      ? 'bg-[#fe8a04] text-white shadow-lg shadow-[#fe8a04]/25'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Jobs List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="careers-job-card-skeleton animate-pulse"></div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white/5 rounded-2xl border border-white/10 max-w-xl mx-auto">
              <Briefcase className="w-12 h-12 text-[#fe8a04] mx-auto mb-4 opacity-75" />
              <h3 className="text-lg font-bold text-white">No Openings Currently Listed in this Department</h3>
              <p className="text-sm text-gray-300 mt-2">
                We are always happy to hear from talented individuals. Send us an open application anytime!
              </p>
              <button
                onClick={() => handleOpenApplyModal(null)}
                className="mt-6 inline-flex items-center gap-2 bg-[#fe8a04] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#ff9500] transition-colors"
              >
                <span>Submit General Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => {
                const isExpanded = expandedJobId === job._id;
                return (
                  <div key={job._id} className="careers-job-card">
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-xl font-bold text-white">{job.title}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fe8a04]/20 text-[#fe8a04] border border-[#fe8a04]/30">
                            {job.department}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-300">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-[#fe8a04]" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#fe8a04]" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-[#fe8a04]" />
                            Exp: {job.experience}
                          </span>
                          {job.salaryRange && (
                            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                              <DollarSign className="w-4 h-4" />
                              {job.salaryRange}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => setExpandedJobId(isExpanded ? null : job._id)}
                          className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 border border-white/10 cursor-pointer"
                        >
                          <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleOpenApplyModal(job)}
                          className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#fe8a04] text-white hover:bg-[#ff9500] shadow-md shadow-[#fe8a04]/20 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Details Drawer */}
                    {isExpanded && (
                      <div className="border-t border-white/10 p-6 bg-black/25 space-y-5 animate-fadeIn">
                        <div>
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Role Overview</h4>
                          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{job.description}</p>
                        </div>

                        {job.requirements && job.requirements.length > 0 && (
                          <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Requirements</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                              {job.requirements.map((req, i) => (
                                <li key={i}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {job.responsibilities && job.responsibilities.length > 0 && (
                          <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Key Responsibilities</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                              {job.responsibilities.map((resp, i) => (
                                <li key={i}>{resp}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="pt-2">
                          <button
                            onClick={() => handleOpenApplyModal(job)}
                            className="inline-flex items-center gap-2 bg-[#fe8a04] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#ff9500] transition-colors cursor-pointer"
                          >
                            <span>Apply For This Position</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Application Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#021343] border border-white/15 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 text-white relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {activeJobForApply ? `Apply for ${activeJobForApply.title}` : 'Direct Application'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  Fill in your details and attach your resume. We look forward to meeting you!
                </p>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            {submitSuccess ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-bold text-white">Application Received!</h4>
                <p className="text-gray-300 max-w-md mx-auto text-sm leading-relaxed">
                  Thank you for applying to <span className="text-[#fe8a04] font-semibold">{websiteName}</span>. Our recruitment team has received your resume and will reach out to schedule an interview if your profile aligns.
                </p>
                <button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="mt-6 bg-[#fe8a04] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#ff9500] transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                {submitError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                      Full Name <span className="text-[#fe8a04]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#030919] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#fe8a04]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                      Email Address <span className="text-[#fe8a04]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#030919] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#fe8a04]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                      Phone Number <span className="text-[#fe8a04]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#030919] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#fe8a04]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                      Target Position <span className="text-[#fe8a04]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full bg-[#030919] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#fe8a04]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                      Experience
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2.5 Years"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full bg-[#030919] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#fe8a04]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                      Current Company
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp"
                      value={formData.currentCompany}
                      onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                      className="w-full bg-[#030919] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#fe8a04]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                      Expected CTC
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹6 LPA"
                      value={formData.expectedSalary}
                      onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                      className="w-full bg-[#030919] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#fe8a04]"
                    />
                  </div>
                </div>

                {/* Resume Upload Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                    Upload Resume (PDF, DOC, DOCX up to 5MB) <span className="text-[#fe8a04]">*</span>
                  </label>
                  <label className="careers-resume-dropzone cursor-pointer block">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center p-5 text-center">
                      <UploadCloud className="w-8 h-8 text-[#fe8a04] mb-2" />
                      {resumeFile ? (
                        <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                          <FileText className="w-4 h-4" />
                          <span>{resumeFile.name} ({(resumeFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm font-medium text-white">Click or drag file here to attach resume</span>
                          <span className="text-xs text-gray-400 mt-1">Supported: PDF, DOC, DOCX (Max 5MB)</span>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {/* Cover Note */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                    Brief Note / Links (Portfolio, GitHub, LinkedIn)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us a little about your experience or paste your portfolio links..."
                    value={formData.coverNote}
                    onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                    className="w-full bg-[#030919] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#fe8a04] resize-none"
                  ></textarea>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="careers-submit-btn"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        Uploading Resume...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span>Submit Application</span>
                        <Send className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;
