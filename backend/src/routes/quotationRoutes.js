const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getQuotations,
  getQuotationById,
  createQuotation,
  updateQuotation,
  deleteQuotation,
} = require('../controllers/quotationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

// All quotation routes require admin authentication
router.use(protect, adminOnly);

router.get('/', getQuotations);
router.get('/:id', getQuotationById);
router.post(
  '/',
  [
    body('customerName').notEmpty().withMessage('Customer name is required'),
    body('customerEmail').isEmail().withMessage('Valid customer email is required'),
    body('customerPhone').notEmpty().withMessage('Customer phone is required'),
    body('title').notEmpty().withMessage('Quotation title is required'),
  ],
  validate,
  createQuotation
);
router.put('/:id', updateQuotation);
router.delete('/:id', deleteQuotation);

module.exports = router;

