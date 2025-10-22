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

    it('should throw error for already rejected request', () => {
      const mockRequest = {
        id: 'leave-1',
        employeeId: 'user-1',
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        reason: 'Vacation',
        type: 'annual' as const,
        status: 'rejected' as const, // Already processed
        getDuration: jest.fn().mockReturnValue(5)
      };

      jest.spyOn(leaveService as any, 'getLeaveRequestById').mockReturnValue(mockRequest);

      expect(() => {
        leaveService.approveOrRejectLeave('leave-1', 'manager-1', 'approve');
      }).toThrow('Leave request has already been processed');
    });

    it('should throw error for employee not found during approval', () => {
      const mockRequest = {
        id: 'leave-1',
        employeeId: 'non-existent-user',
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        reason: 'Vacation',
        type: 'annual' as const,
        status: 'pending' as const,
        getDuration: jest.fn().mockReturnValue(5)
      };

      jest.spyOn(leaveService as any, 'getLeaveRequestById').mockReturnValue(mockRequest);
      jest.spyOn(leaveService as any, 'getUserById').mockReturnValue(null);

      expect(() => {
        leaveService.approveOrRejectLeave('leave-1', 'manager-1', 'approve');
      }).toThrow('Employee not found');
    });

    it('should handle rejection with empty rejection reason', () => {
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
        '' // Empty rejection reason
      );

      expect(result.message).toBe('Leave request rejected successfully');
      expect(mockRequest.reject).toHaveBeenCalledWith('manager-1', '');
    });

    it('should handle rejection with undefined rejection reason', () => {
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
        'reject'
        // No rejection reason provided
      );

      expect(result.message).toBe('Leave request rejected successfully');
      expect(mockRequest.reject).toHaveBeenCalledWith('manager-1', undefined);
    });
  });

  describe('getPendingLeaveRequests', () => {
    it('should return only pending requests', () => {
      const mockRequests = [
        { id: '1', status: 'pending', employeeId: 'user-1' },
        { id: '2', status: 'approved', employeeId: 'user-2' },
        { id: '3', status: 'pending', employeeId: 'user-3' },
        { id: '4', status: 'rejected', employeeId: 'user-4' }
      ];

      jest.spyOn(leaveService as any, 'leaveRequests', 'get').mockReturnValue(mockRequests);

      const result = leaveService.getPendingLeaveRequests();

      expect(result).toHaveLength(2);
      expect(result.every(req => req.status === 'pending')).toBe(true);
    });

    it('should return empty array when no pending requests', () => {
      const mockRequests = [
        { id: '1', status: 'approved', employeeId: 'user-1' },
        { id: '2', status: 'rejected', employeeId: 'user-2' }
      ];

      jest.spyOn(leaveService as any, 'leaveRequests', 'get').mockReturnValue(mockRequests);

      const result = leaveService.getPendingLeaveRequests();

      expect(result).toHaveLength(0);
    });

    it('should handle empty requests array', () => {
      jest.spyOn(leaveService as any, 'leaveRequests', 'get').mockReturnValue([]);

      const result = leaveService.getPendingLeaveRequests();

      expect(result).toHaveLength(0);
    });
  });

  describe('getAllLeaveRequests', () => {
    it('should return all leave requests with employee information', () => {
      const mockRequests = [
        { id: '1', status: 'pending', employeeId: 'user-1' },
        { id: '2', status: 'approved', employeeId: 'user-2' }
      ];

      const mockUsers = [
        { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
        { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com' }
      ];

      jest.spyOn(leaveService as any, 'leaveRequests', 'get').mockReturnValue(mockRequests);
      jest.spyOn(leaveService as any, 'users', 'get').mockReturnValue(mockUsers);

      const result = leaveService.getAllLeaveRequests();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('employeeName', 'John Doe');
      expect(result[0]).toHaveProperty('employeeEmail', 'john@example.com');
      expect(result[1]).toHaveProperty('employeeName', 'Jane Smith');
      expect(result[1]).toHaveProperty('employeeEmail', 'jane@example.com');
    });

    it('should handle requests with unknown employees', () => {
      const mockRequests = [
        { id: '1', status: 'pending', employeeId: 'unknown-user' }
      ];

      const mockUsers = [
        { id: 'user-1', name: 'John Doe', email: 'john@example.com' }
      ];

      jest.spyOn(leaveService as any, 'leaveRequests', 'get').mockReturnValue(mockRequests);
      jest.spyOn(leaveService as any, 'users', 'get').mockReturnValue(mockUsers);

      const result = leaveService.getAllLeaveRequests();

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('employeeName', 'Unknown');
      expect(result[0]).toHaveProperty('employeeEmail', 'Unknown');
    });
  });

  describe('getMonthlyLeaveSummary', () => {
    it('should return correct monthly summary', () => {
      const mockRequests = [
        { 
          id: '1', 
          startDate: '2024-02-01', 
          endDate: '2024-02-05', 
          status: 'approved',
          employeeId: 'user-1'
        },
        { 
          id: '2', 
          startDate: '2024-02-10', 
          endDate: '2024-02-12', 
          status: 'rejected',
          employeeId: 'user-2'
        },
        { 
          id: '3', 
          startDate: '2024-02-15', 
          endDate: '2024-02-16', 
          status: 'pending',
          employeeId: 'user-3'
        },
        { 
          id: '4', 
          startDate: '2024-03-01', 
          endDate: '2024-03-05', 
          status: 'approved',
          employeeId: 'user-4'
        }
      ];

      const mockUsers = [
        { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
        { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com' },
        { id: 'user-3', name: 'Bob Wilson', email: 'bob@example.com' }
      ];

      jest.spyOn(leaveService as any, 'leaveRequests', 'get').mockReturnValue(mockRequests);
      jest.spyOn(leaveService as any, 'users', 'get').mockReturnValue(mockUsers);

      const result = leaveService.getMonthlyLeaveSummary(2024, 2);

      expect(result.year).toBe(2024);
      expect(result.month).toBe(2);
      expect(result.totalRequests).toBe(3);
      expect(result.approvedRequests).toBe(1);
      expect(result.rejectedRequests).toBe(1);
      expect(result.pendingRequests).toBe(1);
      expect(result.requests).toHaveLength(3);
    });

    it('should return empty summary for month with no requests', () => {
      const mockRequests = [
        { 
          id: '1', 
          startDate: '2024-02-01', 
          endDate: '2024-02-05', 
          status: 'approved',
          employeeId: 'user-1'
        }
      ];

      jest.spyOn(leaveService as any, 'leaveRequests', 'get').mockReturnValue(mockRequests);

      const result = leaveService.getMonthlyLeaveSummary(2024, 3);

      expect(result.year).toBe(2024);
      expect(result.month).toBe(3);
      expect(result.totalRequests).toBe(0);
      expect(result.approvedRequests).toBe(0);
      expect(result.rejectedRequests).toBe(0);
      expect(result.pendingRequests).toBe(0);
      expect(result.requests).toHaveLength(0);
    });

    it('should handle edge case dates correctly', () => {
      const mockRequests = [
        { 
          id: '1', 
          startDate: '2024-02-29', // Leap year
          endDate: '2024-02-29', 
          status: 'approved',
          employeeId: 'user-1'
        }
      ];

      const mockUsers = [
        { id: 'user-1', name: 'John Doe', email: 'john@example.com' }
      ];

      jest.spyOn(leaveService as any, 'leaveRequests', 'get').mockReturnValue(mockRequests);
      jest.spyOn(leaveService as any, 'users', 'get').mockReturnValue(mockUsers);

      const result = leaveService.getMonthlyLeaveSummary(2024, 2);

      expect(result.totalRequests).toBe(1);
      expect(result.requests[0].startDate).toBe('2024-02-29');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle zero leave balance correctly', () => {
      const mockUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'employee' as const,
        department: 'Engineering',
        leaveBalance: 0, // Zero balance
        createdAt: new Date()
      };

      jest.spyOn(leaveService as any, 'getUserById').mockReturnValue(mockUser);

      const leaveData = {
        startDate: '2024-02-01',
        endDate: '2024-02-01', // 1 day request
        reason: 'Vacation',
        type: 'annual' as const
      };

      expect(() => {
        leaveService.applyForLeave('user-1', leaveData);
      }).toThrow('Insufficient leave balance for the requested period');
    });

    it('should handle very long leave periods', () => {
      const mockUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'employee' as const,
        department: 'Engineering',
        leaveBalance: 100, // High balance
        createdAt: new Date()
      };

      jest.spyOn(leaveService as any, 'getUserById').mockReturnValue(mockUser);

      const leaveData = {
        startDate: '2024-02-01',
        endDate: '2024-12-31', // Very long period
        reason: 'Extended vacation',
        type: 'annual' as const
      };

      expect(() => {
        leaveService.applyForLeave('user-1', leaveData);
      }).toThrow('Insufficient leave balance for the requested period');
    });

    it('should handle concurrent leave requests for same user', () => {
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

      const leaveData1 = {
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        reason: 'Vacation 1',
        type: 'annual' as const
      };

      const leaveData2 = {
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        reason: 'Vacation 2',
        type: 'annual' as const
      };

      // First request should succeed
      const result1 = leaveService.applyForLeave('user-1', leaveData1);
      expect(result1).toBeDefined();

      // Second request should also succeed (no overlap check in applyForLeave)
      const result2 = leaveService.applyForLeave('user-1', leaveData2);
      expect(result2).toBeDefined();
    });

    it('should handle invalid date formats gracefully', () => {
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

      const leaveData = {
        startDate: 'invalid-date',
        endDate: '2024-02-05',
        reason: 'Vacation',
        type: 'annual' as const
      };

      expect(() => {
        leaveService.applyForLeave('user-1', leaveData);
      }).toThrow('Cannot apply for leave in the past');
    });
  });
});
