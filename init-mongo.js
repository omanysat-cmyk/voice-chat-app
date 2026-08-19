// MongoDB Initialization Script
db = db.getSiblingDB('voice-chat-db');

// Create collections
db.createCollection('users');
db.createCollection('chats');
db.createCollection('messages');
db.createCollection('calls');
db.createCollection('groups');
db.createCollection('contacts');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });

db.chats.createIndex({ participants: 1 });
db.chats.createIndex({ createdAt: -1 });
db.chats.createIndex({ lastMessageAt: -1 });

db.messages.createIndex({ chatId: 1, createdAt: -1 });
db.messages.createIndex({ senderId: 1 });
db.messages.createIndex({ createdAt: 1 });

db.calls.createIndex({ participants: 1 });
db.calls.createIndex({ startedAt: -1 });
db.calls.createIndex({ status: 1 });

db.groups.createIndex({ name: 1 });
db.groups.createIndex({ members: 1 });
db.groups.createIndex({ createdAt: -1 });

db.contacts.createIndex({ userId: 1, contactId: 1 }, { unique: true });

console.log('✅ MongoDB initialization completed!');
