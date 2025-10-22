import { Request, Response, NextFunction } from 'express';
import { ROLES, MESSAGES, STATUS_CODES } from '../utils/constants';
import { AuthenticatedRequest } from '../types';

// Simple mock authentication middleware
export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.ERROR.UNAUTHORIZED
    });
    return;
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
    res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.ERROR.UNAUTHORIZED
    });
  }
};

// Role-based authorization middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.ERROR.UNAUTHORIZED
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: MESSAGES.ERROR.FORBIDDEN
      });
      return;
    }

    next();
  };
};

// Manager-only middleware
export const requireManager = requireRole([ROLES.MANAGER]);

// Employee-only middleware
export const requireEmployee = requireRole([ROLES.EMPLOYEE]);
