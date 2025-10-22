// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      PROFILE: '/auth/profile',
      USERS: '/auth/users'
    },
    LEAVE: {
      APPLY: '/leave/apply',
      PENDING: '/leave/pending',
      MY_REQUESTS: '/leave/my-requests',
      ALL: '/leave/all',
      APPROVE: '/leave/approve',
      SUMMARY: '/leave/summary'
    }
  }
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

// UI Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN_SUCCESS: 'Login successful!',
    LEAVE_APPLIED: 'Leave request submitted successfully!',
    LEAVE_APPROVED: 'Leave request approved!',
    LEAVE_REJECTED: 'Leave request rejected!',
    LOGOUT_SUCCESS: 'Logged out successfully!'
  },
  ERROR: {
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    NETWORK_ERROR: 'Network error. Please try again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    GENERIC_ERROR: 'Something went wrong. Please try again.'
  },
  INFO: {
    NO_PENDING_REQUESTS: 'No pending leave requests found.',
    NO_LEAVE_REQUESTS: 'No leave requests found.',
    LOADING: 'Loading...'
  }
} as const;

// Form Validation
export const VALIDATION_RULES = {
  EMAIL: {
    REQUIRED: 'Email is required',
    INVALID: 'Please enter a valid email address'
  },
  PASSWORD: {
    REQUIRED: 'Password is required',
    MIN_LENGTH: 'Password must be at least 6 characters'
  },
  LEAVE_REASON: {
    REQUIRED: 'Reason is required',
    MAX_LENGTH: 'Reason cannot exceed 500 characters'
  },
  DATE: {
    REQUIRED: 'Date is required',
    PAST_DATE: 'Cannot select a past date',
    INVALID_RANGE: 'End date must be after start date'
  }
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  PRIMARY_COLOR: '#1976d2',
  SECONDARY_COLOR: '#dc004e',
  SUCCESS_COLOR: '#2e7d32',
  WARNING_COLOR: '#ed6c02',
  ERROR_COLOR: '#d32f2f',
  INFO_COLOR: '#0288d1'
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data'
} as const;

// Mock User Credentials for Demo
export const DEMO_CREDENTIALS = {
  EMPLOYEE: {
    email: 'john.doe@company.com',
    password: 'password123'
  },
  MANAGER: {
    email: 'mike.johnson@company.com',
    password: 'password123'
  }
} as const;
