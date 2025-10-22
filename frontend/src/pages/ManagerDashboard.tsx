import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Event,
  CheckCircle,
  Pending,
  Cancel
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../constants';
import LeaveRequestList from '../components/Leave/LeaveRequestList';
import apiService from '../services/api';
import { LeaveRequestWithEmployee } from '../types';

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [allRequests, setAllRequests] = useState<LeaveRequestWithEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const requests = await apiService.getAllLeaveRequests();
      setAllRequests(requests);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Alert severity="error">
        User information not available
      </Alert>
    );
  }

  const pendingCount = allRequests.filter(req => req.status === 'pending').length;
  const approvedCount = allRequests.filter(req => req.status === 'approved').length;
  const rejectedCount = allRequests.filter(req => req.status === 'rejected').length;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Manager Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Welcome back, {user.name}! Review and manage leave requests from your team.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Manager Info Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Profile</Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {user.name}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {user.email}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body1">
                  {user.department}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Role
                </Typography>
                <Chip 
                  label="Manager" 
                  color="primary" 
                  size="small"
                />
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Leave Balance
                </Typography>
                <Typography variant="h5" color="primary.main" fontWeight="bold">
                  {user.leaveBalance} days
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Pending sx={{ mr: 1, color: 'warning.main' }} />
                    <Typography variant="h6">Pending</Typography>
                  </Box>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {loading ? <CircularProgress size={24} /> : pendingCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Awaiting approval
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="h6">Approved</Typography>
                  </Box>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {loading ? <CircularProgress size={24} /> : approvedCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This period
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Cancel sx={{ mr: 1, color: 'error.main' }} />
                    <Typography variant="h6">Rejected</Typography>
                  </Box>
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                    {loading ? <CircularProgress size={24} /> : rejectedCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This period
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Pending Requests */}
        <Grid item xs={12}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <LeaveRequestList 
            isManager={true} 
            refreshTrigger={allRequests.length}
            onRefresh={fetchAllRequests}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagerDashboard;
