import React, { useState, useEffect } from 'react';
import { useWebsite } from '../../context/WebsiteContext';
import './InitialPageLoader.css';

const InitialPageLoader = () => {
  const [loading, setLoading] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const { websiteName } = useWebsite();

  const brandParts = (websiteName || 'Webtrek IT Solutions').trim().split(' ');
  const brandFirst = brandParts[0] || 'WEBTREK';
  const brandRest = brandParts.slice(1).join(' ') || 'IT Solutions & Digital Agency';

  useEffect(() => {
    // Check if initial loader has already been shown during this tab session
    const hasLoaded = sessionStorage.getItem('webtrek_initial_loaded');
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setFadingOut(true);
      const removeTimer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem('webtrek_initial_loaded', 'true');
      }, 500); // Wait for CSS fade-out transition
      return () => clearTimeout(removeTimer);
    }, 900); // Snappy duration: shows brand reveal without delaying user

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className={`initial-page-loader-overlay ${fadingOut ? 'fade-out' : ''}`} aria-hidden={fadingOut}>
      <div className="ipl-ambient-glow" />
      <div className="ipl-content">
        <div className="ipl-logo-badge">
          <span className="ipl-logo-letter">{brandFirst.charAt(0).toUpperCase()}</span>
        </div>
        <h1 className="ipl-brand-name">
          {brandFirst.toUpperCase()}<span>.</span>
        </h1>
        <p className="ipl-tagline">{brandRest}</p>

        <div className="ipl-progress-track">
          <div className="ipl-progress-bar" />
        </div>
        <span className="ipl-status-text">INITIALIZING EXPERIENCE</span>
      </div>
    </div>
  );
};

export default InitialPageLoader;
