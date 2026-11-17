import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  Share2,
  Bookmark,
  Sparkles,
  Loader2,
  Tag,
} from 'lucide-react';
import { blogsService } from '../services/api';
import { useWebsite } from '../context/WebsiteContext';
import ContactCTA from '../components/home/ContactCTA';
import { ImageSkeleton, TextSkeleton, Shimmer } from '../components/common/Shimmer';
import './BlogDetailsPage.css';

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const { openEnquiryModal } = useWebsite();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await blogsService.getBySlug(slug);
        if (res.data.success && res.data.data) {
          setBlog(res.data.data);
          setRelatedBlogs(res.data.relatedBlogs || []);
        } else {
          setError('Article not found.');
        }
      } catch (err) {
        setError('Article could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-4">
            <Shimmer width="120px" height="24px" borderRadius="999px" />
            <Shimmer width="85%" height="40px" borderRadius="8px" />
            <div className="flex gap-4">
              <Shimmer width="100px" height="18px" />
              <Shimmer width="100px" height="18px" />
            </div>
          </div>
          <ImageSkeleton height="400px" borderRadius="16px" />
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <TextSkeleton count={4} />
            <Shimmer width="60%" height="28px" borderRadius="6px" />
            <TextSkeleton count={5} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4 text-center space-y-4">
        <h2 className="font-heading font-black text-3xl text-[#021343]">
          Article Not Found
        </h2>
        <p className="text-sm text-gray-500 max-w-md">
          {error || 'The blog article you are looking for is unavailable or has been removed.'}
        </p>
        <Link
          to="/blog-page"
          className="inline-flex items-center gap-2 bg-[#021343] hover:bg-[#fe8a04] text-white px-6 py-3 rounded-full text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Banner */}
      <section className="blog-detail-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-300">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/blog-page" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[#fe8a04] line-clamp-1 max-w-[200px]">{blog.title}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#fe8a04] text-xs font-bold uppercase tracking-wider border border-[#fe8a04]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{blog.category}</span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-300 pt-2 font-medium">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#fe8a04]" />
              {blog.author || 'Webtrek IT Team'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#fe8a04]" />
              {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#fe8a04]" />
              {blog.readTime || '5 min read'}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Article */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Image */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 mb-10 max-h-[500px]">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover max-h-[500px]"
            />
          </div>

          {/* Short Description Lead */}
          {blog.shortDescription && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#f8fafc] border-l-4 border-[#fe8a04] mb-10">
              <p className="text-gray-700 font-semibold text-base sm:text-lg leading-relaxed italic">
                "{blog.shortDescription}"
              </p>
            </div>
          )}

          {/* Full Article Text */}
          <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-base sm:text-lg">
            {blog.content.split('\n\n').map((paragraph, pIdx) => (
              <p key={pIdx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="pt-10 mt-10 border-t border-gray-200 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 mr-2">
                <Tag className="w-3.5 h-3.5 text-[#fe8a04]" />
                Tags:
              </span>
              {blog.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-700 hover:bg-[#021343] hover:text-white transition-colors cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Back Button & Share */}
          <div className="pt-8 mt-8 border-t border-gray-100 flex items-center justify-between">
            <Link
              to="/blog-page"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#021343] hover:text-[#fe8a04] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </Link>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: blog.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Article link copied to clipboard!');
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#fe8a04]" />
              <span>Share Article</span>
            </button>
          </div>
        </div>
      </section>

      {/* Related Blogs in same category */}
      {relatedBlogs && relatedBlogs.length > 0 && (
        <section className="py-16 bg-[#f8fafc] border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#fe8a04]">
                Related Topics
              </span>
              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#021343] mt-1">
                More Articles from {blog.category}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((rel) => (
                <article key={rel._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <img src={rel.image} alt={rel.title} className="w-full h-48 object-cover" />
                    <div className="p-5">
                      <span className="text-[10px] font-bold uppercase text-[#fe8a04] tracking-wider block mb-1">
                        {rel.category}
                      </span>
                      <h4 className="font-heading font-bold text-base text-[#021343] line-clamp-2 mb-2">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {rel.shortDescription}
                      </p>
                    </div>
                  </div>
                  <div className="p-5 pt-0 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      to={`/blog-page/${rel.slug}`}
                      className="text-xs font-bold text-[#fe8a04] hover:underline flex items-center gap-1"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <ContactCTA />
    </div>
  );
};

export default BlogDetailsPage;

