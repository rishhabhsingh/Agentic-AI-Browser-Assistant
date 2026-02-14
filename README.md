# 🤖 BrowserBuddy AI

**Your Intelligent Browsing Assistant Powered by AI**

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/yourusername/browserbuddy-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

![BrowserBuddy AI Banner](https://via.placeholder.com/1200x400/667eea/ffffff?text=BrowserBuddy+AI)

---

## 🌟 What is BrowserBuddy AI?

BrowserBuddy AI is a powerful Chrome extension that uses cutting-edge AI (Groq/Llama 3.3) to supercharge your browsing experience. Say goodbye to tab chaos, content overload, and repetitive tasks!

**🎯 Perfect for:**
- 📚 Students researching for assignments
- 💼 Professionals managing multiple projects
- 🔬 Researchers reading complex papers
- ✍️ Content creators gathering information
- 🎓 Job seekers optimizing resumes

---

## ✨ Features

### 1. 🗂️ **Smart Tab Manager**
AI-powered tab organization that actually works!
- 🤖 AI detects duplicate and similar tabs
- ⚡ Quick Scan mode (instant, rule-based)
- 📊 Tab usage statistics
- 🗑️ One-click bulk cleanup
- 🎯 Confidence scoring

### 2. 📝 **Content Simplifier**
Make any content easier to understand!
- 🧸 ELI5 mode (Explain Like I'm 5)
- 😊 Simple mode (general audience)
- 📚 Medium mode (balanced detail)
- 🔬 Technical mode (expert level)
- 📋 Copy simplified text
- 📄 Full page summarization

### 3. 📖 **Reading Mode**
Distraction-free reading experience!
- 🌙 Dark/Light theme toggle
- 🔤 Adjustable font size (12-24px)
- 🚫 Ad and clutter removal
- ✨ Clean, focused layout
- 📱 Works on articles, blogs, news

### 4. 🔖 **Smart Bookmarks**
AI organizes your bookmarks automatically!
- 🤖 Auto-categorization (12 categories)
- 🏷️ Smart tag generation
- 🔍 Intelligent search
- 📁 Category filtering
- ⚡ One-click bookmark saving

### 5. ⚙️ **Settings & Customization**
Complete control over your experience!
- 🎨 Theme switching (Auto/Light/Dark)
- 🔤 Font size preferences
- 🎚️ Feature toggles
- ⌨️ Keyboard shortcuts
- 🔒 Privacy controls

### 6. 📝 **Auto Form Filler**
Never fill forms manually again!
- 👤 Save your profile once
- 🎯 AI matches fields intelligently
- ⚡ One-click autofill
- 📋 Works on Google Forms, job applications, etc.
- ✨ Visual feedback on filled fields

### 7. 📄 **Resume Optimizer**
Get that job with ATS-friendly resumes!
- 🎯 Keyword extraction from job descriptions
- 📊 Match score calculation (0-100%)
- 💡 AI improvement suggestions
- 📥 Generate ATS-friendly .docx templates
- ✅ Highlight matched/missing keywords

---

## 🚀 Quick Start

### Installation

#### Option 1: Chrome Web Store (Recommended)
```
Coming soon! Currently in review.
```

#### Option 2: Manual Installation
1. Download the latest release from [Releases](https://github.com/yourusername/browserbuddy-ai/releases)
2. Unzip the file
3. Open Chrome → `chrome://extensions/`
4. Enable "Developer mode" (top right)
5. Click "Load unpacked"
6. Select the unzipped folder
7. 🎉 Done! Click the extension icon to start

### First-Time Setup
1. Click the BrowserBuddy icon in your toolbar
2. Go to Settings → Configure your preferences
3. (Optional) Set up Form Filler profile for auto-fill
4. Start browsing smarter! 🚀

---

## 🛠️ Tech Stack

### Frontend (Extension)
- ⚛️ **React 18** with Vite
- 🎨 **CSS3** with Glassmorphism
- 🔌 **Chrome Extension API** (Manifest V3)
- ✨ **Smooth animations** and transitions

### Backend
- 🟢 **Node.js** + Express.js
- 🍃 **MongoDB** (optional, works without)
- 🤖 **Groq AI** (Llama 3.3-70b-versatile)
- 🔒 **RESTful API** architecture

### AI Integration
- **Provider:** Groq (FREE tier)
- **Model:** llama-3.3-70b-versatile
- **Limit:** ~14,400 requests/day
- **Features:** All features have non-AI fallbacks

---

## 📸 Screenshots

### Home Screen
![Home Screen](https://via.placeholder.com/800x500/667eea/ffffff?text=Home+Screen)

### Smart Tab Manager
![Tab Manager](https://via.placeholder.com/800x500/2980b9/ffffff?text=Tab+Manager)

### Content Simplifier
![Content Simplifier](https://via.placeholder.com/800x500/16a085/ffffff?text=Content+Simplifier)

### Resume Optimizer
![Resume Optimizer](https://via.placeholder.com/800x500/d35400/ffffff?text=Resume+Optimizer)

---

## 🏗️ Project Structure
```
browserbuddy-ai/
├── extension/              # Chrome Extension
│   ├── public/
│   │   ├── manifest.json  # Extension config
│   │   ├── background.js  # Background service worker
│   │   ├── content.js     # Content scripts
│   │   └── icons/         # Extension icons
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx        # Main app
│   │   └── App.css        # Styles
│   └── package.json
│
├── backend/               # Express API
│   ├── routes/           # API routes
│   ├── controllers/      # Business logic
│   ├── models/          # MongoDB schemas
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
├── landing-page/        # Marketing website
│   └── (deployed separately)
│
└── docs/               # Documentation
    ├── README.md
    ├── USER_GUIDE.md
    ├── DEVELOPER.md
    ├── API.md
    └── SETUP.md
```

---

## 🔧 Development Setup

See [SETUP.md](docs/SETUP.md) for detailed instructions.

**Quick Start:**
```bash
# Clone repository
git clone https://github.com/yourusername/browserbuddy-ai.git
cd browserbuddy-ai

# Backend setup
cd backend
npm install
cp .env.example .env
# Add your GROQ_API_KEY to .env
npm run dev

# Extension setup (new terminal)
cd extension
npm install
npm run build

# Load extension in Chrome
# chrome://extensions/ → Load unpacked → Select extension/dist
```

---

## 🌐 API Documentation

See [API.md](docs/API.md) for complete API reference.

**Base URL:** `http://localhost:5000/api`

**Endpoints:**
- `/tabs/*` - Tab management
- `/simplify/*` - Content simplification
- `/bookmarks/*` - Bookmark management
- `/settings/*` - User settings
- `/formfill/*` - Form filling
- `/resume/*` - Resume optimization

---

## 🤝 Contributing

We love contributions! See [DEVELOPER.md](docs/DEVELOPER.md) for guidelines.

**Quick steps:**
1. Fork the repo
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

- **Groq** for providing free, fast AI inference
- **Chrome Extension API** for the powerful platform
- **MongoDB Atlas** for free database hosting
- **Vercel** for landing page hosting
- **Open Source Community** for amazing libraries

---

## 📞 Support

- 📧 **Email:** your.email@example.com
- 🐛 **Issues:** [GitHub Issues](https://github.com/yourusername/browserbuddy-ai/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/yourusername/browserbuddy-ai/discussions)
- 🌐 **Website:** [browserbuddy-ai.vercel.app](https://browser-buddy-ai-assitant.vercel.app/)

---

## 🗺️ Roadmap

- [ ] Chrome Web Store publication
- [ ] Firefox extension port
- [ ] More AI models support
- [ ] Cloud sync for settings
- [ ] Mobile companion app
- [ ] Team collaboration features

---

## ⭐ Star History

If you find this project useful, please consider giving it a star!

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/browserbuddy-ai&type=Date)](https://star-history.com/#yourusername/browserbuddy-ai&Date)

---

## 💖 Support the Project

If BrowserBuddy AI helps you, consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 📢 Sharing with friends
- ☕ [Buy me a coffee](https://buymeacoffee.com/yourname)

---

**Made with ❤️ by [Your Name]**  
**College Final Year Project | 2025**

---

🤖 *"Stop browsing. Start thriving."* - BrowserBuddy AI