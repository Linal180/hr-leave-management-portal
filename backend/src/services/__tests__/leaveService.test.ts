import leaveService from '../leaveService';
import { User } from '../../models/User';
import { LeaveRequest } from '../../models/LeaveRequest';

// Mock the models
jest.mock('../../models/User');
jest.mock('../../models/LeaveRequest');

describe('LeaveService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('applyForLeave', () => {
    it('should successfully apply for leave with valid data', () => {
      const mockUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'employee' as const,
        department: 'Engineering',
        leaveBalance: 20,
        createdAt: new Date()
      };

      // Mock the user lookup
      jest.spyOn(leaveService as any, 'getUserById').mockReturnValue(mockUser);

      const leaveData = {
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        reason: 'Vacation',
        type: 'annual' as const
      };

      const result = leaveService.applyForLeave('user-1', leaveData);

      expect(result).toBeDefined();
      expect(result.employeeId).toBe('user-1');
      expect(result.startDate).toBe(leaveData.startDate);
      expect(result.endDate).toBe(leaveData.endDate);
      expect(result.reason).toBe(leaveData.reason);
      expect(result.type).toBe(leaveData.type);
      expect(result.status).toBe('pending');
    });

    it('should throw error for insufficient leave balance', () => {
      const mockUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'employee' as const,
        department: 'Engineering',
        leaveBalance: 2, // Low balance
        createdAt: new Date()
      };

      jest.spyOn(leaveService as any, 'getUserById').mockReturnValue(mockUser);

      const leaveData = {
        startDate: '2024-02-01',
        endDate: '2024-02-10', // 10 days requested
        reason: 'Vacation',
        type: 'annual' as const
      };

      expect(() => {
        leaveService.applyForLeave('user-1', leaveData);
      }).toThrow('Insufficient leave balance for the requested period');
    });

    it('should throw error for past date', () => {
      const mockUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'employee' as const,
        department: 'Engineering',
        leaveBalance: 20,
        createdAt: new Date()
      };

      jest.spyOn(leaveService as any, 'getUserById').mockReturnValue(mockUser);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const leaveData = {
        startDate: yesterday.toISOString().split('T')[0],
        endDate: '2024-02-05',
        reason: 'Vacation',
        type: 'annual' as const
      };

      expect(() => {
        leaveService.applyForLeave('user-1', leaveData);
      }).toThrow('Cannot apply for leave in the past');
    });

    it('should throw error for user not found', () => {
      jest.spyOn(leaveService as any, 'getUserById').mockReturnValue(null);

      const leaveData = {
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        reason: 'Vacation',
        type: 'annual' as const
      };

      expect(() => {
        leaveService.applyForLeave('non-existent-user', leaveData);
      }).toThrow('Employee not found');
    });
  });

  describe('approveOrRejectLeave', () => {
    it('should successfully approve leave request', () => {
      const mockRequest = {
        id: 'leave-1',
        employeeId: 'user-1',
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        reason: 'Vacation',
        type: 'annual' as const,
        status: 'pending' as const,
        approve: jest.fn(),
        getDuration: jest.fn().mockReturnValue(5)
      };

      const mockUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'employee' as const,
        department: 'Engineering',
        leaveBalance: 20,
        createdAt: new Date()
      };

      jest.spyOn(leaveService as any, 'getLeaveRequestById').mockReturnValue(mockRequest);
      jest.spyOn(leaveService as any, 'getUserById').mockReturnValue(mockUser);

      const result = leaveService.approveOrRejectLeave('leave-1', 'manager-1', 'approve');

      expect(result.message).toBe('Leave request approved successfully');
      expect(mockRequest.approve).toHaveBeenCalledWith('manager-1');
      expect(mockUser.leaveBalance).toBe(15); // 20 - 5 days
    });

    it('should successfully reject leave request', () => {
      const mockRequest = {
        id: 'leave-1',
        employeeId: 'user-1',
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        reason: 'Vacation',
        type: 'annual' as const,
        status: 'pending' as const,
        reject: jest.fn(),
        getDuration: jest.fn().mockReturnValue(5)
      };

      const mockUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'employee' as const,
        department: 'Engineering',
        leaveBalance: 20,
        createdAt: new Date()
      };

      jest.spyOn(leaveService as any, 'getLeaveRequestById').mockReturnValue(mockRequest);
      jest.spyOn(leaveService as any, 'getUserById').mockReturnValue(mockUser);

      const result = leaveService.approveOrRejectLeave(
        'leave-1', 
        'manager-1', 
        'reject', 
        'Business needs'
      );

      expect(result.message).toBe('Leave request rejected successfully');
      expect(mockRequest.reject).toHaveBeenCalledWith('manager-1', 'Business needs');
      expect(mockUser.leaveBalance).toBe(20); // Should remain unchanged
    });

    it('should throw error for insufficient balance during approval', () => {
      const mockRequest = {
        id: 'leave-1',
        employeeId: 'user-1',
        startDate: '2024-02-01',
        endDate: '2024-02-10',
        reason: 'Vacation',
        type: 'annual' as const,
        status: 'pending' as const,
        getDuration: jest.fn().mockReturnValue(10)
      };

      const mockUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'employee' as const,
        department: 'Engineering',
        leaveBalance: 5, // Insufficient balance
        createdAt: new Date()
      };

      jest.spyOn(leaveService as any, 'getLeaveRequestById').mockReturnValue(mockRequest);
      jest.spyOn(leaveService as any, 'getUserById').mockReturnValue(mockUser);

      expect(() => {
        leaveService.approveOrRejectLeave('leave-1', 'manager-1', 'approve');
      }).toThrow('Insufficient leave balance');
    });

    it('should throw error for leave request not found', () => {
      jest.spyOn(leaveService as any, 'getLeaveRequestById').mockReturnValue(null);

      expect(() => {
        leaveService.approveOrRejectLeave('non-existent', 'manager-1', 'approve');
      }).toThrow('Leave request not found');
    });

    it('should throw error for already processed request', () => {
      const mockRequest = {
        id: 'leave-1',
        employeeId: 'user-1',
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        reason: 'Vacation',
        type: 'annual' as const,
        status: 'approved' as const, // Already processed
        getDuration: jest.fn().mockReturnValue(5)
      };

      jest.spyOn(leaveService as any, 'getLeaveRequestById').mockReturnValue(mockRequest);

      expect(() => {
        leaveService.approveOrRejectLeave('leave-1', 'manager-1', 'approve');
      }).toThrow('Leave request has already been processed');
    });
  });
});
