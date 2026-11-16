const ClientProject = require('../models/ClientProject');
const Enquiry = require('../models/Enquiry');

// @desc    Get all client delivery projects
// @route   GET /api/client-projects
// @access  Private (Admin Only)
const getClientProjects = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status && req.query.status !== 'All') {
      filter.status = req.query.status;
    }

    if (req.query.search && req.query.search.trim()) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      filter.$or = [
        { projectName: searchRegex },
        { clientName: searchRegex },
        { clientEmail: searchRegex },
        { assignedTeam: searchRegex },
      ];
    }

    const projects = await ClientProject.find(filter)
      .populate('enquiry', 'fullName phone service budget')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single client delivery project by ID
// @route   GET /api/client-projects/:id
// @access  Private (Admin Only)
const getClientProjectById = async (req, res, next) => {
  try {
    const project = await ClientProject.findById(req.params.id).populate('enquiry');
    if (!project) {
      return res.status(404).json({ success: false, message: 'Client delivery project not found.' });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new client delivery project
// @route   POST /api/client-projects
// @access  Private (Admin Only)
const createClientProject = async (req, res, next) => {
  try {
    const project = await ClientProject.create(req.body);

    // If linked to an enquiry, update enquiry status to In Progress
    if (req.body.enquiry) {
      await Enquiry.findByIdAndUpdate(req.body.enquiry, {
        status: 'In Progress',
        $push: {
          contactHistory: {
            date: new Date(),
            channel: 'Project Kickoff',
            notes: `Converted into delivery project: ${project.projectName}`,
            createdBy: 'Admin',
          },
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Client delivery project created successfully.',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update client delivery project
// @route   PUT /api/client-projects/:id
// @access  Private (Admin Only)
const updateClientProject = async (req, res, next) => {
  try {
    const project = await ClientProject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Client delivery project not found.' });
    }

    // If marked as Completed, update linked enquiry status to Converted
    if (req.body.status === 'Completed' && project.enquiry) {
      await Enquiry.findByIdAndUpdate(project.enquiry, { status: 'Converted' });
    }

    res.status(200).json({
      success: true,
      message: 'Client delivery project updated successfully.',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete client delivery project
// @route   DELETE /api/client-projects/:id
// @access  Private (Admin Only)
const deleteClientProject = async (req, res, next) => {
  try {
    const project = await ClientProject.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Client delivery project not found.' });
    }

    await project.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Client delivery project deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClientProjects,
  getClientProjectById,
  createClientProject,
  updateClientProject,
  deleteClientProject,
};

