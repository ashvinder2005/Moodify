import { Request, Response } from 'express';
import Song from '../models/Song';
import History from '../models/History';
import { AuthRequest } from '../middlewares/authMiddleware';

const classifyTimeOfDay = (hour: number): string[] => {
  if (hour >= 5 && hour < 12) return ['Energetic', 'Happy']; // Morning
  if (hour >= 12 && hour < 17) return ['Pop', 'Rock', 'Energetic']; // Afternoon
  if (hour >= 17 && hour < 21) return ['Acoustic', 'Ambient', 'Calm']; // Evening
  return ['Calm', 'Acoustic', 'Sad']; // Night
};

export const getRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mood, intensity } = req.query;
    const intensityParam = Number(intensity) || 3;
    const hour = new Date().getHours();
    
    // Determine Time of Day tags
    const timeTags = classifyTimeOfDay(hour);

    // Fetch User History
    const history = await History.find({ userId: req.user._id }).populate('songId').sort({ playedAt: -1 }).limit(20);
    const historyTags: Record<string, number> = {};
    
    history.forEach((h: any) => {
       if (h.songId && h.songId.moodTags) {
         h.songId.moodTags.forEach((tag: string) => {
           historyTags[tag] = (historyTags[tag] || 0) + 1;
         });
       }
    });

    const allSongs = await Song.find({});
    
    // Scoring Algorithm
    const scoredSongs = allSongs.map(song => {
      let score = 0;
      
      song.moodTags.forEach(tag => {
        let moodMatch = 0;
        let historyWeight = historyTags[tag] || 0;

        // 1. Primary Mood Match
        if (mood && tag.toLowerCase() === (mood as string).toLowerCase()) {
          moodMatch = 1;
        }
        
        // 2. Time Match
        let timeMatch = timeTags.includes(tag) ? 1 : 0;

        // 3. Apply Dynamic Scoring logic
        // Formula: score = (moodMatch * 5) + (intensity * 2) + (timeMatch * 2) + (historyWeight * 4)
        // We evaluate intensity only if there is a mood match to avoid padding arbitrary tags.
        let appliedIntensity = moodMatch > 0 ? intensityParam : 0;
        score += (moodMatch * 5) + (appliedIntensity * 2) + (timeMatch * 2) + (historyWeight * 4);
      });
      
      return { song, score };
    });

    // Sort by descending score
    scoredSongs.sort((a, b) => b.score - a.score);

    let finalSongs = scoredSongs.map(s => s.song);

    // If the user explicitly requested a mood, ONLY return songs that match that mood to ensure relevance
    if (mood) {
      finalSongs = finalSongs.filter(song => 
        song.moodTags.some(tag => tag.toLowerCase() === (mood as string).toLowerCase())
      );
    }

    // Return top 20
    const recommendations = finalSongs.slice(0, 20);

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

    // Using the text index for optimized searching
    const songs = await Song.find(
      { $text: { $search: q as string } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } }).limit(10);

    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAllSongs = async (req: Request, res: Response): Promise<void> => {
  try {
    const songs = await Song.find({});
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getRecentlyPlayed = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    // Get distinct recently played song IDs
    const history = await History.find({ userId })
      .sort({ playedAt: -1 })
      .limit(30)
      .populate('songId');

    const uniqueSongs: any[] = [];
    const seenIds = new Set();

    history.forEach((h: any) => {
      if (h.songId && !seenIds.has(h.songId._id.toString())) {
        uniqueSongs.push(h.songId);
        seenIds.add(h.songId._id.toString());
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
    const hour = new Date().getHours();
    const timeTags = classifyTimeOfDay(hour);

    // Fetch User History for weighting
    const history = await History.find({ userId }).populate('songId').sort({ playedAt: -1 }).limit(50);
    const historyTags: Record<string, number> = {};
    
    history.forEach((h: any) => {
       if (h.songId && h.songId.moodTags) {
         h.songId.moodTags.forEach((tag: string) => {
           historyTags[tag] = (historyTags[tag] || 0) + 1;
         });
       }
    });

    const allSongs = await Song.find({});
    
    const scoredSongs = allSongs.map(song => {
      let score = 0;
      song.moodTags.forEach(tag => {
        let historyWeight = historyTags[tag] || 0;
        let timeMatch = timeTags.includes(tag) ? 1 : 0;
        
        // Formula: score = (timeMatch * 5) + (historyWeight * 4) 
        // Note: No moodMatch here as it's a general personalized recommendation
        score += (timeMatch * 5) + (historyWeight * 4);
      });
      return { song, score };
    });

    scoredSongs.sort((a, b) => b.score - a.score);
    const recommendations = scoredSongs.slice(0, 10).map(s => s.song);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
