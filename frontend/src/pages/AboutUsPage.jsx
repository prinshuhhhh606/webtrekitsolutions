import React, { useEffect } from 'react';
import { Target, Compass, Award, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useWebsite } from '../context/WebsiteContext';
import TeamSection from '../components/home/TeamSection';
import ContactCTA from '../components/home/ContactCTA';
import SectionHeader from '../components/common/SectionHeader';
import PageBanner from '../components/common/PageBanner';
import './AboutUsPage.css';

const AboutUsPage = () => {
  const { openEnquiryModal } = useWebsite();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const skills = [
    { name: 'Web Development & E-Commerce', level: 98 },
    { name: 'Digital Marketing & Lead Generation', level: 95 },
    { name: 'SEO & Search Engine Optimization', level: 94 },
    { name: 'UI/UX Design & Branding', level: 92 },
  ];

  const workPriorities = [
    {
      title: 'Your Satisfaction',
      desc: 'We focus on delivering results that meet your business goals and exceed expectations.',
    },
    {
      title: 'Quality & Innovation',
      desc: 'Whether it is web development or digital marketing, we ensure high standards and creative solutions.',
    },
    {
      title: 'On Time Work',
      desc: 'We respect your time. Every project is managed with clear timelines and consistent updates.',
    },
  ];

  const businessValues = [
    {
      title: 'Client Success First',
      desc: 'Your growth is our priority—we align every solution with your business goals.',
    },
    {
      title: 'Transparent Communication',
      desc: 'Clear, honest updates and collaboration at every stage of the project.',
    },
    {
      title: 'Fast & Perfect Work',
      desc: 'No one-size-fits-all—we deliver strategies tailored to your unique needs.',
    },
    {
      title: 'Quality & Reliability',
      desc: 'We take pride in delivering high-performing, secure, and dependable results.',
    },
    {
      title: 'Long-Term Partnership',
      desc: 'We’re not just service providers—we aim to be your trusted digital growth partner.',
    },
    {
      title: 'Continuous Support',
      desc: 'Our support continues even after delivery to keep your systems running at peak performance.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Banner with exact reference text and image overlay */}
      <PageBanner
        badge="About us"
        title="About-US"
        description="We are a creative digital agency for the modern world. We combine creativity, technology, and strategy to deliver impactful digital solutions for businesses worldwide."
      />

      {/* Section 1: Our Work Priority Is */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Best Work For You"
            title="Our Work Priority"
            highlight="Is"
            subtitle="Our core focus is delivering results that meet your business goals and exceed expectations."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workPriorities.map((item, idx) => (
              <div key={idx} className="about-priority-card">
                <div className="text-3xl font-heading font-black text-[#fe8a04] mb-3">
                  0{idx + 1}.
                </div>
                <h4 className="font-heading font-bold text-xl text-[#021343] mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Who We Are ? */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#fe8a04]">
                Who We Are ?
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#021343] leading-tight">
                We Are a Creative Digital Agency for the Modern World
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                We combine creativity, technology, and strategy to deliver impactful digital solutions for businesses worldwide:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-semibold text-gray-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#fe8a04]" />
                  <span>Innovative Design</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#fe8a04]" />
                  <span>Strategic Digital Marketing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#fe8a04]" />
                  <span>Custom Web & App Development</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#fe8a04]" />
                  <span>Strong Brand Identity</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#fe8a04]" />
                  <span>End-to-End Solutions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#fe8a04]" />
                  <span>Global Reach, Local Focus</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => openEnquiryModal('About Agency Get Started')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#fe8a04] to-[#ff5e13] text-white px-7 py-3 rounded-full font-bold text-sm shadow-glow-orange cursor-pointer"
                >
                  <span>Get Started With Us</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
                  alt="Webtrek Agency Modern World"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Our Business Values for Clients */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Why Choice Us"
            title="Our Business Values"
            highlight="for Clients"
            subtitle="Our core commitments that ensure your peace of mind and sustained digital growth."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessValues.map((val, idx) => (
              <div key={idx} className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all">
                <h4 className="font-heading font-bold text-lg text-[#021343] mb-2">
                  {val.title}
                </h4>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Know More Our Team Skill */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#fe8a04]">
                Team Skill Bar
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#021343] leading-tight">
                Know More Our Team Skill
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Whether it's web development, digital marketing, or complex software architectures, our specialists ensure high standards and creative solutions.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-5">
              {skills.map((skill, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>{skill.name}</span>
                    <span className="text-[#fe8a04]">{skill.level}%</span>
                  </div>
                  <div className="skill-bar-track">
                    <div
                      className="skill-bar-fill"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Our Vision & Mission */}
      <section className="py-20 bg-[#021343] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Our Vision & Mission"
            title="We Help Improve & Grow Online-Based"
            highlight="Businesses Worldwide"
            subtitle="Delivering strategic digital marketing, high-performance web platforms, and data-driven growth solutions."
            isDark={true}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#fe8a04]/40 transition-all">
              <h4 className="font-heading font-bold text-lg text-white mb-2">Strategic Digital Marketing</h4>
              <p className="text-xs text-gray-300 leading-relaxed">Tailored PPC campaigns and social media funnels engineered for high ROI.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#fe8a04]/40 transition-all">
              <h4 className="font-heading font-bold text-lg text-white mb-2">High-Performance Websites & E-commerce</h4>
              <p className="text-xs text-gray-300 leading-relaxed">Sub-second load times, modern clean coding, and seamless checkout journeys.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#fe8a04]/40 transition-all">
              <h4 className="font-heading font-bold text-lg text-white mb-2">Data-Driven Growth Solutions</h4>
              <p className="text-xs text-gray-300 leading-relaxed">Real-time performance tracking and CRM automation that scales business.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#fe8a04]/40 transition-all">
              <h4 className="font-heading font-bold text-lg text-white mb-2">Global Reach, Local Impact</h4>
              <p className="text-xs text-gray-300 leading-relaxed">Serving ambitious businesses from Indore to international markets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Our Best Team */}
      <TeamSection />

      {/* Section 7: Webtrek IT Solutions – The Perfect Solution for Your Business */}
      <ContactCTA />
    </div>
  );
};

export default AboutUsPage;
