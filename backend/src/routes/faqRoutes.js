const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} = require('../controllers/faqController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

// Public routes
router.get('/', getFAQs);

// Admin protected routes
router.get('/:id', protect, getFAQById);
router.post(
  '/',
  protect,
  adminOnly,
  [
    body('question').notEmpty().withMessage('Question is required'),
    body('answer').notEmpty().withMessage('Answer is required'),
  ],
  validate,
  createFAQ
);
router.put('/:id', protect, adminOnly, updateFAQ);
router.delete('/:id', protect, adminOnly, deleteFAQ);

module.exports = router;

