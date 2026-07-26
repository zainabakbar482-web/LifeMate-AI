# LifeMate AI 🤖✨

> **Your All-in-One AI Productivity, Learning, & Life Companion**  
> Live Application: [https://life-mate-ai.vercel.app/](https://life-mate-ai.vercel.app/)

---

## 🌟 Overview

**LifeMate AI** is a comprehensive, multi-persona AI assistant web application designed to empower **Students, Teachers, Job Seekers, Professionals, Parents, and General Users**. By tailoring AI intelligence to individual user roles and needs, LifeMate AI streamlines daily tasks, automates document creation, crafts study materials, organizes tasks, and provides real-time conversational assistance.

Whether you need to generate a job-winning CV, study with interactive flashcards and quizzes, draft formal emails, organize family schedules, or get instant step-by-step solutions to complex topics, **LifeMate AI** is your go-to intelligent life copilot.

---

## 🚀 Live Demo

🌐 **Deployed App**: [https://life-mate-ai.vercel.app/](https://life-mate-ai.vercel.app/)

---

## ✨ Key Features & User Personas

LifeMate AI adapts its context, features, and prompts depending on the user's selected role:

### 🎭 Persona-Tailored Capabilities
* 🎓 **Students**: Instant topic explanations, interactive flip flashcards, dynamic MCQs with explanations, short questions, and custom day-by-day study roadmaps.
* 👩‍🏫 **Teachers**: Lesson plan generators, automated quiz/test creation, homework assignments, grading rubrics, and subject breakdowns.
* 💼 **Job Seekers**: AI CV/Resume builder, customized cover letters, job application statements, personal statements, and formal follow-up emails.
* 👔 **Professionals**: Business email drafters, meeting minutes summarizer, project update generators, and professional message polishers.
* 👨‍👩‍👧 **Parents**: Family meal planners, parenting tips, kid activity organizers, and home study schedule planners.
* 🌐 **General Users**: Daily life planner, creative brainstormer, productivity tracker, and conversational assistant.

---

## 🛠️ Core Functional Modules

### 💬 1. Intelligent AI Assistant (Chat)
- Multi-turn conversational interface powered by **Google Gemini 2.5**.
- Supports code syntax highlighting, rich Markdown formatting, tables, lists, and copy-to-clipboard functionality.
- Multilingual assistance: English, Urdu, and Roman Urdu.
- Conversation history tracking and persistent chat threads.

### 📚 2. AI Study & Learning Suite
- **Explanations & Summaries**: Break down complex concepts into simple, readable text.
- **Interactive Flashcards**: Animated flip cards for active recall practice.
- **Dynamic Quizzes (MCQs)**: Multiple-choice questions with real-time scoring, instant option feedback, and step-by-step explanations.
- **Short Questions & Answers**: Targeted revision questions for exam prep.
- **Structured Study Plans**: Custom day-by-day study schedules tailored to exam timelines and subjects.

### 📄 3. Professional Document Helper
- Create professional CV/Resume text, tailored Cover Letters, formal Job Applications, Personal Statements, and Formal Emails.
- Customizable tone selection (Professional, Confident, Persuasive, Friendly, Formal).
- Built-in document editor, history saver, and quick copy/export tools.

### 📅 4. Smart Task Planner
- Priority management: **High**, **Medium**, and **Low** priority tagging.
- Due date tracking, completion status toggling, and category filters.
- AI-assisted task breakdown and priority suggestions.

### 🔐 5. Authentication & Profile Management
- Secure JWT-based authentication with mock email verification options.
- Profile settings with language preference switching (English, Urdu, Roman Urdu).
- Theme toggle: Light, Dark, or System mode.

---

## 🏗️ Tech Stack

| Domain | Technology / Library |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & UI** | Tailwind CSS v4, Lucide React Icons |
| **Animations** | Motion (`motion/react`) |
| **Backend Server** | Express.js (Node.js, full-stack runner with Vite middleware) |
| **AI Integration** | `@google/genai` (Google Gemini API - Gemini 2.5 Flash / Pro) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), Node Crypto |
| **Persistence** | Atomic JSON File Database (`data/db.json`) with fault recovery |
| **Deployment** | Vercel (`https://life-mate-ai.vercel.app/`) |

---

## 📁 Directory & File Structure

```text
├── data/
│   └── db.json                   # Local persistent storage database
├── server/
│   └── db.ts                     # Database read/write & atomic persistence layer
├── src/
│   ├── components/
│   │   ├── FormattedText.tsx     # Rich markdown and code rendering component
│   │   ├── Header.tsx            # Navigation header & user persona badge
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   └── views/
│   │       ├── AssistantView.tsx     # AI Chat Assistant
│   │       ├── AuthViews.tsx         # Login, Register & Verification modal/views
│   │       ├── DashboardView.tsx     # Role-based dashboard overview
│   │       ├── DocumentHelperView.tsx# AI Document & CV Generator
│   │       ├── LandingView.tsx       # Landing page overview
│   │       ├── ProfileView.tsx       # User profile details
│   │       ├── SettingsView.tsx      # Language, theme, & privacy settings
│   │       ├── StudyHelperView.tsx   # Flashcards, MCQs, Study Plans & Summaries
│   │       └── TaskPlannerView.tsx   # Priority task planner
│   ├── lib/
│   │   └── api.ts                # Client API service handlers
│   ├── App.tsx                   # Main React routing & state orchestration
│   ├── main.tsx                  # Application entry point
│   ├── index.css                 # Tailwind CSS styles
│   └── types.ts                  # Shared TypeScript interfaces
├── .env.example                  # Environment configuration template
├── metadata.json                 # AI Studio application metadata
├── package.json                  # Dependencies & scripts
├── server.ts                     # Express REST API backend server
├── tsconfig.json                 # TypeScript configuration
└── vite.config.ts                # Vite build configuration
```

---

## ⚡ Getting Started Locally

Follow these steps to run LifeMate AI on your local environment:

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **bun**

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/life-mate-ai.git
   cd life-mate-ai
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   JWT_SECRET=your_secret_jwt_key
   PORT=3000
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000`.

---

## 🔌 API Endpoint Reference

### 🔑 Auth Routes (`/api/auth`)
- `POST /api/auth/register` — Register a new user account
- `POST /api/auth/login` — Authenticate user and issue JWT token
- `POST /api/auth/verify` — Verify user account with confirmation code
- `GET /api/auth/me` — Fetch currently logged-in user profile

### 🤖 AI Endpoints (`/api/ai`)
- `POST /api/ai/chat` — Send prompt to Gemini API with chat context
- `POST /api/ai/study` — Generate study content (Flashcards, MCQs, Summaries, Study Plans)
- `POST /api/ai/document` — Generate documents (CV, Cover Letter, Formal Email, etc.)

### 📋 Resource Endpoints
- `/api/tasks` — GET, POST, PUT, DELETE user tasks
- `/api/documents` — GET, POST, DELETE saved AI documents
- `/api/study-sessions` — GET, POST, DELETE saved study sessions
- `/api/conversations` — GET, POST, DELETE chat conversations

---

## 🎨 Design Philosophy & UX

- **Zero Clutter**: Clean, high-contrast interface designed for maximum readability and ease of use.
- **Fluid Layouts**: Smooth transitions powered by `motion` with full responsive mobile and desktop optimization.
- **Language Inclusivity**: Built-in support for English, Urdu, and Roman Urdu so users can learn and work in their comfortable language.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Crafted with ❤️ for lifelong learners, educators, job seekers, and professionals.  
  <b>LifeMate AI — Empowering Every Aspect of Your Life.</b>
</p>
