import React, { useEffect } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useWebsite } from '../context/WebsiteContext';
import ContactCTA from '../components/home/ContactCTA';
import FAQSection from '../components/home/FAQSection';
import AchievementCounters from '../components/home/AchievementCounters';
import PageBanner from '../components/common/PageBanner';
import './ServicesPage.css';

const servicesData = [
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Services',
    subtitle: 'Our Services',
    description: 'We help businesses increase visibility, generate leads, and boost sales through tailored, result-driven digital strategies.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    features: [
      'Social Media Marketing',
      'Search Engine Optimization (SEO)',
      'Google & Meta Ads',
      'Lead Generation',
    ],
  },
  {
    id: 'website-development',
    title: 'Website Development Services',
    subtitle: 'Our Services',
    description: 'We build modern, high-performance websites that not only look great but also drive results and support your business growth.',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
    features: [
      'Custom Corporate & Business Websites',
      'High-Speed Modern Frameworks',
      'Responsive Mobile & Tablet Design',
      'Clean Coding Practices & Security',
    ],
  },
  {
    id: 'seo-specialist',
    title: 'SEO Specialist Services',
    subtitle: 'Our Services',
    description: 'Dominate organic search results, outrank competitors, and capture high-intent customers on Google.',
    image: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&w=800&q=80',
    features: [
      'Website SEO Audit',
      'Keyword Research & Strategy',
      'On-Page SEO',
      'Off-Page SEO & Link Building',
      'Local SEO',
      'Monthly Reporting & Analytics',
    ],
  },
  {
    id: 'social-media-marketing',
    title: 'Social Media Marketing Services',
    subtitle: 'Our Services',
    description: 'We help businesses build a strong online presence, engage their audience, and drive growth through strategic and creative social media campaigns.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    features: [
      'Social Media Strategy & Planning',
      'Content Creation & Design',
      'Profile Optimization',
      'Ad Campaign Management',
      'Community Management',
      'Analytics & Reporting',
    ],
  },
  {
    id: 'lead-generation',
    title: 'Lead Generation Services',
    subtitle: 'Our Services',
    description: 'We help you attract, capture, and convert high-quality leads that fuel your business growth with proven strategies and targeted campaigns.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    features: [
      'Targeted Campaigns- Meta Ads',
      'Landing Page & Funnel Creation',
      'Email Marketing Automation',
      'Social Media Lead Ads',
      'CRM Integration & Lead Management',
      'Performance Tracking & Reporting',
    ],
  },
];

const ServicesPage = () => {
  const { openEnquiryModal } = useWebsite();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Banner with exact reference text and image overlay */}
      <PageBanner
        badge="Our-services"
        title="Our Services"
        description="Delivering digital excellence through strategy, creativity, and technology to help your business grow."
      />

      {/* Services List with exact reference sections */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {servicesData.map((service, index) => {
            const isEven = index % 2 === 1;
            return (
              <div
                key={service.id}
                id={service.id}
                className={`service-feature-card service-feature-card-${index + 1} ${isEven ? 'alt' : ''} grid grid-cols-1 lg:grid-cols-12 gap-10 items-center`}
              >
                <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : ''}`}>
                  <div className="service-img-container rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-72 sm:h-80 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                <div className={`lg:col-span-7 space-y-4 ${isEven ? 'lg:order-1' : ''}`}>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fe8a04]/10 text-[#fe8a04] text-xs font-bold uppercase tracking-wider">
                    {service.subtitle}
                  </span>

                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#021343]">
                    {service.title}
                  </h2>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-[#fe8a04] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() =>
                        openEnquiryModal({
                          service: service.title.replace(/ Services?$/i, ''),
                          enquiryType: 'Service',
                          sourcePage: `Our Services - ${service.title}`,
                        })
                      }
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#fe8a04] to-[#ff5e13] text-white px-6 py-3 rounded-full font-bold text-sm shadow-glow-orange hover:shadow-orange-500/50 hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <span>Enquire Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() =>
                        openEnquiryModal({
                          service: service.title.replace(/ Services?$/i, ''),
                          enquiryType: 'Quote',
                          sourcePage: `Our Services - Quote - ${service.title}`,
                        })
                      }
                      className="inline-flex items-center gap-2 bg-[#021343] hover:bg-[#021343]/90 text-white px-5 py-3 rounded-full font-bold text-sm transition-all cursor-pointer border border-[#021343]"
                    >
                      <span>Request a Quote</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Achievement Counters */}
      <AchievementCounters />

      {/* FAQ / How to Contact Us & Order Services */}
      <FAQSection />

      {/* CTA */}
      <ContactCTA />
    </div>
  );
};

export default ServicesPage;
