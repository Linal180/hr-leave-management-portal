import { Request, Response } from 'express';
import leaveService from '../services/leaveService';
import { MESSAGES, STATUS_CODES } from '../utils/constants';
import { AuthenticatedRequest } from '../types';

export class LeaveController {
  // Apply for leave
  async applyForLeave(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const leaveData = req.body;
      const employeeId = req.user.id;

      const result = leaveService.applyForLeave(employeeId, leaveData);

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: MESSAGES.SUCCESS.LEAVE_APPLIED,
        data: result
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : MESSAGES.ERROR.INTERNAL_ERROR;
      
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: errorMessage
      });
    }
  }

  // Get pending leave requests (for managers)
  async getPendingLeaveRequests(req: Request, res: Response): Promise<void> {
    try {
      const pendingRequests = leaveService.getPendingLeaveRequests();

      res.status(STATUS_CODES.OK).json({
        success: true,
        data: pendingRequests
      });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_ERROR).json({
        success: false,
        message: MESSAGES.ERROR.INTERNAL_ERROR
      });
    }
  }

  // Get all leave requests
  async getAllLeaveRequests(req: Request, res: Response): Promise<void> {
    try {
      const allRequests = leaveService.getAllLeaveRequests();

      res.status(STATUS_CODES.OK).json({
        success: true,
        data: allRequests
      });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_ERROR).json({
        success: false,
        message: MESSAGES.ERROR.INTERNAL_ERROR
      });
    }
  }

  // Get leave requests by employee
  async getEmployeeLeaveRequests(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const employeeId = req.user.id;
      const requests = leaveService.getLeaveRequestsByEmployee(employeeId);

      res.status(STATUS_CODES.OK).json({
        success: true,
        data: requests
      });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_ERROR).json({
        success: false,
        message: MESSAGES.ERROR.INTERNAL_ERROR
      });
    }
  }

  // Approve or reject leave request
  async approveOrRejectLeave(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { action, rejectionReason } = req.body;
      const managerId = req.user.id;

      const result = leaveService.approveOrRejectLeave(id, managerId, action, rejectionReason);

      res.status(STATUS_CODES.OK).json({
        success: true,
        message: result.message,
        data: result.request
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : MESSAGES.ERROR.INTERNAL_ERROR;
      
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: errorMessage
      });
    }
  }

  // Get monthly leave summary
  async getMonthlySummary(req: Request, res: Response): Promise<void> {
    try {
      const { year, month } = req.query;
      
      if (!year || !month) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: 'Year and month are required'
        });
        return;
      }

      const summary = leaveService.getMonthlyLeaveSummary(
        parseInt(year as string, 10),
        parseInt(month as string, 10)
      );

      res.status(STATUS_CODES.OK).json({
        success: true,
        data: summary
      });
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_ERROR).json({
        success: false,
        message: MESSAGES.ERROR.INTERNAL_ERROR
      });
    }
  }
}

export default new LeaveController();
