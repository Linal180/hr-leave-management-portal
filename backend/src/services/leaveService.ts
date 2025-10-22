import { LeaveRequest } from '../models/LeaveRequest';
import { User } from '../models/User';
import { checkDateOverlap, validateDateRange } from '../utils/validation';
import { MESSAGES, LEAVE_STATUS } from '../utils/constants';
import UserService from './userService';
import { 
  LeaveRequestWithEmployee, 
  LeaveApplicationRequest, 
  LeaveApprovalRequest,
  MonthlySummary 
} from '../types';

class LeaveService {
  private leaveRequests: LeaveRequest[];
  private userService: UserService;

  constructor() {
    this.leaveRequests = LeaveRequest.createMockRequests();
    this.userService = UserService.getInstance();
  }

  // Get all leave requests
  getAllLeaveRequests(): LeaveRequestWithEmployee[] {
    return this.leaveRequests.map(request => {
      const employee = this.userService.getUserById(request.employeeId);
      return {
        ...request.toJSON(),
        employeeName: employee ? employee.name : 'Unknown',
        employeeEmail: employee ? employee.email : 'Unknown'
      };
    });
  }

  // Get pending leave requests for managers
  getPendingLeaveRequests(): LeaveRequestWithEmployee[] {
    return this.leaveRequests
      .filter(request => request.status === LEAVE_STATUS.PENDING)
      .map(request => {
        const employee = this.userService.getUserById(request.employeeId);
        return {
          ...request.toJSON(),
          employeeName: employee ? employee.name : 'Unknown',
          employeeEmail: employee ? employee.email : 'Unknown'
        };
      });
  }

  // Get leave requests by employee ID
  getLeaveRequestsByEmployee(employeeId: string) {
    return this.leaveRequests
      .filter(request => request.employeeId === employeeId)
      .map(request => request.toJSON());
  }

  // Apply for leave
  applyForLeave(employeeId: string, leaveData: LeaveApplicationRequest) {
    const employee = this.userService.getUserById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    // Validate date range
    const dateValidation = validateDateRange(leaveData.startDate, leaveData.endDate);
    if (!dateValidation.isValid) {
      throw new Error(dateValidation.error);
    }

    // Check for overlapping dates
    const employeeRequests = this.leaveRequests.filter(
      request => request.employeeId === employeeId
    );
    
    const overlapCheck = checkDateOverlap(
      leaveData.startDate,
      leaveData.endDate,
      employeeRequests
    );

    if (overlapCheck.hasOverlap) {
      throw new Error(MESSAGES.ERROR.DATE_OVERLAP);
    }

    // Calculate leave duration
    const startDate = new Date(leaveData.startDate);
    const endDate = new Date(leaveData.endDate);
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Check leave balance
    if (employee.leaveBalance < duration) {
      throw new Error(MESSAGES.ERROR.INSUFFICIENT_BALANCE);
    }

    // Create new leave request
    const newRequest = new LeaveRequest(
      undefined,
      employeeId,
      leaveData.startDate,
      leaveData.endDate,
      leaveData.reason,
      leaveData.type,
      LEAVE_STATUS.PENDING
    );

    this.leaveRequests.push(newRequest);
    return newRequest.toJSON();
  }

  // Approve or reject leave request
  approveOrRejectLeave(
    requestId: string, 
    managerId: string, 
    action: 'approve' | 'reject', 
    rejectionReason?: string
  ) {
    const request = this.leaveRequests.find(req => req.id === requestId);
    if (!request) {
      throw new Error('Leave request not found');
    }

    if (request.status !== LEAVE_STATUS.PENDING) {
      throw new Error('Leave request has already been processed');
    }

    const employee = this.userService.getUserById(request.employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    if (action === 'approve') {
      // Check leave balance before approval
      if (employee.leaveBalance < request.getDuration()) {
        throw new Error(MESSAGES.ERROR.INSUFFICIENT_BALANCE);
      }

      console.log(`Approving leave request ${requestId} for employee ${employee.id}`);
      console.log(`Employee leave balance before: ${employee.leaveBalance}`);
      console.log(`Leave duration: ${request.getDuration()}`);

      // Approve the request
      request.approve(managerId);
      
      // Deduct leave balance
      employee.leaveBalance -= request.getDuration();
      
      // Update the user in the shared UserService
      this.userService.updateUser(employee);
      
      console.log(`Employee leave balance after: ${employee.leaveBalance}`);
      
      return {
        message: MESSAGES.SUCCESS.LEAVE_APPROVED,
        request: request.toJSON()
      };
    } else if (action === 'reject') {
      // Reject the request
      request.reject(managerId, rejectionReason || 'No reason provided');
      
      return {
        message: MESSAGES.SUCCESS.LEAVE_REJECTED,
        request: request.toJSON()
      };
    } else {
      throw new Error('Invalid action. Must be approve or reject');
    }
  }

  // Get monthly leave summary
  getMonthlyLeaveSummary(year: number, month: number): MonthlySummary {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const monthlyRequests = this.leaveRequests.filter(request => {
      const requestDate = new Date(request.startDate);
      return requestDate >= startDate && requestDate <= endDate;
    });

    const summary: MonthlySummary = {
      year,
      month,
      totalRequests: monthlyRequests.length,
      approvedRequests: monthlyRequests.filter(req => req.status === LEAVE_STATUS.APPROVED).length,
      rejectedRequests: monthlyRequests.filter(req => req.status === LEAVE_STATUS.REJECTED).length,
      pendingRequests: monthlyRequests.filter(req => req.status === LEAVE_STATUS.PENDING).length,
      requests: monthlyRequests.map(request => {
        const employee = this.userService.getUserById(request.employeeId);
        return {
          ...request.toJSON(),
          employeeName: employee ? employee.name : 'Unknown',
          employeeEmail: employee ? employee.email : 'Unknown'
        };
      })
    };

    return summary;
  }

  // Get user by ID
  getUserById(userId: string) {
    return this.users.find(user => user.id === userId);
  }

  // Get leave request by ID
  getLeaveRequestById(requestId: string) {
    return this.leaveRequests.find(request => request.id === requestId);
  }
}

export default new LeaveService();
