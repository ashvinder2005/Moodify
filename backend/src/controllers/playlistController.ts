import { Response } from 'express';
import Playlist from '../models/Playlist';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createPlaylist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const playlist = await Playlist.create({
      userId: req.user._id,
      name,
      songs: []
    });
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getUserPlaylists = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const playlists = await Playlist.find({ userId: req.user._id }).populate('songs');
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const addSongToPlaylist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { playlistId, songId } = req.body;
    
    // Ownership check implicitly not handled for brevity, but a robust system should
    const playlist = await Playlist.findOne({ _id: playlistId, userId: req.user._id });
    if (!playlist) {
      res.status(404).json({ message: 'Playlist not found' });
      return;
    }

    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }
    
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
