import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { projectsService } from '../services/api';
import { useWebsite } from '../context/WebsiteContext';
import ContactCTA from '../components/home/ContactCTA';
import { ImageSkeleton, TextSkeleton, Shimmer } from '../components/common/Shimmer';
import { formatINR } from '../utils/currency';
import './ProjectDetailsPage.css';

const ProjectDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { openEnquiryModal } = useWebsite();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await projectsService.getBySlug(slug);
        if (res.data.success && res.data.data) {
          setProject(res.data.data);
          setActiveImage(res.data.data.image);
        } else {
          setError('Project details could not be found.');
        }
      } catch (err) {
        // Fallback: search by id or display friendly error
        setError('Project details could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-4">
            <Shimmer width="130px" height="24px" borderRadius="999px" />
            <Shimmer width="70%" height="42px" borderRadius="8px" />
            <div className="flex gap-4">
              <Shimmer width="110px" height="20px" />
              <Shimmer width="110px" height="20px" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-6">
              <ImageSkeleton height="420px" borderRadius="16px" />
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                <Shimmer width="40%" height="28px" borderRadius="6px" />
                <TextSkeleton count={5} />
                <div className="pt-4 space-y-3">
                  <Shimmer width="90%" height="18px" />
                  <Shimmer width="85%" height="18px" />
                  <Shimmer width="80%" height="18px" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                <Shimmer width="60%" height="24px" borderRadius="6px" />
                <div className="space-y-3">
                  <Shimmer width="100%" height="40px" borderRadius="10px" />
                  <Shimmer width="100%" height="40px" borderRadius="10px" />
                  <Shimmer width="100%" height="40px" borderRadius="10px" />
                </div>
                <Shimmer width="100%" height="48px" borderRadius="12px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4 text-center space-y-4">
        <h2 className="font-heading font-black text-3xl text-[#021343]">
          Project Not Found
        </h2>
        <p className="text-sm text-gray-500 max-w-md">
          {error || 'The project case study you are looking for is either unavailable or has been archived.'}
        </p>
        <Link
          to="/our-project"
          className="inline-flex items-center gap-2 bg-[#021343] hover:bg-[#fe8a04] text-white px-6 py-3 rounded-full text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Our Projects</span>
        </Link>
      </div>
    );
  }

  const gallery = [project.image, ...(project.galleryImages || [])].filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Banner with breadcrumb */}
      <section className="project-detail-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-300">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/our-project" className="hover:text-white transition-colors">Our Projects</Link>
            <span>/</span>
            <span className="text-[#fe8a04]">{project.title}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#fe8a04] text-xs font-bold uppercase tracking-wider border border-[#fe8a04]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{project.category}</span>
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight max-w-4xl mx-auto leading-tight word-wrap break-word">
            {project.title}
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {project.shortDescription || project.description}
          </p>
        </div>
      </section>

      {/* Main Project Details Body */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 8 Cols: Visuals & Full Overview */}
            <div className="lg:col-span-8 space-y-8">
              {/* Primary Active Showcase */}
              <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-xl bg-gray-100 max-h-[500px]">
                <img
                  src={activeImage || project.image}
                  alt={project.title}
                  className="w-full h-full object-cover max-h-[500px]"
                />
              </div>

              {/* Gallery Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {gallery.map((imgUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative w-24 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        activeImage === imgUrl
                          ? 'border-[#fe8a04] ring-2 ring-[#fe8a04]/30 scale-105'
                          : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Project Narrative & Description */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div>
                  <h3 className="font-heading font-extrabold text-2xl text-[#021343] mb-3">
                    Project Overview & Challenge
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {project.fullDescription || project.description}
                  </p>
                </div>

                {/* Key Deliverables Bullet Points */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-heading font-bold text-lg text-[#021343]">
                    What We Delivered
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#fe8a04] shrink-0" />
                      <span>Custom Scalable Architecture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#fe8a04] shrink-0" />
                      <span>Mobile & Tablet Responsiveness</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#fe8a04] shrink-0" />
                      <span>SEO & Performance Optimization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#fe8a04] shrink-0" />
                      <span>Fast Sub-Second Page Speed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Project Specifications & Action Card */}
            <div className="lg:col-span-4 space-y-6">
              {/* Metadata Card */}
              <div className="bg-[#f8fafc] p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                <h3 className="font-heading font-bold text-xl text-[#021343] border-b border-gray-200 pb-3">
                  Project Specifications
                </h3>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-400 font-medium block">Category</span>
                    <span className="font-bold text-[#021343] text-sm mt-0.5 block">
                      {project.category}
                    </span>
                  </div>

                  {project.client && (
                    <div>
                      <span className="text-gray-400 font-medium block">Client</span>
                      <span className="font-bold text-[#021343] text-sm mt-0.5 block">
                        {project.client}
                      </span>
                    </div>
                  )}

                  {project.completionDate && (
                    <div>
                      <span className="text-gray-400 font-medium block">Delivered On</span>
                      <span className="font-bold text-[#021343] text-sm mt-0.5 block">
                        {project.completionDate}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-gray-400 font-medium block">Starting Package</span>
                    <span className="font-black text-[#fe8a04] text-lg mt-0.5 block">
                      {formatINR(project.price || project.budget || 5500)}
                    </span>
                  </div>
                </div>

                {/* Technologies Stack */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-400 font-medium text-xs block mb-2.5">
                      Technologies & Tools
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 text-[11px] font-bold shadow-2xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Action Buttons */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  {/* Start Similar Project CTA */}
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
                        sourcePage: `Project Detail - ${project.title}`,
                      })
                    }
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#fe8a04] to-[#ff5e13] text-white py-3.5 rounded-2xl font-bold text-sm shadow-glow-orange hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>Start a Similar Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Visit Live Website Button - only if liveUrl exists */}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[#021343] border border-gray-300 py-3.5 rounded-2xl font-bold text-sm transition-all"
                    >
                      <ExternalLink className="w-4 h-4 text-[#fe8a04]" />
                      <span>Visit Live Website</span>
                    </a>
                  )}

                  <Link
                    to="/our-project"
                    className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#021343] pt-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to All Projects</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <ContactCTA />
    </div>
  );
};

export default ProjectDetailsPage;

