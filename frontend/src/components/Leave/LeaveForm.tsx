import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { LeaveFormData, LeaveApplicationRequest } from '../../types';
import { LEAVE_TYPES, MESSAGES, VALIDATION_RULES } from '../../constants';
import apiService from '../../services/api';

interface LeaveFormProps {
  onSuccess?: () => void;
}

const LeaveForm: React.FC<LeaveFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<LeaveFormData>({
    startDate: '',
    endDate: '',
    reason: '',
    type: 'annual'
  });
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: Dayjs | null) => {
    if (field === 'startDate') {
      setStartDate(value);
      setFormData(prev => ({
        ...prev,
        startDate: value ? value.format('YYYY-MM-DD') : ''
      }));
    } else {
      setEndDate(value);
      setFormData(prev => ({
        ...prev,
        endDate: value ? value.format('YYYY-MM-DD') : ''
      }));
    }
    setError('');
    setSuccess('');
  };

  const validateForm = (): boolean => {
    if (!formData.startDate || !formData.endDate) {
      setError('Please select both start and end dates');
      return false;
    }

    if (!formData.reason.trim()) {
      setError(VALIDATION_RULES.LEAVE_REASON.REQUIRED);
      return false;
    }

    if (formData.reason.length > 500) {
      setError(VALIDATION_RULES.LEAVE_REASON.MAX_LENGTH);
      return false;
    }

    const start = dayjs(formData.startDate);
    const end = dayjs(formData.endDate);
    const today = dayjs().startOf('day');

    if (start.isBefore(today)) {
      setError(VALIDATION_RULES.DATE.PAST_DATE);
      return false;
    }

    if (end.isBefore(start)) {
      setError(VALIDATION_RULES.DATE.INVALID_RANGE);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const leaveRequest: LeaveApplicationRequest = {
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason.trim(),
        type: formData.type
      };

      await apiService.applyForLeave(leaveRequest);
      setSuccess(MESSAGES.SUCCESS.LEAVE_APPLIED);
      
      // Reset form
      setFormData({
        startDate: '',
        endDate: '',
        reason: '',
        type: 'annual'
      });
      setStartDate(null);
      setEndDate(null);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || MESSAGES.ERROR.GENERIC_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case LEAVE_TYPES.ANNUAL:
        return 'Annual Leave';
      case LEAVE_TYPES.SICK:
        return 'Sick Leave';
      case LEAVE_TYPES.PERSONAL:
        return 'Personal Leave';
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Apply for Leave
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(value) => handleDateChange('startDate', value)}
                  minDate={dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(value) => handleDateChange('endDate', value)}
                  minDate={startDate || dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Leave Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    label="Leave Type"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value={LEAVE_TYPES.ANNUAL}>
                      {getLeaveTypeLabel(LEAVE_TYPES.ANNUAL)}
                    </MenuItem>
                    <MenuItem value={LEAVE_TYPES.SICK}>
                      {getLeaveTypeLabel(LEAVE_TYPES.SICK)}
                    </MenuItem>
                    <MenuItem value={LEAVE_TYPES.PERSONAL}>
                      {getLeaveTypeLabel(LEAVE_TYPES.PERSONAL)}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  required
                  helperText={`${formData.reason.length}/500 characters`}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{ py: 1.5 }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Submit Leave Request'
                  )}
                </Button>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LeaveForm;
