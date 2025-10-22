import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import {
  Person,
  Event,
  CheckCircle,
  Pending,
  Cancel,
  Assessment
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { ROLES, APP_STRINGS } from '../constants';
import LeaveRequestList from '../components/Leave/LeaveRequestList';
import MonthlySummary from '../components/Leave/MonthlySummary';
import apiService from '../services/api';
import { LeaveRequestWithEmployee } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`manager-tabpanel-${index}`}
      aria-labelledby={`manager-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [allRequests, setAllRequests] = useState<LeaveRequestWithEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {APP_STRINGS.MANAGER_DASHBOARD}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {APP_STRINGS.WELCOME_BACK}, {user.name}! {APP_STRINGS.REVIEW_AND_MANAGE}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Manager Info Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">{APP_STRINGS.PROFILE}</Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  {APP_STRINGS.FULL_NAME}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {user.name}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  {APP_STRINGS.EMAIL_ADDRESS}
                </Typography>
                <Typography variant="body1">
                  {user.email}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  {APP_STRINGS.DEPARTMENT}
                </Typography>
                <Typography variant="body1">
                  {user.department}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  {APP_STRINGS.ROLE}
                </Typography>
                <Chip 
                  label="Manager" 
                  color="primary" 
                  size="small"
                />
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {APP_STRINGS.CURRENT_LEAVE_BALANCE}
                </Typography>
                <Typography variant="h5" color="primary.main" fontWeight="bold">
                  {user.leaveBalance} {APP_STRINGS.DAYS}
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
                    <Typography variant="h6">{APP_STRINGS.PENDING}</Typography>
                  </Box>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {loading ? <CircularProgress size={24} /> : pendingCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {APP_STRINGS.AWAITING_APPROVAL}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="h6">{APP_STRINGS.APPROVED}</Typography>
                  </Box>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {loading ? <CircularProgress size={24} /> : approvedCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {APP_STRINGS.THIS_PERIOD}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Cancel sx={{ mr: 1, color: 'error.main' }} />
                    <Typography variant="h6">{APP_STRINGS.REJECTED}</Typography>
                  </Box>
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                    {loading ? <CircularProgress size={24} /> : rejectedCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {APP_STRINGS.THIS_PERIOD}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <Grid item xs={12}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="manager dashboard tabs"
                variant="fullWidth"
              >
                <Tab 
                  icon={
                    <Badge badgeContent={pendingCount} color="error">
                      <Pending />
                    </Badge>
                  } 
                  label={APP_STRINGS.PENDING_LEAVE_REQUESTS} 
                  iconPosition="start"
                  sx={{ textTransform: 'none', fontWeight: 'medium' }}
                />
                <Tab 
                  icon={<Assessment />} 
                  label={APP_STRINGS.MONTHLY_LEAVE_SUMMARY} 
                  iconPosition="start"
                  sx={{ textTransform: 'none', fontWeight: 'medium' }}
                />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
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
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <MonthlySummary />
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagerDashboard;
