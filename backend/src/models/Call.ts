import mongoose, { Schema, Document } from 'mongoose';

export interface ICall extends Document {
  caller: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  type: 'audio' | 'video';
  status: 'pending' | 'accepted' | 'rejected' | 'missed' | 'ended';
  startedAt?: Date;
  endedAt?: Date;
  duration?: number; // in seconds
  callId: string; // unique identifier for the call
  createdAt: Date;
  updatedAt: Date;
}

const callSchema = new Schema<ICall>(
  {
    caller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['audio', 'video'], default: 'audio' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'missed', 'ended'], default: 'pending' },
    startedAt: { type: Date },
    endedAt: { type: Date },
    duration: { type: Number }, // seconds
    callId: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

callSchema.index({ caller: 1, createdAt: -1 });
callSchema.index({ receiver: 1, status: 1 });

export const Call = mongoose.model<ICall>('Call', callSchema);
