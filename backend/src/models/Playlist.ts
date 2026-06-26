import mongoose, { Document, Schema } from 'mongoose';

export interface IPlaylist extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  songs: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const playlistSchema = new Schema<IPlaylist>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPlaylist>('Playlist', playlistSchema);
