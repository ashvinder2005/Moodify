import express from 'express';
import { logMood, getMoodAnalytics } from '../controllers/moodController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/log', protect as any, logMood as any);
router.get('/analytics', protect as any, getMoodAnalytics as any);

export default router;
