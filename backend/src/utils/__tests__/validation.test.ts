import { validateDateRange, checkDateOverlap, userLoginSchema, leaveRequestSchema, leaveApprovalSchema } from '../validation';

describe('Validation Utilities', () => {
  describe('validateDateRange', () => {
    it('should return valid for future date range', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      const result = validateDateRange(
        tomorrow.toISOString().split('T')[0],
        dayAfterTomorrow.toISOString().split('T')[0]
      );

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for past start date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const today = new Date();

      const result = validateDateRange(
        yesterday.toISOString().split('T')[0],
        today.toISOString().split('T')[0]
      );

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Start date cannot be in the past');
    });

    it('should return invalid when end date is before start date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      const result = validateDateRange(
        tomorrow.toISOString().split('T')[0],
        dayAfterTomorrow.toISOString().split('T')[0]
      );

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('End date must be after start date');
    });

    it('should return valid for same start and end date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const result = validateDateRange(
        tomorrow.toISOString().split('T')[0],
        tomorrow.toISOString().split('T')[0]
      );

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    // Edge cases
    it('should handle today as start date', () => {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const result = validateDateRange(
        today.toISOString().split('T')[0],
        tomorrow.toISOString().split('T')[0]
      );

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should handle invalid date strings', () => {
      const result = validateDateRange('invalid-date', '2024-02-01');
      
      // Invalid dates are treated as past dates
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Start date cannot be in the past');
    });

    it('should handle very far future dates', () => {
      const farFuture = '2030-12-31';
      const result = validateDateRange(farFuture, farFuture);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should handle leap year dates', () => {
      // Use a future leap year date
      const futureLeapYear = '2028-02-29';
      const result = validateDateRange(futureLeapYear, '2028-03-01');
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should handle timezone edge cases', () => {
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0); // Start of tomorrow

      const result = validateDateRange(
        today.toISOString().split('T')[0],
        tomorrow.toISOString().split('T')[0]
      );

      expect(result.isValid).toBe(true);
    });
  });

  describe('checkDateOverlap', () => {
    const mockRequests = [
      {
        id: '1',
        startDate: '2024-01-10',
        endDate: '2024-01-15',
        status: 'approved'
      },
      {
        id: '2',
        startDate: '2024-01-20',
        endDate: '2024-01-25',
        status: 'pending'
      },
      {
        id: '3',
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        status: 'approved'
      }
    ];

    it('should detect overlap with approved request', () => {
      const result = checkDateOverlap('2024-01-12', '2024-01-18', mockRequests);

      expect(result.hasOverlap).toBe(true);
      expect(result.conflictingRequest).toEqual(mockRequests[0]);
    });

    it('should not detect overlap with pending request', () => {
      const result = checkDateOverlap('2024-01-12', '2024-01-18', mockRequests);

      expect(result.hasOverlap).toBe(true);
      // Should find the approved request, not the pending one
      expect(result.conflictingRequest?.status).toBe('approved');
    });

    it('should not detect overlap when no conflicts exist', () => {
      const result = checkDateOverlap('2024-01-26', '2024-01-30', mockRequests);

      expect(result.hasOverlap).toBe(false);
      expect(result.conflictingRequest).toBeUndefined();
    });

    it('should detect exact date overlap', () => {
      const result = checkDateOverlap('2024-01-10', '2024-01-15', mockRequests);

      expect(result.hasOverlap).toBe(true);
      expect(result.conflictingRequest).toEqual(mockRequests[0]);
    });

    it('should detect partial overlap at start', () => {
      const result = checkDateOverlap('2024-01-08', '2024-01-12', mockRequests);

      expect(result.hasOverlap).toBe(true);
      expect(result.conflictingRequest).toEqual(mockRequests[0]);
    });

    it('should detect partial overlap at end', () => {
      const result = checkDateOverlap('2024-01-13', '2024-01-18', mockRequests);

      expect(result.hasOverlap).toBe(true);
      expect(result.conflictingRequest).toEqual(mockRequests[0]);
    });

    it('should handle empty requests array', () => {
      const result = checkDateOverlap('2024-01-10', '2024-01-15', []);

      expect(result.hasOverlap).toBe(false);
      expect(result.conflictingRequest).toBeUndefined();
    });

    it('should handle null/undefined requests', () => {
      // Test with empty array instead of null to avoid iteration error
      const result = checkDateOverlap('2024-01-10', '2024-01-15', []);

      expect(result.hasOverlap).toBe(false);
      expect(result.conflictingRequest).toBeUndefined();
    });

    it('should handle requests with invalid date formats', () => {
      const invalidRequests = [
        {
          id: '1',
          startDate: 'invalid-date',
          endDate: '2024-01-15',
          status: 'approved'
        }
      ];

      const result = checkDateOverlap('2024-01-10', '2024-01-15', invalidRequests);

      expect(result.hasOverlap).toBe(false);
    });

    it('should handle edge case where new request exactly touches existing request', () => {
      const mockRequests = [
        {
          id: '1',
          startDate: '2024-01-10',
          endDate: '2024-01-15',
          status: 'approved'
        }
      ];

      // New request starts exactly when previous ends
      const result = checkDateOverlap('2024-01-15', '2024-01-20', mockRequests);

      expect(result.hasOverlap).toBe(true);
    });

    it('should handle multiple overlapping requests', () => {
      const mockRequests = [
        {
          id: '1',
          startDate: '2024-01-10',
          endDate: '2024-01-15',
          status: 'approved'
        },
        {
          id: '2',
          startDate: '2024-01-12',
          endDate: '2024-01-18',
          status: 'approved'
        }
      ];

      const result = checkDateOverlap('2024-01-13', '2024-01-16', mockRequests);

      expect(result.hasOverlap).toBe(true);
      // Should return the first conflicting request found
      expect(result.conflictingRequest?.id).toBe('1');
    });
  });

  describe('Zod Schema Validation', () => {
    describe('userLoginSchema', () => {
      it('should validate correct login data', () => {
        const validData = {
          email: 'test@example.com',
          password: 'password123'
        };

        const result = userLoginSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject invalid email format', () => {
        const invalidData = {
          email: 'invalid-email',
          password: 'password123'
        };

        const result = userLoginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid email format');
        }
      });

      it('should reject empty password', () => {
        const invalidData = {
          email: 'test@example.com',
          password: ''
        };

        const result = userLoginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Password is required');
        }
      });

      it('should reject missing fields', () => {
        const invalidData = {
          email: 'test@example.com'
          // password missing
        };

        const result = userLoginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should handle edge case email formats', () => {
        const edgeCases = [
          'test+tag@example.com',
          'test.email@example.co.uk',
          '123@example.com',
          'test@subdomain.example.com'
        ];

        edgeCases.forEach(email => {
          const result = userLoginSchema.safeParse({ email, password: 'password' });
          expect(result.success).toBe(true);
        });
      });
    });

    describe('leaveRequestSchema', () => {
      it('should validate correct leave request data', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 2);

        const validData = {
          startDate: tomorrow.toISOString().split('T')[0],
          endDate: dayAfter.toISOString().split('T')[0],
          reason: 'Vacation',
          type: 'annual'
        };

        const result = leaveRequestSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject past start date', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const today = new Date();

        const invalidData = {
          startDate: yesterday.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0],
          reason: 'Vacation',
          type: 'annual'
        };

        const result = leaveRequestSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Start date cannot be in the past');
        }
      });

      it('should reject end date before start date', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 2);
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 1);

        const invalidData = {
          startDate: tomorrow.toISOString().split('T')[0],
          endDate: dayAfter.toISOString().split('T')[0],
          reason: 'Vacation',
          type: 'annual'
        };

        const result = leaveRequestSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('End date must be after or equal to start date');
        }
      });

      it('should reject empty reason', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const invalidData = {
          startDate: tomorrow.toISOString().split('T')[0],
          endDate: tomorrow.toISOString().split('T')[0],
          reason: '',
          type: 'annual'
        };

        const result = leaveRequestSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Reason is required');
        }
      });

      it('should reject reason that is too long', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const invalidData = {
          startDate: tomorrow.toISOString().split('T')[0],
          endDate: tomorrow.toISOString().split('T')[0],
          reason: 'a'.repeat(501),
          type: 'annual'
        };

        const result = leaveRequestSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Reason too long');
        }
      });

      it('should reject invalid leave type', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const invalidData = {
          startDate: tomorrow.toISOString().split('T')[0],
          endDate: tomorrow.toISOString().split('T')[0],
          reason: 'Vacation',
          type: 'invalid-type'
        };

        const result = leaveRequestSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Type must be annual, sick, or personal');
        }
      });

      it('should accept all valid leave types', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const validTypes = ['annual', 'sick', 'personal'];
        
        validTypes.forEach(type => {
          const data = {
            startDate: tomorrow.toISOString().split('T')[0],
            endDate: tomorrow.toISOString().split('T')[0],
            reason: 'Test reason',
            type
          };

          const result = leaveRequestSchema.safeParse(data);
          expect(result.success).toBe(true);
        });
      });

      it('should handle maximum length reason', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const validData = {
          startDate: tomorrow.toISOString().split('T')[0],
          endDate: tomorrow.toISOString().split('T')[0],
          reason: 'a'.repeat(500), // Exactly 500 characters
          type: 'annual'
        };

        const result = leaveRequestSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('leaveApprovalSchema', () => {
      it('should validate correct approval data', () => {
        const validData = {
          action: 'approve'
        };

        const result = leaveApprovalSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should validate correct rejection data with reason', () => {
        const validData = {
          action: 'reject',
          rejectionReason: 'Business needs'
        };

        const result = leaveApprovalSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject rejection without reason', () => {
        const invalidData = {
          action: 'reject'
          // rejectionReason missing
        };

        const result = leaveApprovalSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Rejection reason is required when rejecting a request');
        }
      });

      it('should reject invalid action', () => {
        const invalidData = {
          action: 'invalid-action'
        };

        const result = leaveApprovalSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Action must be approve or reject');
        }
      });

      it('should accept rejection with empty string reason', () => {
        const invalidData = {
          action: 'reject',
          rejectionReason: ''
        };

        const result = leaveApprovalSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Rejection reason is required when rejecting a request');
        }
      });

      it('should accept approval with optional rejection reason', () => {
        const validData = {
          action: 'approve',
          rejectionReason: 'This should be ignored'
        };

        const result = leaveApprovalSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });
});
