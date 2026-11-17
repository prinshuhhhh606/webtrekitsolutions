import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Search, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { useWebsite } from '../context/WebsiteContext';
import { blogsService } from '../services/api';
import ContactCTA from '../components/home/ContactCTA';
import SectionHeader from '../components/common/SectionHeader';
import PageBanner from '../components/common/PageBanner';
import { BlogCardSkeleton } from '../components/common/Shimmer';
import './BlogPage.css';

const defaultBlogPosts = [
  {
    _id: '1',
    id: 1,
    title: 'Why Modern Web Development Demands High-Speed Scalable Frameworks',
    slug: 'why-modern-web-development-demands-high-speed-scalable-frameworks',
    category: 'Web Development',
    createdAt: '2026-11-12T00:00:00.000Z',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Webtrek builds responsive, high-performance websites tailored to your business goals. Clean coding practices and modern architectures ensure seamless conversions.',
  },
  {
    _id: '2',
    id: 2,
    title: 'Top Digital Marketing Strategies to Grow Online-Based Businesses in 2026',
    slug: 'top-digital-marketing-strategies-grow-online-businesses-2026',
    category: 'Digital Marketing',
    createdAt: '2026-11-06T00:00:00.000Z',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'How data-driven PPC campaigns, social media marketing, and SEO lead funnels accelerate customer acquisition and revenue.',
  },
  {
    _id: '3',
    id: 3,
    title: 'Transforming Business Efficiency with Custom Software & Automation',
    slug: 'transforming-business-efficiency-custom-software-automation',
    category: 'IT Consulting',
    createdAt: '2026-10-30T00:00:00.000Z',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Leveraging modern cloud technology, AI, and workflow automation to streamline operations, eliminate bottlenecks, and stay competitive.',
  },
];

const categories = ['All', 'Web Development', 'Digital Marketing', 'IT Consulting', 'Technology'];

const BlogPage = () => {
  const [blogs, setBlogs] = useState(defaultBlogPosts);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { openEnquiryModal } = useWebsite();

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadBlogs = async () => {
      try {
        setLoading(true);
        const res = await blogsService.getAll();
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          setBlogs(res.data.data);
        }
      } catch (err) {
        // Keep default fallback
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const filteredBlogs = blogs.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.shortDescription && post.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Banner with exact reference text and image overlay */}
      <PageBanner
        badge="Blog-page"
        title="Blog-page"
        description="Webtrek IT Solutions is a tech company specializing in innovative IT services and digital solutions. It offers web development, software solutions, mobile app development, digital marketing, and IT consulting, helping businesses grow through technology-driven strategies."
      />

      {/* Blog Articles & Search / Filter */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Insights & Trends"
            title="Latest Articles &"
            highlight="Updates"
            subtitle="Explore our articles on modern web design, digital marketing, SEO, and enterprise software."
          />

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full sm:w-auto scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#021343] text-[#fe8a04] shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-full border border-gray-200 focus:outline-none focus:border-[#fe8a04]"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <BlogCardSkeleton count={6} />
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-heading font-bold text-lg text-gray-800">No Articles Found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No published articles match your search or category filter. Try clearing filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 content-fade-in">
              {filteredBlogs.map((post) => (
                <article key={post._id || post.id} className="blog-article-card flex flex-col justify-between">
                  <div>
                    <div className="relative h-56 w-full overflow-hidden bg-gray-200">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-[#021343]/85 text-[#fe8a04] text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                        {post.category}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#fe8a04]" />
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#fe8a04]" />
                          {post.readTime || '5 min read'}
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-xl text-[#021343] mb-3 leading-snug line-clamp-2">
                        <Link
                          to={`/blog-page/${post.slug || post._id}`}
                          className="hover:text-[#fe8a04] transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {post.shortDescription || post.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">
                      Webtrek IT
                    </span>
                    <Link
                      to={`/blog-page/${post.slug || post._id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#fe8a04] hover:underline cursor-pointer"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <ContactCTA />
    </div>
  );
};

export default BlogPage;
