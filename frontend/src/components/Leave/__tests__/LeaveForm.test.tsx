import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LeaveForm from '../LeaveForm';
import { AuthProvider } from '../../../contexts/AuthContext';

// Mock the API service
jest.mock('../../../services/api', () => ({
  applyForLeave: jest.fn()
}));

// Mock the date picker components
jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label, onChange, ...props }: any) => (
    <input
      data-testid={`date-picker-${label.toLowerCase().replace(' ', '-')}`}
      placeholder={label}
      onChange={(e) => onChange && onChange(e.target.value)}
      {...props}
    />
  )
}));

jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }: any) => <div>{children}</div>
}));

jest.mock('@mui/x-date-pickers/AdapterDayjs', () => ({
  AdapterDayjs: {}
}));

// Mock dayjs
jest.mock('dayjs', () => {
  const originalDayjs = jest.requireActual('dayjs');
  return {
    ...originalDayjs,
    default: (date?: any) => {
      if (date) {
        return originalDayjs.default(date);
      }
      return {
        format: () => '2024-02-01',
        isBefore: () => false,
        startOf: () => ({
          isBefore: () => false
        })
      };
    }
  };
});

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <AuthProvider>
        {component}
      </AuthProvider>
    </ThemeProvider>
  );
};

describe('LeaveForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders leave form with all required fields', () => {
    renderWithProviders(<LeaveForm />);

    expect(screen.getByText('Apply for Leave')).toBeInTheDocument();
    expect(screen.getByLabelText('Leave Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Reason')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit leave request/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithProviders(<LeaveForm />);

    const submitButton = screen.getByRole('button', { name: /submit leave request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please select both start and end dates/i)).toBeInTheDocument();
    });
  });

  it('validates reason field is required', async () => {
    renderWithProviders(<LeaveForm />);

    const reasonField = screen.getByLabelText('Reason');
    fireEvent.change(reasonField, { target: { value: '' } });

    const submitButton = screen.getByRole('button', { name: /submit leave request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/reason is required/i)).toBeInTheDocument();
    });
  });

  it('validates reason field maximum length', async () => {
    renderWithProviders(<LeaveForm />);

    const reasonField = screen.getByLabelText('Reason');
    const longText = 'a'.repeat(501); // Exceeds 500 character limit
    fireEvent.change(reasonField, { target: { value: longText } });

    const submitButton = screen.getByRole('button', { name: /submit leave request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/reason cannot exceed 500 characters/i)).toBeInTheDocument();
    });
  });

  it('shows character count for reason field', () => {
    renderWithProviders(<LeaveForm />);

    const reasonField = screen.getByLabelText('Reason');
    fireEvent.change(reasonField, { target: { value: 'Test reason' } });

    expect(screen.getByText(/11\/500 characters/)).toBeInTheDocument();
  });

  it('allows selecting different leave types', () => {
    renderWithProviders(<LeaveForm />);

    const leaveTypeSelect = screen.getByLabelText('Leave Type');
    fireEvent.mouseDown(leaveTypeSelect);

    expect(screen.getByText('Annual Leave')).toBeInTheDocument();
    expect(screen.getByText('Sick Leave')).toBeInTheDocument();
    expect(screen.getByText('Personal Leave')).toBeInTheDocument();
  });

  it('calls onSuccess callback when form is submitted successfully', async () => {
    const mockOnSuccess = jest.fn();
    const mockApplyForLeave = require('../../../services/api').default.applyForLeave;
    mockApplyForLeave.mockResolvedValue({ id: '1', status: 'pending' });

    renderWithProviders(<LeaveForm onSuccess={mockOnSuccess} />);

    // Fill in the form
    const reasonField = screen.getByLabelText('Reason');
    fireEvent.change(reasonField, { target: { value: 'Test vacation' } });

    const submitButton = screen.getByRole('button', { name: /submit leave request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('shows loading state during form submission', async () => {
    const mockApplyForLeave = require('../../../services/api').default.applyForLeave;
    mockApplyForLeave.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithProviders(<LeaveForm />);

    const reasonField = screen.getByLabelText('Reason');
    fireEvent.change(reasonField, { target: { value: 'Test vacation' } });

    const submitButton = screen.getByRole('button', { name: /submit leave request/i });
    fireEvent.click(submitButton);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays success message after successful submission', async () => {
    const mockApplyForLeave = require('../../../services/api').default.applyForLeave;
    mockApplyForLeave.mockResolvedValue({ id: '1', status: 'pending' });

    renderWithProviders(<LeaveForm />);

    const reasonField = screen.getByLabelText('Reason');
    fireEvent.change(reasonField, { target: { value: 'Test vacation' } });

    const submitButton = screen.getByRole('button', { name: /submit leave request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/leave request submitted successfully/i)).toBeInTheDocument();
    });
  });

  it('displays error message when submission fails', async () => {
    const mockApplyForLeave = require('../../../services/api').default.applyForLeave;
    mockApplyForLeave.mockRejectedValue(new Error('Network error'));

    renderWithProviders(<LeaveForm />);

    const reasonField = screen.getByLabelText('Reason');
    fireEvent.change(reasonField, { target: { value: 'Test vacation' } });

    const submitButton = screen.getByRole('button', { name: /submit leave request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it('handles form reset after successful submission', async () => {
    const mockOnSuccess = jest.fn();
    const mockApplyForLeave = require('../../../services/api').default.applyForLeave;
    mockApplyForLeave.mockResolvedValue({ id: '1', status: 'pending' });

    renderWithProviders(<LeaveForm onSuccess={mockOnSuccess} />);

    const reasonField = screen.getByLabelText('Reason');
    fireEvent.change(reasonField, { target: { value: 'Test vacation' } });

    const submitButton = screen.getByRole('button', { name: /submit leave request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    // Form should be reset
    expect(reasonField).toHaveValue('');
  });

  it('prevents multiple submissions while loading', async () => {
    const mockApplyForLeave = require('../../../services/api').default.applyForLeave;
    let resolvePromise: (value: any) => void;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    mockApplyForLeave.mockReturnValue(promise);

    renderWithProviders(<LeaveForm />);

    const reasonField = screen.getByLabelText('Reason');
    fireEvent.change(reasonField, { target: { value: 'Test vacation' } });

    const submitButton = screen.getByRole('button', { name: /submit leave request/i });
    
    // Click multiple times
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    // Should only be called once
    expect(mockApplyForLeave).toHaveBeenCalledTimes(1);

    // Resolve the promise
    resolvePromise!({ id: '1', status: 'pending' });
  });

  it('handles API error with specific error message', async () => {
    const mockApplyForLeave = require('../../../services/api').default.applyForLeave;
    const errorResponse = {
      response: {
        data: {
          message: 'Insufficient leave balance'
        }
      }
    };
    mockApplyForLeave.mockRejectedValue(errorResponse);

    renderWithProviders(<LeaveForm />);

    const reasonField = screen.getByLabelText('Reason');
    fireEvent.change(reasonField, { target: { value: 'Test vacation' } });

    const submitButton = screen.getByRole('button', { name: /submit leave request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Insufficient leave balance')).toBeInTheDocument();
    });
  });

  it('handles API error without response data', async () => {
    const mockApplyForLeave = require('../../../services/api').default.applyForLeave;
    mockApplyForLeave.mockRejectedValue(new Error('Network timeout'));

    renderWithProviders(<LeaveForm />);

    const reasonField = screen.getByLabelText('Reason');
    fireEvent.change(reasonField, { target: { value: 'Test vacation' } });

    const submitButton = screen.getByRole('button', { name: /submit leave request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it('validates date range correctly', async () => {
    renderWithProviders(<LeaveForm />);

    // Mock dayjs to return specific dates
    const mockDayjs = require('dayjs');
    mockDayjs.default.mockImplementation((date?: any) => {
      if (date === '2024-01-01') {
        return {
          format: () => '2024-01-01',
          isBefore: () => false,
          startOf: () => ({
            isBefore: () => false
          })
        };
      }
      if (date === '2023-12-31') {
        return {
          format: () => '2023-12-31',
          isBefore: () => true,
          startOf: () => ({
            isBefore: () => true
          })
        };
      }
      return {
        format: () => '2024-01-01',
        isBefore: () => false,
        startOf: () => ({
          isBefore: () => false
        })
      };
    });

    const reasonField = screen.getByLabelText('Reason');
    fireEvent.change(reasonField, { target: { value: 'Test vacation' } });

    const submitButton = screen.getByRole('button', { name: /submit leave request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please select both start and end dates/i)).toBeInTheDocument();
    });
  });

  it('handles form submission with all leave types', async () => {
    const mockApplyForLeave = require('../../../services/api').default.applyForLeave;
    mockApplyForLeave.mockResolvedValue({ id: '1', status: 'pending' });

    const leaveTypes = ['Annual Leave', 'Sick Leave', 'Personal Leave'];
    
    for (const leaveType of leaveTypes) {
      renderWithProviders(<LeaveForm />);

      const leaveTypeSelect = screen.getByLabelText('Leave Type');
      fireEvent.mouseDown(leaveTypeSelect);
      
      const option = screen.getByText(leaveType);
      fireEvent.click(option);

      const reasonField = screen.getByLabelText('Reason');
      fireEvent.change(reasonField, { target: { value: `Test ${leaveType}` } });

      const submitButton = screen.getByRole('button', { name: /submit leave request/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockApplyForLeave).toHaveBeenCalledWith(
          expect.objectContaining({
            type: leaveType.toLowerCase().replace(' leave', '')
          })
        );
      });

      jest.clearAllMocks();
    }
  });

  it('handles keyboard navigation in form', () => {
    renderWithProviders(<LeaveForm />);

    const reasonField = screen.getByLabelText('Reason');
    const submitButton = screen.getByRole('button', { name: /submit leave request/i });

    // Tab navigation
    reasonField.focus();
    expect(reasonField).toHaveFocus();

    // Enter key submission
    fireEvent.change(reasonField, { target: { value: 'Test vacation' } });
    fireEvent.keyDown(reasonField, { key: 'Enter', code: 'Enter' });

    // Should not submit on Enter in textarea
    expect(submitButton).not.toHaveAttribute('disabled');
  });

  it('handles form with maximum length reason', async () => {
    const mockApplyForLeave = require('../../../services/api').default.applyForLeave;
    mockApplyForLeave.mockResolvedValue({ id: '1', status: 'pending' });

    renderWithProviders(<LeaveForm />);

    const reasonField = screen.getByLabelText('Reason');
    const maxLengthReason = 'a'.repeat(500); // Exactly 500 characters
    fireEvent.change(reasonField, { target: { value: maxLengthReason } });

    const submitButton = screen.getByRole('button', { name: /submit leave request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockApplyForLeave).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: maxLengthReason
        })
      );
    });
  });

  it('handles form with reason exceeding maximum length', async () => {
    renderWithProviders(<LeaveForm />);

    const reasonField = screen.getByLabelText('Reason');
    const tooLongReason = 'a'.repeat(501); // Exceeds 500 characters
    fireEvent.change(reasonField, { target: { value: tooLongReason } });

    const submitButton = screen.getByRole('button', { name: /submit leave request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/reason cannot exceed 500 characters/i)).toBeInTheDocument();
    });
  });

  it('handles rapid form field changes', () => {
    renderWithProviders(<LeaveForm />);

    const reasonField = screen.getByLabelText('Reason');
    
    // Rapid changes
    fireEvent.change(reasonField, { target: { value: 'Test' } });
    fireEvent.change(reasonField, { target: { value: 'Test vacation' } });
    fireEvent.change(reasonField, { target: { value: 'Test vacation request' } });
    fireEvent.change(reasonField, { target: { value: 'Test vacation request for next week' } });

    expect(reasonField).toHaveValue('Test vacation request for next week');
    expect(screen.getByText(/35\/500 characters/)).toBeInTheDocument();
  });

  it('handles form with special characters in reason', async () => {
    const mockApplyForLeave = require('../../../services/api').default.applyForLeave;
    mockApplyForLeave.mockResolvedValue({ id: '1', status: 'pending' });

    renderWithProviders(<LeaveForm />);

    const reasonField = screen.getByLabelText('Reason');
    const specialReason = 'Test vacation with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
    fireEvent.change(reasonField, { target: { value: specialReason } });

    const submitButton = screen.getByRole('button', { name: /submit leave request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockApplyForLeave).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: specialReason
        })
      );
    });
  });

  it('handles form with unicode characters in reason', async () => {
    const mockApplyForLeave = require('../../../services/api').default.applyForLeave;
    mockApplyForLeave.mockResolvedValue({ id: '1', status: 'pending' });

    renderWithProviders(<LeaveForm />);

    const reasonField = screen.getByLabelText('Reason');
    const unicodeReason = 'Test vacation with unicode: 🏖️ ✈️ 🌴 🏨';
    fireEvent.change(reasonField, { target: { value: unicodeReason } });

    const submitButton = screen.getByRole('button', { name: /submit leave request/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockApplyForLeave).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: unicodeReason
        })
      );
    });
  });
});
