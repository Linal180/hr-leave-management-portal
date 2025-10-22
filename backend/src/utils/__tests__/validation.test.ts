import { validateDateRange, checkDateOverlap } from '../validation';

describe('Date Validation Utilities', () => {
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
  });
});
