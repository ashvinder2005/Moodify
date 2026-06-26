import mongoose, { Document, Schema } from 'mongoose';

export interface ISong extends Document {
  title: string;
  artist: string;
  duration: number; // in seconds
  audioUrl: string;
  genre: string;
  moodTags: string[]; // e.g. ["Happy", "Energetic"]
  imageUrl: string;
  createdAt: Date;
}

const songSchema = new Schema<ISong>({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  duration: { type: Number, required: true },
  audioUrl: { type: String, required: true },
  genre: { type: String, required: true },
  moodTags: { type: [String], default: [] },
  imageUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

songSchema.index({ title: 'text', artist: 'text' });

export default mongoose.model<ISong>('Song', songSchema);
