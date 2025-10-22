import { Request, Response } from 'express';
import authController from '../authController';
import authService from '../../services/authService';

// Mock the auth service
jest.mock('../../services/authService');

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should login user with valid credentials', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'John Doe',
        role: 'employee',
        department: 'Engineering',
        leaveBalance: 20,
        createdAt: new Date()
      };

      const mockToken = 'valid-jwt-token';

      (authService.login as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken
      });

      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Login successful',
        user: mockUser,
        token: mockToken
      });
    });

    it('should handle invalid credentials', async () => {
      (authService.login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      mockRequest.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid credentials'
      });
    });

    it('should handle missing email', async () => {
      mockRequest.body = {
        password: 'password123'
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email and password are required'
      });
    });

    it('should handle missing password', async () => {
      mockRequest.body = {
        email: 'test@example.com'
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email and password are required'
      });
    });

    it('should handle empty request body', async () => {
      mockRequest.body = {};

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email and password are required'
      });
    });

    it('should handle null request body', async () => {
      mockRequest.body = null;

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email and password are required'
      });
    });

    it('should handle undefined request body', async () => {
      mockRequest.body = undefined;

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email and password are required'
      });
    });

    it('should handle empty email string', async () => {
      mockRequest.body = {
        email: '',
        password: 'password123'
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email and password are required'
      });
    });

    it('should handle empty password string', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: ''
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email and password are required'
      });
    });

    it('should handle whitespace-only email', async () => {
      mockRequest.body = {
        email: '   ',
        password: 'password123'
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email and password are required'
      });
    });

    it('should handle whitespace-only password', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: '   '
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email and password are required'
      });
    });

    it('should handle service throwing generic error', async () => {
      (authService.login as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });

    it('should handle service throwing non-Error object', async () => {
      (authService.login as jest.Mock).mockRejectedValue('String error');

      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });

    it('should handle manager login correctly', async () => {
      const mockManager = {
        id: 'manager-1',
        email: 'manager@example.com',
        name: 'Jane Manager',
        role: 'manager',
        department: 'Management',
        leaveBalance: 25,
        createdAt: new Date()
      };

      const mockToken = 'manager-jwt-token';

      (authService.login as jest.Mock).mockResolvedValue({
        user: mockManager,
        token: mockToken
      });

      mockRequest.body = {
        email: 'manager@example.com',
        password: 'managerpassword'
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(authService.login).toHaveBeenCalledWith('manager@example.com', 'managerpassword');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Login successful',
        user: mockManager,
        token: mockToken
      });
    });

    it('should handle special characters in email', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test+tag@example.com',
        name: 'John Doe',
        role: 'employee',
        department: 'Engineering',
        leaveBalance: 20,
        createdAt: new Date()
      };

      const mockToken = 'valid-jwt-token';

      (authService.login as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken
      });

      mockRequest.body = {
        email: 'test+tag@example.com',
        password: 'password123'
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(authService.login).toHaveBeenCalledWith('test+tag@example.com', 'password123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should handle very long password', async () => {
      const longPassword = 'a'.repeat(1000);
      
      (authService.login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      mockRequest.body = {
        email: 'test@example.com',
        password: longPassword
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(authService.login).toHaveBeenCalledWith('test@example.com', longPassword);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should handle very long email', async () => {
      const longEmail = 'a'.repeat(100) + '@example.com';
      
      (authService.login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      mockRequest.body = {
        email: longEmail,
        password: 'password123'
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(authService.login).toHaveBeenCalledWith(longEmail, 'password123');
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
  });
});
