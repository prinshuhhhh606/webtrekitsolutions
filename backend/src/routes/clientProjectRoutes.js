const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getClientProjects,
  getClientProjectById,
  createClientProject,
  updateClientProject,
  deleteClientProject,
} = require('../controllers/clientProjectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

router.use(protect, adminOnly);

router.get('/', getClientProjects);
router.get('/:id', getClientProjectById);
router.post(
  '/',
  [
    body('projectName').notEmpty().withMessage('Project name is required'),
    body('clientName').notEmpty().withMessage('Client name is required'),
    body('clientEmail').isEmail().withMessage('Valid client email is required'),
  ],
  validate,
  createClientProject
);
router.put('/:id', updateClientProject);
router.delete('/:id', deleteClientProject);

module.exports = router;

