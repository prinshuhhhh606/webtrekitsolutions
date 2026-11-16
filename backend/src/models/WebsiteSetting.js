const mongoose = require('mongoose');

const websiteSettingSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'Webtrek IT Solutions',
    },
    tagline: {
      type: String,
      default: 'Smart Partner To Grow Your Best Business',
    },
    phone: {
      type: String,
      default: '+91 7496969728',
    },
    alternatePhone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: 'info@webtrekitsolutions.in',
    },
    supportEmail: {
      type: String,
      default: 'support@webtrekitsolutions.in',
    },
    address: {
      type: String,
      default: '328, Patni Pura Road, Nanda Nagar, Indore, Madhya Pradesh 452011, India',
    },
    businessHours: {
      type: String,
      default: 'Mon - Sat: 9:30 AM - 6:30 PM (Sunday Closed)',
    },
    googleMapsEmbedUrl: {
      type: String,
      default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117763.55184882555!2d75.79373977797746!3d22.72420499933596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcad1b410ddb%3A0x96ec4da356240f4!2sIndore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com/webtrekitsolutions' },
      instagram: { type: String, default: 'https://instagram.com/webtrekitsolutions' },
      linkedin: { type: String, default: 'https://linkedin.com/company/webtrekitsolutions' },
      twitter: { type: String, default: 'https://twitter.com/webtrekitsolutions' },
      whatsapp: { type: String, default: 'https://wa.me/917496969728' },
      youtube: { type: String, default: '' },
    },
    stats: {
      projectsCompleted: { type: String, default: '150+' },
      clientSatisfaction: { type: String, default: '99%' },
      yearsExperience: { type: String, default: '5+' },
      supportHours: { type: String, default: '24/7' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WebsiteSetting', websiteSettingSchema);

