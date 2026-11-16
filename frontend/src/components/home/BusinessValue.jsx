import React, { useState, useEffect, useRef } from 'react';
import { Users, Lightbulb, Clock, Handshake, TrendingUp, ShieldCheck } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import './BusinessValue.css';

const values = [
  {
    icon: Users,
    title: 'Client-Centric Approach',
    desc: 'We prioritize understanding your goals to deliver personalized and impactful solutions.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation-Driven',
    desc: 'We embrace the latest technologies to create smart, future-ready digital experiences.',
  },
  {
    icon: Clock,
    title: 'Timely Delivery',
    desc: 'We value your time—every project is executed with efficiency and clear deadlines.',
  },
  {
    icon: Handshake,
    title: 'Trusted Partnership',
    desc: 'We believe in building long-term relationships through honesty, collaboration, and ongoing support.',
  },
  {
    icon: TrendingUp,
    title: 'Scalable Solutions',
    desc: 'Our services are designed to grow with your business, ensuring lasting value.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality & Reliability',
    desc: 'From clean code to strategic marketing, we maintain high standards in everything we do.',
  },
];

const BusinessValue = () => {
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else if (entry.boundingClientRect.top > 0) {
          // Reset when scrolled back above, so it re-triggers smoothly when scrolling down again
          setIsVisible(false);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="business-value-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Why Choose Us"
          title="Our Business"
          highlight="Value"
          subtitle="Discover how our dedicated principles create smart, dependable digital experiences for your brand."
          isDark={true}
        />

        <div
          ref={gridRef}
          className={`business-value-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${
            isVisible ? 'is-visible' : ''
          }`}
        >
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="business-value-card"
                style={{
                  transitionDelay: isVisible ? `${idx * 110}ms` : '0ms',
                }}
              >
                <div className="business-value-icon">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="font-heading font-bold text-xl text-white mb-3">
                  {val.title}
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BusinessValue;
