import mongoose, { Document, Schema } from 'mongoose';
import { ISong } from '../types/Song';

export interface IHistory extends Document {
  userId: mongoose.Types.ObjectId;
  song: ISong;
  playedAt: Date;
}

const historySchema = new Schema<IHistory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  song: {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    artist: { type: String, required: true },
    duration: { type: Number, default: 0 },
    previewUrl: { type: String, default: '' },
    genre: { type: String, default: '' },
    moodTags: { type: [String], default: [] },
    imageUrl: { type: String, default: '' }
  },
  playedAt: { type: Date, default: Date.now }
});

// Index to improve search history queries
historySchema.index({ userId: 1, playedAt: -1 });

export default mongoose.model<IHistory>('History', historySchema);
