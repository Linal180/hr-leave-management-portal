import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  Avatar,
  Divider
} from '@mui/material';
import {
  CalendarToday,
  Business,
  Email
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { ROLES, APP_STRINGS } from '../constants';
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
        {APP_STRINGS.EMPLOYEE_DASHBOARD}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {APP_STRINGS.WELCOME_BACK}, {user.name}! {APP_STRINGS.MANAGE_LEAVE_REQUESTS}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* User Info Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'primary.main',
                    mr: 2
                  }}
                >
                  {user.name.split(' ').map(word => word.charAt(0)).join('').toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {user.name}
                  </Typography>
                  <Chip 
                    label={user.role === ROLES.MANAGER ? 'Manager' : 'Employee'} 
                    color="primary" 
                    size="small"
                  />
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Email sx={{ mr: 1, fontSize: 16 }} />
                  {APP_STRINGS.EMAIL_ADDRESS}
                </Typography>
                <Typography variant="body1">
                  {user.email}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Business sx={{ mr: 1, fontSize: 16 }} />
                  {APP_STRINGS.DEPARTMENT}
                </Typography>
                <Typography variant="body1">
                  {user.department}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <CalendarToday sx={{ mr: 1, fontSize: 16 }} />
                  {APP_STRINGS.CURRENT_LEAVE_BALANCE}
                </Typography>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {user.leaveBalance} {APP_STRINGS.DAYS}
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
