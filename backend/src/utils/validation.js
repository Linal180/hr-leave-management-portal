const { z } = require('zod');

// User validation schemas
const userLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// Leave request validation schemas
const leaveRequestSchema = z.object({
  startDate: z.string().refine((date) => {
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate >= today;
  }, {
    message: 'Start date cannot be in the past'
  }),
  endDate: z.string(),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason too long'),
  type: z.enum(['annual', 'sick', 'personal'], {
    errorMap: () => ({ message: 'Type must be annual, sick, or personal' })
  })
}).refine((data) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return endDate >= startDate;
}, {
  message: 'End date must be after or equal to start date',
  path: ['endDate']
});

const leaveApprovalSchema = z.object({
  action: z.enum(['approve', 'reject'], {
    errorMap: () => ({ message: 'Action must be approve or reject' })
  }),
  rejectionReason: z.string().optional()
}).refine((data) => {
  if (data.action === 'reject' && !data.rejectionReason) {
    return false;
  }
  return true;
}, {
  message: 'Rejection reason is required when rejecting a request',
  path: ['rejectionReason']
});

// Date validation utilities
const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    return { isValid: false, error: 'Start date cannot be in the past' };
  }

  if (end < start) {
    return { isValid: false, error: 'End date must be after start date' };
  }

  return { isValid: true };
};

const checkDateOverlap = (newStart, newEnd, existingRequests) => {
  const newStartDate = new Date(newStart);
  const newEndDate = new Date(newEnd);

  for (const request of existingRequests) {
    if (request.status === 'approved') {
      const existingStart = new Date(request.startDate);
      const existingEnd = new Date(request.endDate);

      // Check for overlap
      if (
        (newStartDate <= existingEnd && newEndDate >= existingStart)
      ) {
        return {
          hasOverlap: true,
          conflictingRequest: request
        };
      }
    }
  }

  return { hasOverlap: false };
};

module.exports = {
  userLoginSchema,
  leaveRequestSchema,
  leaveApprovalSchema,
  validateDateRange,
  checkDateOverlap
};
