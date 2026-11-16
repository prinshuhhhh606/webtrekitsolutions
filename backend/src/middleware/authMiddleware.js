const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'webtrek_super_secret_jwt_key_2026_production_ready');

    if (decoded.id === 'superadmin_1') {
      req.admin = {
        _id: 'superadmin_1',
        id: 'superadmin_1',
        name: 'Webtrek Super Admin',
        email: process.env.ADMIN_DEFAULT_EMAIL || 'admin@webtrekitsolutions.in',
        role: 'superadmin',
      };
      return next();
    }

    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found or has been revoked.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token verification failed.',
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.admin && (req.admin.role === 'superadmin' || req.admin.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Requires Admin privileges.',
    });
  }
};

module.exports = { protect, adminOnly };

