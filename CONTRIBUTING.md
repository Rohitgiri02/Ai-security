# Contributing to AI Code Analyzer

Thank you for your interest in contributing! This document provides guidelines and instructions.

## 📋 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on code, not the coder
- Help others learn and grow

## 🐛 Found a Bug?

1. **Check existing issues** - Avoid duplicates
2. **Create detailed report** with:
   - Environment (OS, Node version, npm version)
   - Steps to reproduce
   - Expected vs actual behavior
   - Error logs/screenshots
3. **Use a clear title** - "Backend crashes on repo analysis" not "doesn't work"

## ✨ Suggesting Features

1. **Check existing issues** - Avoid duplicates
2. **Describe the use case** - Why is this needed?
3. **Provide examples** - How would users use it?
4. **Consider alternatives** - What else could solve this?

## 🔧 Development Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/ai-code-analyzer.git
cd ai-code-analyzer

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm start

# Setup frontend (new terminal)
cd frontend
npm install
npm run dev
```

## 📝 Making Changes

1. **Create a branch**:
   ```bash
   git checkout -b feature/my-feature
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes** following:
   - Existing code style
   - TypeScript best practices
   - React component conventions
   - Express middleware patterns

3. **Test your changes**:
   - Backend: Verify API endpoints work
   - Frontend: Test UI in multiple browsers
   - Manual testing with real repos

4. **Commit with clear messages**:
   ```bash
   git commit -m "Add feature X"
   git commit -m "Fix: Correct vulnerability pattern detection"
   ```

## 🧪 Testing Guidelines

- Test with real GitHub repositories
- Verify no regressions in existing features
- Check edge cases (empty repos, large repos, etc.)
- Test authentication flow
- Validate error handling

## 📦 Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Keep PR focused** - One feature per PR
4. **Write clear PR description**:
   - What does this change?
   - Why is it needed?
   - How to test it?

5. **Link related issues**:
   ```
   Closes #123
   ```

6. **Wait for review** - Be responsive to feedback

## 🎯 Areas for Contribution

### Backend
- [ ] Add new vulnerability patterns
- [ ] Improve pattern detection
- [ ] Database integration
- [ ] Performance optimization
- [ ] Error handling
- [ ] API documentation

### Frontend
- [ ] UI/UX improvements
- [ ] Additional pages
- [ ] Mobile responsiveness
- [ ] Dark mode
- [ ] Accessibility (a11y)
- [ ] Testing

### DevOps
- [ ] Docker improvements
- [ ] CI/CD pipeline
- [ ] Deployment guides
- [ ] Monitoring
- [ ] Performance

### Documentation
- [ ] API documentation
- [ ] Setup guides
- [ ] Troubleshooting
- [ ] Examples
- [ ] Blog posts

## 📚 Documentation Standard

For new features, document:
- What it does
- Why it's useful
- How to use it
- Examples
- Configuration options

```javascript
/**
 * Analyzes a GitHub repository for security vulnerabilities
 * 
 * @param {string} repo - Repository in format "owner/repo"
 * @returns {Promise<Analysis>} Analysis result with risk score
 * 
 * @example
 * const result = await analyzeRepository("facebook/react");
 * console.log(result.risk); // 25
 */
async function analyzeRepository(repo) {
  // ...
}
```

## 🤝 Code Review Process

- Reviews are constructive and respectful
- Reviewers suggest improvements
- Authors explain decisions
- Conversation is collaborative
- Disagreements are resolved professionally

## 📋 Checklist Before Submitting PR

- [ ] Code follows project style
- [ ] No console.log statements (except debug)
- [ ] No hardcoded secrets/credentials
- [ ] Imports are organized
- [ ] No unused imports/variables
- [ ] Error handling is proper
- [ ] TypeScript types are used
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] Commit messages are clear

## 🚀 Release Process

1. Version bump (major.minor.patch)
2. Update CHANGELOG
3. Create GitHub release
4. Tag commit
5. Announce to community

Version format: `v1.2.3`

## 🆘 Getting Help

- **Questions**: Check README.md and SETUP.md
- **Issues**: Look at GitHub Issues
- **Discussions**: GitHub Discussions
- **Community**: Join our Discord

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

We appreciate all contributions, no matter how small. Every PR, issue, and suggestion helps make this project better!

---

**Happy contributing!** 🎉
