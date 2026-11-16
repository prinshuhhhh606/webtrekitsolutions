import React from 'react';
import { Star, Quote } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import './TestimonialsSection.css';

const testimonialsList = [
  {
    clientName: 'John De',
    company: 'Invision Inc.',
    feedback: 'Webtrek IT Solutions is a reliable and creative digital partner. Their technical execution on our web portal and marketing campaigns drove incredible results.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    clientName: 'Romano',
    company: 'Lead Developer',
    feedback: 'High-performing, secure, and clean coding standards. Working with Webtrek made our system deployment smooth and on schedule.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    clientName: 'Radino',
    company: 'Store Manager',
    feedback: 'From initial consultation to final delivery, the team was responsive and focused on our business goals. Highly recommended for any serious business.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Client Reviews"
          title="What Our Clients Say"
          highlight="About Us"
          subtitle="Real feedback from founders, developers, and business managers who scaled with Webtrek IT Solutions."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsList.map((item, idx) => (
            <div key={idx} className="testimonial-card-box">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#fe8a04] text-[#fe8a04]" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-[#fe8a04]/20" />
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                  "{item.feedback}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <img
                  src={item.avatar}
                  alt={item.clientName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#fe8a04]/30"
                />
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#021343]">
                    {item.clientName}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {item.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
