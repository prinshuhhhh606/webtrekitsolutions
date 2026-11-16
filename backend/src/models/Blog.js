const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Full blog content is required'],
    },
    author: {
      type: String,
      default: 'Webtrek IT Team',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'Technology',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    seoTitle: {
      type: String,
      default: '',
      trim: true,
    },
    seoDescription: {
      type: String,
      default: '',
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
blogSchema.index({ category: 1, isPublished: 1 });
blogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);
