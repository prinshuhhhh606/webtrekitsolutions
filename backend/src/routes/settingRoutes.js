const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
} = require('../controllers/settingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public route: Get website information, contacts, and social links
router.get('/', getSettings);

// Admin protected route: Update settings
router.put('/', protect, adminOnly, updateSettings);

module.exports = router;

