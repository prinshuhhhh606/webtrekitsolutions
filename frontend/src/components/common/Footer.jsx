import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight, Lock } from 'lucide-react';
import { useWebsite } from '../../context/WebsiteContext';
import './Footer.css';

const Footer = () => {
  const { settings, websiteName, openEnquiryModal } = useWebsite();

  const brandParts = (websiteName || settings.companyName || 'Webtrek IT Solutions').trim().split(' ');
  const brandFirst = brandParts[0] || 'WEBTREK';
  const brandRest = brandParts.slice(1).join(' ') || 'IT Solutions';
  const displayName = websiteName || settings.companyName || 'Webtrek IT Solutions';

  const servicesList = [
    { name: 'Website Development', path: '/our-services' },
    { name: 'Digital Marketing Service', path: '/our-services' },
    { name: 'SEO Specialist Services', path: '/our-services' },
    { name: 'Social Media Marketing', path: '/our-services' },
    { name: 'Lead Generation', path: '/our-services' },
    { name: 'Mobile App Development', path: '/our-services' },
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About-US', path: '/about-us' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Our-services', path: '/our-services' },
    { name: 'Our-projects', path: '/our-project' },
    { name: 'Blog-page', path: '/blog-page' },
    { name: 'Contact Us', path: '/contact-us' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <footer className="footer-container">
      <div className="footer-glow-1" />
      <div className="footer-glow-2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#fe8a04] to-[#ff5e13] flex items-center justify-center text-white font-bold text-xl shadow-glow-orange">
                <span className="font-heading">{brandFirst.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-2xl text-white tracking-tight leading-none">
                  {brandFirst.toUpperCase()}<span className="text-[#fe8a04]">.</span>
                </span>
                {brandRest && (
                  <span className="text-[10px] uppercase tracking-widest text-gray-300 font-medium">
                    {brandRest}
                  </span>
                )}
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              {displayName} is a tech company specializing in innovative IT services and digital solutions. It offers web development, software solutions, mobile app development, digital marketing, and IT consulting, helping businesses grow through technology-driven strategies.
            </p>

            <div className="pt-2">
              <button
                onClick={() => openEnquiryModal('Footer Get Started')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#fe8a04] to-[#ff5e13] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-glow-orange hover:shadow-orange-500/50 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="footer-title">
              <span className="footer-bullet"></span>
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="footer-link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="footer-title">
              <span className="footer-bullet"></span>
              Our Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {servicesList.map((service) => (
                <li key={service.name}>
                  <Link to={service.path} className="footer-link">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="footer-title">
              <span className="footer-bullet"></span>
              Contact Us
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-4 h-4 text-[#fe8a04] shrink-0 mt-0.5" />
                <span>{settings.address || '328 Patnipura, Main Road, Indore'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#fe8a04] shrink-0" />
                <a
                  href={`tel:${settings.phone?.replace(/[^0-9+]/g, '') || '+919039811558'}`}
                  className="text-gray-400 hover:text-white transition-colors font-medium"
                >
                  {settings.phone || '+91 9039811558'}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#fe8a04] shrink-0" />
                <a
                  href={`mailto:${settings.email || 'webtrekitsolutions@gmail.com'}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {settings.email || 'webtrekitsolutions@gmail.com'}
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Clock className="w-4 h-4 text-[#fe8a04] shrink-0" />
                <span>{settings.businessHours || 'Mon - Sat: 9:30 AM - 6:30 PM'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with exact copyright text */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} {displayName}. All rights reserved. | Empowering businesses with smart IT solutions.</p>
          <div className="flex items-center gap-6">
            <Link to="/about-us" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/contact-us" className="hover:text-white transition-colors">Contact</Link>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-[#fe8a04] transition-colors"
              title="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
