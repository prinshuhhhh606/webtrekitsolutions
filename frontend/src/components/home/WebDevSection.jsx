import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Zap, Code, Sparkles } from 'lucide-react';
import { useWebsite } from '../../context/WebsiteContext';
import './WebDevSection.css';

const WebDevSection = () => {
  const { openEnquiryModal } = useWebsite();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      title: 'Get More Customer Now & Lets 24 Hours Online',
      desc: 'Automate workflows, track performance with real-time analytics, and integrate smart tools that make your operations smoother and more efficient.',
    },
    {
      title: 'Scale Faster & Make Smarter Decisions',
      desc: 'From custom full-stack web platforms to targeted digital marketing campaigns—all backed by the right technology.',
    },
    {
      title: 'Audience Detail & Personalized Solutions',
      desc: 'We prioritize understanding your business goals to deliver personalized and impactful digital solutions.',
    },
    {
      title: 'Modern Architecture & Clean Coding',
      desc: 'Engineered for speed, high security, cross-device responsiveness, and measurable business growth.',
    },
  ];

  return (
    <section className="webdev-section-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual with Scroll-Triggered Entrance Animation */}
          <div className="lg:col-span-6 relative">
            <div
              ref={sectionRef}
              className={`webdev-visual-wrapper ${isVisible ? 'is-visible' : ''}`}
            >
              {/* Radiant Ambient Glow Behind Card */}
              <div className="webdev-ambient-glow" />

              <div className="webdev-image-card">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80"
                  alt="Web Development Architecture"
                  className="w-full h-[400px] sm:h-[440px] object-cover webdev-hero-img"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#021343]/90 via-[#021343]/30 to-transparent pointer-events-none" />

                {/* Floating All-in-One Package Card with Staggered Entrance & Ambient Float */}
                <div className="webdev-floating-card absolute bottom-6 left-6 right-6 text-white p-5 rounded-2xl">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#fe8a04]" />
                        <span className="text-xs uppercase text-[#fe8a04] font-extrabold tracking-wider">
                          All In One Package
                        </span>
                      </div>
                      <h4 className="font-heading font-extrabold text-lg sm:text-xl text-white tracking-tight">
                        Smart Digital Solutions
                      </h4>
                    </div>
                    <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/35 shrink-0 shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>24 Hours Online</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Information */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fe8a04]/10 text-[#fe8a04] text-xs font-bold uppercase tracking-wider border border-[#fe8a04]/20">
              <Code className="w-3.5 h-3.5" />
              <span>Digital Marketing Services</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#021343] tracking-tight leading-tight">
              Empowering Your Business with{' '}
              <span className="gradient-text-orange">Smart Digital Solutions</span>
            </h2>

            <p className="text-gray-600 text-base leading-relaxed">
              Automate workflows, track performance with real-time analytics, and integrate smart tools that make your operations smoother and more efficient. Scale faster and make smarter decisions—all backed by the right technology.
            </p>

            <div className="space-y-4 pt-2">
              {features.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-[#fe8a04]/10 text-[#fe8a04] flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-[#fe8a04]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() =>
                  openEnquiryModal({
                    service: 'Digital Marketing',
                    enquiryType: 'Service',
                    sourcePage: 'Home - Empowering Business Section',
                  })
                }
                className="webdev-cta-btn"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/our-services"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#021343] hover:text-[#fe8a04] px-4 py-2 transition-colors"
              >
                <span>Explore Services</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebDevSection;
