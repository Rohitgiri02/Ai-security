const express = require('express');
const User = require('../models/User');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

async function ensureUser(clerkId) {
  let user = await User.findOne({ clerkId });

  if (!user) {
    user = await User.create({ clerkId });
  }

  return user;
}

router.use(requireAuth);

router.post('/sync', async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { email, username, displayName, avatarUrl } = req.body || {};

    const user = await ensureUser(clerkId);

    user.email = email || user.email;
    user.username = username || user.username;
    user.displayName = displayName || user.displayName;
    user.avatarUrl = avatarUrl || user.avatarUrl;
    user.lastLoginAt = new Date();

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    const user = await ensureUser(req.auth.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/me', async (req, res) => {
  try {
    const updates = req.body || {};
    const user = await ensureUser(req.auth.userId);

    if (typeof updates.displayName === 'string') {
      user.displayName = updates.displayName.trim();
    }

    if (updates.preferences && typeof updates.preferences === 'object') {
      user.preferences.emailAlerts = !!updates.preferences.emailAlerts;
      user.preferences.pushAlerts = !!updates.preferences.pushAlerts;
    }

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
