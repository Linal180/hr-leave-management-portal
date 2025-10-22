// API Response Messages
export const MESSAGES = {
  SUCCESS: {
    LEAVE_APPLIED: 'Leave request submitted successfully',
    LEAVE_APPROVED: 'Leave request approved successfully',
    LEAVE_REJECTED: 'Leave request rejected successfully',
    LOGIN_SUCCESS: 'Login successful'
  },
  ERROR: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation error',
    INSUFFICIENT_BALANCE: 'Insufficient leave balance',
    DATE_OVERLAP: 'Leave dates overlap with existing approved request',
    PAST_DATE: 'Cannot apply for leave in the past',
    INVALID_DATE_RANGE: 'Invalid date range',
    INTERNAL_ERROR: 'Internal server error'
  }
} as const;

// HTTP Status Codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
} as const;

// User Roles
export const ROLES = {
  EMPLOYEE: 'employee',
  MANAGER: 'manager'
} as const;

// Leave Types
export const LEAVE_TYPES = {
  ANNUAL: 'annual',
  SICK: 'sick',
  PERSONAL: 'personal'
} as const;

// Leave Status
export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

// Default Leave Balance
export const DEFAULT_LEAVE_BALANCE = 20;

// Mock User Credentials (for demo purposes)
export const MOCK_CREDENTIALS: Record<string, { password: string; userId: string }> = {
  'john.doe@company.com': { password: 'password123', userId: 'user-1' },
  'jane.smith@company.com': { password: 'password123', userId: 'user-2' },
  'mike.johnson@company.com': { password: 'password123', userId: 'user-3' },
  'sarah.wilson@company.com': { password: 'password123', userId: 'user-4' },
  'david.brown@company.com': { password: 'password123', userId: 'user-5' }
};
