import mongoose, { Document, Schema } from 'mongoose';

export interface IHistory extends Document {
  userId: mongoose.Types.ObjectId;
  songId: mongoose.Types.ObjectId;
  playedAt: Date;
}

const historySchema = new Schema<IHistory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  songId: { type: Schema.Types.ObjectId, ref: 'Song', required: true },
  playedAt: { type: Date, default: Date.now }
});

// Index to improve search history queries
historySchema.index({ userId: 1, playedAt: -1 });

export default mongoose.model<IHistory>('History', historySchema);
