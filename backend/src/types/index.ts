export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager';
  department: string;
  leaveBalance: number;
  createdAt: Date;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: 'annual' | 'sick' | 'personal';
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string | null;
  approvedAt?: Date | null;
  rejectionReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
  duration: number;
}

export interface LeaveRequestWithEmployee extends LeaveRequest {
  employeeName: string;
  employeeEmail: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LeaveApplicationRequest {
  startDate: string;
  endDate: string;
  reason: string;
  type: 'annual' | 'sick' | 'personal';
}

export interface LeaveApprovalRequest {
  action: 'approve' | 'reject';
  rejectionReason?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface MonthlySummary {
  year: number;
  month: number;
  totalRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  pendingRequests: number;
  requests: LeaveRequestWithEmployee[];
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}
