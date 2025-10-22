import { Response, NextFunction } from 'express';
import { authenticateUser, requireRole, requireManager, requireEmployee } from '../auth';
import { ROLES } from '../../utils/constants';
import { AuthenticatedRequest } from '../../types';

describe('Authentication Middleware', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      user: undefined
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticateUser', () => {
    it('should authenticate valid token', () => {
      mockRequest.headers = {
        authorization: 'Bearer user-1:employee'
      };

      authenticateUser(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockRequest.user).toEqual({ id: 'user-1', role: 'employee' });
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should reject request without authorization header', () => {
      authenticateUser(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized access'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request with invalid authorization format', () => {
      mockRequest.headers = {
        authorization: 'InvalidFormat token'
      };

      authenticateUser(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized access'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token format', () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token'
      };

      authenticateUser(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized access'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle manager token correctly', () => {
      mockRequest.headers = {
        authorization: 'Bearer manager-1:manager'
      };

      authenticateUser(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockRequest.user).toEqual({ id: 'manager-1', role: 'manager' });
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should handle token with extra whitespace', () => {
      mockRequest.headers = {
        authorization: '  Bearer   user-1:employee   '
      };

      authenticateUser(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockRequest.user).toEqual({ id: 'user-1', role: 'employee' });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle token with missing role', () => {
      mockRequest.headers = {
        authorization: 'Bearer user-1'
      };

      authenticateUser(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized access'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle token with missing user ID', () => {
      mockRequest.headers = {
        authorization: 'Bearer :employee'
      };

      authenticateUser(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized access'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireRole', () => {
    beforeEach(() => {
      // Set up authenticated user
      mockRequest.user = { id: 'user-1', role: ROLES.EMPLOYEE };
    });

    it('should authorize user with correct role', () => {
      const authorizeEmployee = requireRole([ROLES.EMPLOYEE]);
      
      authorizeEmployee(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should authorize user with one of multiple allowed roles', () => {
      const authorizeEmployeeOrManager = requireRole([ROLES.EMPLOYEE, ROLES.MANAGER]);
      
      authorizeEmployeeOrManager(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should reject user with unauthorized role', () => {
      const authorizeManager = requireRole([ROLES.MANAGER]);
      
      authorizeManager(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access forbidden'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request without authenticated user', () => {
      mockRequest.user = undefined;
      const authorizeEmployee = requireRole([ROLES.EMPLOYEE]);
      
      authorizeEmployee(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized access'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle empty roles array', () => {
      const authorizeNone = requireRole([]);
      
      authorizeNone(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access forbidden'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should authorize manager role correctly', () => {
      mockRequest.user = { id: 'manager-1', role: ROLES.MANAGER };
      const authorizeManager = requireRole([ROLES.MANAGER]);
      
      authorizeManager(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe('requireManager', () => {
    it('should authorize manager', () => {
      mockRequest.user = { id: 'manager-1', role: ROLES.MANAGER };
      
      requireManager(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should reject employee', () => {
      mockRequest.user = { id: 'user-1', role: ROLES.EMPLOYEE };
      
      requireManager(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access forbidden'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireEmployee', () => {
    it('should authorize employee', () => {
      mockRequest.user = { id: 'user-1', role: ROLES.EMPLOYEE };
      
      requireEmployee(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should reject manager', () => {
      mockRequest.user = { id: 'manager-1', role: ROLES.MANAGER };
      
      requireEmployee(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access forbidden'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Integration Tests', () => {
    it('should work with both middleware functions together', () => {
      mockRequest.headers = {
        authorization: 'Bearer user-1:employee'
      };

      // First authenticate
      authenticateUser(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);
      expect(mockRequest.user).toEqual({ id: 'user-1', role: 'employee' });
      expect(mockNext).toHaveBeenCalled();

      // Reset next mock
      (mockNext as jest.Mock).mockClear();

      // Then authorize
      const authorizeEmployee = requireRole([ROLES.EMPLOYEE]);
      authorizeEmployee(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should fail authorization after successful authentication', () => {
      mockRequest.headers = {
        authorization: 'Bearer user-1:employee'
      };

      // First authenticate
      authenticateUser(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);
      expect(mockRequest.user).toEqual({ id: 'user-1', role: 'employee' });
      expect(mockNext).toHaveBeenCalled();

      // Reset next mock
      (mockNext as jest.Mock).mockClear();

      // Then authorize with wrong role
      const authorizeManager = requireRole([ROLES.MANAGER]);
      authorizeManager(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access forbidden'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});