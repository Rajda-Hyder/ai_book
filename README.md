# Physical AI & Humanoid Robotics Textbook

A beginner-friendly, interactive robotics textbook with AI-powered learning tools, built with Docusaurus v3.

![Status: Development](https://img.shields.io/badge/status-development-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-green)

## 📚 About

This textbook teaches robotics fundamentals from the ground up, covering:

- **Module 1:** Foundations of Robotics (What is robotics? Robot anatomy, Motors & sensors)
- **Module 2:** Programming Your First Robot (Python basics, Robot control, Loops & logic)
- **Module 3:** Sensing & Perception (Computer vision, Distance sensors, Sensor data processing)
- **Module 4:** Advanced Robotics (Machine learning, Autonomous navigation, Multi-robot systems)

## ✨ Features

- 📖 **12 Hands-On Lessons** — Clear explanations with code examples
- 💬 **AI Chatbot** — Ask questions about any lesson (RAG-powered)
- 🎨 **Interactive Diagrams** — Visual explanations of concepts
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile
- 🌍 **Multi-Language Support** — English + Urdu (coming soon)
- 👤 **User Accounts** — Sign in to save progress (Better-Auth)
- 🎯 **Personalization** — Content adapts to your learning style

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Python 3.10+ (for backend)
- Git

### Setup (Development)

```bash
# Clone repository
git clone https://github.com/Rajda-Hyder/my_ai_book_project
cd my_ai_book_project

# Install frontend dependencies
npm install

# Start development server
npm run start
```

Visit `http://localhost:3000` — site will be at `http://localhost:3000/my_ai_book_project/`

### Build for Production

```bash
npm run build
npm run serve
```

## 📂 Project Structure

```
my_ai_book_project/
├── docs/                          # Lesson content (Markdown)
│   ├── intro.md
│   ├── module-1-foundations/      # 3 lessons
│   ├── module-2-programming/      # 3 lessons
│   ├── module-3-sensing/          # 3 lessons
│   └── module-4-advanced/         # 3 lessons
│
├── src/                           # React components
│   ├── components/
│   │   ├── ChatBot.tsx
│   │   ├── Auth.tsx
│   │   ├── Personalization.tsx
│   │   └── TranslationToggle.tsx
│   ├── css/
│   └── utils/
│
├── api/                           # FastAPI backend (Python)
│   ├── main.py
│   ├── requirements.txt
│   └── services/
│
├── static/                        # Images, diagrams, code examples
│   ├── diagrams/
│   ├── images/
│   └── code-examples/
│
├── .github/
│   └── workflows/
│       ├── deploy-site.yml        # Auto-deploy to GitHub Pages
│       └── deploy-api.yml         # Deploy backend
│
├── docusaurus.config.js           # Docusaurus configuration
├── sidebars.js                    # Navigation structure
├── package.json
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **Docusaurus v3** — Static site generator
- **React** + **TypeScript** — Interactive components
- **Tailwind CSS** — Styling
- **ChatKit SDK** — Chat interface

### Backend
- **FastAPI** (Python) — REST API
- **OpenAI API** — LLM for chatbot
- **Qdrant** — Vector database for embeddings
- **Neon Postgres** — User data storage
- **Better-Auth** — Authentication

### Deployment
- **GitHub Pages** — Host Docusaurus site
- **Render.com** / **Railway.app** — Host API (free tier)
- **GitHub Actions** — Automated deployment

## 📖 Usage

### Reading Lessons

1. Navigate to any lesson using the sidebar
2. Read content with code examples
3. Click on code to copy and run locally
4. Complete challenge projects at the end

### Using the Chatbot

1. Click the chat icon (bottom right)
2. Ask questions about lessons or concepts
3. Get AI-powered answers with citations
4. Ask about selected text on page

### Personalizing Content

1. Sign in with email or GitHub
2. Select difficulty level (beginner/intermediate/advanced)
3. Choose topics of interest
4. Get personalized recommendations

### Translating to Urdu

1. Click "Translate" button in navbar
2. Select "Urdu" from language menu
3. Content translates to Urdu

## 🔧 Backend Setup

### Install Backend Dependencies

```bash
cd api
pip install -r requirements.txt
```

### Set Environment Variables

Create `.env` file:

```
OPENAI_API_KEY=sk-xxx...
QDRANT_URL=https://your-qdrant-cloud-url
QDRANT_API_KEY=xxx...
DATABASE_URL=postgresql://user:pass@neon-host/db
```

### Run Backend

```bash
python main.py
```

Backend will be at `http://localhost:8000`

## 🤖 API Endpoints

### Chat & RAG

```
POST /api/search
{
  "query": "How do motors work?",
  "user_id": "user123"
}
→ { "answer": "...", "sources": [...], "confidence": 0.95 }
```

### Authentication

```
POST /api/auth/signup
POST /api/auth/login
GET /api/auth/profile
```

### Personalization

```
GET /api/personalize/{user_id}/{chapter}
POST /api/personalize/{user_id}/{chapter}
```

### Translation

```
POST /api/translate
{
  "text": "What is a robot?",
  "target_language": "ur"
}
```

## 📊 Content Structure

Each lesson follows this format:

```markdown
# Lesson Title

## Learning Objectives
- Clear, measurable goals

## Key Concepts
- Explained with examples

## Hands-On Practice
- Code examples you can run

## Challenge Project
- Real-world problem to solve

## Resources & Further Reading
- Links to related content
```

## 🚀 Deployment

### Deploy to GitHub Pages

```bash
# Automatic via GitHub Actions
# Just push to main branch
git add .
git commit -m "Update lessons"
git push origin main

# Or manually
npm run build
npm run deploy
```

Site will be live at: `https://rajda-hyder.github.io/my_ai_book_project/`

### Deploy API

```bash
# Using Render.com (free tier)
# 1. Create account on render.com
# 2. Connect GitHub repo
# 3. Deploy from api/ folder
# 4. Set environment variables

# Or using Railway.app
# Similar process to Render
```

## 🎯 Features Coming Soon

- [ ] Full RAG chatbot integration
- [ ] Better-Auth signup/signin
- [ ] Urdu translation for all lessons
- [ ] Personalization engine
- [ ] User progress tracking
- [ ] Code sandbox (run code in browser)
- [ ] Interactive diagrams
- [ ] Video tutorials
- [ ] Quizzes and assessments

## 📝 Contributing

We welcome contributions! To help:

1. **Report Issues:** [Create an issue](https://github.com/Rajda-Hyder/my_ai_book_project/issues)
2. **Suggest Improvements:** Share ideas in discussions
3. **Submit Code:** Fork repo, make changes, submit pull request

### Content Guidelines

- Use 8th–10th grade reading level
- Include code examples for every concept
- Add diagrams for complex topics
- Test all code before submitting
- Link to relevant resources

## 🏆 Hackathon Submission

**Event:** Panaversity Hackathon I

**Key Achievements:**
- ✅ 4 modules × 3 lessons (12 total)
- ✅ Docusaurus v3 with GitHub Pages deployment
- ✅ FastAPI backend ready for RAG integration
- ✅ GitHub Actions CI/CD pipeline
- ✅ Better-Auth authentication setup
- ✅ Beginner-friendly, hands-on content
- ✅ Urdu translation support ready

## 📄 License

MIT License — See [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- **Panaversity** — Hackathon organizers
- **Claude AI** — Content generation assistance
- **Docusaurus Team** — Excellent documentation framework
- **Open Source Community** — All the tools we use

## 📞 Contact

- **GitHub:** [@Rajda-Hyder](https://github.com/Rajda-Hyder)
- **Email:** rajdahyder@gmail.com
- **Issues:** [Report bugs](https://github.com/Rajda-Hyder/my_ai_book_project/issues)

---

**Happy learning! Let's build robots together. 🤖🚀**
