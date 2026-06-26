import mongoose, { Document, Schema } from 'mongoose';

export enum MoodEnum {
  Happy = 'Happy',
  Sad = 'Sad',
  Angry = 'Angry',
  Calm = 'Calm'
}

export interface IMoodLog extends Document {
  userId: mongoose.Types.ObjectId;
  mood: MoodEnum;
  textInput?: string; // Optional user text describing mood
  intensity: number; // 1-5 intensity scale
  timestamp: Date;
}

const moodLogSchema = new Schema<IMoodLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: String, enum: Object.values(MoodEnum), required: true },
  textInput: { type: String },
  intensity: { type: Number, min: 1, max: 5, default: 3 },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IMoodLog>('MoodLog', moodLogSchema);
