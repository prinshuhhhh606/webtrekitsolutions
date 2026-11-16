const Service = require('../models/Service');

// @desc    Get all active services (or all for admin)
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const services = await Service.find(filter).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service by slug
// @route   GET /api/services/slug/:slug
// @access  Public
const getServiceBySlug = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Private (Admin)
const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Admin)
const createService = async (req, res, next) => {
  try {
    // Generate slug if not provided
    if (!req.body.slug && req.body.title) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    // If file uploaded via multer
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    if (typeof req.body.features === 'string') {
      try {
        req.body.features = JSON.parse(req.body.features);
      } catch (e) {
        req.body.features = req.body.features.split(',').map((f) => f.trim());
      }
    }

    const service = await Service.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Admin)
const updateService = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    if (typeof req.body.features === 'string') {
      try {
        req.body.features = JSON.parse(req.body.features);
      } catch (e) {
        req.body.features = req.body.features.split(',').map((f) => f.trim());
      }
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await service.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getServiceBySlug,
  getServiceById,
  createService,
  updateService,
  deleteService,
};

