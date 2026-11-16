const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getServices,
  getServiceBySlug,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validate } = require('../middleware/validateMiddleware');

// Public routes
router.get('/', getServices);
router.get('/slug/:slug', getServiceBySlug);

// Admin protected routes
router.get('/:id', protect, getServiceById);
router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('shortDescription').notEmpty().withMessage('Short description is required'),
  ],
  validate,
  createService
);
router.put('/:id', protect, adminOnly, upload.single('image'), updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;

