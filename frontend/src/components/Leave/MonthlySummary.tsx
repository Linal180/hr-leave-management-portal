import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { MonthlySummary as IMonthlySummary } from '../../types';
import { LEAVE_STATUS, LEAVE_TYPES, APP_STRINGS } from '../../constants';
import apiService from '../../services/api';

const MonthlySummary: React.FC = () => {
  const [summary, setSummary] = useState<IMonthlySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiService.getMonthlySummary(selectedYear, selectedMonth);
      setSummary(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch monthly summary');
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case LEAVE_STATUS.APPROVED:
        return 'success';
      case LEAVE_STATUS.REJECTED:
        return 'error';
      case LEAVE_STATUS.PENDING:
        return 'warning';
      default:
        return 'default';
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case LEAVE_TYPES.ANNUAL:
        return 'Annual';
      case LEAVE_TYPES.SICK:
        return 'Sick';
      case LEAVE_TYPES.PERSONAL:
        return 'Personal';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Monthly Leave Summary
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>{APP_STRINGS.YEAR}</InputLabel>
              <Select
                value={selectedYear}
                label={APP_STRINGS.YEAR}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {years.map(year => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>{APP_STRINGS.MONTH}</InputLabel>
              <Select
                value={selectedMonth}
                label={APP_STRINGS.MONTH}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {monthNames.map((month, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : summary ? (
          <Box>
            {/* Summary Statistics */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={1}>
                  <Typography variant="h4" color="primary.main" fontWeight="bold">
                    {summary.totalRequests}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Requests
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center" p={2} bgcolor="success.light" borderRadius={1}>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {summary.approvedRequests}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Approved
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center" p={2} bgcolor="error.light" borderRadius={1}>
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                    {summary.rejectedRequests}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rejected
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center" p={2} bgcolor="warning.light" borderRadius={1}>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {summary.pendingRequests}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Detailed Table */}
            {summary.requests.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summary.requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {request.employeeName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {request.employeeEmail}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getLeaveTypeLabel(request.type)} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{formatDate(request.startDate)}</TableCell>
                        <TableCell>{formatDate(request.endDate)}</TableCell>
                        <TableCell>{request.duration} days</TableCell>
                        <TableCell>
                          <Chip 
                            label={request.status} 
                            color={getStatusColor(request.status) as any}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center" py={4}>
                No leave requests found for {monthNames[selectedMonth - 1]} {selectedYear}
              </Typography>
            )}
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default MonthlySummary;
