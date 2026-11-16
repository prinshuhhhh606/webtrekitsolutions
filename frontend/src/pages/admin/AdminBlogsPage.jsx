import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  BookOpen,
  Calendar,
  Eye,
  Search,
} from 'lucide-react';
import { blogsService, uploadService } from '../../services/api';
import './AdminBlogsPage.css';

const blogCategories = [
  'Web Development',
  'Digital Marketing',
  'IT Consulting',
  'Technology',
  'SEO & Growth',
  'App Development',
  'Other',
];

const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    content: '',
    author: 'Webtrek IT Team',
    category: 'Web Development',
    tags: '',
    image: '',
    readTime: '5 min read',
    isPublished: true,
    seoTitle: '',
    seoDescription: '',
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await blogsService.getAll({ all: true });
      if (res.data.success) {
        setBlogs(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      shortDescription: '',
      content: '',
      author: 'Webtrek IT Team',
      category: 'Web Development',
      tags: '',
      image: '',
      readTime: '5 min read',
      isPublished: true,
      seoTitle: '',
      seoDescription: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingId(blog._id);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      shortDescription: blog.shortDescription,
      content: blog.content,
      author: blog.author || 'Webtrek IT Team',
      category: blog.category || 'Web Development',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
      image: blog.image || '',
      readTime: blog.readTime || '5 min read',
      isPublished: blog.isPublished !== false,
      seoTitle: blog.seoTitle || '',
      seoDescription: blog.seoDescription || '',
    });
    setModalOpen(true);
  };

  const handleTitleChange = (e) => {
    const titleVal = e.target.value;
    if (!editingId) {
      const generatedSlug = titleVal
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData((prev) => ({ ...prev, title: titleVal, slug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, title: titleVal }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      setActionLoading(true);
      const res = await uploadService.uploadSingle(uploadData);
      if (res.data.success) {
        setFormData((prev) => ({ ...prev, image: res.data.url }));
        setMsg({ text: 'Image uploaded successfully!', type: 'success' });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMsg({ text: 'Image upload failed. Try again.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      };

      if (editingId) {
        const res = await blogsService.update(editingId, payload);
        if (res.data.success) {
          setMsg({ text: 'Blog article updated successfully!', type: 'success' });
        }
      } else {
        const res = await blogsService.create(payload);
        if (res.data.success) {
          setMsg({ text: 'New blog published successfully!', type: 'success' });
        }
      }

      setModalOpen(false);
      fetchBlogs();
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      setMsg({
        text: err.response?.data?.message || 'Failed to save blog article.',
        type: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog article?')) return;

    try {
      setActionLoading(true);
      const res = await blogsService.delete(id);
      if (res.data.success) {
        setBlogs(blogs.filter((b) => b._id !== id));
        setMsg({ text: 'Article deleted successfully!', type: 'success' });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMsg({ text: 'Failed to delete article.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#fe8a04]">
            Content Management System
          </span>
          <h1 className="font-heading font-extrabold text-2xl text-[#021343]">
            Blog & Article Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Publish thought leadership articles, SEO insights, and company news.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#021343] hover:bg-[#fe8a04] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {msg.text && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles by title or category..."
          className="w-full text-xs focus:outline-none"
        />
      </div>

      {/* Articles Grid / Table */}
      {loading ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-200">
          <Loader2 className="w-8 h-8 text-[#fe8a04] animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Loading articles...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 space-y-2">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-gray-700">No Articles Found</h3>
          <p className="text-xs text-gray-400">Click "Write New Article" to publish your first post.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      b.isPublished
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {b.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className="absolute bottom-3 left-3 bg-[#021343]/85 text-[#fe8a04] text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                    {b.category}
                  </span>
                </div>

                <div className="p-5">
                  <span className="text-[11px] text-gray-400 font-medium block mb-1">
                    {new Date(b.publishedAt || b.createdAt).toLocaleDateString()} • {b.readTime}
                  </span>
                  <h3 className="font-heading font-bold text-base text-[#021343] line-clamp-2 mb-2">
                    {b.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {b.shortDescription}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-gray-100 flex items-center justify-between">
                <a
                  href={`/blog-page/${b.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#021343] hover:text-[#fe8a04] flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(b)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Article Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-heading font-extrabold text-xl text-[#021343]">
                {editingId ? 'Edit Article' : 'Write New Article'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Modern Web Architecture for 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#fe8a04]"
                  >
                    {blogCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Featured Image URL / Upload</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... or upload"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04]"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold cursor-pointer whitespace-nowrap">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One or two sentences summarizing the article..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04] resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Content *</label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the full article content here. Use double newlines for paragraphs..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#fe8a04]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="React, Growth, SEO"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded text-[#fe8a04] focus:ring-[#fe8a04] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isPublished" className="font-bold text-gray-700 cursor-pointer">
                  Publish Article Immediately (Visible to public)
                </label>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#021343] hover:bg-[#fe8a04] text-white font-bold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading ? 'Saving...' : editingId ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogsPage;

