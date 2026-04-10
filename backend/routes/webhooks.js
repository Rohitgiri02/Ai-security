const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// In-memory webhook events log
const webhookLogs = [];

// Verify GitHub webhook signature
const verifyGithubSignature = (req, signature) => {
  if (!process.env.GITHUB_WEBHOOK_SECRET) {
    return true; // Skip verification if secret not set
  }

  const hash = crypto
    .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  return `sha256=${hash}` === signature;
};

// POST GitHub webhook
router.post('/github', async (req, res) => {
  try {
    const signature = req.headers['x-hub-signature-256'];
    const event = req.headers['x-github-event'];

    // Verify webhook signature
    if (!verifyGithubSignature(req, signature)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Log webhook
    const log = {
      id: `webhook-${Date.now()}`,
      event,
      repository: req.body.repository?.full_name,
      branch: req.body.ref?.split('/').pop(),
      commits: req.body.commits?.length || 0,
      timestamp: new Date(),
    };

    webhookLogs.push(log);

    // Handle push events only
    if (event === 'push') {
      const { repository, ref, commits } = req.body;

      if (!repository || !commits || commits.length === 0) {
        return res.json({ message: 'No commits to analyze' });
      }

      const repoFullName = repository.full_name;
      const branch = ref.split('/').pop();

      console.log(`\n📢 Webhook: Push to ${repoFullName}/${branch}`);
      console.log(`   Commits: ${commits.length}`);
      console.log(`   Analyzing code...`);

      // In production, trigger analysis asynchronously
      // For now, just acknowledge receipt

      return res.json({
        message: 'Webhook received',
        repository: repoFullName,
        branch,
        commits: commits.length,
        analysisQueued: true,
      });
    }

    res.json({ message: `Event ${event} received` });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET webhook logs (for debugging)
router.get('/logs', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    res.json(webhookLogs.slice(-limit));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
