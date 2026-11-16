import React, { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import WebDevSection from '../components/home/WebDevSection';
import AboutSection from '../components/home/AboutSection';
import BusinessValue from '../components/home/BusinessValue';
import AchievementCounters from '../components/home/AchievementCounters';
import TeamSection from '../components/home/TeamSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FAQSection from '../components/home/FAQSection';
import ContactCTA from '../components/home/ContactCTA';
import './HomePage.css';

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="homepage-container">
      <HeroSection />
      <AboutSection />
      <WebDevSection />
      <BusinessValue />
      <AchievementCounters />
      <TeamSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactCTA />
    </div>
  );
};

export default HomePage;
