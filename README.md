# Security Analyzer - AI-Powered CI/CD Security Platform

A modern, full-stack security analysis platform that automatically detects and prevents vulnerabilities in your code using AI.

## 🎯 Features

- **Real-Time Scanning**: Analyzes code at every push with advanced pattern matching
- **AI-Powered Intelligence**: Uses LLM (Llama 4 Scout) to eliminate false positives
- **GitHub Integration**: Automatic webhook integration for continuous monitoring
- **Smart Dashboard**: Beautiful visual insights with actionable recommendations
- **Risk Scoring**: Automatic risk assessment with block/allow decisions
- **GitHub OAuth**: Seamless authentication with GitHub

## 📋 Prerequisites

- Node.js 18+ and npm
- GitHub Account
- GitHub Personal Access Token (for API access)
- Groq API Key (for Llama model access)

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:
```env
PORT=3000
NODE_ENV=development
GITHUB_TOKEN=your_github_token_here
OPENAI_API_KEY=your_groq_api_key_here
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here
GITHUB_CLIENT_ID=your_github_oauth_client_id
FRONTEND_URL=http://localhost:3001
```

Start the backend:
```bash
npm start
```

The backend will run on `http://localhost:3000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3001`

## 🏗️ Architecture

### Backend Stack
- **Framework**: Express.js
- **Language**: JavaScript/Node.js
- **API Integration**: GitHub GraphQL API
- **AI Model**: Llama 4 Scout via Groq
- **Scanning**: 20 security vulnerability patterns

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router

### Frontend UI
- **Landing Page**: Hero, features slider, and workflow sections use motion to feel more dynamic
- **Footer Layout**: The footer now uses a three-column responsive grid for cleaner alignment
- **Social Links**: GitHub, X, and LinkedIn icons are included in the footer for quick external navigation
- **Accessibility**: Social icons include labels and the layout stays readable on smaller screens

## 📚 API Endpoints

### Authentication
- `GET /auth/github/url` - Get GitHub OAuth URL
- `POST /auth/github/callback` - Exchange OAuth code for token
- `GET /auth/me` - Get current user info

### Security Analysis
- `POST /analyze` - Analyze a GitHub repository
  - Body: `{ repo: "owner/repo" }`
  - Returns: Risk score, decision, issues, AI summary

### Projects
- `GET /projects` - List all projects
- `POST /projects` - Create new project
  - Body: `{ owner: "string", repo: "string" }`
- `GET /projects/:id` - Get project details
- `DELETE /projects/:id` - Delete project
- `GET /projects/:id/analyses` - Get analysis history

### Webhooks
- `POST /webhook/github` - GitHub webhook endpoint
- `GET /webhook/logs` - View webhook logs (debugging)

## 🔍 Security Analysis Process

1. **Code Fetching**: Uses GitHub GraphQL API to fetch entire repository
2. **Pattern Matching**: Scans code against 20 vulnerability patterns
3. **AI Validation**: Uses Llama model to validate findings and eliminate false positives
4. **Risk Scoring**: Calculates risk score (0-100)
5. **Decision**: Blocks deployment if risk > 70

### Supported Patterns
- Code Injection (eval, exec, system)
- SQL Injection
- Cross-Site Scripting (XSS)
- Weak Cryptography (MD5, SHA1)
- Hardcoded Credentials
- JWT Misconfiguration
- Environment Variable Misuse
- Process Execution
- And 12 more...

## 🔧 Environment Variables

### Backend
```env
PORT=3000                                          # Server port
NODE_ENV=development                              # Node environment
GITHUB_TOKEN=ghp_xxxxx                           # GitHub personal access token
OPENAI_API_KEY=gsk_xxxxx                         # Groq API key
OPENAI_BASE_URL=https://api.groq.com/openai/v1  # Groq endpoint
OPENAI_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
GITHUB_WEBHOOK_SECRET=your_secret               # For webhook verification
GITHUB_CLIENT_ID=your_client_id                 # For OAuth
FRONTEND_URL=http://localhost:3001              # Frontend URL
```

### Frontend
```env
VITE_API_URL=http://localhost:3000              # Backend API URL (auto-proxied)
```

## 📊 How It Works

### Step 1: Connect GitHub
User logs in with GitHub account using OAuth

### Step 2: Add Projects
Add GitHub repositories to monitor

### Step 3: Setup Webhooks
Platform automatically sets up webhooks for push events

### Step 4: Analysis Runs
At every push, the platform:
1. Fetches changed files
2. Scans for vulnerabilities
3. Uses AI to validate findings
4. Calculates risk score
5. Blocks if risk > 70

### Step 5: View Results
Dashboard shows detailed analysis with:
- Risk score and decision
- Issues found with exact locations
- AI-generated summaries
- Fix recommendations

## 🧪 Testing

### Test with Real Repositories

```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo": "digininja/DVWA"}'
```

Expected output for DVWA:
```json
{
  "risk": 90,
  "decision": "block",
  "issues": [
    {
      "pattern": "eval(",
      "severity": "critical",
      "file": "vulnerabilities/view_help.php",
      "line": 20,
      "description": "Use of eval() can execute untrusted input as code"
    }
  ]
}
```

## 📈 Cost Optimization

- **Before**: ~60 API calls per repository
- **After**: 1 GraphQL call per repository
- **Cost Reduction**: 98%
- **GitHub API Quota**: From 83 repos/hour to 2,488+ repos/hour

## 🚀 Deployment

### Docker (Recommended)

```bash
docker-compose up -d
```

### Manual Deployment

1. **Heroku**:
   ```bash
   git push heroku main
   ```

2. **DigitalOcean App Platform**: Connect GitHub repo

3. **AWS/GCP**: Use provided Dockerfile

## 🐛 Debugging

### Backend Logs
```bash
npm start
# or with verbose logging:
DEBUG=* npm start
```

### Frontend Dev Tools
```bash
npm run dev  # Includes source maps and debug info
```

### Webhook Testing
```bash
# View recent webhook logs
curl http://localhost:3000/webhook/logs
```

## 📝 Configuration

### Adjusting Risk Threshold
Edit [backend/services/risk.service.js](backend/services/risk.service.js):
```javascript
const RISK_THRESHOLD = 70; // Adjust this value
```

### Adding Custom Patterns
Edit [backend/data/patterns.json](backend/data/patterns.json):
```json
{
  "id": "PAT-XXX",
  "pattern": "your_pattern_here",
  "risk": "Risk Category",
  "severity": "critical",
  "description": "Description",
  "fix": "How to fix"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- 📧 Email: support@securityanalyzer.dev
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

## 🎯 Roadmap

- [ ] Database integration (PostgreSQL)
- [ ] Advanced filtering and search
- [ ] Custom vulnerability patterns
- [ ] Team collaboration features
- [ ] SAST/DAST integration
- [ ] CI/CD pipeline integration
- [ ] Automated remediation suggestions
- [ ] Enterprise features

---

**Made with ❤️ for secure code**
