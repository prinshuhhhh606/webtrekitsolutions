const FAQ = require('../models/FAQ');

// @desc    Get all active FAQs (optional category filter)
// @route   GET /api/faqs
// @access  Public
const getFAQs = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }

    const faqs = await FAQ.find(filter).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single FAQ by ID
// @route   GET /api/faqs/:id
// @access  Private (Admin)
const getFAQById = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.status(200).json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
};

// @desc    Create FAQ
// @route   POST /api/faqs
// @access  Private (Admin)
const createFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update FAQ
// @route   PUT /api/faqs/:id
// @access  Private (Admin)
const updateFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      data: faq,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/faqs/:id
// @access  Private (Admin)
const deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    await faq.deleteOne();
    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
};

