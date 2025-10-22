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
  Divider
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { DEMO_CREDENTIALS, MESSAGES, APP_STRINGS } from '../../constants';

const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [demoUser, setDemoUser] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleDemoUserChange = (e: any) => {
    const userType = e.target.value;
    setDemoUser(userType);
    
    if (userType === 'employee') {
      setFormData({
        email: DEMO_CREDENTIALS.EMPLOYEE.email,
        password: DEMO_CREDENTIALS.EMPLOYEE.password
      });
    } else if (userType === 'manager') {
      setFormData({
        email: DEMO_CREDENTIALS.MANAGER.email,
        password: DEMO_CREDENTIALS.MANAGER.password
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData.email, formData.password);
    } catch (err: any) {
      setError(err.message || MESSAGES.ERROR.LOGIN_FAILED);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
            {APP_STRINGS.LEAVE_REQUEST_SYSTEM}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {APP_STRINGS.SIGN_IN_TO_ACCOUNT}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>{APP_STRINGS.DEMO_USER}</InputLabel>
            <Select
              value={demoUser}
              label={APP_STRINGS.DEMO_USER}
              onChange={handleDemoUserChange}
            >
              <MenuItem value="">
                <em>{APP_STRINGS.SELECT_DEMO_USER}</em>
              </MenuItem>
              <MenuItem value="employee">{APP_STRINGS.EMPLOYEE_JOHN_DOE}</MenuItem>
              <MenuItem value="manager">{APP_STRINGS.MANAGER_MIKE_JOHNSON}</MenuItem>
            </Select>
          </FormControl>

          <Divider sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {APP_STRINGS.OR}
            </Typography>
          </Divider>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={APP_STRINGS.EMAIL}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
              autoComplete="email"
              autoFocus
            />
            
            <TextField
              fullWidth
              label={APP_STRINGS.PASSWORD}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              margin="normal"
              required
              autoComplete="current-password"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                APP_STRINGS.SIGN_IN
              )}
            </Button>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" align="center">
              {APP_STRINGS.DEMO_CREDENTIALS}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" align="center">
              {APP_STRINGS.EMPLOYEE_CREDENTIALS}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" align="center">
              {APP_STRINGS.MANAGER_CREDENTIALS}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginForm;
