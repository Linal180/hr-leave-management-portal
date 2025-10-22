import { v4 as uuidv4 } from 'uuid';
import { LeaveRequest as ILeaveRequest } from '../types';

export class LeaveRequest implements ILeaveRequest {
  public id: string;
  public employeeId: string;
  public startDate: string;
  public endDate: string;
  public reason: string;
  public type: 'annual' | 'sick' | 'personal';
  public status: 'pending' | 'approved' | 'rejected';
  public approvedBy?: string | null;
  public approvedAt?: Date | null;
  public rejectionReason?: string | null;
  public createdAt: Date;
  public updatedAt: Date;
  public duration: number;

  constructor(
    id?: string,
    employeeId?: string,
    startDate?: string,
    endDate?: string,
    reason?: string,
    type: 'annual' | 'sick' | 'personal' = 'annual',
    status: 'pending' | 'approved' | 'rejected' = 'pending'
  ) {
    this.id = id || uuidv4();
    this.employeeId = employeeId || '';
    this.startDate = startDate || '';
    this.endDate = endDate || '';
    this.reason = reason || '';
    this.type = type;
    this.status = status;
    this.approvedBy = null;
    this.approvedAt = null;
    this.rejectionReason = null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.duration = this.getDuration();
  }

  static createMockRequests(): LeaveRequest[] {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    // Add some October 2025 data for testing
    const oct2025 = new Date('2025-10-15');
    const oct2025End = new Date('2025-10-17');
    const oct2025Pending = new Date('2025-10-20');
    const oct2025PendingEnd = new Date('2025-10-22');

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
        twoWeeksAgo.toISOString().split('T')[0],
        lastWeek.toISOString().split('T')[0],
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
      ),
      // October 2025 data
      new LeaveRequest(
        'leave-5',
        'user-1',
        oct2025.toISOString().split('T')[0],
        oct2025End.toISOString().split('T')[0],
        'Conference attendance',
        'annual',
        'approved'
      ),
      new LeaveRequest(
        'leave-6',
        'user-2',
        oct2025Pending.toISOString().split('T')[0],
        oct2025PendingEnd.toISOString().split('T')[0],
        'Personal leave',
        'personal',
        'pending'
      ),
      new LeaveRequest(
        'leave-7',
        'user-1',
        '2025-10-29',
        '2025-10-31',
        'Holiday break',
        'annual',
        'rejected'
      )
    ];
  }

  approve(managerId: string): void {
    this.status = 'approved';
    this.approvedBy = managerId;
    this.approvedAt = new Date();
    this.updatedAt = new Date();
  }

  reject(managerId: string, reason: string): void {
    this.status = 'rejected';
    this.approvedBy = managerId;
    this.approvedAt = new Date();
    this.rejectionReason = reason;
    this.updatedAt = new Date();
  }

  getDuration(): number {
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates
  }

  toJSON(): ILeaveRequest {
    return {
      id: this.id,
      employeeId: this.employeeId,
      startDate: this.startDate,
      endDate: this.endDate,
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
