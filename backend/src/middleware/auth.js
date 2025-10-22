const { ROLES, MESSAGES, STATUS_CODES } = require('../utils/constants');

// Simple mock authentication middleware
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.ERROR.UNAUTHORIZED
    });
  }

  const token = authHeader.substring(7);
  
  // In a real application, you would verify the JWT token here
  // For this demo, we'll use a simple token format: "userId:role"
  try {
    const [userId, role] = token.split(':');
    
    if (!userId || !role) {
      throw new Error('Invalid token format');
    }

    // Attach user info to request
    req.user = {
      id: userId,
      role: role
    };

    next();
  } catch (error) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.ERROR.UNAUTHORIZED
    });
  }
};

// Role-based authorization middleware
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.ERROR.UNAUTHORIZED
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: MESSAGES.ERROR.FORBIDDEN
      });
    }

    next();
  };
};

// Manager-only middleware
const requireManager = requireRole([ROLES.MANAGER]);

// Employee-only middleware
const requireEmployee = requireRole([ROLES.EMPLOYEE]);

module.exports = {
  authenticateUser,
  requireRole,
  requireManager,
  requireEmployee
};
