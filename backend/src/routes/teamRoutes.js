const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require('../controllers/teamController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validate } = require('../middleware/validateMiddleware');

// Public routes
router.get('/', getTeamMembers);

// Admin protected routes
router.get('/:id', protect, getTeamMemberById);
router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('designation').notEmpty().withMessage('Designation is required'),
  ],
  validate,
  createTeamMember
);
router.put('/:id', protect, adminOnly, upload.single('image'), updateTeamMember);
router.delete('/:id', protect, adminOnly, deleteTeamMember);

module.exports = router;

