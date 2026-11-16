import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, Eye } from 'lucide-react';
import { useWebsite } from '../context/WebsiteContext';
import { projectsService } from '../services/api';
import ContactCTA from '../components/home/ContactCTA';
import TestimonialsSection from '../components/home/TestimonialsSection';
import SectionHeader from '../components/common/SectionHeader';
import PageBanner from '../components/common/PageBanner';
import './PortfolioPage.css';

const portfolioItems = [
  {
    id: 1,
    title: 'OmniTrade - NextGen E-Commerce Suite',
    category: 'E-Commerce',
    client: 'OmniTrade Retail Ltd.',
    description: 'A headless enterprise e-commerce portal with real-time stock sync, AI recommendations, and multi-currency checkout.',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    stats: '+140% Conversion Growth',
    liveUrl: 'https://webtrekitsolutions.in/portfolio/',
  },
  {
    id: 2,
    title: 'FinEdge - Real-Time Wealth & Investment App',
    category: 'Mobile App',
    client: 'FinEdge Capital Group',
    description: 'Cross-platform mobile fintech app enabling automated SIP investments, portfolio rebalancing, and instant UPI transfers.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    stats: '50,000+ Downloads',
    liveUrl: 'https://webtrekitsolutions.in/portfolio/',
  },
  {
    id: 3,
    title: 'Skyline Real Estate & Property Discovery',
    category: 'Web Development',
    client: 'Skyline Realty Global',
    description: 'High-converting real estate platform with 3D virtual property tours, live map exploration, and instant agent booking.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    stats: '3.5x More Inquiries',
    liveUrl: 'https://webtrekitsolutions.in/portfolio/',
  },
  {
    id: 4,
    title: 'PulseGrowth - 360° Digital Marketing Campaign',
    category: 'Digital Marketing',
    client: 'PulseGrowth SaaS',
    description: 'Full-funnel digital marketing and paid customer acquisition yielding 450+ enterprise B2B sales qualified leads.',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
    stats: '4.8x ROAS Achieved',
    liveUrl: 'https://webtrekitsolutions.in/portfolio/',
  },
  {
    id: 5,
    title: 'MediCare360 - Hospital & Clinic Management ERP',
    category: 'Custom Software',
    client: 'Apollo Health Associates',
    description: 'Enterprise clinic portal handling electronic health records (EHR), automated OPD tokens, and integrated pharmacy invoicing.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    stats: '99.99% Uptime',
    liveUrl: 'https://webtrekitsolutions.in/portfolio/',
  },
  {
    id: 6,
    title: 'SkillSprint - Interactive EdTech Learning Hub',
    category: 'Web Development',
    client: 'Sprint Innovations',
    description: 'Comprehensive digital learning platform with live coding sandboxes, interactive video streaming, and verified digital certificates.',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80',
    stats: '15,000+ Active Students',
    liveUrl: 'https://webtrekitsolutions.in/portfolio/',
  },
];

const categories = ['All', 'Web Development', 'Mobile App', 'E-Commerce', 'Digital Marketing', 'Custom Software'];

const PortfolioPage = () => {
  const [items, setItems] = useState(portfolioItems);
  const [activeCategory, setActiveCategory] = useState('All');
  const { openEnquiryModal } = useWebsite();

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadLivePortfolio = async () => {
      try {
        const res = await projectsService.getAll();
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          setItems(res.data.data);
        }
      } catch (err) {
        // Fallback to portfolioItems
      }
    };

    loadLivePortfolio();
  }, []);

  const filteredItems =
    activeCategory === 'All'
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Banner with exact reference text and image overlay */}
      <PageBanner
        badge="Portfolio"
        title="Portfolio"
        description="Delivering digital excellence through strategy, creativity, and technology to help your business grow."
      />

      {/* Working Gallery Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Working Gallery"
            title="Our Recent Work &"
            highlight="Projects"
            subtitle="Explore our working gallery of innovative IT services and digital solutions."
          />

          {/* Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-8 scrollbar-none sm:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#021343] text-[#fe8a04] shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div key={item._id || item.id} className="portfolio-card-box flex flex-col justify-between">
                <div>
                  <div className="portfolio-img-wrapper relative h-60 w-full overflow-hidden bg-gray-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="portfolio-img-overlay" />
                    <div className="absolute top-4 left-4 bg-[#021343]/85 text-[#fe8a04] text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 z-10">
                      {item.category}
                    </div>
                    {item.stats && (
                      <div className="absolute bottom-4 right-4 bg-green-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow z-10">
                        {item.stats}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">
                      {item.client}
                    </span>
                    <h3 className="portfolio-card-title font-heading font-bold text-xl text-[#021343] mb-3 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Action Buttons: View Details, Visit Live Website, Similar Project */}
                <div className="p-6 pt-0 border-t border-gray-100 flex flex-wrap items-center gap-2">
                  <Link
                    to={`/our-project/${item.slug || item._id || item.id}`}
                    className="portfolio-view-btn flex-1 min-w-[100px] inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#021343] bg-gray-100 hover:bg-[#021343] hover:text-white transition-all cursor-pointer border border-gray-200"
                    title="View Dynamic Project Case Study"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </Link>

                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="portfolio-live-btn inline-flex items-center justify-center p-2.5 rounded-xl text-gray-600 bg-white hover:bg-gray-100 hover:text-[#021343] transition-all cursor-pointer border border-gray-200"
                      title="Visit Live Website"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#fe8a04]" />
                    </a>
                  )}

                  <button
                    onClick={() =>
                      openEnquiryModal({
                        enquiryType: 'Project',
                        relatedProject: item.title,
                        service: item.category?.includes('Marketing')
                          ? 'Digital Marketing'
                          : item.category?.includes('Mobile')
                          ? 'Mobile App Development'
                          : item.category?.includes('E-Commerce')
                          ? 'E-commerce Development'
                          : 'Website Development',
                        sourcePage: `Portfolio - ${item.title}`,
                      })
                    }
                    className="portfolio-similar-btn flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#fe8a04] to-[#ff5e13] hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
                  >
                    <span>Similar Project</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA */}
      <ContactCTA />
    </div>
  );
};

export default PortfolioPage;
