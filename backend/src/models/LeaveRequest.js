const { v4: uuidv4 } = require('uuid');

class LeaveRequest {
  constructor(id, employeeId, startDate, endDate, reason, type = 'annual', status = 'pending') {
    this.id = id || uuidv4();
    this.employeeId = employeeId;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
    this.reason = reason;
    this.type = type; // 'annual', 'sick', 'personal'
    this.status = status; // 'pending', 'approved', 'rejected'
    this.approvedBy = null;
    this.approvedAt = null;
    this.rejectionReason = null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static createMockRequests() {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    return [
      new LeaveRequest(
        'leave-1',
        'user-1',
        nextWeek.toISOString().split('T')[0],
        new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        'Family vacation',
        'annual',
        'pending'
      ),
      new LeaveRequest(
        'leave-2',
        'user-2',
        new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        'Medical appointment',
        'sick',
        'pending'
      ),
      new LeaveRequest(
        'leave-3',
        'user-1',
        lastWeek.toISOString().split('T')[0],
        twoWeeksAgo.toISOString().split('T')[0],
        'Personal matters',
        'personal',
        'approved'
      ),
      new LeaveRequest(
        'leave-4',
        'user-5',
        new Date(nextWeek.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date(nextWeek.getTime() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        'Wedding',
        'annual',
        'pending'
      )
    ];
  }

  approve(managerId) {
    this.status = 'approved';
    this.approvedBy = managerId;
    this.approvedAt = new Date();
    this.updatedAt = new Date();
  }

  reject(managerId, reason) {
    this.status = 'rejected';
    this.approvedBy = managerId;
    this.approvedAt = new Date();
    this.rejectionReason = reason;
    this.updatedAt = new Date();
  }

  getDuration() {
    const timeDiff = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates
  }

  toJSON() {
    return {
      id: this.id,
      employeeId: this.employeeId,
      startDate: this.startDate.toISOString().split('T')[0],
      endDate: this.endDate.toISOString().split('T')[0],
      reason: this.reason,
      type: this.type,
      status: this.status,
      approvedBy: this.approvedBy,
      approvedAt: this.approvedAt,
      rejectionReason: this.rejectionReason,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      duration: this.getDuration()
    };
  }
}

module.exports = LeaveRequest;
