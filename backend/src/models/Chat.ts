import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  name: string;
  description?: string;
  type: 'private' | 'group';
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  lastMessageAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['private', 'group'], default: 'private' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    lastMessageAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1 });
chatSchema.index({ createdAt: -1 });

export const Chat = mongoose.model<IChat>('Chat', chatSchema);
