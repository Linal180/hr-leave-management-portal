import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert
} from '@mui/material';
import {
  Person,
  Event,
  CheckCircle,
  Pending
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../constants';
import LeaveForm from '../components/Leave/LeaveForm';
import LeaveRequestList from '../components/Leave/LeaveRequestList';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLeaveSubmit = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!user) {
    return (
      <Alert severity="error">
        User information not available
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Employee Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Welcome back, {user.name}! Manage your leave requests here.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* User Info Card */}
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
                  label={user.role === ROLES.MANAGER ? 'Manager' : 'Employee'} 
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

        {/* Leave Form */}
        <Grid item xs={12} md={8}>
          <LeaveForm onSuccess={handleLeaveSubmit} />
        </Grid>

        {/* Leave Requests */}
        <Grid item xs={12}>
          <LeaveRequestList refreshTrigger={refreshTrigger} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeDashboard;
