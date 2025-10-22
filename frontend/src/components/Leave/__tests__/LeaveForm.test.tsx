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
});
