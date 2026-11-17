import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, PhoneCall } from 'lucide-react';
import { useWebsite } from '../../context/WebsiteContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { websiteName, openEnquiryModal } = useWebsite();
  const location = useLocation();

  const brandParts = (websiteName || 'Webtrek IT Solutions').trim().split(' ');
  const brandFirst = brandParts[0] || 'WEBTREK';
  const brandRest = brandParts.slice(1).join(' ') || 'IT Solutions';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About-US', path: '/about-us' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Our-services', path: '/our-services' },
    { name: 'Our-projects', path: '/our-project' },
    { name: 'Blog-page', path: '/blog-page' },
  ];

  return (
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="navbar-logo-badge group-hover:scale-105">
              <span>{brandFirst.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg sm:text-2xl text-white tracking-tight leading-none">
                {brandFirst.toUpperCase()}<span className="text-[#fe8a04]">.</span>
              </span>
              {brandRest && (
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-300 font-medium">
                  {brandRest}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() =>
                openEnquiryModal({
                  service: 'Website Development',
                  enquiryType: 'General',
                  sourcePage: 'Navbar Get Started',
                })
              }
              className="navbar-cta-btn"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() =>
                openEnquiryModal({
                  service: 'Website Development',
                  enquiryType: 'General',
                  sourcePage: 'Navbar Mobile Get Started',
                })
              }
              className="sm:inline-flex hidden items-center gap-1.5 bg-[#fe8a04] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer shadow-sm hover:bg-[#ff9500] transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Get Started</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 focus:outline-none transition-colors cursor-pointer"
              aria-label="Toggle Navigation"
              aria-expanded={isOpen}
              aria-controls="mobile-nav-drawer"
            >
              {isOpen ? <X className="w-6 h-6 text-[#fe8a04]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden mobile-nav-drawer bg-[#030919] border-b border-white/10 px-4 pt-3 pb-6 space-y-3 shadow-2xl">
          <div className="flex flex-col space-y-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 rounded-xl text-base font-medium transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#fe8a04]/15 text-[#fe8a04] font-bold border border-[#fe8a04]/30'
                      : 'text-gray-200 hover:bg-white/5 hover:text-[#fe8a04]'
                  }`
                }
              >
                <span>{link.name}</span>
                <ArrowRight className="w-4 h-4 opacity-40" />
              </NavLink>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                setIsOpen(false);
                openEnquiryModal({
                  service: 'Website Development',
                  enquiryType: 'General',
                  sourcePage: 'Navbar Mobile Drawer',
                });
              }}
              className="navbar-cta-btn w-full justify-center"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-center text-xs text-gray-400">
              Need assistance? Call <a href="tel:+919039811558" className="text-[#fe8a04] underline font-bold">+91 9039811558</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
