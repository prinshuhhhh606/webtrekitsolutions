import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, ExternalLink, Sparkles } from 'lucide-react';
import { useWebsite } from '../../context/WebsiteContext';
import { projectsService } from '../../services/api';
import SectionHeader from '../common/SectionHeader';
import { ProjectCardSkeleton } from '../common/Shimmer';
import './HomeProjectsSection.css';

const defaultFeatured = [
  {
    id: 1,
    title: 'Company Profile Web Development',
    price: '$65',
    category: 'Website Development',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
    description: 'Modern, high-performance corporate presence that establishes authority and drives business inquiries.',
    liveUrl: 'https://webtrekitsolutions.in/',
    slug: 'company-profile-web-development',
  },
  {
    id: 2,
    title: 'Graphic Design Monthly Subscription',
    price: '$65',
    category: 'Digital Marketing',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    description: 'High-impact brand creatives, social media banners, and digital graphics tailored for your monthly marketing strategy.',
    liveUrl: 'https://webtrekitsolutions.in/our-project/',
    slug: 'graphic-design-monthly-subscription',
  },
  {
    id: 3,
    title: 'Ecommerce Presentation Startup',
    price: '$65',
    category: 'Consultant Business',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    description: 'Pitch decks, product roadmaps, and business deck architecture designed for innovative retail startups.',
    liveUrl: 'https://webtrekitsolutions.in/our-project/',
    slug: 'ecommerce-presentation-startup',
  },
  {
    id: 4,
    title: 'Grow Social Media Marketing Business',
    price: '$65',
    category: 'Digital Marketing',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    description: 'Community building, organic storytelling, and targeted customer engagement on Instagram, LinkedIn, and Meta.',
    liveUrl: 'https://webtrekitsolutions.in/our-project/',
    slug: 'grow-social-media-marketing-business',
  },
  {
    id: 5,
    title: 'Photography Ads For Business Media',
    price: '$65',
    category: 'Digital Marketing',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
    description: 'Visual advertising creatives, product photoshoot concepts, and high-CTR social ad creatives.',
    liveUrl: 'https://webtrekitsolutions.in/our-project/',
    slug: 'photography-ads-for-business-media',
  },
  {
    id: 6,
    title: 'Comeback & Grow Business Services',
    price: '$65',
    category: 'Consultant Business',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    description: 'Holistic business turnaround consulting, digital optimization, and revenue recovery roadmaps.',
    liveUrl: 'https://webtrekitsolutions.in/our-project/',
    slug: 'comeback-and-grow-business-services',
  },
];

const HomeProjectsSection = () => {
  const [projects, setProjects] = useState(defaultFeatured);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const { openEnquiryModal } = useWebsite();

  const scrollRef = useRef(null);

  // Mouse drag state
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const isDraggingState = useRef(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectsService.getAll();
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          setProjects(res.data.data);
        }
      } catch (err) {
        // Fallback to defaultFeatured
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Direct Mouse Wheel Horizontal Scroll Listener
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > 0) {
        // Prevent default vertical window scroll and convert directly to horizontal scroll
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.35;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Update active center card on scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    let closestIdx = 0;
    let closestDist = Infinity;

    const cards = container.querySelectorAll('.coverflow-slide');
    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });

    if (closestIdx !== activeIndex) {
      setActiveIndex(closestIdx);
    }
  };

  const scrollToCard = (idx) => {
    if (!scrollRef.current) return;
    const cards = scrollRef.current.querySelectorAll('.coverflow-slide');
    if (cards[idx]) {
      const container = scrollRef.current;
      const card = cards[idx];
      const targetScroll = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  // Mouse Drag Handlers for Smooth Panning
  const handleMouseDown = (e) => {
    if (e.button !== 0 || !scrollRef.current) return;
    isDownRef.current = true;
    isDraggingState.current = false;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDownRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    if (Math.abs(walk) > 5) {
      isDraggingState.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDownRef.current = false;
    setTimeout(() => {
      isDraggingState.current = false;
    }, 60);
  };

  const handleMouseLeave = () => {
    isDownRef.current = false;
    setTimeout(() => {
      isDraggingState.current = false;
    }, 60);
  };

  return (
    <section className="home-projects-section py-20 bg-[#fafbfc] overflow-hidden">
      {/* Kept 100% Inside Page Container to prevent spilling right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <SectionHeader
            badge="Case Studies & Deliverables"
            title="Our Featured"
            highlight="Projects"
            subtitle="Explore our proven digital solutions, web applications, and marketing deliverables crafted for real business results."
          />
        </div>

        {/* Direct Mouse Wheel & Drag Horizontal Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="horizontal-projects-scroll-wrapper"
        >
          {loading ? (
            <div className="horizontal-projects-track">
              <ProjectCardSkeleton count={4} />
            </div>
          ) : (
            <div className="horizontal-projects-track content-fade-in">
              {projects.map((project, idx) => {
                const isCenter = idx === activeIndex;

                return (
                  <div
                    key={project._id || project.id}
                    onClick={() => {
                      if (!isDraggingState.current && !isCenter) {
                        scrollToCard(idx);
                      }
                    }}
                    className={`coverflow-slide ${isCenter ? 'is-active' : ''}`}
                  >
                    <div className="project-item-card flex flex-col justify-between h-full">
                      <div>
                        {/* Project Image Container with Overflow Hidden for Zoom Animation */}
                        <div className="project-img-wrapper relative h-60 w-full overflow-hidden bg-gray-200">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            draggable={false}
                          />

                          {/* Dark Gradient Overlay */}
                          <div className="project-img-overlay" />

                          {/* Category Badge */}
                          <div className="absolute top-4 left-4 bg-[#021343]/90 text-[#fe8a04] text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-sm z-10">
                            {project.category}
                          </div>

                          {/* Price Tag */}
                          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-[#fe8a04] to-[#ff5e13] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                            {project.price || '$65'}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="project-card-title font-heading font-bold text-xl text-[#021343] mb-3 leading-snug line-clamp-2">
                            {project.title}
                          </h3>
                          <p className="project-card-desc text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                            {project.description || project.shortDescription}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="p-6 pt-0 border-t border-gray-100 space-y-3 mt-auto">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            Starting Package
                          </span>
                          <span className="text-base font-extrabold text-[#021343]">
                            {project.price || '$65'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <Link
                            to={`/our-project/${project.slug || project._id || project.id}`}
                            onClick={(e) => {
                              if (isDraggingState.current) e.preventDefault();
                            }}
                            className="project-view-btn flex-1 min-w-[100px] inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#021343] bg-gray-100 hover:bg-[#021343] hover:text-white transition-all cursor-pointer border border-gray-200"
                            title="View Project Case Study"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </Link>

                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                if (isDraggingState.current) e.preventDefault();
                              }}
                              className="project-live-btn inline-flex items-center justify-center p-2.5 rounded-xl text-gray-600 bg-white hover:bg-gray-100 hover:text-[#021343] transition-all cursor-pointer border border-gray-200"
                              title="Visit Live Website"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-[#fe8a04]" />
                            </a>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isDraggingState.current) return;
                              openEnquiryModal({
                                enquiryType: 'Project',
                                relatedProject: project.title,
                                service: project.category?.includes('Marketing')
                                  ? 'Digital Marketing'
                                  : project.category?.includes('Web')
                                  ? 'Website Development'
                                  : 'Business Consultancy',
                                sourcePage: `Home Featured Projects - ${project.title}`,
                              });
                            }}
                            className="project-similar-btn flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#fe8a04] to-[#ff5e13] hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
                          >
                            <span>Similar Project</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Interactive Dot Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {projects.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => scrollToCard(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`coverflow-dot ${dotIdx === activeIndex ? 'active' : ''}`}
            />
          ))}
        </div>

        {/* View All Projects Bottom Link */}
        <div className="mt-10 text-center">
          <Link
            to="/our-project"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm text-white bg-[#021343] hover:bg-[#fe8a04] shadow-md hover:shadow-orange-500/30 transition-all duration-300 group cursor-pointer"
          >
            <span>Explore All Projects</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeProjectsSection;
