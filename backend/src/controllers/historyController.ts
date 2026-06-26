import { Response } from 'express';
import History from '../models/History';
import { AuthRequest } from '../middlewares/authMiddleware';

export const logHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { songId } = req.body;
    
    if (!songId) {
      res.status(400).json({ message: 'Song ID is required' });
      return;
    }

    const historyEntry = await History.create({
      userId: req.user._id,
      songId
    });

    res.status(201).json(historyEntry);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const history = await History.find({ userId: req.user._id })
      .sort({ playedAt: -1 })
      .populate('songId')
      .limit(50);
      
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
