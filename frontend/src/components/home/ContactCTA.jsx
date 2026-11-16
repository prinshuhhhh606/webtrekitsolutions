import React from 'react';
import { Phone, ArrowRight, Sparkles } from 'lucide-react';
import { useWebsite } from '../../context/WebsiteContext';
import './ContactCTA.css';

const ContactCTA = () => {
  const { openEnquiryModal, settings } = useWebsite();

  return (
    <section className="contact-cta-wrapper">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="contact-cta-pill">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Get More Customer Now & Lets 24 Hours Online</span>
        </div>

        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
          Are You Ready to{' '}
          <span className="gradient-text-orange inline-block">Grow Your Business?</span>
        </h2>

        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Webtrek IT Solutions is your perfect partner for digital success. With a focus on innovation, quality, and results, we deliver smart, tailored solutions that help businesses grow.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() =>
              openEnquiryModal({
                service: 'Website Development',
                enquiryType: 'Consultation',
                sourcePage: 'Footer CTA Section',
              })
            }
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#fe8a04] to-[#ff5e13] text-white px-8 py-4 rounded-full font-bold text-base shadow-glow-orange hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            href={`tel:${settings.phone?.replace(/[^0-9+]/g, '') || '+919039811558'}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 px-8 py-4 rounded-full font-bold text-base backdrop-blur-sm transition-all"
          >
            <Phone className="w-4 h-4 text-[#fe8a04]" />
            <span>Call: {settings.phone || '+91 9039811558'}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
