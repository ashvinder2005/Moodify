import express from 'express';
import { getRecommendations, searchSongs, getAllSongs, getRecentlyPlayed, getPersonalizedRecommendations } from '../controllers/musicController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/recommendations', protect as any, getRecommendations as any);
router.get('/recently-played', protect as any, getRecentlyPlayed as any);
router.get('/personalized', protect as any, getPersonalizedRecommendations as any);
router.get('/search', searchSongs as any);
router.get('/', getAllSongs as any);

export default router;
