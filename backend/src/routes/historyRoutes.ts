import express from 'express';
import { logHistory, getHistory } from '../controllers/historyController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect as any, logHistory as any);
router.get('/', protect as any, getHistory as any);

export default router;
