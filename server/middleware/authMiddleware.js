const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware: Protect routes
 * Validates the JWT Bearer token and attaches the authenticated user to req.user
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'eventhub_default_secret_fallback');

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized: User no longer exists'
        });
      }

      next();
    } catch (error) {
      console.error('[Auth Error]', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Invalid or expired token'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No token provided'
    });
  }
};

/**
 * Role-Based Access Control Middleware (RBAC)
 * Restricts access to specified roles (e.g. authorize('admin', 'organizer'))
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user?.role || 'guest'}' is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
