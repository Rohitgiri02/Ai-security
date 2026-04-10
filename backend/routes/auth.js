const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const router = express.Router();

// In-memory session and state stores. Replace with persistent storage in production.
const sessionsByToken = new Map();
const oauthStates = new Map();

const GITHUB_OAUTH_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_OAUTH_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

const createToken = () => crypto.randomBytes(32).toString('hex');
const createState = () => crypto.randomBytes(16).toString('hex');

const pruneExpiredSessions = () => {
  const now = Date.now();
  for (const [token, session] of sessionsByToken.entries()) {
    if (session.expiresAt <= now) {
      sessionsByToken.delete(token);
    }
  }
};

const pruneExpiredStates = () => {
  const now = Date.now();
  for (const [state, expiresAt] of oauthStates.entries()) {
    if (expiresAt <= now) {
      oauthStates.delete(state);
    }
  }
};

// GET GitHub OAuth login URL
router.get('/github/url', (req, res) => {
  if (!GITHUB_OAUTH_CLIENT_ID) {
    return res.status(500).json({ error: 'GITHUB_CLIENT_ID is not configured' });
  }

  const redirectUri = `${FRONTEND_URL}/auth/github/callback`;
  const scope = 'repo admin:repo_hook';
  const state = createState();

  pruneExpiredStates();
  oauthStates.set(state, Date.now() + OAUTH_STATE_TTL_MS);

  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.append('client_id', GITHUB_OAUTH_CLIENT_ID);
  githubAuthUrl.searchParams.append('redirect_uri', redirectUri);
  githubAuthUrl.searchParams.append('scope', scope);
  githubAuthUrl.searchParams.append('state', state);

  res.json({ url: githubAuthUrl.toString() });
});

// POST GitHub OAuth callback
router.post('/github/callback', async (req, res) => {
  try {
    const { code, state } = req.body;

    if (!code || !state) {
      return res.status(400).json({ error: 'Authorization code and state are required' });
    }

    if (!GITHUB_OAUTH_CLIENT_ID || !GITHUB_OAUTH_CLIENT_SECRET) {
      return res.status(500).json({ error: 'GitHub OAuth is not fully configured' });
    }

    pruneExpiredStates();
    const stateExpiry = oauthStates.get(state);
    if (!stateExpiry || stateExpiry <= Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OAuth state' });
    }
    oauthStates.delete(state);

    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_OAUTH_CLIENT_ID,
        client_secret: GITHUB_OAUTH_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const githubAccessToken = tokenResponse.data?.access_token;
    if (!githubAccessToken) {
      return res.status(401).json({ error: 'Failed to exchange GitHub code for access token' });
    }

    const [profileResponse, emailResponse] = await Promise.all([
      axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'ai-code-analyzer',
        },
      }),
      axios.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'ai-code-analyzer',
        },
      }).catch(() => ({ data: [] })),
    ]);

    const githubUser = profileResponse.data;
    const primaryEmail = Array.isArray(emailResponse.data)
      ? emailResponse.data.find((e) => e.primary)?.email || emailResponse.data[0]?.email
      : undefined;

    const sessionToken = createToken();
    const sessionUser = {
      id: String(githubUser.id),
      githubUsername: githubUser.login,
      email: primaryEmail || githubUser.email || undefined,
      name: githubUser.name || githubUser.login,
      avatarUrl: githubUser.avatar_url,
    };

    pruneExpiredSessions();
    sessionsByToken.set(sessionToken, {
      user: sessionUser,
      githubAccessToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_TTL_MS,
    });

    res.json({
      user: sessionUser,
      token: sessionToken,
    });
  } catch (error) {
    const message = error.response?.data?.error_description || error.message;
    res.status(500).json({ error: `GitHub OAuth failed: ${message}` });
  }
});

// GET current user
router.get('/me', (req, res) => {
  try {
    pruneExpiredSessions();

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const session = sessionsByToken.get(token);

    if (!session) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json(session.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      sessionsByToken.delete(token);
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
