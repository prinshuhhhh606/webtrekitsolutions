import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Code2, Share2, Briefcase, Sparkles } from 'lucide-react';
import { useWebsite } from '../../context/WebsiteContext';
import './HeroSection.css';

const heroServices = [
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Service',
    icon: TrendingUp,
    path: '/our-services#digital-marketing',
  },
  {
    id: 'website-development',
    title: 'Website Development',
    icon: Code2,
    path: '/our-services#website-development',
  },
  {
    id: 'social-media-marketing',
    title: 'Social Media Marketing',
    icon: Share2,
    path: '/our-services#social-media-marketing',
  },
  {
    id: 'business-consulting',
    title: 'Business Consultant Service',
    icon: Briefcase,
    path: '/our-services#business-consulting',
  },
];

const HeroSection = () => {
  const { openEnquiryModal } = useWebsite();

  return (
    <section className="hero-banner-section">
      {/* Background Image Container with user provided image */}
      <div className="hero-banner-bg" />

      {/* Corporate Overlay matching webtrekitsolutions.in (#314376 with high contrast) */}
      <div className="hero-banner-overlay" />

      {/* Main Container */}
      <div className="hero-banner-container">
        {/* Banner Text Area (Centered like reference site) */}
        <div className="hero-text-wrapper">
          {/* Subtle Accent Pill */}
          <div className="hero-tag-badge">
            <Sparkles className="w-4 h-4 text-[#fe8a04]" />
            <span>Digital Agency & IT Solutions</span>
          </div>

          {/* Exact Heading */}
          <h1 className="hero-heading">
            Smart Partner For To{' '}
            <span className="hero-heading-highlight">Grow Your Best</span>{' '}
            Business
          </h1>

          {/* Exact Description */}
          <p className="hero-description">
            Webtrek builds responsive, high-performance websites tailored to your
            business goals. From corporate websites to e-commerce platforms,
            Digital marketing solutions, the team ensures a seamless user
            experience with modern design and clean coding practices.
          </p>

          {/* CTA Buttons */}
          <div className="hero-actions">
            <button
              onClick={() =>
                openEnquiryModal({
                  service: 'Website Development',
                  enquiryType: 'General',
                  sourcePage: 'Hero Banner Get Started',
                })
              }
              className="hero-btn-primary"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>

            <Link to="/our-services" className="hero-btn-secondary">
              <span>Our Services</span>
            </Link>
          </div>
        </div>

        {/* Four Service Boxes in One Row at the Bottom of Hero Banner */}
        <div className="hero-service-cards-row">
          {heroServices.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.id} className="hero-service-card">
                <div className="hero-card-header">
                  <div className="hero-card-icon-box">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="hero-card-title">{service.title}</h3>

                <div className="hero-card-action">
                  <Link to={service.path} className="hero-card-learn-btn">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
