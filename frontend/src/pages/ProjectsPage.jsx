import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, ShoppingCart, TrendingUp, ExternalLink, Eye } from 'lucide-react';
import { useWebsite } from '../context/WebsiteContext';
import { projectsService } from '../services/api';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FAQSection from '../components/home/FAQSection';
import ContactCTA from '../components/home/ContactCTA';
import SectionHeader from '../components/common/SectionHeader';
import PageBanner from '../components/common/PageBanner';
import { ProjectCardSkeleton } from '../components/common/Shimmer';
import { formatINR } from '../utils/currency';
import './ProjectsPage.css';

const projectsList = [
  {
    id: 1,
    title: 'Graphic Design Monthly Subscription',
    price: '₹5,500',
    category: 'Digital Marketing',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    description: 'High-impact brand creatives, social media banners, and digital graphics tailored for your monthly marketing strategy.',
    liveUrl: 'https://webtrekitsolutions.in/our-project/',
  },
  {
    id: 2,
    title: 'Ecommerce Presentation Startup',
    price: '₹5,500',
    category: 'Consultant Business',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    description: 'Pitch decks, product roadmaps, and business deck architecture designed for innovative retail startups.',
    liveUrl: 'https://webtrekitsolutions.in/our-project/',
  },
  {
    id: 3,
    title: 'Company Profile Web Development',
    price: '₹5,500',
    category: 'Website Development',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
    description: 'Modern, high-performance corporate presence that establishes authority and drives business inquiries.',
    liveUrl: 'https://webtrekitsolutions.in/',
  },
  {
    id: 4,
    title: 'Grow Social Media Marketing Business',
    price: '₹5,500',
    category: 'Digital Marketing',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    description: 'Community building, organic storytelling, and targeted customer engagement on Instagram, LinkedIn, and Meta.',
    liveUrl: 'https://webtrekitsolutions.in/our-project/',
  },
  {
    id: 5,
    title: 'Photography Ads For Business Media',
    price: '₹5,500',
    category: 'Digital Marketing',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
    description: 'Visual advertising creatives, product photoshoot concepts, and high-CTR social ad creatives.',
    liveUrl: 'https://webtrekitsolutions.in/our-project/',
  },
  {
    id: 6,
    title: 'Comeback & Grow Business Services',
    price: '₹5,500',
    category: 'Consultant Business',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    description: 'Holistic business turnaround consulting, digital optimization, and revenue recovery roadmaps.',
    liveUrl: 'https://webtrekitsolutions.in/our-project/',
  },
];

const categories = ['All', 'Digital Marketing', 'Website Development', 'Consultant Business', 'Web Development', 'Mobile App', 'Custom Software'];

const ProjectsPage = () => {
  const [projects, setProjects] = useState(projectsList);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { openEnquiryModal } = useWebsite();

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadLiveProjects = async () => {
      try {
        const res = await projectsService.getAll();
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          setProjects(res.data.data);
        }
      } catch (err) {
        // Fallback to default list
      } finally {
        setLoading(false);
      }
    };

    loadLiveProjects();
  }, []);

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory || (selectedCategory === 'Website Development' && p.category === 'Web Development'));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Banner with exact reference text and image overlay */}
      <PageBanner
        badge="Our-project"
        title="Our Projects"
        description="Explore our featured client solutions and digital deliverables tailored for business growth."
      />

      {/* 3 Easy Steps from reference */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Chose Our Projects"
            title="Get Easy"
            highlight="3 Step"
            subtitle="Starting your next project with Webtrek IT Solutions is fast, transparent, and seamless."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="easy-step-box">
              <div className="w-14 h-14 rounded-2xl bg-[#021343] text-[#fe8a04] flex items-center justify-center mx-auto mb-5 shadow">
                <Layers className="w-7 h-7" />
              </div>
              <h4 className="font-heading font-bold text-xl text-[#021343] mb-2">
                1. Chose Our Project
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Select from our curated digital marketing, web engineering, or business consulting packages.
              </p>
            </div>

            <div className="easy-step-box">
              <div className="w-14 h-14 rounded-2xl bg-[#fe8a04] text-white flex items-center justify-center mx-auto mb-5 shadow-glow-orange">
                <ShoppingCart className="w-7 h-7" />
              </div>
              <h4 className="font-heading font-bold text-xl text-[#021343] mb-2">
                2. Purchase Order
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Submit your project specifications and receive clear transparent deliverables and scope.
              </p>
            </div>

            <div className="easy-step-box">
              <div className="w-14 h-14 rounded-2xl bg-[#021343] text-[#fe8a04] flex items-center justify-center mx-auto mb-5 shadow">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h4 className="font-heading font-bold text-xl text-[#021343] mb-2">
                3. Grow Business
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Watch your online visibility, customer inquiries, and monthly revenues accelerate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-8 scrollbar-none sm:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#021343] text-[#fe8a04] shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ProjectCardSkeleton count={6} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 content-fade-in">
              {filteredProjects.map((project) => (
                <div key={project._id || project.id} className="project-item-card flex flex-col justify-between">
                  <div>
                    <div className="project-img-wrapper relative h-60 w-full overflow-hidden bg-gray-200">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="project-img-overlay" />
                      <div className="absolute top-4 left-4 bg-[#021343]/85 text-[#fe8a04] text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 z-10">
                        {project.category}
                      </div>
                      <div className="absolute bottom-4 right-4 bg-[#fe8a04] text-white text-xs font-bold px-3 py-1 rounded-full shadow z-10">
                        {formatINR(project.price || 5500)}
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <h3 className="project-card-title font-heading font-bold text-lg sm:text-xl text-[#021343] mb-2 sm:mb-3 leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 pt-0 border-t border-gray-100 space-y-2.5 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Starting Package
                      </span>
                      <span className="text-base font-extrabold text-[#021343]">
                        {formatINR(project.price || 5500)}
                      </span>
                    </div>

                    {/* Action Buttons: View Details, Visit Live Website, Similar Project */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Link
                        to={`/our-project/${project.slug || project._id || project.id}`}
                        className="project-view-btn flex-1 min-w-[100px] inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#021343] bg-gray-100 hover:bg-[#021343] hover:text-white transition-all cursor-pointer border border-gray-200"
                        title="View Dynamic Project Case Study"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </Link>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-live-btn inline-flex items-center justify-center p-2.5 rounded-xl text-gray-600 bg-white hover:bg-gray-100 hover:text-[#021343] transition-all cursor-pointer border border-gray-200"
                          title="Visit Live Website"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#fe8a04]" />
                        </a>
                      )}

                      <button
                        onClick={() =>
                          openEnquiryModal({
                            enquiryType: 'Project',
                            relatedProject: project.title,
                            service: project.category?.includes('Marketing')
                              ? 'Digital Marketing'
                              : project.category?.includes('Web')
                              ? 'Website Development'
                              : 'Business Consultancy',
                            sourcePage: `Our Projects - ${project.title}`,
                          })
                        }
                        className="project-similar-btn flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#fe8a04] to-[#ff5e13] hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
                      >
                        <span>Similar Project</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials from reference */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />

      {/* CTA */}
      <ContactCTA />
    </div>
  );
};

export default ProjectsPage;
