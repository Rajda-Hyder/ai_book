# Setup & Deployment Guide

This guide helps you set up and deploy the Physical AI & Humanoid Robotics Textbook.

## 📋 Prerequisites

- Node.js 18+ (get from [nodejs.org](https://nodejs.org/))
- Python 3.10+ (get from [python.org](https://www.python.org/))
- Git (get from [git-scm.com](https://git-scm.com/))
- A GitHub account (for Pages hosting)

## 🚀 Local Development Setup

### Step 1: Install Frontend Dependencies

```bash
cd /path/to/my_ai_book_project
npm install
```

### Step 2: Start Development Server

```bash
npm run start
```

The site will open at `http://localhost:3000`

Note: The site is served at `http://localhost:3000/my_ai_book_project/` (with base URL)

### Step 3: Try the Development Build

```bash
npm run build
npm run serve
```

## 🛠️ Backend Setup (Optional - for RAG Features)

### Step 1: Create Python Virtual Environment

```bash
cd api
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Step 2: Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Set Up Environment Variables

```bash
cp ../.env.example .env
# Edit .env and add your API keys:
# - OPENAI_API_KEY
# - QDRANT_URL and QDRANT_API_KEY
# - DATABASE_URL
```

### Step 4: Run FastAPI Server

```bash
python main.py
```

Backend will be at `http://localhost:8000`

Visit `http://localhost:8000/docs` for API documentation

## 🌐 Deploy to GitHub Pages

### Step 1: Set Up Repository

Make sure your repo is at: `https://github.com/Rajda-Hyder/my_ai_book_project`

### Step 2: Enable GitHub Pages

1. Go to GitHub Repo → Settings → Pages
2. Select "Deploy from a branch"
3. Choose `gh-pages` branch
4. Click Save

### Step 3: Automatic Deployment (via GitHub Actions)

The project includes GitHub Actions workflow that:
- Triggers on push to `main` branch
- Installs dependencies
- Builds Docusaurus
- Deploys to `gh-pages` branch

Just push your code:

```bash
git add .
git commit -m "Update lessons"
git push origin main
```

Site will be live at: `https://rajda-hyder.github.io/my_ai_book_project/`

### Step 4: Manual Deployment (Alternative)

```bash
npm run build
npm run deploy
```

## 🔑 Getting API Keys (Required for Features)

### OpenAI API Key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Add to `.env`:
   ```
   OPENAI_API_KEY=sk-xxx...
   ```

### Qdrant (Vector Database)

1. Go to [cloud.qdrant.io](https://cloud.qdrant.io/)
2. Create free account
3. Create new cluster (free tier available)
4. Get API key and URL
5. Add to `.env`:
   ```
   QDRANT_URL=https://...
   QDRANT_API_KEY=xxx...
   ```

### Neon (Postgres Database)

1. Go to [neon.tech](https://neon.tech/)
2. Sign up with GitHub
3. Create new project
4. Get connection string
5. Add to `.env`:
   ```
   DATABASE_URL=postgresql://...
   ```

### Better-Auth (Authentication)

1. Go to [better-auth.com](https://better-auth.com/)
2. Follow setup guide
3. Configure OAuth providers (GitHub, Google)
4. Add credentials to `.env`:
   ```
   BETTER_AUTH_SECRET=your-secret
   GITHUB_CLIENT_ID=xxx
   GITHUB_CLIENT_SECRET=xxx
   ```

## 📦 Deployment Platforms

### Option 1: Render.com (Free Tier)

Best for FastAPI backend:

1. Go to [render.com](https://render.com/)
2. Sign up with GitHub
3. Create new "Web Service"
4. Connect this repo
5. Set build command: `pip install -r api/requirements.txt`
6. Set start command: `python api/main.py`
7. Add environment variables
8. Deploy!

### Option 2: Railway.app (Free Tier)

1. Go to [railway.app](https://railway.app/)
2. Sign up with GitHub
3. Create new project
4. Connect this repo
5. Select "Python" environment
6. Configure and deploy

### Option 3: Heroku (Paid)

Legacy platform, less recommended now

## ✅ Checklist for Deployment

- [ ] Docusaurus builds locally (`npm run build`)
- [ ] All 12 lessons display correctly
- [ ] GitHub Actions workflow is enabled
- [ ] GitHub Pages is enabled in settings
- [ ] OpenAI API key added to `.env`
- [ ] Qdrant database created
- [ ] Neon database created
- [ ] Backend API deployed
- [ ] Site builds and deploys via GitHub Actions
- [ ] Site is live at GitHub Pages URL

## 🧪 Testing Before Deployment

### Test Frontend Build

```bash
npm run build
npm run serve
```

Then visit `http://localhost:3000/my_ai_book_project/`

### Test Backend API

```bash
cd api
python main.py
```

Visit `http://localhost:8000/health` - should return `{"status": "healthy"}`

### Test GitHub Actions

1. Make a small change
2. Commit and push to `main`
3. Go to repo → Actions
4. Watch the workflow run
5. Check if site builds and deploys

## 🐛 Troubleshooting

### "npm: command not found"
→ Install Node.js from [nodejs.org](https://nodejs.org/)

### "Build fails with missing pages"
→ Make sure all lesson files exist in `docs/` folder
→ Check `sidebars.js` references correct file names

### "GitHub Pages shows 404"
→ Check base URL in `docusaurus.config.js` matches repository name
→ Current: `baseUrl: '/my_ai_book_project/'`

### "API deployment fails"
→ Check environment variables are set on platform
→ Check Python version is 3.10+
→ Check all dependencies install with `pip install -r requirements.txt`

## 📚 Next Steps

1. **Add More Content:** Create additional lessons following the existing format
2. **Implement RAG:** Add full embedding and chat functionality
3. **Add Auth UI:** Build login/signup components in React
4. **Deploy API:** Choose Render or Railway, deploy backend
5. **Configure CI/CD:** Ensure GitHub Actions workflows pass
6. **Launch Site:** Share GitHub Pages URL with community

## 📞 Support

- **Issues:** [Report on GitHub](https://github.com/Rajda-Hyder/my_ai_book_project/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Rajda-Hyder/my_ai_book_project/discussions)
- **Email:** rajdahyder@gmail.com

## 📄 Additional Resources

- [Docusaurus Docs](https://docusaurus.io/docs/installation)
- [FastAPI Guide](https://fastapi.tiangolo.com/)
- [GitHub Actions Guide](https://docs.github.com/en/actions)
- [Better-Auth Docs](https://better-auth.com/docs)

---

**Happy deploying! 🚀**
