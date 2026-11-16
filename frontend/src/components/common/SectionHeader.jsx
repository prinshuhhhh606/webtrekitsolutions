import React from 'react';
import './SectionHeader.css';

const SectionHeader = ({
  badge = '',
  title = '',
  highlight = '',
  subtitle = '',
  centered = true,
  isDark = false,
}) => {
  return (
    <div className={`section-header-wrapper ${centered ? 'section-header-centered' : 'max-w-2xl'}`}>
      {badge && (
        <div className={`section-header-badge ${isDark ? 'dark' : 'light'}`}>
          <span className="section-header-pulse"></span>
          <span>{badge}</span>
        </div>
      )}

      {title && (
        <h2 className={`section-header-title ${isDark ? 'dark' : 'light'}`}>
          {title}{' '}
          {highlight && (
            <span className="gradient-text-orange inline-block">
              {highlight}
            </span>
          )}
        </h2>
      )}

      {subtitle && (
        <p className={`section-header-subtitle ${isDark ? 'dark' : 'light'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
