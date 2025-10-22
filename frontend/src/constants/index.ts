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

// Application Strings
export const APP_STRINGS = {
  LEAVE_REQUEST_SYSTEM: 'Leave Request System',
  PROFILE: 'Profile',
  LOGOUT: 'Logout',
  WELCOME_BACK: 'Welcome back',
  MANAGER_DASHBOARD: 'Manager Dashboard',
  EMPLOYEE_DASHBOARD: 'Employee Dashboard',
  REVIEW_AND_MANAGE: 'Review and manage leave requests from your team.',
  MANAGE_LEAVE_REQUESTS: 'Manage your leave requests here.',
  PERSONAL_INFORMATION: 'Personal Information',
  LEAVE_INFORMATION: 'Leave Information',
  SECURITY_ACCESS: 'Security & Access',
  FULL_NAME: 'Full Name',
  EMAIL_ADDRESS: 'Email Address',
  DEPARTMENT: 'Department',
  ROLE: 'Role',
  CURRENT_LEAVE_BALANCE: 'Current Leave Balance',
  ACCOUNT_CREATED: 'Account Created',
  LEAVE_POLICY: 'Leave Policy',
  STANDARD_ANNUAL_LEAVE: 'Standard annual leave policy applies',
  ACCOUNT_STATUS: 'Account Status',
  ACTIVE: 'Active',
  LAST_LOGIN: 'Last Login',
  EDIT_PROFILE: 'Edit Profile',
  SAVE_CHANGES: 'Save Changes',
  CANCEL: 'Cancel',
  APPLY_FOR_LEAVE: 'Apply for Leave',
  PENDING_LEAVE_REQUESTS: 'Pending Leave Requests',
  MY_LEAVE_REQUESTS: 'My Leave Requests',
  MONTHLY_LEAVE_SUMMARY: 'Monthly Leave Summary',
  TOTAL_REQUESTS: 'Total Requests',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PENDING: 'Pending',
  AWAITING_APPROVAL: 'Awaiting approval',
  THIS_PERIOD: 'This period',
  NO_PENDING_REQUESTS: 'No pending leave requests found.',
  NO_LEAVE_REQUESTS: 'No leave requests found.',
  NO_REQUESTS_FOUND: 'No leave requests found for',
  EMPLOYEE: 'Employee',
  TYPE: 'Type',
  START_DATE: 'Start Date',
  END_DATE: 'End Date',
  DURATION: 'Duration',
  REASON: 'Reason',
  STATUS: 'Status',
  ACTIONS: 'Actions',
  APPROVE: 'Approve',
  REJECT: 'Reject',
  REFRESH: 'Refresh',
  YEAR: 'Year',
  MONTH: 'Month',
  DAYS: 'days',
  REASON_LABEL: 'Reason',
  REJECTION_REASON: 'Reason'
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
