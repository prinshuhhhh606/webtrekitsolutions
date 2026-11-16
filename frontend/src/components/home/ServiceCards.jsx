import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Code2, Share2, Briefcase } from 'lucide-react';
import './ServiceCards.css';

const services = [
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Service',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    theme: 'blue', // #314376
    overlayColor: 'rgba(49, 67, 118, 0.92)',
    buttonBg: '#fe8a04',
    buttonBorder: '#fe8a04',
    icon: TrendingUp,
    path: '/our-services#digital-marketing',
  },
  {
    id: 'website-development',
    title: 'Website Development',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    theme: 'orange', // #F66F0D
    overlayColor: 'rgba(246, 111, 13, 0.92)',
    buttonBg: '#314376',
    buttonBorder: '#314376',
    icon: Code2,
    path: '/our-services#website-development',
  },
  {
    id: 'social-media-marketing',
    title: 'Social Media Marketing',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    theme: 'blue', // #314376
    overlayColor: 'rgba(49, 67, 118, 0.92)',
    buttonBg: '#fe8a04',
    buttonBorder: '#fe8a04',
    icon: Share2,
    path: '/our-services#social-media-marketing',
  },
  {
    id: 'business-consultant',
    title: 'Business Consultant Service',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    theme: 'orange', // #F66F0D
    overlayColor: 'rgba(246, 111, 13, 0.92)',
    buttonBg: '#314376',
    buttonBorder: '#314376',
    icon: Briefcase,
    path: '/our-services#business-consulting',
  },
];

const ServiceCards = () => {
  return (
    <section className="webtrek-services-strip">
      <div className="webtrek-strip-grid">
        {services.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`webtrek-service-col theme-${item.theme}`}
            >
              {/* Background Photo */}
              <div
                className="webtrek-service-bg"
                style={{ backgroundImage: `url(${item.image})` }}
              />

              {/* Colored Translucent Overlay (#314376 or #F66F0D) */}
              <div
                className="webtrek-service-overlay"
                style={{ backgroundColor: item.overlayColor }}
              />

              {/* Content Box */}
              <div className="webtrek-service-content">
                <div className="webtrek-service-icon-wrap">
                  <Icon className="webtrek-service-icon" />
                </div>

                <h3 className="webtrek-service-title">
                  {item.title}
                </h3>

                <div className="webtrek-service-btn-wrap">
                  <Link
                    to={item.path}
                    className={`webtrek-learn-more-btn btn-${item.theme}`}
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ServiceCards;
