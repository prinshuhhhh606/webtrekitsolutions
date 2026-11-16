const Enquiry = require('../models/Enquiry');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Team = require('../models/Team');
const Blog = require('../models/Blog');
const Quotation = require('../models/Quotation');
const ClientProject = require('../models/ClientProject');
const { sendEnquiryNotification, sendCustomerConfirmation } = require('../services/emailService');

// @desc    Submit new contact / business enquiry form (Public)
// @route   POST /api/enquiries or POST /api/contact
// @access  Public (No login required)
const createEnquiry = async (req, res, next) => {
  try {
    const fullName = req.body.fullName || req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const companyName = req.body.companyName || '';
    const service = req.body.service || 'Website Development';
    const projectDescription = req.body.projectDescription || req.body.message || '';
    const budget = req.body.budget || 'Not Decided Yet';
    const timeline = req.body.timeline || 'Just Exploring';
    const preferredContactMethod = req.body.preferredContactMethod || 'Any';
    const enquiryType = req.body.enquiryType || 'General';
    const relatedProject = req.body.relatedProject || '';
    const sourcePage = req.body.sourcePage || '';

    // Validation
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Phone number is required.' });
    }
    if (!projectDescription || !projectDescription.trim()) {
      return res.status(400).json({ success: false, message: 'Project description / requirement is required.' });
    }

    const enquiry = await Enquiry.create({
      fullName: fullName.trim(),
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      companyName: companyName.trim(),
      service: service.trim(),
      projectDescription: projectDescription.trim(),
      message: projectDescription.trim(),
      budget: budget.trim(),
      timeline: timeline.trim(),
      preferredContactMethod,
      enquiryType,
      relatedProject: relatedProject.trim(),
      sourcePage: sourcePage.trim(),
      status: 'New',
    });

    // Send notifications in background (non-blocking)
    sendEnquiryNotification(enquiry).catch(() => {});
    sendCustomerConfirmation(enquiry).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Thank You for Your Enquiry! Our team has received your request. We will contact you soon.',
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enquiries with search, filters & pagination
// @route   GET /api/enquiries or GET /api/admin/enquiries
// @access  Private (Admin Only)
const getEnquiries = async (req, res, next) => {
  try {
    const filter = {};

    // Status filter
    if (req.query.status && req.query.status !== 'All') {
      filter.status = req.query.status;
    }

    // Service filter
    if (req.query.service && req.query.service !== 'All') {
      filter.service = req.query.service;
    }

    // Enquiry Type filter
    if (req.query.enquiryType && req.query.enquiryType !== 'All') {
      filter.enquiryType = req.query.enquiryType;
    }

    // Search by name, email, phone, companyName
    if (req.query.search && req.query.search.trim()) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      filter.$or = [
        { fullName: searchRegex },
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { companyName: searchRegex },
        { service: searchRegex },
      ];
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const total = await Enquiry.countDocuments(filter);
    const enquiries = await Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: enquiries.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: enquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single enquiry by ID
// @route   GET /api/enquiries/:id or GET /api/admin/enquiries/:id
// @access  Private (Admin Only)
const getEnquiryById = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry record not found.' });
    }
    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status, admin notes, or details
// @route   PATCH /api/enquiries/:id or PATCH /api/admin/enquiries/:id
// @access  Private (Admin Only)
const updateEnquiryStatus = async (req, res, next) => {
  try {
    const {
      status,
      adminNotes,
      companyName,
      service,
      budget,
      timeline,
      priority,
      nextFollowUpDate,
      followUpStatus,
      newContactLog,
    } = req.body;

    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry record not found.' });
    }

    if (status) enquiry.status = status;
    if (adminNotes !== undefined) enquiry.adminNotes = adminNotes;
    if (companyName !== undefined) enquiry.companyName = companyName;
    if (service) enquiry.service = service;
    if (budget) enquiry.budget = budget;
    if (timeline) enquiry.timeline = timeline;
    if (priority) enquiry.priority = priority;
    if (nextFollowUpDate !== undefined) enquiry.nextFollowUpDate = nextFollowUpDate;
    if (followUpStatus) enquiry.followUpStatus = followUpStatus;

    if (newContactLog && newContactLog.notes) {
      enquiry.contactHistory.push({
        date: new Date(),
        channel: newContactLog.channel || 'Phone Call',
        notes: newContactLog.notes,
        createdBy: newContactLog.createdBy || 'Admin',
      });
    }

    await enquiry.save();

    res.status(200).json({
      success: true,
      message: 'Enquiry updated successfully.',
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id or DELETE /api/admin/enquiries/:id
// @access  Private (Admin Only)
const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry record not found.' });
    }

    await enquiry.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comprehensive enquiry statistics for Admin Dashboard
// @route   GET /api/enquiries/stats
// @access  Private (Admin Only)
const getDashboardStats = async (req, res, next) => {
  try {
    const totalEnquiries = await Enquiry.countDocuments();
    const newEnquiries = await Enquiry.countDocuments({ status: 'New' });
    const contactedEnquiries = await Enquiry.countDocuments({ status: 'Contacted' });
    const inProgressEnquiries = await Enquiry.countDocuments({ status: 'In Progress' });
    const convertedEnquiries = await Enquiry.countDocuments({ status: 'Converted' });
    const closedEnquiries = await Enquiry.countDocuments({ status: 'Closed' });

    const totalServices = await Service.countDocuments({ isActive: true });
    const totalProjects = await Project.countDocuments({ isActive: true });
    const totalTeam = await Team.countDocuments({ isActive: true });
    const totalBlogs = await Blog.countDocuments({ isPublished: true });
    const totalQuotations = await Quotation.countDocuments();
    const totalClientProjects = await ClientProject.countDocuments();

    // Upcoming follow-ups (next 7 days)
    const upcomingFollowUps = await Enquiry.find({
      nextFollowUpDate: { $gte: new Date() },
      status: { $nin: ['Converted', 'Closed'] },
    })
      .sort({ nextFollowUpDate: 1 })
      .limit(5);

    const recentEnquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(10);
    const recentProjects = await Project.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalEnquiries,
        newEnquiries,
        contactedEnquiries,
        inProgressEnquiries,
        convertedEnquiries,
        closedEnquiries,
        totalServices,
        totalProjects,
        totalTeam,
        totalBlogs,
        totalQuotations,
        totalClientProjects,
      },
      upcomingFollowUps,
      recentEnquiries,
      recentProjects,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry,
  getDashboardStats,
};
