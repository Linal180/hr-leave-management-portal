import React, { useState, useEffect } from 'react';
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Visibility,
  Refresh
} from '@mui/icons-material';
import { LeaveRequest, LeaveRequestWithEmployee, ApprovalFormData } from '../../types';
import { LEAVE_STATUS, LEAVE_TYPES, MESSAGES } from '../../constants';
import apiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface LeaveRequestListProps {
  isManager?: boolean;
  refreshTrigger?: number;
}

const LeaveRequestList: React.FC<LeaveRequestListProps> = ({ 
  isManager = false, 
  refreshTrigger = 0 
}) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LeaveRequestWithEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequestWithEmployee | null>(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [approvalForm, setApprovalForm] = useState<ApprovalFormData>({
    action: 'approve',
    rejectionReason: ''
  });
  const [approvalLoading, setApprovalLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      
      let data: LeaveRequestWithEmployee[];
      if (isManager) {
        data = await apiService.getPendingLeaveRequests();
      } else {
        const myRequests = await apiService.getMyLeaveRequests();
        // Convert to LeaveRequestWithEmployee format
        data = myRequests.map(req => ({
          ...req,
          employeeName: user?.name || 'Unknown',
          employeeEmail: user?.email || 'Unknown'
        }));
      }
      
      setRequests(data);
    } catch (err: any) {
      setError(err.response?.data?.message || MESSAGES.ERROR.GENERIC_ERROR);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [isManager, refreshTrigger]);

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

  const handleApprove = (request: LeaveRequestWithEmployee) => {
    setSelectedRequest(request);
    setApprovalForm({ action: 'approve', rejectionReason: '' });
    setApprovalDialogOpen(true);
  };

  const handleReject = (request: LeaveRequestWithEmployee) => {
    setSelectedRequest(request);
    setApprovalForm({ action: 'reject', rejectionReason: '' });
    setApprovalDialogOpen(true);
  };

  const handleApprovalSubmit = async () => {
    if (!selectedRequest) return;

    try {
      setApprovalLoading(true);
      await apiService.approveOrRejectLeave(selectedRequest.id, approvalForm);
      
      setApprovalDialogOpen(false);
      setSelectedRequest(null);
      fetchRequests(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || MESSAGES.ERROR.GENERIC_ERROR);
    } finally {
      setApprovalLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2">
            {isManager ? 'Pending Leave Requests' : 'My Leave Requests'}
          </Typography>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchRequests}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {requests.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center" py={4}>
            {isManager ? MESSAGES.INFO.NO_PENDING_REQUESTS : MESSAGES.INFO.NO_LEAVE_REQUESTS}
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {isManager && <TableCell>Employee</TableCell>}
                  <TableCell>Type</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  {isManager && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    {isManager && (
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
                    )}
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
                      <Tooltip title={request.reason}>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {request.reason}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={request.status} 
                        color={getStatusColor(request.status) as any}
                        size="small"
                      />
                    </TableCell>
                    {isManager && request.status === LEAVE_STATUS.PENDING && (
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Approve">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handleApprove(request)}
                            >
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleReject(request)}
                            >
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Approval Dialog */}
        <Dialog open={approvalDialogOpen} onClose={() => setApprovalDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {approvalForm.action === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
          </DialogTitle>
          <DialogContent>
            {selectedRequest && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Employee: {selectedRequest.employeeName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Period: {formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Reason: {selectedRequest.reason}
                </Typography>
                
                {approvalForm.action === 'reject' && (
                  <TextField
                    fullWidth
                    label="Rejection Reason"
                    multiline
                    rows={3}
                    value={approvalForm.rejectionReason}
                    onChange={(e) => setApprovalForm(prev => ({
                      ...prev,
                      rejectionReason: e.target.value
                    }))}
                    margin="normal"
                    required
                  />
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setApprovalDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleApprovalSubmit}
              variant="contained"
              color={approvalForm.action === 'approve' ? 'success' : 'error'}
              disabled={approvalLoading || (approvalForm.action === 'reject' && !approvalForm.rejectionReason)}
            >
              {approvalLoading ? (
                <CircularProgress size={20} />
              ) : (
                approvalForm.action === 'approve' ? 'Approve' : 'Reject'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestList;
