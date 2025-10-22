import { Router } from 'express';
import authController from '../controllers/authController';
import { validateRequest } from '../middleware/validation';
import { authenticateUser } from '../middleware/auth';
import { userLoginSchema } from '../utils/validation';

const router = Router();

// Public routes
router.post('/login', validateRequest(userLoginSchema), authController.login);

// Protected routes
router.get('/profile', authenticateUser, authController.getProfile);
router.get('/users', authenticateUser, authController.getAllUsers);

export default router;
