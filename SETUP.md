# Security Analyzer - Setup Guide

## Prerequisites

Before starting, make sure you have:
- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn package manager
- Git
- A GitHub account
- A text editor or IDE (VS Code recommended)

## Step-by-Step Setup

### 1️⃣ Get API Keys

#### GitHub Personal Access Token
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" (Classic)
3. Give it a name like "Security Analyzer"
4. Select these scopes:
   - `repo` (Full control of private repositories)
   - `admin:repo_hook` (Full control of repository hooks)
5. Click "Generate token"
6. Copy the token (you won't see it again!)

#### Groq API Key (for AI analysis)
1. Go to https://console.groq.com
2. Sign up with your GitHub account (or email)
3. Go to API Keys section
4. Create a new key
5. Copy the API key

#### GitHub OAuth (Optional - for login)
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: `Security Analyzer`
   - Homepage URL: `http://localhost:3001`
   - Authorization callback: `http://localhost:3001/auth/github/callback`
4. Copy Client ID and Client Secret

### 2️⃣ Clone or Create Project

```bash
# If fresh start
mkdir AI-Code-Analyzer
cd AI-Code-Analyzer

# Or clone existing
git clone <your-repo-url>
cd AI-Code-Analyzer
```

### 3️⃣ Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=3000
NODE_ENV=development

GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE
OPENAI_API_KEY=gsk_YOUR_GROQ_KEY_HERE
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=meta-llama/llama-4-scout-17b-16e-instruct

GITHUB_CLIENT_ID=YOUR_CLIENT_ID_HERE
GITHUB_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
GITHUB_WEBHOOK_SECRET=my_webhook_secret_123

FRONTEND_URL=http://localhost:3001
```

Start backend:
```bash
npm start
# or for development with auto-reload
npm run dev  # (if nodemon is installed)
```

✅ Backend should be running on `http://localhost:3000`

### 4️⃣ Setup Frontend

In a new terminal:
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

✅ Frontend should be running on `http://localhost:3001`

### 5️⃣ Test the Setup

#### Test Backend
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","timestamp":"..."}
```

#### Test Analysis
```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo": "octocat/Hello-World"}'
```

#### Test Frontend
Open http://localhost:3001 in your browser

You should see:
- Landing page with features
- "Get Started with GitHub" button
- Login page at /login (with demo login)
- Dashboard at /dashboard (after login in demo mode)

## 🆘 Troubleshooting

### "PORT 3000 already in use"
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm start
```

### "Module not found" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### GitHub API authentication fails
- Check your GITHUB_TOKEN is correct
- Ensure token hasn't expired (GitHub tokens don't expire by default)
- Check token has `repo` and `admin:repo_hook` scopes

### Groq API errors
- Verify OPENAI_API_KEY is correct
- Check at https://console.groq.com/keys
- API key should start with `gsk_`

### Frontend can't connect to backend
- Ensure backend is running on port 3000
- Check Vite config has correct API proxy settings
- Look for CORS errors in browser console

## 📱 Using the Platform

### Login (Demo Mode)
1. Click "Login with GitHub"
2. You'll be logged in as demo user
3. Can add projects and run analysis

### Add a Project
1. Go to Dashboard
2. Enter repo in format: `owner/repo` (e.g., `facebook/react`)
3. Click "Analyze"
4. Wait for analysis to complete
5. View results and issues

### Understand Results
- **Risk Score**: 0-100, >70 = Block
- **Severity**: Critical > High > Medium > Low
- **File/Line**: Exact location of issue
- **Fix**: Recommendation to fix the issue

## 🚀 Next Steps

### Development
- Browse code in `backend/` and `frontend/`
- All routes documented in README.md
- Modify patterns in `backend/data/patterns.json`

### Production
- Use Docker: `docker-compose up`
- Deploy to Heroku/AWS/DigitalOcean
- Setup GitHub webhooks for auto-analysis

### Customize
- Edit Tailwind colors in `frontend/tailwind.config.js`
- Add more security patterns
- Integrate with your CI/CD pipeline

## 📚 API Reference

See `README.md` for complete API documentation

## 💡 Tips

1. **Start with test repos**: 
   - `octocat/Hello-World` (clean, small)
   - `digininja/DVWA` (intentional vulnerabilities)

2. **Watch the logs**:
   - Backend: Check console for request logs
   - Frontend: Open browser DevTools (F12)

3. **Debug webhooks**:
   - `curl http://localhost:3000/webhook/logs`
   - Check webhook delivery in GitHub repo settings

4. **Try different repos**:
   - Small repos analyze faster
   - Public repos don't need special token scopes

## 🎉 Success Indicators

- ✅ Backend responds to health check
- ✅ Frontend loads without errors
- ✅ Can login (demo mode)
- ✅ Analysis returns risk score
- ✅ Issues show file locations
- ✅ Dashboard displays results

---

**Need help?** Check the main README.md or GitHub Issues
