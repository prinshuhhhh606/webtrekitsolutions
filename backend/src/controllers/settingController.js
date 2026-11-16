const WebsiteSetting = require('../models/WebsiteSetting');

// @desc    Get website settings (public)
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res, next) => {
  try {
    let settings = await WebsiteSetting.findOne();
    if (!settings) {
      settings = await WebsiteSetting.create({});
    }
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update website settings
// @route   PUT /api/settings
// @access  Private (Admin)
const updateSettings = async (req, res, next) => {
  try {
    let settings = await WebsiteSetting.findOne();
    if (!settings) {
      settings = await WebsiteSetting.create(req.body);
    } else {
      settings = await WebsiteSetting.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Website settings updated successfully',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
};

