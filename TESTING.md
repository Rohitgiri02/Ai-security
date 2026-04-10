# 🧪 Platform Testing Guide

Complete testing guide to verify that your AI Code Analyzer platform is working correctly.

## ✅ Pre-Testing Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] GitHub Personal Access Token obtained
- [ ] Groq API Key obtained
- [ ] `.env` file created with API keys
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`cd frontend && npm install`)

## 🚀 Phase 1: Backend Tests

### Test 1: Server Startup

```bash
cd backend
npm start
```

**Expected Output:**
```
🔐 Security Analyzer Backend
🚀 Server running on port 3000
📊 API endpoint: http://localhost:3000
🏥 Health check: http://localhost:3000/health

✅ Ready for analysis
```

**Result**: ✅ PASS / ❌ FAIL

### Test 2: Health Check

In a new terminal:
```bash
curl http://localhost:3000/health
```

**Expected:**
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

**Result**: ✅ PASS / ❌ FAIL

### Test 3: Get GitHub OAuth URL

```bash
curl http://localhost:3000/auth/github/url
```

**Expected:**
```json
{
  "url": "https://github.com/login/oauth/authorize?..."
}
```

**Result**: ✅ PASS / ❌ FAIL

### Test 4: Analyze Small Repository

```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo": "octocat/Hello-World"}'
```

**Expected Output:**
```json
{
  "risk": 0,
  "decision": "allow",
  "issues": [],
  "ai": {"summary": "..."},
  "metadata": {...}
}
```

**Result**: ✅ PASS / ❌ FAIL

### Test 5: Analyze Vulnerable Repository (DVWA)

```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo": "digininja/DVWA"}'
```

**Expected Output:**
```json
{
  "risk": 90,
  "decision": "block",
  "issues": [
    {
      "id": "PAT-001",
      "pattern": "eval(",
      "risk": "Code Injection",
      "severity": "critical",
      "file": "vulnerabilities/view_help.php",
      "line": 20,
      ...
    }
  ],
  "ai": {"summary": "..."},
  "metadata": {...}
}
```

**Result**: ✅ PASS / ❌ FAIL

### Test 6: Project Management

**Create Project:**
```bash
curl -X POST http://localhost:3000/projects \
  -H "Content-Type: application/json" \
  -d '{"owner": "facebook", "repo": "react"}'
```

**Expected:**
```json
{
  "id": "facebook/react",
  "owner": "facebook",
  "repo": "react",
  "createdAt": "...",
  "analyses": [],
  "isActive": true
}
```

**Result**: ✅ PASS / ❌ FAIL

**List Projects:**
```bash
curl http://localhost:3000/projects
```

**Expected:** Array of projects

**Result**: ✅ PASS / ❌ FAIL

## 📱 Phase 2: Frontend Tests

### Test 1: Frontend Server Startup

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v4.x.x
ready in 123 ms

➜  Local:   http://localhost:3001/
```

**Result**: ✅ PASS / ❌ FAIL

### Test 2: Landing Page

1. Open http://localhost:3001
2. Verify:
   - [ ] Hero section visible
   - [ ] Features grid displays
   - [ ] "Get Started with GitHub" button visible
   - [ ] Footer present
   - [ ] No console errors (F12)

**Result**: ✅ PASS / ❌ FAIL

### Test 3: Navigation Bar

1. Check navbar at top (fixed position)
2. Verify:
   - [ ] Logo visible
   - [ ] "Security Analyzer" text
   - [ ] "Login with GitHub" button
   - [ ] Responsive on mobile

**Result**: ✅ PASS / ❌ FAIL

### Test 4: Login Page

1. Click "Login with GitHub"
2. Verify redirected to `/login`
3. Check:
   - [ ] GitHub login button visible
   - [ ] "Demo Mode" section visible
   - [ ] Form styled correctly
   - [ ] Responsive design

**Result**: ✅ PASS / ❌ FAIL

### Test 5: Demo Login

1. Click "Login with GitHub" on login page
2. Verify:
   - [ ] Redirected to Dashboard
   - [ ] User shows in navbar
   - [ ] "Dashboard" link appears in navbar
   - [ ] "Logout" button visible

**Result**: ✅ PASS / ❌ FAIL

### Test 6: Dashboard Page

1. Navigate to /dashboard (after login)
2. Verify:
   - [ ] Navbar shows user logged in
   - [ ] "Add Project" section visible
   - [ ] Input field for repo
   - [ ] "Analyze" button
   - [ ] Demo project shows (DVWA)
   - [ ] Project cards display with:
     - [ ] Project name
     - [ ] Risk badge
     - [ ] Issue count
     - [ ] AI summary
     - [ ] "View Details" button

**Result**: ✅ PASS / ❌ FAIL

### Test 7: Project Detail Page

1. Click "View Details" on a project
2. Verify:
   - [ ] Back to Dashboard link
   - [ ] Project title and URL
   - [ ] Analysis history buttons
   - [ ] Risk score displayed
   - [ ] Decision (block/allow) shown
   - [ ] Issues list with cards
   - [ ] Each issue shows:
     - [ ] Pattern name
     - [ ] Severity badge (color-coded)
     - [ ] File location
     - [ ] Code snippet
     - [ ] Description
     - [ ] Fix recommendation
   - [ ] AI summary visible
   - [ ] Summary statistics (Critical/High/Medium/Low count)

**Result**: ✅ PASS / ❌ FAIL

### Test 8: Add Project and Analyze

1. On Dashboard, enter repo: `digininja/DVWA`
2. Click "Analyze"
3. Verify:
   - [ ] Button shows "Analyzing..."
   - [ ] Process takes 3-5 seconds
   - [ ] New project added to list
   - [ ] Results show immediately
   - [ ] Risk score: 90
   - [ ] Decision: BLOCK

**Result**: ✅ PASS / ❌ FAIL

### Test 9: Logout

1. Click "Logout" in navbar
2. Verify:
   - [ ] Redirected to Landing page
   - [ ] User removed from navbar
   - [ ] "Login with GitHub" button shows again
   - [ ] Authorization persisted (check localStorage)

**Result**: ✅ PASS / ❌ FAIL

### Test 10: Responsive Design

1. Open DevTools (F12)
2. Test at breakpoints:
   - [ ] Mobile (320px)
   - [ ] Tablet (768px)
   - [ ] Desktop (1024px+)
3. Verify:
   - [ ] No horizontal scrolling
   - [ ] Text readable
   - [ ] Buttons clickable
   - [ ] Layout adjusts properly

**Result**: ✅ PASS / ❌ FAIL

## 🔌 Phase 3: Integration Tests

### Test 1: API Communication

1. Open browser DevTools (F12)
2. Go to Network tab
3. Click "Analyze" on Dashboard
4. Verify:
   - [ ] POST request to `/api/analyze`
   - [ ] Request includes repo name
   - [ ] Response includes risk score
   - [ ] Status code 200

**Result**: ✅ PASS / ❌ FAIL

### Test 2: Vite Proxy Configuration

1. Check that `/api/` requests are proxied to `http://localhost:3000`
2. Open DevTools Network tab
3. Click analyze
4. Verify request goes to backend

**Result**: ✅ PASS / ❌ FAIL

### Test 3: Authentication Flow

1. Clear localStorage (DevTools Console):
   ```javascript
   localStorage.clear()
   ```
2. Refresh page - should show Landing page
3. Click Login - go to login page
4. Click Login button
5. Verify:
   - [ ] Token saved in localStorage
   - [ ] User state updated
   - [ ] Dashboard accessible
   - [ ] Token sent in API requests (Authorization header)

**Result**: ✅ PASS / ❌ FAIL

## 🐛 Phase 4: Error Handling Tests

### Test 1: Invalid Repository

1. Enter invalid repo: `invalid-repo`
2. Click Analyze
3. Verify:
   - [ ] Error message displayed
   - [ ] Graceful error handling
   - [ ] Can try again

**Result**: ✅ PASS / ❌ FAIL

### Test 2: API Failure Simulation

1. Stop backend server
2. Try to analyze
3. Verify:
   - [ ] Error message shown
   - [ ] No hard crash
   - [ ] Can retry after restarting

**Result**: ✅ PASS / ❌ FAIL

### Test 3: Missing Environment Variables

1. Edit `.env` - comment out a required key
2. Restart backend
3. Try to analyze
4. Verify:
   - [ ] Meaningful error message
   - [ ] Clear indication of what's missing

**Result**: ✅ PASS / ❌ FAIL

## 📊 Phase 5: Performance Tests

### Test 1: Analysis Speed

**Small Repo (octocat/Hello-World):**
- Expected time: < 2 seconds
- Actual time: ___ seconds
- **Result**: ✅ PASS / ❌ FAIL

**Medium Repo (digininja/DVWA):**
- Expected time: 3-5 seconds
- Actual time: ___ seconds
- **Result**: ✅ PASS / ❌ FAIL

**Large Repo (facebook/react):**
- Expected time: 10-20 seconds
- Actual time: ___ seconds
- **Result**: ✅ PASS / ❌ FAIL

### Test 2: Pattern Detection Accuracy

Analyze DVWA - Expected results:
- [ ] Risk score: ~90
- [ ] Issues found: 1+
- [ ] eval() pattern detected
- [ ] Correct file path shown
- [ ] Correct line number shown

**Result**: ✅ PASS / ❌ FAIL

### Test 3: False Positive Filtering

Analyze RocketChat - Expected results:
- [ ] Risk score: 0-20
- [ ] No critical issues
- [ ] False positives filtered
- [ ] AI validation working

**Result**: ✅ PASS / ❌ FAIL

## 🔐 Phase 6: Security Tests

### Test 1: API Key Not Exposed

1. Open DevTools Network tab
2. Analyze a repo
3. Check request/response:
   - [ ] API key NOT visible in requests
   - [ ] Token properly sent in headers
   - [ ] No credentials in console logs

**Result**: ✅ PASS / ❌ FAIL

### Test 2: localStorage Security

1. Open DevTools Console
2. Check localStorage:
   ```javascript
   localStorage.getItem('authToken')
   ```
3. Verify:
   - [ ] Token present but not API key
   - [ ] Could be improved (use sessionStorage)

**Result**: ✅ PASS / ❌ FAIL

## 📋 Final Test Summary

### Backend Tests
- Test 1: Server Startup - ✅/❌
- Test 2: Health Check - ✅/❌
- Test 3: OAuth URL - ✅/❌
- Test 4: Analyze Small Repo - ✅/❌
- Test 5: Analyze DVWA - ✅/❌
- Test 6: Project CRUD - ✅/❌

**Backend Score**: __/6 | Status: ✅ READY / ⚠️ ISSUES

### Frontend Tests
- Test 1-10: Page & Feature Tests - __/10

**Frontend Score**: __/10 | Status: ✅ READY / ⚠️ ISSUES

### Integration Tests
- Test 1-3: Integration - __/3

**Integration Score**: __/3 | Status: ✅ READY / ⚠️ ISSUES

### Error Handling Tests
- Test 1-3: Error Cases - __/3

**Error Handling Score**: __/3 | Status: ✅ READY / ⚠️ ISSUES

### Performance Tests
- Test 1-3: Speed & Accuracy - __/3

**Performance Score**: __/3 | Status: ✅ READY / ⚠️ ISSUES

### Security Tests
- Test 1-2: Security - __/2

**Security Score**: __/2 | Status: ✅ READY / ⚠️ ISSUES

## 🎯 Overall Status

**Total Tests: 40**  
**Passed**: ___  
**Failed**: ___  
**Success Rate**: ____%

### Platform Status
- ✅ **READY FOR PRODUCTION** (30+ tests passing)
- ⚠️ **MOSTLY WORKING** (20-30 tests passing)
- ❌ **NEEDS FIXES** (<20 tests passing)

---

## 🐛 Troubleshooting Failed Tests

### Common Issues

**Port Already in Use**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

**Module Not Found**
```bash
rm -rf node_modules package-lock.json
npm install
```

**API Key Invalid**
- Check .env file
- Verify key hasn't expired
- Check scopes/permissions

**CORS Issues**
- Check vite.config.ts proxy settings
- Ensure backend is running
- Check Authorization header format

**Database/Storage Issues**
- Clear localStorage: `localStorage.clear()`
- Restart both servers
- Check file permissions

---

## ✅ Declaration

By completing all tests above, you confirm:

- [ ] Backend is fully functional
- [ ] Frontend is fully functional
- [ ] API integration works
- [ ] Authentication works
- [ ] Error handling is proper
- [ ] Performance is acceptable
- [ ] Security measures in place
- [ ] Platform is production-ready

---

**Test Date**: __________  
**Tester Name**: __________  
**Overall Result**: ✅ PASS / ❌ FAIL

---

**Next Steps**: Ready to deploy, customize, or integrate with CI/CD pipeline!
