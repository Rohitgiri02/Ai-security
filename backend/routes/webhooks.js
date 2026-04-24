const express = require('express');
const crypto = require('crypto');
const Project = require('../models/Project');
const { fetchRepoCode } = require('../services/github.service');
const { scanCodeForPatterns, validateIssuesWithAI } = require('../services/scan.service');
const { analyzeRiskWithAI } = require('../services/ai.service');
const { fallbackRiskScore, decisionFromRisk } = require('../services/risk.service');
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

async function runRepositoryAnalysis(repoFullName, metadata = {}) {
  const { combinedCode, fileCount } = await fetchRepoCode(repoFullName);
  const detectedPatterns = scanCodeForPatterns(combinedCode);
  const validatedIssues = await validateIssuesWithAI(detectedPatterns);

  let risk = fallbackRiskScore(validatedIssues);
  let ai = {};

  if (validatedIssues.length > 0) {
    try {
      ai = await analyzeRiskWithAI({ code: combinedCode, issues: validatedIssues });
      if (typeof ai.risk === 'number') {
        risk = ai.risk;
      }
    } catch (error) {
      ai = {
        summary: 'AI analysis unavailable. Fallback risk used.',
        error: error.message,
      };
    }
  } else {
    ai = {
      summary: 'No verified security vulnerabilities detected.',
    };
  }

  const decision = decisionFromRisk(risk);

  return {
    risk,
    decision,
    issues: validatedIssues,
    ai,
    meta: {
      repo: repoFullName,
      fileCount,
      issuesDetected: detectedPatterns.length,
      issuesValidated: validatedIssues.length,
      scannedAt: new Date().toISOString(),
      trigger: metadata.trigger || 'webhook',
      branch: metadata.branch,
      commitSha: metadata.commitSha,
      source: metadata.source || 'github',
    },
  };
}

async function persistAnalysisForRepo(repoFullName, analysis) {
  const projects = await Project.find({ fullName: repoFullName });
  if (!projects.length) {
    return 0;
  }

  const analysisRecord = {
    ...analysis,
    analyzedAt: new Date(),
  };

  await Promise.all(
    projects.map(async (project) => {
      project.latestAnalysis = analysisRecord;
      project.analyses = [analysisRecord, ...(project.analyses || [])].slice(0, 25);
      await project.save();
    })
  );

  return projects.length;
}

router.post('/analyze-ci', async (req, res) => {
  try {
    const { repo, branch, commitSha } = req.body || {};

    if (!repo || typeof repo !== 'string' || !/^[^/\s]+\/[^/\s]+$/.test(repo)) {
      return res.status(400).json({ error: 'Invalid repo format. Use owner/repo' });
    }

    const analysis = await runRepositoryAnalysis(repo, {
      trigger: 'ci',
      branch,
      commitSha,
      source: 'github-actions',
    });

    const projectsUpdated = await persistAnalysisForRepo(repo, analysis);

    return res.json({
      repository: repo,
      decision: analysis.decision,
      risk: analysis.risk,
      issuesCount: analysis.issues.length,
      projectsUpdated,
      analysis,
    });
  } catch (error) {
    console.error('[WEBHOOK_CI_ANALYZE] Failed', error.message);
    return res.status(error.statusCode || 500).json({
      error: error.publicMessage || 'Failed to analyze repository from CI',
      details: process.env.NODE_ENV === 'production' ? undefined : error.message,
    });
  }
});

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

      const commitSha = req.body.after;

      // Handle analysis asynchronously so GitHub webhook delivery is fast.
      setImmediate(async () => {
        try {
          const analysis = await runRepositoryAnalysis(repoFullName, {
            trigger: 'webhook',
            branch,
            commitSha,
            source: 'github-webhook',
          });

          const updated = await persistAnalysisForRepo(repoFullName, analysis);

          console.log(
            `[WEBHOOK_ANALYSIS] ${repoFullName} ${branch} risk=${analysis.risk} decision=${analysis.decision} updatedProjects=${updated}`
          );
        } catch (analysisError) {
          console.error('[WEBHOOK_ANALYSIS] Failed', analysisError.message);
        }
      });

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
