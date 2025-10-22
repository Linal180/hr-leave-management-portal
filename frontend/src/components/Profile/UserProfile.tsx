import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Grid,
  Divider,
  Alert
} from '@mui/material';
import {
  Person,
  CalendarToday,
  Security
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES, APP_STRINGS } from '../../constants';

const UserProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Alert severity="error">
        User information not available
      </Alert>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplayName = (role: string) => {
    return role === ROLES.MANAGER ? 'Manager' : 'Employee';
  };

  const getRoleColor = (role: string) => {
    return role === ROLES.MANAGER ? 'primary' : 'secondary';
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {APP_STRINGS.PROFILE}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Manage your account information and preferences.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Profile Header Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                      mr: 3
                    }}
                  >
                    {getInitials(user.name)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {user.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      {user.email}
                    </Typography>
                    <Chip
                      label={getRoleDisplayName(user.role)}
                      color={getRoleColor(user.role) as any}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                {APP_STRINGS.PERSONAL_INFORMATION}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
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
                  {APP_STRINGS.ROLE}
                </Typography>
                <Chip
                  label={getRoleDisplayName(user.role)}
                  color={getRoleColor(user.role) as any}
                  size="small"
                />
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {APP_STRINGS.DEPARTMENT}
                </Typography>
                <Typography variant="body1">
                  {user.department}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Leave Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                {APP_STRINGS.LEAVE_INFORMATION}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  {APP_STRINGS.CURRENT_LEAVE_BALANCE}
                </Typography>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {user.leaveBalance} {APP_STRINGS.DAYS}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  {APP_STRINGS.ACCOUNT_CREATED}
                </Typography>
                <Typography variant="body1">
                  {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {APP_STRINGS.LEAVE_POLICY}
                </Typography>
                <Typography variant="body1">
                  {APP_STRINGS.STANDARD_ANNUAL_LEAVE}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Security sx={{ mr: 1, color: 'primary.main' }} />
                {APP_STRINGS.SECURITY_ACCESS}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {APP_STRINGS.ACCOUNT_STATUS}
                    </Typography>
                    <Chip label={APP_STRINGS.ACTIVE} color="success" size="small" />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {APP_STRINGS.LAST_LOGIN}
                    </Typography>
                    <Typography variant="body1">
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile;
