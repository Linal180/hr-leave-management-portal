const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const { checkDateOverlap, validateDateRange } = require('../utils/validation');
const { MESSAGES, LEAVE_STATUS } = require('../utils/constants');

class LeaveService {
  constructor() {
    this.leaveRequests = LeaveRequest.createMockRequests();
    this.users = User.createMockUsers();
  }

  // Get all leave requests
  getAllLeaveRequests() {
    return this.leaveRequests.map(request => {
      const employee = this.users.find(user => user.id === request.employeeId);
      return {
        ...request.toJSON(),
        employeeName: employee ? employee.name : 'Unknown',
        employeeEmail: employee ? employee.email : 'Unknown'
      };
    });
  }

  // Get pending leave requests for managers
  getPendingLeaveRequests() {
    return this.leaveRequests
      .filter(request => request.status === LEAVE_STATUS.PENDING)
      .map(request => {
        const employee = this.users.find(user => user.id === request.employeeId);
        return {
          ...request.toJSON(),
          employeeName: employee ? employee.name : 'Unknown',
          employeeEmail: employee ? employee.email : 'Unknown'
        };
      });
  }

  // Get leave requests by employee ID
  getLeaveRequestsByEmployee(employeeId) {
    return this.leaveRequests
      .filter(request => request.employeeId === employeeId)
      .map(request => request.toJSON());
  }

  // Apply for leave
  applyForLeave(employeeId, leaveData) {
    const employee = this.users.find(user => user.id === employeeId);
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
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

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
  approveOrRejectLeave(requestId, managerId, action, rejectionReason = null) {
    const request = this.leaveRequests.find(req => req.id === requestId);
    if (!request) {
      throw new Error('Leave request not found');
    }

    if (request.status !== LEAVE_STATUS.PENDING) {
      throw new Error('Leave request has already been processed');
    }

    const employee = this.users.find(user => user.id === request.employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    if (action === 'approve') {
      // Check leave balance before approval
      if (employee.leaveBalance < request.getDuration()) {
        throw new Error(MESSAGES.ERROR.INSUFFICIENT_BALANCE);
      }

      // Approve the request
      request.approve(managerId);
      
      // Deduct leave balance
      employee.leaveBalance -= request.getDuration();
      
      return {
        message: MESSAGES.SUCCESS.LEAVE_APPROVED,
        request: request.toJSON()
      };
    } else if (action === 'reject') {
      // Reject the request
      request.reject(managerId, rejectionReason);
      
      return {
        message: MESSAGES.SUCCESS.LEAVE_REJECTED,
        request: request.toJSON()
      };
    } else {
      throw new Error('Invalid action. Must be approve or reject');
    }
  }

  // Get monthly leave summary
  getMonthlyLeaveSummary(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const monthlyRequests = this.leaveRequests.filter(request => {
      const requestDate = new Date(request.startDate);
      return requestDate >= startDate && requestDate <= endDate;
    });

    const summary = {
      year,
      month,
      totalRequests: monthlyRequests.length,
      approvedRequests: monthlyRequests.filter(req => req.status === LEAVE_STATUS.APPROVED).length,
      rejectedRequests: monthlyRequests.filter(req => req.status === LEAVE_STATUS.REJECTED).length,
      pendingRequests: monthlyRequests.filter(req => req.status === LEAVE_STATUS.PENDING).length,
      requests: monthlyRequests.map(request => {
        const employee = this.users.find(user => user.id === request.employeeId);
        return {
          ...request.toJSON(),
          employeeName: employee ? employee.name : 'Unknown'
        };
      })
    };

    return summary;
  }

  // Get user by ID
  getUserById(userId) {
    return this.users.find(user => user.id === userId);
  }

  // Get leave request by ID
  getLeaveRequestById(requestId) {
    return this.leaveRequests.find(request => request.id === requestId);
  }
}

module.exports = new LeaveService();
