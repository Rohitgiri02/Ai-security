const OpenAI = require("openai");

const MAX_CODE_CHARS = 12000;

function clampRisk(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(value)));
}

function extractJsonObject(text) {
  if (!text || typeof text !== "string") {
    return null;
  }

  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch (_) {
    // Some models return text around JSON; extract the first JSON object if present.
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  const possibleJson = trimmed.slice(start, end + 1);

  try {
    return JSON.parse(possibleJson);
  } catch (_) {
    return null;
  }
}

async function getAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  });
}

// Validate if a detected pattern is a REAL security vulnerability
async function validateIssueWithAI({ file, line, pattern, code, context, risk, severity }) {
  try {
    const client = await getAIClient();
    const model = process.env.OPENAI_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct";

    const validationPrompt = `You are a security code reviewer. Analyze this code finding and determine if it's a REAL security vulnerability or a FALSE POSITIVE.

FILE: ${file}
LINE: ${line}
DETECTED PATTERN: "${pattern}"
SEVERITY CATEGORY: ${severity}

CODE LINE:
${code}

FULL CONTEXT (surrounding lines):
${context}

TASK: Determine if this is a real security issue.

Consider:
1. Is this executable code or just documentation/comments?
2. Is this in a test/example/build script (false positive) or production code?
3. Is the detected pattern used safely or unsafely?
4. Would this actually cause a security vulnerability?

Return ONLY valid JSON with:
{
  "isRealVulnerability": boolean,
  "reasoning": "brief explanation",
  "falsePositiveReason": "if false positive, why (e.g., 'documentation file', 'test code', 'legitimate usage')",
  "confidence": "high|medium|low"
}`;

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.2,
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content:
            "You are a security expert. Be strict: only flag REAL vulnerabilities, not false positives from documentation or legitimate code patterns.",
        },
        { role: "user", content: validationPrompt },
      ],
    });

    const rawContent = completion.choices?.[0]?.message?.content || "";
    const parsed = extractJsonObject(rawContent);

    if (!parsed) {
      console.warn(`[AI] Failed to parse validation response for ${pattern}`);
      return false;
    }

    // Log the AI decision
    if (!parsed.isRealVulnerability) {
      console.info(
        `[AI] Filtered FP: ${pattern} in ${file}:${line} - ${parsed.falsePositiveReason}`
      );
    }

    return parsed.isRealVulnerability === true;
  } catch (error) {
    console.error(`[AI] Validation error: ${error.message}`);
    // Propagate so caller can keep finding with low confidence fallback.
    throw error;
  }
}

async function analyzeRiskWithAI({ code, issues }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const client = await getAIClient();
  const model = process.env.OPENAI_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct";

  const truncatedCode = String(code || "").slice(0, MAX_CODE_CHARS);

  const systemPrompt = [
    "You are a senior application security engineer.",
    "Analyze the provided repository code and detected issues.",
    "Return ONLY strict JSON with keys: risk (0-100 number), summary (string).",
    "Risk must be an integer and represent deployment risk.",
  ].join(" ");

  const userPrompt = JSON.stringify(
    {
      task: "Assess CI/CD deployment risk",
      detectedIssues: issues,
      codeSnippet: truncatedCode,
      instructions: "Focus on exploitability, impact, and confidence.",
    },
    null,
    2
  );

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.3,
    max_tokens: 500,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const rawContent = completion.choices?.[0]?.message?.content || "";
  const parsed = extractJsonObject(rawContent);

  if (!parsed || typeof parsed.summary !== "string") {
    throw new Error("AI returned invalid JSON payload");
  }

  return {
    risk: clampRisk(Number(parsed.risk)),
    summary: parsed.summary,
    model,
  };
}

module.exports = {
  analyzeRiskWithAI,
  validateIssueWithAI,
};
