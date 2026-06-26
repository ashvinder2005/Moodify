import express from 'express';
import { createPlaylist, getUserPlaylists, addSongToPlaylist } from '../controllers/playlistController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect as any, createPlaylist as any);
router.get('/', protect as any, getUserPlaylists as any);
router.post('/add', protect as any, addSongToPlaylist as any);

export default router;
