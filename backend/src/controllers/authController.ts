import { Request, Response } from 'express';
import authService from '../services/authService';
import { MESSAGES, STATUS_CODES } from '../utils/constants';
import { AuthenticatedRequest } from '../types';

export class AuthController {
  // Login endpoint
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      const result = authService.login(email, password);
      
      res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.SUCCESS.LOGIN_SUCCESS,
        data: result
      });
    } catch (error) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.ERROR.INVALID_CREDENTIALS
      });
    }
  }

  // Get current user profile
  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      console.log('Getting profile for user ID:', req.user.id);
      const user = authService.getUserById(req.user.id);
      
      if (!user) {
        console.log('User not found for ID:', req.user.id);
        res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: MESSAGES.ERROR.NOT_FOUND
        });
        return;
      }

      console.log('User profile found:', user.toJSON());
      res.status(STATUS_CODES.OK).json({
        success: true,
        data: user.toJSON()
      });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_ERROR).json({
        success: false,
        message: MESSAGES.ERROR.INTERNAL_ERROR
      });
    }
  }

  // Get all users (for admin purposes)
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = authService.getAllUsers();
      
      res.status(STATUS_CODES.OK).json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_ERROR).json({
        success: false,
        message: MESSAGES.ERROR.INTERNAL_ERROR
      });
    }
  }
}

export default new AuthController();
