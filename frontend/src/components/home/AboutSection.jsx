import React from 'react';
import { Lightbulb, Layers, Handshake, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './AboutSection.css';

const AboutSection = () => {
  const cards = [
    {
      id: 'smart-solutions',
      icon: Lightbulb,
      title: 'Smart & Innovative Solutions',
      description:
        'Leveraging the latest technologies like AI, cloud, and automation, digital solutions help businesses streamline operations, reduce costs, and stay competitive with intelligent strategies.',
      theme: 'blue', // #314376 background
    },
    {
      id: 'digital-transformation',
      icon: Layers,
      title: 'End-to-End Digital Transformation',
      description:
        'From strategy to execution, digital solutions cover the full spectrum-website development, CRM integration, data analytics, and more-to drive complete business modernization.',
      theme: 'orange', // #F66F0D background
    },
    {
      id: 'trusted-partner',
      icon: Handshake,
      title: 'Trusted Digital Partner',
      description:
        'A reliable digital solutions provider acts as a long-term partner, offering consistent support, expert guidance, and scalable services tailored to evolving business needs.',
      theme: 'white', // White card with #F66F0D icon, hover to #314376
    },
  ];

  return (
    <section className="webtrek-perfect-solution-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header: 2 Columns (50% / 50%) matching reference site */}
        <div className="webtrek-solution-header-grid">
          {/* Left Column: Subtitle + Main Heading */}
          <div className="webtrek-solution-header-left">
            <span className="webtrek-solution-subtitle">
              Grow Your Business
            </span>
            <h2 className="webtrek-solution-title">
              We Are Perfect Solution For Your Business
            </h2>
          </div>

          {/* Right Column: Paragraph */}
          <div className="webtrek-solution-header-right">
            <p className="webtrek-solution-desc">
              <strong>Webtrek IT Solutions</strong> is your perfect partner for
              digital success. We offer a complete range of IT services including
              web development, mobile app creation, custom software, digital
              marketing, and IT consulting. With a focus on innovation, quality,
              and results, we deliver smart, tailored solutions that help
              businesses grow, streamline operations, and stay ahead in the
              digital world.
            </p>
          </div>
        </div>

        {/* 3 Interactive Cards matching Elementor Infoboxes */}
        <div className="webtrek-solution-cards-grid">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`webtrek-infobox card-theme-${card.theme}`}
              >
                <div className="webtrek-infobox-icon-wrap">
                  <Icon className="webtrek-infobox-icon" />
                </div>
                <h3 className="webtrek-infobox-title">{card.title}</h3>
                <p className="webtrek-infobox-text">{card.description}</p>
              </div>
            );
          })}
        </div>

        {/* Action Link to About Us */}
        <div className="webtrek-solution-cta">
          <Link to="/about-us" className="webtrek-solution-btn">
            <span>Learn More About Us</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
