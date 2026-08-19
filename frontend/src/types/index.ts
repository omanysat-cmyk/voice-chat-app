export interface IUser {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChat {
  _id: string;
  name: string;
  description?: string;
  type: 'private' | 'group';
  participants: IUser[];
  lastMessage?: IMessage;
  lastMessageAt?: Date;
  createdBy: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  _id: string;
  chat: string;
  sender: IUser;
  content: string;
  type: 'text' | 'voice' | 'image' | 'file';
  fileUrl?: string;
  duration?: number;
  readBy: IUser[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICall {
  _id: string;
  caller: IUser;
  receiver: IUser;
  type: 'audio' | 'video';
  status: 'pending' | 'accepted' | 'rejected' | 'missed' | 'ended';
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
  callId: string;
  createdAt: Date;
  updatedAt: Date;
}
