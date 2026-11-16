const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Upload single image
router.post('/single', protect, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please provide an image file.' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully.',
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
  });
});

// Upload multiple images (for galleries)
router.post('/multiple', protect, adminOnly, upload.array('images', 8), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'Please provide at least one image file.' });
  }

  const fileUrls = req.files.map((file) => `/uploads/${file.filename}`);
  res.status(200).json({
    success: true,
    message: `${req.files.length} images uploaded successfully.`,
    urls: fileUrls,
  });
});

module.exports = router;

