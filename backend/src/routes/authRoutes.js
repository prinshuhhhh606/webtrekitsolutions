const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  updateAdminPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

// Public route: Admin login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  loginAdmin
);

// Protected routes
router.get('/me', protect, getAdminProfile);
router.put('/profile', protect, updateAdminProfile);
router.put(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  validate,
  updateAdminPassword
);

module.exports = router;

