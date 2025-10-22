// API Response Messages
const MESSAGES = {
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
};

// HTTP Status Codes
const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
};

// User Roles
const ROLES = {
  EMPLOYEE: 'employee',
  MANAGER: 'manager'
};

// Leave Types
const LEAVE_TYPES = {
  ANNUAL: 'annual',
  SICK: 'sick',
  PERSONAL: 'personal'
};

// Leave Status
const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Default Leave Balance
const DEFAULT_LEAVE_BALANCE = 20;

// Mock User Credentials (for demo purposes)
const MOCK_CREDENTIALS = {
  'john.doe@company.com': { password: 'password123', userId: 'user-1' },
  'jane.smith@company.com': { password: 'password123', userId: 'user-2' },
  'mike.johnson@company.com': { password: 'password123', userId: 'user-3' },
  'sarah.wilson@company.com': { password: 'password123', userId: 'user-4' },
  'david.brown@company.com': { password: 'password123', userId: 'user-5' }
};

module.exports = {
  MESSAGES,
  STATUS_CODES,
  ROLES,
  LEAVE_TYPES,
  LEAVE_STATUS,
  DEFAULT_LEAVE_BALANCE,
  MOCK_CREDENTIALS
};
