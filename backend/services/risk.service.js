function fallbackRiskScore(issues = []) {
  if (!Array.isArray(issues) || issues.length === 0) {
    return 0;
  }

  const severityWeights = {
    critical: 60,
    high: 40,
    medium: 20,
    low: 10,
  };

  let score = 0;

  for (const issue of issues) {
    const severity = String(issue.severity || "low").toLowerCase();
    score += severityWeights[severity] || severityWeights.low;
  }

  // Slightly increase risk when many findings exist.
  if (issues.length > 3) {
    score += Math.min(15, (issues.length - 3) * 5);
  }

  return Math.min(100, score);
}

function decisionFromRisk(risk) {
  return Number(risk) > 70 ? "block" : "allow";
}

module.exports = {
  fallbackRiskScore,
  decisionFromRisk,
};
