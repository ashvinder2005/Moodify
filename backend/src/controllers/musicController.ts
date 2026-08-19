import { Request, Response } from 'express';
import History from '../models/History';
import { AuthRequest } from '../middlewares/authMiddleware';
import { MusicService } from '../services/musicService';

export const getRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mood, intensity } = req.query;
    const moodParam = mood ? String(mood) : 'trending';
    const intensityParam = Number(intensity) || 3;
    
    const recommendations = await MusicService.getRecommendationsByMood(moodParam, intensityParam);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const searchSongs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    if (!q) {
      res.json([]);
      return;
    }

    const songs = await MusicService.searchSongs(String(q));
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAllSongs = async (req: Request, res: Response): Promise<void> => {
  try {
    // Return some trending/default songs since we don't have a database of "all songs"
    const songs = await MusicService.getTrendingSongs();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getRecentlyPlayed = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    // Get distinct recently played songs from embedded history
    const history = await History.find({ userId })
      .sort({ playedAt: -1 })
      .limit(30);

    const uniqueSongs: any[] = [];
    const seenIds = new Set();

    history.forEach((h: any) => {
      if (h.song && h.song._id && !seenIds.has(h.song._id.toString())) {
        uniqueSongs.push(h.song);
        seenIds.add(h.song._id.toString());
      }
    });

    res.json(uniqueSongs.slice(0, 10));
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getPersonalizedRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;

    // Fetch User History to determine favorite genres or moods based on what they listened to
    const history = await History.find({ userId }).sort({ playedAt: -1 }).limit(10);
    
    // If no history, return trending
    if (!history || history.length === 0) {
      const trending = await MusicService.getTrendingSongs();
      res.json(trending);
      return;
    }

    // Try to extract an artist or title from the most recent songs to use as a seed for recommendations
    // For a generic API, searching an artist they recently listened to is a good way to personalize
    const recentSong = history[0].song;
    const seedArtist = recentSong?.artist || "pop";
    
    const recommendations = await MusicService.searchSongs(seedArtist + " music", 10);
    
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
