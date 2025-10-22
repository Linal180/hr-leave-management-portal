import { Router } from 'express';
import leaveController from '../controllers/leaveController';
import { validateRequest } from '../middleware/validation';
import { authenticateUser, requireManager, requireEmployee } from '../middleware/auth';
import { leaveRequestSchema, leaveApprovalSchema } from '../utils/validation';

const router = Router();

// All leave routes require authentication
router.use(authenticateUser);

// Employee routes
router.post('/apply', requireEmployee, validateRequest(leaveRequestSchema), leaveController.applyForLeave);
router.get('/my-requests', requireEmployee, leaveController.getEmployeeLeaveRequests);

// Manager routes
router.get('/pending', requireManager, leaveController.getPendingLeaveRequests);
router.post('/approve/:id', requireManager, validateRequest(leaveApprovalSchema), leaveController.approveOrRejectLeave);

// Admin routes (both managers and employees can view all requests)
router.get('/all', leaveController.getAllLeaveRequests);
router.get('/summary', leaveController.getMonthlySummary);

export default router;
