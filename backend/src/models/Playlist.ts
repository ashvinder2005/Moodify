import mongoose, { Document, Schema } from 'mongoose';
import { ISong } from '../types/Song';

export interface IPlaylist extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  songs: ISong[];
  createdAt: Date;
}

const playlistSchema = new Schema<IPlaylist>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  songs: [{
    _id: { type: String, required: true },
    title: { type: String, required: true },
    artist: { type: String, required: true },
    duration: { type: Number, default: 0 },
    previewUrl: { type: String, default: '' },
    genre: { type: String, default: '' },
    moodTags: { type: [String], default: [] },
    imageUrl: { type: String, default: '' }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPlaylist>('Playlist', playlistSchema);
