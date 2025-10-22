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
import { LEAVE_TYPES, MESSAGES, VALIDATION_RULES, APP_STRINGS } from '../../constants';
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
  const [fieldErrors, setFieldErrors] = useState<{
    startDate?: string;
    endDate?: string;
    reason?: string;
  }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
    // Clear field-specific error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
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
    // Clear field-specific error when user selects a date
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: { startDate?: string; endDate?: string; reason?: string } = {};
    let isValid = true;

    // Validate start date
    if (!formData.startDate) {
      errors.startDate = VALIDATION_RULES.DATE.REQUIRED;
      isValid = false;
    } else {
      const start = dayjs(formData.startDate);
      const today = dayjs().startOf('day');
      if (start.isBefore(today)) {
        errors.startDate = VALIDATION_RULES.DATE.PAST_DATE;
        isValid = false;
      }
    }

    // Validate end date
    if (!formData.endDate) {
      errors.endDate = VALIDATION_RULES.DATE.REQUIRED;
      isValid = false;
    } else if (formData.startDate) {
      const start = dayjs(formData.startDate);
      const end = dayjs(formData.endDate);
      if (end.isBefore(start)) {
        errors.endDate = VALIDATION_RULES.DATE.INVALID_RANGE;
        isValid = false;
      }
    }

    // Validate reason
    if (!formData.reason.trim()) {
      errors.reason = VALIDATION_RULES.LEAVE_REASON.REQUIRED;
      isValid = false;
    } else if (formData.reason.length > 500) {
      errors.reason = VALIDATION_RULES.LEAVE_REASON.MAX_LENGTH;
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
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
        return APP_STRINGS.ANNUAL_LEAVE;
      case LEAVE_TYPES.SICK:
        return APP_STRINGS.SICK_LEAVE;
      case LEAVE_TYPES.PERSONAL:
        return APP_STRINGS.PERSONAL_LEAVE;
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
                  label={APP_STRINGS.START_DATE}
                  value={startDate}
                  onChange={(value) => handleDateChange('startDate', value)}
                  minDate={dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!fieldErrors.startDate,
                      helperText: fieldErrors.startDate
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label={APP_STRINGS.END_DATE}
                  value={endDate}
                  onChange={(value) => handleDateChange('endDate', value)}
                  minDate={startDate || dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!fieldErrors.endDate,
                      helperText: fieldErrors.endDate
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>{APP_STRINGS.LEAVE_TYPE}</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    label={APP_STRINGS.LEAVE_TYPE}
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
                  label={APP_STRINGS.REASON}
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  required
                  error={!!fieldErrors.reason}
                  helperText={fieldErrors.reason || `${formData.reason.length}/500 characters`}
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
                    APP_STRINGS.SUBMIT_LEAVE_REQUEST
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
