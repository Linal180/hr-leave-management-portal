// User Roles
export const ROLES = {
  EMPLOYEE: 'employee',
  MANAGER: 'manager'
} as const;

// Leave Status
export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

// Leave Types
export const LEAVE_TYPES = {
  ANNUAL: 'annual',
  SICK: 'sick',
  PERSONAL: 'personal'
} as const;

// Demo Credentials
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

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data'
} as const;

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

// Validation Rules
export const VALIDATION_RULES = {
  REASON_MAX_LENGTH: 500,
  MIN_LEAVE_DURATION: 1,
  MAX_LEAVE_DURATION: 30,
  DATE: {
    REQUIRED: 'Date is required',
    PAST_DATE: 'Start date cannot be in the past',
    INVALID_RANGE: 'End date must be after start date'
  },
  LEAVE_REASON: {
    REQUIRED: 'Reason is required',
    MAX_LENGTH: 'Reason must be less than 500 characters'
  }
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
  REJECTION_REASON: 'Reason',
  SIGN_IN_TO_ACCOUNT: 'Sign in to your account',
  DEMO_USER: 'Demo User',
  SELECT_DEMO_USER: 'Select a demo user',
  EMPLOYEE_JOHN_DOE: 'Employee (John Doe)',
  MANAGER_MIKE_JOHNSON: 'Manager (Mike Johnson)',
  OR: 'OR',
  EMAIL: 'Email',
  PASSWORD: 'Password',
  SIGN_IN: 'Sign In',
  DEMO_CREDENTIALS: 'Demo Credentials:',
  EMPLOYEE_CREDENTIALS: 'Employee: john.doe@company.com / password123',
  MANAGER_CREDENTIALS: 'Manager: mike.johnson@company.com / password123',
  SUBMIT_LEAVE_REQUEST: 'Submit Leave Request',
  ANNUAL_LEAVE: 'Annual Leave',
  SICK_LEAVE: 'Sick Leave',
  PERSONAL_LEAVE: 'Personal Leave',
  LEAVE_TYPE: 'Leave Type',
  SUBMIT: 'Submit',
  LOADING: 'Loading...',
  NO_DATA_AVAILABLE: 'No data available',
  USER_INFO_NOT_AVAILABLE: 'User information not available',
  MANAGE_ACCOUNT_INFO: 'Manage your account information and preferences here.'
} as const;

// UI Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN_SUCCESS: 'Login successful!',
    LEAVE_APPLIED: 'Leave request submitted successfully!',
    LEAVE_APPROVED: 'Leave request approved successfully!',
    LEAVE_REJECTED: 'Leave request rejected successfully!'
  },
  ERROR: {
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    NETWORK_ERROR: 'Network error. Please try again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    LEAVE_APPLICATION_FAILED: 'Failed to submit leave request. Please try again.',
    LEAVE_APPROVAL_FAILED: 'Failed to process leave request. Please try again.',
    FETCH_LEAVE_REQUESTS_FAILED: 'Failed to fetch leave requests. Please try again.',
    FETCH_SUMMARY_FAILED: 'Failed to fetch leave summary. Please try again.',
    GENERIC_ERROR: 'An error occurred. Please try again.'
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_DATE: 'Please enter a valid date',
    START_DATE_PAST: 'Start date cannot be in the past',
    END_DATE_BEFORE_START: 'End date must be after start date',
    REASON_TOO_LONG: `Reason must be less than ${VALIDATION_RULES.REASON_MAX_LENGTH} characters`,
    INSUFFICIENT_LEAVE_BALANCE: 'Insufficient leave balance',
    DATE_OVERLAP: 'Leave dates overlap with existing request',
    INVALID_DATE_RANGE: 'Invalid date range'
  },
  INFO: {
    NO_PENDING_REQUESTS: 'No pending leave requests found.',
    NO_LEAVE_REQUESTS: 'No leave requests found.'
  }
} as const;