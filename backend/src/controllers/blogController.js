const Blog = require('../models/Blog');

// @desc    Get all blogs (public returns only published blogs; admin can get all)
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isPublished: true };

    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }

    if (req.query.search && req.query.search.trim()) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { shortDescription: searchRegex },
        { category: searchRegex },
        { tags: searchRegex },
      ];
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by slug (and increment views)
// @route   GET /api/blogs/slug/:slug
// @access  Public
const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    // Get related blogs from same category
    const relatedBlogs = await Blog.find({
      category: blog.category,
      _id: { $ne: blog._id },
      isPublished: true,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      data: blog,
      relatedBlogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Private (Admin)
const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private (Admin)
const createBlog = async (req, res, next) => {
  try {
    if (!req.body.slug && req.body.title) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    if (typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const blog = await Blog.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Blog article published successfully.',
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private (Admin)
const updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }

    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    if (typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully.',
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private (Admin)
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }

    await blog.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};

