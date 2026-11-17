import React, { useState, useEffect } from 'react';
import './InitialPageLoader.css';

const InitialPageLoader = () => {
  const [loading, setLoading] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

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
          <span className="ipl-logo-letter">W</span>
        </div>
        <h1 className="ipl-brand-name">
          WEBTREK<span>.</span>
        </h1>
        <p className="ipl-tagline">IT Solutions & Digital Agency</p>

        <div className="ipl-progress-track">
          <div className="ipl-progress-bar" />
        </div>
        <span className="ipl-status-text">INITIALIZING EXPERIENCE</span>
      </div>
    </div>
  );
};

export default InitialPageLoader;
