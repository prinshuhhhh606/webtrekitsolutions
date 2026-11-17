import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle, AlertCircle, Loader2, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { settingsService } from '../../services/api';
import { useWebsite } from '../../context/WebsiteContext';
import './AdminSettingsPage.css';

const AdminSettingsPage = () => {
  const { refreshSettings } = useWebsite();
  const [formData, setFormData] = useState({
    websiteName: 'Webtrek IT Solutions',
    companyName: 'Webtrek IT Solutions',
    tagline: 'Smart Partner For To Grow Your Best Business',
    phone: '+91 9039811558',
    email: 'webtrekitsolutions@gmail.com',
    address: '328 Patnipura, Main Road, Indore',
    businessHours: 'Mon - Sat: 9:30 AM - 6:30 PM (Sunday Closed)',
    googleMapsEmbedUrl: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      linkedin: '',
      whatsapp: '',
    },
    stats: {
      projectsCompleted: '150+',
      clientSatisfaction: '99%',
      yearsExperience: '5+',
      supportHours: '24/7',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await settingsService.get();
        if (res.data.success && res.data.data) {
          const d = res.data.data;
          const currentName = d.websiteName || d.companyName || 'Webtrek IT Solutions';
          setFormData((prev) => ({
            ...prev,
            ...d,
            websiteName: currentName,
            companyName: currentName,
            socialLinks: { ...prev.socialLinks, ...(d.socialLinks || {}) },
            stats: { ...prev.stats, ...(d.stats || {}) },
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWebsiteNameChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      websiteName: val,
      companyName: val,
    }));
  };

  const handleSocialChange = (e) => {
    setFormData({
      ...formData,
      socialLinks: { ...formData.socialLinks, [e.target.name]: e.target.value },
    });
  };

  const handleStatChange = (e) => {
    setFormData({
      ...formData,
      stats: { ...formData.stats, [e.target.name]: e.target.value },
    });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.websiteName || !formData.websiteName.trim()) {
      setMsg({ text: 'Website Name cannot be empty.', type: 'error' });
      return;
    }

    setSaving(true);
    setMsg({ text: '', type: '' });

    try {
      const payload = {
        ...formData,
        websiteName: formData.websiteName.trim(),
        companyName: formData.websiteName.trim(),
      };
      const res = await settingsService.update(payload);
      if (res.data.success) {
        setMsg({ text: 'Website Name & Settings saved and updated live!', type: 'success' });
        refreshSettings();
        setTimeout(() => setMsg({ text: '', type: '' }), 4000);
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to update settings.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#fe8a04]">
            Global Configuration
          </span>
          <h1 className="font-heading font-extrabold text-2xl text-[#021343]">
            Website Settings & Contact Info
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Update phone numbers, email addresses, Indore office location, and social media handles.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#fe8a04] to-[#ff5e13] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-glow-orange cursor-pointer disabled:opacity-70"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
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

      {loading ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-200">
          <Loader2 className="w-8 h-8 text-[#fe8a04] animate-spin mx-auto" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company & Contact Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-lg text-[#021343] pb-3 border-b border-gray-100 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#fe8a04]" />
              <span>Company Information & Contact Coordinates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="sm:col-span-2 bg-gradient-to-r from-orange-50/70 to-blue-50/50 p-4 rounded-xl border border-orange-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-gray-900 text-sm">
                    Website Name <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#fe8a04] text-white">
                    Live Brand Identity
                  </span>
                </div>
                <input
                  type="text"
                  name="websiteName"
                  required
                  value={formData.websiteName}
                  onChange={handleWebsiteNameChange}
                  placeholder="e.g. Webtrek IT Solutions"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-base font-bold text-[#021343] focus:outline-none focus:border-[#fe8a04] bg-white shadow-xs"
                />
                <p className="text-[11px] text-gray-500 mt-1.5">
                  Updates dynamically across the Navbar, Footer brand, Browser tab title, and Admin panel layout.
                </p>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Company Legal Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Official Slogan / Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Primary Contact Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 7496969728"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Official Support Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="info@webtrekitsolutions.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1.5">Office Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1.5">Business Hours</label>
                <input
                  type="text"
                  name="businessHours"
                  value={formData.businessHours}
                  onChange={handleChange}
                  placeholder="Mon - Sat: 9:30 AM - 6:30 PM (Sunday Closed)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-lg text-[#021343] pb-3 border-b border-gray-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#fe8a04]" />
              <span>Social Media Channels</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Facebook Page URL</label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.socialLinks?.facebook || ''}
                  onChange={handleSocialChange}
                  placeholder="https://facebook.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Instagram Profile URL</label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.socialLinks?.instagram || ''}
                  onChange={handleSocialChange}
                  placeholder="https://instagram.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">LinkedIn Page URL</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.socialLinks?.linkedin || ''}
                  onChange={handleSocialChange}
                  placeholder="https://linkedin.com/company/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">WhatsApp Direct Link</label>
                <input
                  type="url"
                  name="whatsapp"
                  value={formData.socialLinks?.whatsapp || ''}
                  onChange={handleSocialChange}
                  placeholder="https://wa.me/917496969728"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>
            </div>
          </div>

          {/* Achievement Counters */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-lg text-[#021343] pb-3 border-b border-gray-100 flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#fe8a04]" />
              <span>Achievement Counters Displayed On Homepage</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Projects Completed</label>
                <input
                  type="text"
                  name="projectsCompleted"
                  value={formData.stats?.projectsCompleted || '150+'}
                  onChange={handleStatChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Client Satisfaction</label>
                <input
                  type="text"
                  name="clientSatisfaction"
                  value={formData.stats?.clientSatisfaction || '99%'}
                  onChange={handleStatChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Years Experience</label>
                <input
                  type="text"
                  name="yearsExperience"
                  value={formData.stats?.yearsExperience || '5+'}
                  onChange={handleStatChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Support Hours</label>
                <input
                  type="text"
                  name="supportHours"
                  value={formData.stats?.supportHours || '24/7'}
                  onChange={handleStatChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#fe8a04]"
                />
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminSettingsPage;

