const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry,
  getDashboardStats,
} = require('../controllers/enquiryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

// Public route: Submit contact form / enquiry (No authentication required)
router.post(
  '/',
  [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
  ],
  validate,
  createEnquiry
);

// Admin protected routes
router.get('/stats', protect, getDashboardStats);
router.get('/', protect, getEnquiries);
router.get('/:id', protect, getEnquiryById);
router.patch('/:id', protect, adminOnly, updateEnquiryStatus);
router.delete('/:id', protect, adminOnly, deleteEnquiry);

module.exports = router;
