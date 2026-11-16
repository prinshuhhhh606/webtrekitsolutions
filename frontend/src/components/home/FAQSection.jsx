import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useWebsite } from '../../context/WebsiteContext';
import SectionHeader from '../common/SectionHeader';
import './FAQSection.css';

const faqsData = [
  {
    id: 1,
    question: 'How To Order Service ?',
    isSteps: true,
    steps: [
      { step: 'Step 1: Reach Out', desc: 'Contact us via our online form, email, or call/WhatsApp at +91 9039811558.' },
      { step: 'Step 2: Tell Us What You Need', desc: 'Share your business goals, target audience, technical specifications, and timeline.' },
      { step: 'Step 3: Get a Free Quote', desc: 'We prepare a customized proposal with clear milestones and transparent pricing.' },
      { step: 'Step 4: Confirm & Begin', desc: 'Upon your confirmation, our engineering and marketing team kicks off your project!' },
    ],
  },
  {
    id: 2,
    question: 'Can I Make An Offer ?',
    answer: 'Yes! At Webtrek IT Solutions, we work closely with startups, growing businesses, and established enterprises. We provide tailored scopes and flexible pricing options to align with your exact budget and development requirements.',
  },
  {
    id: 3,
    question: 'How Long Guarante ?',
    answer: 'All our custom web development and software solutions include complimentary post-delivery warranty and dedicated bug-fix support. We also offer monthly maintenance retainers to ensure 24/7 security, high speed, and continuous updates.',
  },
  {
    id: 4,
    question: 'What services does Webtrek IT Solutions specialize in?',
    answer: 'Webtrek IT Solutions is a tech company specializing in innovative IT services and digital solutions. It offers web development, software solutions, mobile app development, digital marketing, and IT consulting, helping businesses grow through technology-driven strategies.',
  },
];

const FAQSection = ({ showHeader = true }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const { openEnquiryModal } = useWebsite();

  return (
    <section className="faq-section-wrapper">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <SectionHeader
            badge="Frequently Asked Question"
            title="How to Contact Us &"
            highlight="Order Services"
            subtitle="At Webtrek IT Solutions, getting started is simple! Whether you need web development, digital marketing, or custom IT services — we're here to help."
          />
        )}

        <div className="space-y-4">
          {faqsData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className={`faq-accordion-item ${isOpen ? 'active' : ''}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer focus:outline-none"
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
                  <div className="px-5 sm:px-6 pb-6 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.isSteps ? (
                      <div className="space-y-3">
                        {faq.steps.map((st, sIdx) => (
                          <div key={sIdx} className="faq-step-card">
                            <span className="faq-step-number">{st.step.split(':')[0]}</span>
                            <div>
                              <h5 className="font-bold text-gray-900 text-sm">
                                {st.step.split(':')[1]?.trim() || st.step}
                              </h5>
                              <p className="text-xs text-gray-500 mt-0.5">{st.desc}</p>
                            </div>
                          </div>
                        ))}
                        <div className="pt-2 text-center">
                          <button
                            onClick={() => openEnquiryModal('FAQ Order Service')}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#fe8a04] to-[#ff5e13] text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-glow-orange cursor-pointer"
                          >
                            <span>Start Step 1 Now</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p>{faq.answer}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
