const Project = require('../models/Project');

// @desc    Get all active projects (with optional category filter)
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res, next) => {
  try {
    const query = req.query.all === 'true' ? {} : { isActive: true };

    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by slug
// @route   GET /api/projects/slug/:slug
// @access  Public
const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, isActive: true });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private (Admin)
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Admin)
const createProject = async (req, res, next) => {
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

    if (!req.body.shortDescription && req.body.description) {
      req.body.shortDescription = req.body.description;
    }
    if (!req.body.description && req.body.shortDescription) {
      req.body.description = req.body.shortDescription;
    }

    if (typeof req.body.technologies === 'string') {
      try {
        req.body.technologies = JSON.parse(req.body.technologies);
      } catch (e) {
        req.body.technologies = req.body.technologies.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    if (typeof req.body.galleryImages === 'string') {
      try {
        req.body.galleryImages = JSON.parse(req.body.galleryImages);
      } catch (e) {
        req.body.galleryImages = req.body.galleryImages.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    const project = await Project.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    if (!req.body.shortDescription && req.body.description) {
      req.body.shortDescription = req.body.description;
    }
    if (!req.body.description && req.body.shortDescription) {
      req.body.description = req.body.shortDescription;
    }

    if (typeof req.body.technologies === 'string') {
      try {
        req.body.technologies = JSON.parse(req.body.technologies);
      } catch (e) {
        req.body.technologies = req.body.technologies.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    if (typeof req.body.galleryImages === 'string') {
      try {
        req.body.galleryImages = JSON.parse(req.body.galleryImages);
      } catch (e) {
        req.body.galleryImages = req.body.galleryImages.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await project.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

