import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { useWebsite } from '../context/WebsiteContext';
import { enquiriesService } from '../services/api';
import FAQSection from '../components/home/FAQSection';
import PageBanner from '../components/common/PageBanner';
import './ContactUsPage.css';

const ContactUsPage = () => {
  const { settings } = useWebsite();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Website Development',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        fullName: formData.name,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        projectDescription: formData.message,
        message: formData.message,
        companyName: formData.companyName || '',
        budget: formData.budget || 'Not Decided Yet',
        timeline: formData.timeline || 'Just Exploring',
        enquiryType: 'General',
        sourcePage: 'Contact Us Page',
      };
      const res = await enquiriesService.create(payload);
      if (res.data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: 'Website Development',
          subject: '',
          message: '',
          companyName: '',
          budget: 'Not Decided Yet',
          timeline: 'Just Exploring',
        });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to send message. Please ensure backend is running.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Banner with exact reference text and image overlay */}
      <PageBanner
        badge="Contact-us"
        title="Contact us"
        description="Stay In Touch - Get A Quotation for website development, digital marketing, or custom IT services."
      />

      {/* Main Content: Info & Form with exact reference text */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Contact Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#fe8a04]">
                  Stay In Touch
                </span>
                <h2 className="font-heading font-extrabold text-3xl text-[#021343] mt-1 mb-4">
                  Get An Quatation
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  At Webtrek IT Solutions, getting started is simple! Reach out to us directly or visit our office.
                </p>
              </div>

              <div className="space-y-4">
                <div className="contact-info-card">
                  <div className="w-12 h-12 rounded-xl bg-[#021343] text-[#fe8a04] flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-base text-[#021343]">Office Location</h4>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {settings.address || '328 Patnipura, Main Road, Indore'}
                    </p>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="w-12 h-12 rounded-xl bg-[#021343] text-[#fe8a04] flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-base text-[#021343]">Our Contact</h4>
                    <a
                      href={`mailto:${settings.email || 'webtrekitsolutions@gmail.com'}`}
                      className="block text-sm text-[#fe8a04] font-bold mt-1 hover:underline"
                    >
                      {settings.email || 'webtrekitsolutions@gmail.com'}
                    </a>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="w-12 h-12 rounded-xl bg-[#021343] text-[#fe8a04] flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-base text-[#021343]">Office Phone</h4>
                    <a
                      href={`tel:${settings.phone?.replace(/[^0-9+]/g, '') || '+919039811558'}`}
                      className="block text-sm text-[#fe8a04] font-bold mt-1 hover:underline"
                    >
                      {settings.phone || '+91 9039811558'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
              <div className="contact-form-card">
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#fe8a04]">
                    Get An Quatation
                  </span>
                  <h3 className="font-heading font-extrabold text-2xl text-[#021343] mt-1">
                    Send Us a Message
                  </h3>
                </div>

                {success ? (
                  <div className="py-12 sm:py-16 text-center space-y-6 animate-fade-in">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md ring-8 ring-emerald-50">
                      <CheckCircle2 className="w-12 h-12" />
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

                    <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                      <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#fe8a04] to-[#ff5e13] text-white font-bold text-sm shadow-glow-orange hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <span>Back to Website</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setSuccess(false)}
                        className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-gray-100 hover:bg-gray-200 text-[#021343] font-bold text-sm transition-all cursor-pointer"
                      >
                        <span>Submit Another Enquiry</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-xs text-red-600">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your Name"
                          className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#fe8a04] focus:ring-2 focus:ring-[#fe8a04]/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 9039811558"
                          className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#fe8a04] focus:ring-2 focus:ring-[#fe8a04]/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="yourname@gmail.com"
                          className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#fe8a04] focus:ring-2 focus:ring-[#fe8a04]/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Service Selection *
                        </label>
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#fe8a04] focus:ring-2 focus:ring-[#fe8a04]/20 transition-all"
                        >
                          <option value="Website Development">Website Development</option>
                          <option value="Digital Marketing Services">Digital Marketing Services</option>
                          <option value="SEO Specialist Services">SEO Specialist Services</option>
                          <option value="Social Media Marketing">Social Media Marketing</option>
                          <option value="Lead Generation Services">Lead Generation Services</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Your message (optional)
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your message here..."
                        className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#fe8a04] focus:ring-2 focus:ring-[#fe8a04]/20 transition-all resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#fe8a04] to-[#ff5e13] text-white py-4 rounded-xl font-bold text-base shadow-glow-orange hover:shadow-orange-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Submitting Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Enquiry</span>
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Contact Us & Order Services from reference */}
      <FAQSection />

      {/* Office Google Map */}
      <section className="bg-gray-100 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <h3 className="font-heading font-bold text-2xl text-[#021343]">
              Location: 328 Patnipura, Main Road, Indore
            </h3>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-200 h-96 w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117763.55184882555!2d75.79373977797746!3d22.72420499933596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcad1b410ddb%3A0x96ec4da356240f4!2sIndore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Webtrek IT Solutions Office Map"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;
