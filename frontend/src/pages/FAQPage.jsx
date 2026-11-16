import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ArrowRight } from 'lucide-react';
import { useWebsite } from '../context/WebsiteContext';
import ContactCTA from '../components/home/ContactCTA';
import SectionHeader from '../components/common/SectionHeader';
import './FAQPage.css';

const faqsList = [
  {
    id: 1,
    category: 'How to Order',
    question: 'How To Order Service ?',
    answer: 'At Webtrek IT Solutions, getting started is simple! Step 1: Reach Out via form/call. Step 2: Tell Us What You Need. Step 3: Get a Free Quote with clear scope and milestones. Step 4: Confirm & Begin.',
  },
  {
    id: 2,
    category: 'General',
    question: 'Can I Make An Offer ?',
    answer: 'Yes! We provide tailored scopes and flexible pricing options to align with your business budget and exact development requirements.',
  },
  {
    id: 3,
    category: 'Support',
    question: 'How Long Guarante ?',
    answer: 'All our custom web development and software solutions include post-delivery warranty and dedicated bug-fix support, with ongoing monthly maintenance packages available.',
  },
  {
    id: 4,
    category: 'Services',
    question: 'What IT services do you specialize in?',
    answer: 'Webtrek IT Solutions is a tech company specializing in innovative IT services and digital solutions. It offers web development, software solutions, mobile app development, digital marketing, and IT consulting, helping businesses grow through technology-driven strategies.',
  },
  {
    id: 5,
    category: 'Location',
    question: 'Where is your office located?',
    answer: 'Our main office is situated at 328 Patnipura, Main Road, Indore, Madhya Pradesh. We serve clients locally in Indore as well as nationally and internationally.',
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const { openEnquiryModal } = useWebsite();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredFaqs = faqsList.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Banner with exact reference text */}
      <section className="faqpage-hero-banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#fe8a04] text-xs font-bold uppercase tracking-wider mb-4 border border-[#fe8a04]/30">
            <span>Frequently Asked Question</span>
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4">
            How to Contact Us &{' '}
            <span className="gradient-text-orange">Order Services</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            At Webtrek IT Solutions, getting started is simple! Whether you need web development, digital marketing, or custom IT services — we're here to help.
          </p>

          <div className="max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search frequently asked questions..."
              className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:bg-white/15 focus:border-[#fe8a04] backdrop-blur-md transition-all text-sm"
            />
          </div>
        </div>
      </section>

      {/* FAQ Accordion List */}
      <section className="py-20 bg-white">
        <div className="faq-card-container">
          <SectionHeader
            badge="Frequently Asked Question"
            title="Ask Question"
            highlight="More"
            subtitle="Find quick answers to common queries regarding ordering services, guarantees, and pricing."
          />

          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-[#fe8a04]/40 bg-[#f8fafc] shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none"
                  >
                    <span className="font-heading font-bold text-base sm:text-lg text-[#021343] pr-4">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'bg-[#fe8a04] text-white rotate-180'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-16 p-8 rounded-3xl bg-[#f8fafc] border border-gray-200 text-center space-y-4">
            <h3 className="font-heading font-bold text-xl text-[#021343]">
              Ready to Order a Service?
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Contact Webtrek IT Solutions today to discuss your website or marketing requirements.
            </p>
            <button
              onClick={() => openEnquiryModal('FAQ Direct Enquiry')}
              className="inline-flex items-center gap-2 bg-[#021343] hover:bg-[#fe8a04] text-white px-7 py-3 rounded-full font-bold text-sm transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <ContactCTA />
    </div>
  );
};

export default FAQPage;
