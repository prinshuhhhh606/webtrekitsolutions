const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validate } = require('../middleware/validateMiddleware');

// Public routes
router.get('/', getBlogs);
router.get('/slug/:slug', getBlogBySlug);

// Admin protected routes
router.get('/:id', protect, getBlogById);
router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  [
    body('title').notEmpty().withMessage('Blog title is required'),
    body('shortDescription').notEmpty().withMessage('Short description is required'),
    body('content').notEmpty().withMessage('Content is required'),
  ],
  validate,
  createBlog
);
router.put('/:id', protect, adminOnly, upload.single('image'), updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);

module.exports = router;

