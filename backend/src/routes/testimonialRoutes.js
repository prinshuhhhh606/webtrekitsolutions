const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validate } = require('../middleware/validateMiddleware');

// Public routes
router.get('/', getTestimonials);

// Admin protected routes
router.get('/:id', protect, getTestimonialById);
router.post(
  '/',
  protect,
  adminOnly,
  upload.single('avatar'),
  [
    body('clientName').notEmpty().withMessage('Client name is required'),
    body('feedback').notEmpty().withMessage('Feedback text is required'),
  ],
  validate,
  createTestimonial
);
router.put('/:id', protect, adminOnly, upload.single('avatar'), updateTestimonial);
router.delete('/:id', protect, adminOnly, deleteTestimonial);

module.exports = router;

