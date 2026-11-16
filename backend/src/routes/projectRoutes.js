const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validate } = require('../middleware/validateMiddleware');

// Public routes
router.get('/', getProjects);
router.get('/slug/:slug', getProjectBySlug);

// Admin protected routes
router.get('/:id', protect, getProjectById);
router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  validate,
  createProject
);
router.put('/:id', protect, adminOnly, upload.single('image'), updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);

module.exports = router;

