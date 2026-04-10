const patterns = require("../data/patterns.json");
const { validateIssueWithAI } = require("./ai.service");

// File extensions to scan (exclude docs, config, etc)
const SCANNABLE_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".java",
  ".go",
  ".rb",
  ".php",
  ".c",
  ".cpp",
  ".cs",
  ".sql",
  ".sh",
]);

// Directories to skip (test, docs, examples)
const SKIP_DIRECTORIES = ["test", "tests", "__tests__", "spec", "specs", "docs", "example", "examples", "sample", ".github", "node_modules"];

function shouldScanFile(filePath) {
  const lower = filePath.toLowerCase();

  // Skip if in excluded directories
  for (const dir of SKIP_DIRECTORIES) {
    if (lower.includes(`/${dir}/`) || lower.startsWith(`${dir}/`)) {
      return false;
    }
  }

  // Check extension
  const ext = lower.slice(lower.lastIndexOf("."));
  return SCANNABLE_EXTENSIONS.has(ext);
}

function getContextLines(lines, lineIndex, contextLines = 2) {
  const start = Math.max(0, lineIndex - contextLines);
  const end = Math.min(lines.length, lineIndex + contextLines + 1);
  return lines.slice(start, end).join("\n");
}

function scanCodeForPatterns(code) {
  if (!code || typeof code !== "string") {
    return [];
  }

  const lines = code.split("\n");
  const detectedIssues = [];
  let currentFile = "unknown";
  let fileLineOffset = 0;

  lines.forEach((line, globalLineIdx) => {
    // Track current file
    if (line.includes("/* FILE:")) {
      const fileMatch = line.match(/\/\* FILE: (.+) \*\//);
      if (fileMatch) {
        currentFile = fileMatch[1];
      }
      fileLineOffset = globalLineIdx + 1;
      return;
    }

    // Skip files we shouldn't scan
    if (!shouldScanFile(currentFile)) {
      return;
    }

    const lineNumber = globalLineIdx - fileLineOffset + 1;
    const normalizedLine = line.toLowerCase();

    // Check each pattern
    patterns.forEach((entry) => {
      const patternLower = String(entry.pattern || "").toLowerCase();

      if (patternLower && normalizedLine.includes(patternLower)) {
        const columnIndex = normalizedLine.indexOf(patternLower);

        // Get context for LLM validation
        const context = getContextLines(lines, globalLineIdx, 3);

        detectedIssues.push({
          id: entry.id,
          pattern: entry.pattern,
          risk: entry.risk,
          severity: entry.severity,
          description: entry.description,
          fix: entry.fix,
          file: currentFile,
          line: Math.max(1, lineNumber),
          column: columnIndex + 1,
          code: line.trim(),
          context, // Full context for AI validation
          validated: false, // Mark as not yet validated
        });
      }
    });
  });

  return detectedIssues;
}

// Validate detected issues using AI
async function validateIssuesWithAI(issues) {
  if (!issues.length) {
    return [];
  }

  const validatedIssues = [];

  for (const issue of issues) {
    try {
      const isReal = await validateIssueWithAI({
        file: issue.file,
        line: issue.line,
        pattern: issue.pattern,
        code: issue.code,
        context: issue.context,
        risk: issue.risk,
        severity: issue.severity,
      });

      if (isReal) {
        validatedIssues.push({
          id: issue.id,
          pattern: issue.pattern,
          risk: issue.risk,
          severity: issue.severity,
          description: issue.description,
          fix: issue.fix,
          file: issue.file,
          line: issue.line,
          column: issue.column,
          code: issue.code,
          validated: true,
          confidence: "high",
        });
      }
    } catch (error) {
      console.warn(`[SCAN] Failed to validate issue ${issue.id}: ${error.message}`);
      // On AI error, include with lower confidence
      validatedIssues.push({
        ...issue,
        validated: false,
        confidence: "low",
      });
    }
  }

  return validatedIssues;
}

module.exports = {
  scanCodeForPatterns,
  validateIssuesWithAI,
};
