import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight, Home } from 'lucide-react';
import './PageBanner.css';

const PageBanner = ({
  badge,
  title,
  highlight,
  description,
  breadcrumbs = [],
  bgImage,
}) => {
  return (
    <section className="page-inner-banner">
      {/* Background Image Layer (same as Home hero banner) */}
      <div
        className="page-banner-bg"
        style={bgImage ? { backgroundImage: `url('${bgImage}'), url('/images/hero-banner.jpg')` } : {}}
      />

      {/* Corporate High-Contrast Overlay */}
      <div className="page-banner-overlay" />

      {/* Subtle Pattern Grid Overlay */}
      <div className="page-banner-pattern" />

      {/* Content Container */}
      <div className="page-banner-container">
        {/* Breadcrumb Navigation */}
        <nav className="page-banner-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-item">
            <Home className="w-3.5 h-3.5 text-[#fe8a04]" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {crumb.path ? (
                <Link to={crumb.path} className="breadcrumb-item">
                  {crumb.label}
                </Link>
              ) : (
                <span className="breadcrumb-item active">{crumb.label}</span>
              )}
              {idx < breadcrumbs.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              )}
            </React.Fragment>
          ))}
          {breadcrumbs.length === 0 && (
            <span className="breadcrumb-item active">{badge || title}</span>
          )}
        </nav>

        {/* Accent Tag / Badge */}
        {badge && (
          <div className="page-banner-badge">
            <Sparkles className="w-3.5 h-3.5 text-[#fe8a04]" />
            <span>{badge}</span>
          </div>
        )}

        {/* Exact Title */}
        <h1 className="page-banner-title">
          {title}{' '}
          {highlight && <span className="title-highlight">{highlight}</span>}
        </h1>

        {/* Exact Description */}
        {description && (
          <p className="page-banner-description">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};

export default PageBanner;

