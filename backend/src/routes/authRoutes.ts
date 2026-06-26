import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerUser as any);
router.post('/login', loginUser as any);
router.get('/profile', protect as any, getUserProfile as any);

export default router;
