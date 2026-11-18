import React from 'react';
import './Shimmer.css';

/**
 * Base generic Shimmer box
 */
export const Shimmer = ({
  className = '',
  width,
  height,
  rounded = 'rounded-lg',
  isDark = false,
  style = {},
}) => {
  return (
    <div
      className={`shimmer-element ${isDark ? 'shimmer-element-dark' : ''} ${rounded} ${className}`}
      style={{
        width: width || undefined,
        height: height || undefined,
        ...style,
      }}
    />
  );
};

/**
 * Reusable Multiline Text Skeleton
 */
export const TextSkeleton = ({ lines = 3, isDark = false, className = '' }) => {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer
          key={i}
          isDark={isDark}
          height="14px"
          rounded="rounded-md"
          className={i === lines - 1 ? 'w-3/5' : 'w-full'}
        />
      ))}
    </div>
  );
};

/**
 * Reusable Image Skeleton Placeholder
 */
export const ImageSkeleton = ({
  height = '240px',
  rounded = 'rounded-2xl',
  isDark = false,
  className = '',
}) => {
  return (
    <Shimmer
      isDark={isDark}
      height={height}
      rounded={rounded}
      className={`w-full ${className}`}
    />
  );
};

/**
 * Exact-dimension Coverflow Carousel Project Shimmer Skeleton
 * Perfectly matches .coverflow-slide and .project-item-card dimensions (width, height, padding, borders)
 * Eliminates all layout shift during initial load
 */
export const HomeProjectCarouselSkeleton = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => {
        const isCenter = idx === 1; // Highlight the 2nd slide as center during initial shimmer
        return (
          <div
            key={idx}
            className={`coverflow-slide ${isCenter ? 'is-active' : ''}`}
            aria-hidden="true"
          >
            <div className="project-item-card flex flex-col justify-between h-full bg-white rounded-3xl overflow-hidden border border-gray-200">
              <div>
                {/* 1. Exact Image Container (h-60 = 240px) */}
                <div className="project-img-wrapper relative h-60 w-full overflow-hidden bg-gray-100">
                  <Shimmer height="100%" rounded="rounded-none" className="w-full" />

                  {/* Category Badge Placeholder */}
                  <div className="absolute top-4 left-4 z-10">
                    <Shimmer height="22px" width="110px" rounded="rounded-full" />
                  </div>

                  {/* Price Tag Placeholder */}
                  <div className="absolute bottom-4 right-4 z-10">
                    <Shimmer height="24px" width="70px" rounded="rounded-full" />
                  </div>
                </div>

                {/* 2. Exact Content Container (Title + Description) */}
                <div className="p-4 sm:p-6 space-y-3">
                  <Shimmer height="22px" width="85%" rounded="rounded-lg" />
                  <div className="space-y-2 pt-1">
                    <Shimmer height="14px" width="100%" rounded="rounded" />
                    <Shimmer height="14px" width="75%" rounded="rounded" />
                  </div>
                </div>
              </div>

              {/* 3. Exact Action Buttons Container */}
              <div className="p-4 sm:p-6 pt-0 border-t border-gray-100 flex items-center justify-between gap-2 sm:gap-3 mt-4">
                <Shimmer height="38px" className="flex-1" rounded="rounded-xl" />
                <Shimmer height="38px" className="flex-1" rounded="rounded-xl" />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

/**
 * Project / Portfolio Card Skeleton
 */
export const ProjectCardSkeleton = ({ count = 3, isGrid = true }) => {
  const cards = Array.from({ length: count });

  const renderCard = (key) => (
    <div key={key} className="skeleton-project-card">
      <div>
        {/* Card Image */}
        <Shimmer height="240px" rounded="rounded-t-3xl" className="w-full" />
        
        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Shimmer height="18px" width="100px" rounded="rounded-full" />
            <Shimmer height="20px" width="60px" rounded="rounded-full" />
          </div>
          <Shimmer height="24px" width="85%" rounded="rounded-md" />
          <TextSkeleton lines={2} />
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between gap-3 mt-auto">
        <Shimmer height="38px" width="48%" rounded="rounded-xl" />
        <Shimmer height="38px" width="48%" rounded="rounded-xl" />
      </div>
    </div>
  );

  if (!isGrid) {
    return <>{cards.map((_, i) => renderCard(i))}</>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {cards.map((_, i) => renderCard(i))}
    </div>
  );
};

/**
 * Blog Article Card Skeleton
 */
export const BlogCardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-blog-card">
          <div>
            <Shimmer height="224px" rounded="rounded-t-3xl" className="w-full" />
            <div className="p-6 space-y-3.5">
              <div className="flex items-center gap-3">
                <Shimmer height="14px" width="80px" rounded="rounded-full" />
                <Shimmer height="14px" width="65px" rounded="rounded-full" />
              </div>
              <Shimmer height="22px" width="90%" rounded="rounded-md" />
              <Shimmer height="18px" width="70%" rounded="rounded-md" />
              <TextSkeleton lines={2} />
            </div>
          </div>
          <div className="p-6 pt-0 flex items-center justify-between border-t border-gray-100 mt-auto">
            <Shimmer height="16px" width="100px" rounded="rounded-md" />
            <Shimmer height="16px" width="20px" rounded="rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Service Card Skeleton (Hero or Services Strip)
 */
export const ServiceCardSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-service-card">
          <div className="flex items-center justify-between mb-4">
            <Shimmer height="56px" width="56px" rounded="rounded-2xl" />
            <Shimmer height="28px" width="36px" rounded="rounded-md" />
          </div>
          <div className="space-y-2 mb-6">
            <Shimmer height="20px" width="80%" rounded="rounded-md" />
            <Shimmer height="16px" width="60%" rounded="rounded-md" />
          </div>
          <div className="pt-3 border-t border-gray-100 mt-auto">
            <Shimmer height="38px" width="100%" rounded="rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Hero Section Skeleton
 */
export const HeroSkeleton = () => {
  return (
    <div className="skeleton-hero-banner">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center space-y-6 pt-10">
        <Shimmer isDark={true} height="28px" width="220px" rounded="rounded-full" />
        <Shimmer isDark={true} height="48px" width="80%" rounded="rounded-xl" />
        <Shimmer isDark={true} height="40px" width="60%" rounded="rounded-xl" />
        <div className="w-full max-w-xl space-y-2 pt-2">
          <Shimmer isDark={true} height="14px" width="100%" rounded="rounded-md" />
          <Shimmer isDark={true} height="14px" width="85%" rounded="rounded-md" />
        </div>
        <div className="flex items-center gap-4 pt-4">
          <Shimmer isDark={true} height="48px" width="160px" rounded="rounded-full" />
          <Shimmer isDark={true} height="48px" width="150px" rounded="rounded-full" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto w-full pt-16">
        <ServiceCardSkeleton count={4} />
      </div>
    </div>
  );
};

export default Shimmer;
