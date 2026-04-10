const { getAuth } = require('@clerk/express');

function requireAuth(req, res, next) {
  const auth = getAuth(req);

  if (!auth.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.auth = auth;
  next();
}

module.exports = {
  requireAuth,
};
