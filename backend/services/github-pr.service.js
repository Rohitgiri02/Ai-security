const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';
const WORKFLOW_FILE_PATH = '.github/workflows/security-gate.yml';
const WORKFLOW_THRESHOLD = 50;

function getAuthHeaders() {
  if (!process.env.GITHUB_TOKEN) {
    const error = new Error('GITHUB_TOKEN is required to create workflow PRs');
    error.statusCode = 500;
    error.publicMessage = 'GitHub token is not configured';
    throw error;
  }

  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'ai-cicd-security-analyzer',
  };
}

async function githubRequest(method, path, data) {
  try {
    const response = await axios({
      method,
      url: `${GITHUB_API_BASE}${path}`,
      headers: getAuthHeaders(),
      data,
      timeout: 20000,
    });

    return response.data;
  } catch (error) {
    const statusCode = error.response?.status || 502;
    const message = error.response?.data?.message || error.message || 'GitHub API request failed';

    const wrapped = new Error(message);
    wrapped.statusCode = statusCode;
    wrapped.publicMessage = message;
    throw wrapped;
  }
}

function buildWorkflowContent() {
  return `name: Security Gate

on:
  push:
    branches:
      - '**'
  pull_request:
    branches:
      - '**'
  workflow_dispatch:

permissions:
  contents: read

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Request security analysis
        id: analysis
        shell: bash
        env:
          BACKEND_URL: ${'$'}{{ secrets.SECURITY_ANALYZER_BACKEND_URL }}
          CI_WEBHOOK_TOKEN: ${'$'}{{ secrets.CI_WEBHOOK_TOKEN }}
          REPOSITORY: ${'$'}{{ github.repository }}
          BRANCH: ${'$'}{{ github.ref_name }}
          COMMIT_SHA: ${'$'}{{ github.sha }}
        run: |
          if [ -z "$BACKEND_URL" ] || [ -z "$CI_WEBHOOK_TOKEN" ]; then
            echo "Missing SECURITY_ANALYZER_BACKEND_URL or CI_WEBHOOK_TOKEN"
            exit 1
          fi

          response=$(curl -sS -X POST "$BACKEND_URL/webhook/analyze-ci" \
            -H "Content-Type: application/json" \
            -H "x-ci-token: $CI_WEBHOOK_TOKEN" \
            -d "{\"repo\":\"$REPOSITORY\",\"branch\":\"$BRANCH\",\"commitSha\":\"$COMMIT_SHA\"}")

          echo "$response" > security-analysis.json

          risk=$(node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('security-analysis.json', 'utf8')); process.stdout.write(String(data.risk ?? 0));")
          decision=$(node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('security-analysis.json', 'utf8')); process.stdout.write(String(data.decision ?? 'allow'));")

          echo "risk=$risk" >> "$GITHUB_OUTPUT"
          echo "decision=$decision" >> "$GITHUB_OUTPUT"

      - name: Block deployment when risk is above threshold
        shell: bash
        run: |
          risk="${'$'}{{ steps.analysis.outputs.risk }}"
          if [ -z "$risk" ]; then
            risk=0
          fi

          if [ "$risk" -gt ${WORKFLOW_THRESHOLD} ]; then
            echo "Security risk is $risk, which is above the allowed threshold of ${WORKFLOW_THRESHOLD}."
            exit 1
          fi
`;
}

async function createWorkflowInjectionPr(repoFullName) {
  const [owner, repo] = repoFullName.split('/');

  if (!owner || !repo) {
    const error = new Error('Invalid repository format');
    error.statusCode = 400;
    error.publicMessage = 'Invalid repository format. Use owner/repo';
    throw error;
  }

  const repoInfo = await githubRequest('GET', `/repos/${owner}/${repo}`);
  const baseBranch = repoInfo.default_branch;
  const branchName = `security/analyzer-${Date.now()}`;

  const branchRef = await githubRequest('GET', `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(baseBranch)}`);
  await githubRequest('POST', `/repos/${owner}/${repo}/git/refs`, {
    ref: `refs/heads/${branchName}`,
    sha: branchRef.object.sha,
  });

  await githubRequest('PUT', `/repos/${owner}/${repo}/contents/${encodeURIComponent(WORKFLOW_FILE_PATH)}`, {
    message: 'feat(security): add automated analysis workflow',
    content: Buffer.from(buildWorkflowContent()).toString('base64'),
    branch: branchName,
  });

  const pullRequest = await githubRequest('POST', `/repos/${owner}/${repo}/pulls`, {
    title: 'feat(security): add automated security gate workflow',
    head: branchName,
    base: baseBranch,
    body: [
      'This PR adds the GitHub Action that runs automated security analysis on every push and pull request.',
      '',
      'Required repository secrets after merge:',
      '- SECURITY_ANALYZER_BACKEND_URL',
      '- CI_WEBHOOK_TOKEN',
      '',
      `The workflow blocks when the backend analysis reports a risk score above ${WORKFLOW_THRESHOLD}.`,
    ].join('\n'),
  });

  return {
    branchName,
    baseBranch,
    workflowFilePath: WORKFLOW_FILE_PATH,
    workflowThreshold: WORKFLOW_THRESHOLD,
    prNumber: pullRequest.number,
    prUrl: pullRequest.html_url,
    prState: pullRequest.state,
    prTitle: pullRequest.title,
  };
}

module.exports = {
  createWorkflowInjectionPr,
  WORKFLOW_FILE_PATH,
  WORKFLOW_THRESHOLD,
};