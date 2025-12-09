# Quick Start Guide ⚡

Get the Robotics Textbook running in 5 minutes!

## Prerequisites
- Node.js 18+ ([download](https://nodejs.org/))
- Git ([download](https://git-scm.com/))

## 1️⃣ Clone & Install (2 minutes)

```bash
git clone https://github.com/Rajda-Hyder/my_ai_book_project
cd my_ai_book_project
npm install
```

## 2️⃣ Start Development Server (1 minute)

```bash
npm run start
```

Browser opens → Site at: `http://localhost:3000/my_ai_book_project/`

## 3️⃣ Explore Content

- Click "Lessons" in navbar
- Browse all 12 lessons
- Try different modules

## 4️⃣ Build for Production (1 minute)

```bash
npm run build
npm run serve
```

## Next Steps

### To Deploy Site
→ See [SETUP_GUIDE.md](SETUP_GUIDE.md) - GitHub Pages section

### To Run API Backend
→ See [SETUP_GUIDE.md](SETUP_GUIDE.md) - Backend Setup section

### To Implement Features
→ See [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) - Roadmap

## 📁 Key Files

| File | Purpose |
|------|---------|
| `docusaurus.config.js` | Site configuration |
| `sidebars.js` | Navigation structure |
| `package.json` | Dependencies |
| `docs/` | Lesson content |
| `api/main.py` | Backend API |

## 🤔 Troubleshooting

**Error: "npm: command not found"**
→ Install Node.js from [nodejs.org](https://nodejs.org/)

**Error: "Port 3000 already in use"**
→ Kill process: `lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9`

**Error: "Build failed"**
→ Clear cache: `npm run clear && npm run build`

## 📚 Documentation

- 📖 [README.md](README.md) - Project overview
- 🛠️ [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
- 🚀 [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) - Roadmap
- ✅ [PROJECT_COMPLETION_SUMMARY.md](PROJECT_COMPLETION_SUMMARY.md) - Full summary

## 💡 Common Commands

```bash
# Development
npm run start              # Run local dev server
npm run build              # Build for production
npm run serve              # Serve built site

# Cleaning
npm run clear              # Clear Docusaurus cache
npm run docusaurus clear   # Full cache clear

# API
cd api
python main.py            # Start FastAPI server
```

## 🎯 5-Minute Learning Path

1. **Module 1 (5 min):** Read "What is Robotics?"
2. **Module 2 (5 min):** Read "Python Basics"
3. **Module 3 (5 min):** Read "Computer Vision"
4. **Module 4 (5 min):** Read "Machine Learning"

Total: 20 minutes to understand robotics basics!

## 🚀 What's Ready to Deploy

- ✅ Docusaurus site
- ✅ GitHub Pages deployment
- ✅ GitHub Actions workflow
- ✅ FastAPI backend
- ⏳ RAG chatbot (ready to implement)
- ⏳ Authentication (ready to implement)
- ⏳ Personalization (ready to implement)
- ⏳ Urdu translation (ready to implement)

## 📞 Help

- Issues: [GitHub Issues](https://github.com/Rajda-Hyder/my_ai_book_project/issues)
- Questions: [GitHub Discussions](https://github.com/Rajda-Hyder/my_ai_book_project/discussions)

---

**That's it! Happy learning! 🤖**
