const mongoose = require('mongoose');

const notificationPreferencesSchema = new mongoose.Schema(
  {
    emailAlerts: { type: Boolean, default: true },
    pushAlerts: { type: Boolean, default: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, default: '' },
    username: { type: String, default: '' },
    displayName: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    role: { type: String, enum: ['member', 'admin'], default: 'member' },
    preferences: { type: notificationPreferencesSchema, default: () => ({}) },
    lastLoginAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
