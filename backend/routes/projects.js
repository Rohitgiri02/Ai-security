const express = require('express');

const Project = require('../models/Project');
const User = require('../models/User');
const { requireAuth } = require('../middleware/requireAuth');
const { fetchRepoCode, ensureRepositoryExists } = require('../services/github.service');
const { createWorkflowInjectionPr, WORKFLOW_FILE_PATH, WORKFLOW_THRESHOLD } = require('../services/github-pr.service');
const { scanCodeForPatterns, validateIssuesWithAI } = require('../services/scan.service');
const { analyzeRiskWithAI } = require('../services/ai.service');
const { fallbackRiskScore, decisionFromRisk } = require('../services/risk.service');

const router = express.Router();

router.use(requireAuth);

async function resolveUser(clerkId) {
  let user = await User.findOne({ clerkId });
  if (!user) {
    user = await User.create({ clerkId });
  }
  return user;
}

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
      trigger: metadata.trigger || 'manual',
      branch: metadata.branch,
      commitSha: metadata.commitSha,
      source: metadata.source || 'dashboard',
    },
  };
}

router.get('/', async (req, res) => {
  try {
    const user = await resolveUser(req.auth.userId);
    const projects = await Project.find({ userId: user._id }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = await resolveUser(req.auth.userId);
    const { owner, repo } = req.body || {};

    if (!owner || !repo) {
      return res.status(400).json({ error: 'owner and repo are required' });
    }

    const safeOwner = String(owner).trim();
    const safeRepo = String(repo).trim();

    if (!/^[\w.-]+$/.test(safeOwner) || !/^[\w.-]+$/.test(safeRepo)) {
      return res.status(400).json({ error: 'Invalid repository format. Use owner/repo' });
    }

    const fullName = `${safeOwner}/${safeRepo}`;

    const existingProject = await Project.findOne({ userId: user._id, fullName });
    if (existingProject) {
      return res.status(409).json({ error: 'Project already exists' });
    }

    await ensureRepositoryExists(fullName);

    const workflowPr = await createWorkflowInjectionPr(fullName);

    const project = await Project.create({
      userId: user._id,
      owner: safeOwner,
      repo: safeRepo,
      fullName,
      defaultBranch: workflowPr.baseBranch,
      workflowPrUrl: workflowPr.prUrl,
      workflowPrNumber: workflowPr.prNumber,
      workflowPrBranch: workflowPr.branchName,
      workflowPrStatus: workflowPr.prState,
      workflowFilePath: WORKFLOW_FILE_PATH,
      workflowThreshold: WORKFLOW_THRESHOLD,
    });

    res.status(201).json(project);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Project already exists' });
    }

    res.status(error.statusCode || 500).json({ error: error.publicMessage || error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await resolveUser(req.auth.userId);
    const project = await Project.findOne({ _id: req.params.id, userId: user._id });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await resolveUser(req.auth.userId);
    const result = await Project.findOneAndDelete({ _id: req.params.id, userId: user._id });

    if (!result) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/analyses', async (req, res) => {
  try {
    const user = await resolveUser(req.auth.userId);
    const project = await Project.findOne({ _id: req.params.id, userId: user._id });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project.analyses || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/analyze', async (req, res) => {
  try {
    const user = await resolveUser(req.auth.userId);
    const project = await Project.findOne({ _id: req.params.id, userId: user._id });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const analysis = await runRepositoryAnalysis(project.fullName, {
      trigger: 'manual',
      source: 'dashboard',
    });
    const analysisRecord = {
      ...analysis,
      analyzedAt: new Date(),
    };

    project.latestAnalysis = analysisRecord;
    project.analyses = [analysisRecord, ...(project.analyses || [])].slice(0, 25);
    await project.save();

    res.json({
      projectId: project._id,
      analysis: analysisRecord,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
