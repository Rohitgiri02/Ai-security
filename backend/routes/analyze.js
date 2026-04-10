const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");

const { fetchRepoCode } = require("../services/github.service");
const { scanCodeForPatterns, validateIssuesWithAI } = require("../services/scan.service");
const { analyzeRiskWithAI } = require("../services/ai.service");
const { fallbackRiskScore, decisionFromRisk } = require("../services/risk.service");

const router = express.Router();

router.use(requireAuth);

router.post("/", async (req, res) => {
  const { repo } = req.body || {};

  if (!repo || typeof repo !== "string" || !/^[^/\s]+\/[^/\s]+$/.test(repo)) {
    return res.status(400).json({
      error: "Invalid repo format. Use owner/repo",
    });
  }

  try {
    console.info(`[ANALYZE] Starting analysis for ${repo}`);

    const { combinedCode, fileCount } = await fetchRepoCode(repo);
    
    // Step 1: Pattern matching (find potential issues)
    const detectedPatterns = scanCodeForPatterns(combinedCode);
    console.info(`[ANALYZE] Detected ${detectedPatterns.length} pattern matches for ${repo}`);

    // Step 2: AI-powered validation (filter false positives using LLM brain)
    const validatedIssues = await validateIssuesWithAI(detectedPatterns);
    console.info(`[ANALYZE] AI validated: ${validatedIssues.length}/${detectedPatterns.length} are real issues for ${repo}`);

    let risk = fallbackRiskScore(validatedIssues);
    let ai = {};

    if (validatedIssues.length > 0) {
      try {
        ai = await analyzeRiskWithAI({ code: combinedCode, issues: validatedIssues });
        if (typeof ai.risk === "number") {
          risk = ai.risk;
        }
      } catch (aiError) {
        console.warn(`[AI] Fallback risk used: ${aiError.message}`);
        ai = {
          error: "AI analysis unavailable. Fallback risk score applied.",
        };
      }
    } else {
      ai = {
        summary: "No verified security vulnerabilities detected.",
      };
    }

    const decision = decisionFromRisk(risk);

    console.info(`[ANALYZE] Completed ${repo} | issues=${validatedIssues.length} | risk=${risk} | decision=${decision}`);

    return res.status(200).json({
      risk,
      decision,
      issues: validatedIssues,
      ai,
      meta: {
        repo,
        fileCount,
        issuesDetected: detectedPatterns.length,
        issuesValidated: validatedIssues.length,
        scannedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    console.error(`[ANALYZE] Failed ${repo}`, error.message);

    return res.status(statusCode).json({
      error: error.publicMessage || "Failed to analyze repository",
      details: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
});

module.exports = router;
