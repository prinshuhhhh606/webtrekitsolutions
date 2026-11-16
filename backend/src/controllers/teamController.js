const Team = require('../models/Team');

// @desc    Get all active team members
// @route   GET /api/team
// @access  Public
const getTeamMembers = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const team = await Team.find(filter).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: team.length,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single team member by ID
// @route   GET /api/team/:id
// @access  Private (Admin)
const getTeamMemberById = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

// @desc    Create team member
// @route   POST /api/team
// @access  Private (Admin)
const createTeamMember = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    if (typeof req.body.socialLinks === 'string') {
      try {
        req.body.socialLinks = JSON.parse(req.body.socialLinks);
      } catch (e) {}
    }

    const member = await Team.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Team member added successfully',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private (Admin)
const updateTeamMember = async (req, res, next) => {
  try {
    let member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    if (typeof req.body.socialLinks === 'string') {
      try {
        req.body.socialLinks = JSON.parse(req.body.socialLinks);
      } catch (e) {}
    }

    member = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private (Admin)
const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    await member.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Team member removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};

