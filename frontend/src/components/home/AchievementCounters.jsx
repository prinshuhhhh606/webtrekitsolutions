import React from 'react';
import { Award, Users, CheckCircle, Smile } from 'lucide-react';
import './AchievementCounters.css';

const AchievementCounters = () => {
  const achievements = [
    {
      icon: Award,
      value: '150+',
      label: 'Project Complete',
      sub: 'Delivered web & digital solutions',
    },
    {
      icon: Users,
      value: '15+',
      label: 'Our Team',
      sub: 'Engineers, designers & marketers',
    },
    {
      icon: CheckCircle,
      value: '50+',
      label: 'Clients Subscription',
      sub: 'Ongoing monthly tech retainers',
    },
    {
      icon: Smile,
      value: '99%',
      label: 'Happy Clients',
      sub: 'Positive client testimonials',
    },
  ];

  return (
    <section className="achievement-section-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#fe8a04] text-xs font-bold uppercase tracking-wider mb-4 border border-[#fe8a04]/30">
            <span>Business Archivement</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
            Lets Know How Much Our{' '}
            <span className="gradient-text-orange">Archivements</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="achievement-card">
                <div className="achievement-card-icon">
                  <Icon className="w-7 h-7" />
                </div>
                <div className="achievement-value">
                  {item.value}
                </div>
                <h4 className="font-bold text-base text-gray-200 mb-1">{item.label}</h4>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AchievementCounters;
