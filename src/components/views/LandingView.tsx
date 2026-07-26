import React from 'react';
import {
  Bot,
  GraduationCap,
  CheckSquare,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  Users,
  CheckCircle2,
  BookOpen,
  Briefcase,
  UserCheck,
  Heart,
  Smile,
} from 'lucide-react';

interface LandingViewProps {
  onGetStarted: () => void;
  onLogin: () => void;
  openPrivacy: () => void;
  openTerms: () => void;
}

export function LandingView({ onGetStarted, onLogin, openPrivacy, openTerms }: LandingViewProps) {
  const features = [
    {
      title: 'Multilingual AI Assistant',
      desc: 'Ask questions in English, Urdu, or Roman Urdu. Get immediate, simple explanations and structured answers.',
      icon: Bot,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'AI Study Helper',
      desc: 'Generate simple explanations, summaries, MCQs, short Q&A, interactive flashcards, and step-by-step study plans.',
      icon: GraduationCap,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Smart Task Planner',
      desc: 'Organize tasks with priorities (High, Medium, Low), due dates, and custom views for Today, Upcoming, and Completed tasks.',
      icon: CheckSquare,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'AI Document Helper',
      desc: 'Draft tailored CVs, Cover Letters, Formal Emails, Applications, and Professional Messages with tone selection.',
      icon: FileText,
      color: 'from-purple-500 to-pink-600',
    },
  ];

  const targetAudiences = [
    {
      role: 'Students',
      icon: BookOpen,
      desc: 'Master tough concepts, review flashcards, generate practice quizzes, and stay on top of assignment due dates.',
    },
    {
      role: 'Teachers',
      icon: GraduationCap,
      desc: 'Quickly draft lesson plans, create quiz questions, summarize topics, and write official emails to parents.',
    },
    {
      role: 'Job Seekers',
      icon: Briefcase,
      desc: 'Craft tailored CV content, write persuasive cover letters, and generate professional outreach messages.',
    },
    {
      role: 'Professionals',
      icon: UserCheck,
      desc: 'Compose formal emails, prepare meeting summaries, organize project tasks, and boost daily productivity.',
    },
    {
      role: 'Parents',
      icon: Heart,
      desc: 'Help children with homework, organize family tasks, and write clean leave applications or school notices.',
    },
    {
      role: 'General Users',
      icon: Smile,
      desc: 'Get fast answers in your preferred language, manage personal reminders, and draft clear notes effortlessly.',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Choose Your Role',
      desc: 'Sign up and select your primary role (Student, Teacher, Job Seeker, etc.) for tailored responses.',
    },
    {
      step: '02',
      title: 'Pick an AI Tool',
      desc: 'Switch between Chat Assistant, Study Helper, Task Planner, and Document Generator anytime.',
    },
    {
      step: '03',
      title: 'Achieve & Save',
      desc: 'Copy, edit, and save generated content securely in your private cloud database.',
    },
  ];

  return (
    <div className="space-y-24 pb-16 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Your All-in-One Daily AI Assistant</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Empower Your Day with <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              LifeMate AI
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Whether you are studying, teaching, applying for jobs, or managing daily work — LifeMate AI helps you chat in English, Urdu & Roman Urdu, plan tasks, draft documents, and learn faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-[#1a201c] hover:bg-emerald-50/50 dark:hover:bg-[#232c26] text-slate-800 dark:text-slate-100 font-bold text-sm border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs transition-all cursor-pointer"
            >
              Sign In to Your Account
            </button>
          </div>

          <div className="pt-8 flex flex-wrap justify-center items-center gap-8 text-slate-600 dark:text-slate-300 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-600" />
              <span>English, Urdu & Roman Urdu</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Secure Cloud Persistence</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Powered by Gemini 3.6</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Everything You Need in One Place
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Intelligent modules designed to streamline learning, communication, and task execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div
                    className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-110 transition-transform"
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#e8f0e8] dark:border-[#2a3b2f] flex items-center text-xs font-bold text-emerald-700 dark:text-emerald-400 gap-1">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 py-12 rounded-3xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold">How LifeMate AI Works</h2>
            <p className="text-emerald-100 text-sm">Three simple steps to unlock your full potential.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((st, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left space-y-3">
                <span className="text-xs font-black px-2.5 py-1 rounded-md bg-emerald-500 text-white inline-block shadow-xs">
                  {st.step}
                </span>
                <h3 className="text-lg font-bold">{st.title}</h3>
                <p className="text-xs text-emerald-100 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits for Everyone */}
      <section id="benefits" className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Designed for Every User Role
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Tailored solutions catered specifically to your exact daily needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {targetAudiences.map((aud, i) => {
            const Icon = aud.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs hover:border-emerald-500/50 transition-all space-y-3"
              >
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 w-fit">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{aud.role}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{aud.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-emerald-700 to-teal-700 text-white text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl font-black">Ready to Supercharge Your Daily Routine?</h2>
          <p className="max-w-xl mx-auto text-sm text-emerald-100">
            Join thousands of students, professionals, and teachers using LifeMate AI today.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-3.5 rounded-xl bg-white text-emerald-800 font-bold text-sm hover:bg-emerald-50 shadow-lg transition cursor-pointer"
          >
            Create Your Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e8f0e8] dark:border-[#263529] pt-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-slate-900 dark:text-white">LifeMate AI</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={openPrivacy} className="hover:text-emerald-600 transition cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={openTerms} className="hover:text-emerald-600 transition cursor-pointer">
              Terms of Service
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
