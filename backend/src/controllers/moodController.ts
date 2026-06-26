import { Response } from 'express';
import MoodLog, { MoodEnum } from '../models/MoodLog';
import History from '../models/History';
import { AuthRequest } from '../middlewares/authMiddleware';

// Enhanced keyword mapping for text-based mood detection with scoring
const mapTextToMood = (text: string): { mood: MoodEnum; intensity: number } => {
  const t = text.toLowerCase();
  const tokens = t.split(/\W+/);
  
  const scores: Record<MoodEnum, number> = {
    [MoodEnum.Happy]: 0,
    [MoodEnum.Sad]: 0,
    [MoodEnum.Angry]: 0,
    [MoodEnum.Calm]: 0
  };

  const keywords: Record<MoodEnum, string[]> = {
    [MoodEnum.Happy]: ['happy', 'joy', 'great', 'excellent', 'awesome', 'good', 'excited', 'amazing', 'fine', 'wonderful', 'blessed'],
    [MoodEnum.Sad]: ['sad', 'depressed', 'down', 'cry', 'tears', 'bad', 'unhappy', 'lonely', 'miserable', 'heartbroken', 'gloomy'],
    [MoodEnum.Angry]: ['angry', 'mad', 'furious', 'frustrated', 'hate', 'annoyed', 'irritable', 'upset', 'rage', 'pissed'],
    [MoodEnum.Calm]: ['calm', 'relax', 'peaceful', 'tired', 'exhausted', 'sleepy', 'quiet', 'serene', 'chill', 'balanced']
  };

  // Intensity keywords
  let intensity = 3;
  if (t.match(/(very|extremely|so|incredibly|super|totally|really)/)) intensity = 5;
  if (t.match(/(slightly|a bit|little|somewhat|kinda|maybe)/)) intensity = 1;

  // Count keyword matches
  tokens.forEach(token => {
    Object.keys(keywords).forEach(mood => {
      if (keywords[mood as MoodEnum].includes(token)) {
        scores[mood as MoodEnum]++;
      }
    });
  });

  // Find mood with highest score
  let maxScore = 0;
  let detectedMood = MoodEnum.Calm; // Default fallback

  Object.keys(scores).forEach(mood => {
    if (scores[mood as MoodEnum] > maxScore) {
      maxScore = scores[mood as MoodEnum];
      detectedMood = mood as MoodEnum;
    }
  });

  return { mood: detectedMood, intensity };
};

export const logMood = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mood, textInput, intensity } = req.body;
    let detectedMood = mood;
    let detectedIntensity = intensity || 3;
    
    if (textInput && !mood) {
      const parsed = mapTextToMood(textInput);
      detectedMood = parsed.mood;
      if (!intensity) detectedIntensity = parsed.intensity;
    }

    if (!detectedMood) {
      res.status(400).json({ message: 'Mood or text input required' });
      return;
    }

    const log = await MoodLog.create({
      userId: req.user._id,
      mood: detectedMood,
      intensity: detectedIntensity,
      textInput,
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getMoodAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;

    // Get distribution counts per mood
    const moodCounts = await MoodLog.aggregate([
      { $match: { userId } },
      { $group: { _id: '$mood', count: { $sum: 1 } } }
    ]);

    // Most Frequent Mood
    const mostFrequent = [...moodCounts].sort((a, b) => b.count - a.count)[0];

    // Mood Trends over Time (Group by Date)
    const moodTrends = await MoodLog.aggregate([
      { $match: { userId } },
      { $group: { 
          _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, mood: "$mood" },
          averageIntensity: { $avg: "$intensity" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    // Most Active Listening Hour
    const activeHourResult = await History.aggregate([
      { $match: { userId } },
      { $group: { _id: { $hour: "$playedAt" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const topHour = activeHourResult.length > 0 ? activeHourResult[0]._id : null;

    // Top Genre Per Mood based on listening history
    const genrePerMood = await History.aggregate([
      { $match: { userId } },
      { $lookup: { from: 'songs', localField: 'songId', foreignField: '_id', as: 'song' } },
      { $unwind: '$song' },
      { $unwind: '$song.moodTags' },
      { $group: { _id: { mood: '$song.moodTags', genre: '$song.genre' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $group: { _id: '$_id.mood', topGenre: { $first: '$_id.genre' }, count: { $first: '$count' } } }
    ]);

    const recentLogs = await MoodLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10);

    res.json({
      counts: moodCounts,
      mostFrequent: mostFrequent ? mostFrequent._id : 'N/A',
      trends: moodTrends,
      topHour,
      genrePerMood,
      recent: recentLogs
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
