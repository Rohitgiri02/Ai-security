# AI Code Analyzer - Quick Reference Guide

## 🎯 Quick Commands

### Start the Platform

**Windows:**
```bash
start.bat
```

**macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
```

**Manual:**
```bash
# Terminal 1: Backend
cd backend
npm install
npm start

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

### URLs
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/health

## 📋 API Quick Reference

### Analyze Repository
```bash
POST /analyze
Content-Type: application/json

{
  "repo": "owner/repo"
}

Response:
{
  "risk": 90,
  "decision": "block",
  "issues": [...],
  "ai": {"summary": "..."}
}
```

### Authentication
```bash
GET /auth/github/url
# Returns OAuth redirect URL

POST /auth/github/callback
{"code": "authorization_code"}
# Returns user + token
```

### Projects Management
```bash
GET /projects              # List all
POST /projects             # Create {owner, repo}
GET /projects/:id          # Get one
DELETE /projects/:id       # Delete
GET /projects/:id/analyses # Analysis history
```

### Webhooks
```bash
POST /webhook/github       # GitHub sends here
GET /webhook/logs          # View logs
```

## 🔐 Environment Variables

**Backend (.env)**
```env
GITHUB_TOKEN=ghp_xxxxx
OPENAI_API_KEY=gsk_xxxxx
GITHUB_CLIENT_ID=Iv1.xxxxx
FRONTEND_URL=http://localhost:3001
```

## 🧪 Test Examples

### Quick Analysis
```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo": "octocat/Hello-World"}'
```

### Check Backend
```bash
curl http://localhost:3000/health
```

### Recent Webhooks
```bash
curl http://localhost:3000/webhook/logs
```

## 🐛 Debugging

### Backend Logs Not Showing?
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill and restart
taskkill /PID <PID> /F
npm start
```

### Frontend Not Loading?
```bash
# Check browser console (F12)
# Check network tab for API calls
# Ensure backend is running

# Restart frontend
npm run dev
```

### Auth Not Working?
- Verify GITHUB_TOKEN in .env
- Check token hasn't expired
- Ensure token has `repo` scope

### API Calls Failing?
- Check OPENAI_API_KEY is correct
- Verify GITHUB_TOKEN permissions
- Check URL format: owner/repo

## 📊 Vulnerability Patterns (20 Total)

1. `eval(` - Code Injection
2. `exec(` - Arbitrary Execution
3. `system(` - System Command Execution
4. `SELECT ` - SQL Injection
5. `<script` - XSS
6. `password` - Hardcoded Password
7. `api_key` - Hardcoded API Key
8. `MD5` - Weak Hash
9. `SHA1` - Weak Hash
10. `crypto.createCipher` - Weak Crypto
11. `.split('.')` - JWT Issues
12. `process.env` - Env Var Misuse
... and 8 more

## 🎨 Customization

### Change UI Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: '#0f172a',
  secondary: '#1e293b',
  accent: '#3b82f6',
}
```

### Add New Pattern
Edit `backend/data/patterns.json`:
```json
{
  "id": "PAT-21",
  "pattern": "your_pattern",
  "risk": "Category",
  "severity": "critical",
  "description": "...",
  "fix": "..."
}
```

### Change Risk Threshold
Edit `backend/services/risk.service.js`:
```javascript
const RISK_THRESHOLD = 70; // Change this
```

## 📈 Performance Tuning

### Reduce API Calls
- Uses GraphQL (98% reduction)
- Caches patterns in memory
- Filters unnecessary files

### Faster Analysis
- Smaller repos analyze faster
- Public repos need fewer permissions
- Parallelized pattern matching

## 🚀 Deployment

### Docker
```bash
docker-compose up -d
```

### Cloud Platform
1. Upload to GitHub
2. Connect to Heroku/Railway/Vercel
3. Set environment variables
4. Deploy

## 🔗 Useful Links

- [GitHub Tokens](https://github.com/settings/tokens)
- [Groq API Console](https://console.groq.com)
- [GitHub OAuth](https://github.com/settings/developers)
- [Express.js Docs](https://expressjs.com)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 💡 Tips & Tricks

1. **Test repos:**
   - `octocat/Hello-World` - Small, clean
   - `digininja/DVWA` - Vulnerable (intentional)
   - `facebook/react` - Large project

2. **Development mode:**
   ```bash
   npm run dev  # with hot reload
   ```

3. **Production build:**
   ```bash
   npm run build
   npm start    # runs dist
   ```

4. **Clear everything and restart:**
   ```bash
   rm -rf backend/node_modules frontend/node_modules
   npm install (in both dirs)
   npm start
   ```

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | `taskkill /PID <PID> /F` or use different port |
| Module not found | Delete node_modules, run npm install |
| API 401 error | Check API keys in .env |
| CORS errors | Check API proxy in vite.config.ts |
| Empty results | Check repo exists and GitHub token |

## 📞 Getting Help

1. Check README.md for full docs
2. Check SETUP.md for installation issues
3. Review backend logs: `npm start`
4. Review frontend logs: Browser console (F12)
5. Check .env file is configured

---

**Version**: 1.0  
**Last Updated**: 2024  
**Maintained by**: Security Analyzer Team
