import React, { useState, useEffect } from 'react';
import {
  Bot,
  GraduationCap,
  CheckSquare,
  FileText,
  Sparkles,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  MessageSquare,
  Send,
} from 'lucide-react';
import { User, Task, Conversation, Document, StudySession } from '../../types';
import { api } from '../../lib/api';

interface DashboardViewProps {
  user: User;
  setActiveTab: (tab: string) => void;
  onQuickAsk: (prompt: string) => void;
}

export function DashboardView({ user, setActiveTab, onQuickAsk }: DashboardViewProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickQuestion, setQuickQuestion] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const [tList, cList, dList, sList] = await Promise.all([
        api.getTasks().catch(() => []),
        api.getConversations().catch(() => []),
        api.getDocuments().catch(() => []),
        api.getStudySessions().catch(() => []),
      ]);

      setTasks(Array.isArray(tList) ? tList : []);
      setConversations(Array.isArray(cList) ? cList : []);
      setDocuments(Array.isArray(dList) ? dList : []);
      setStudySessions(Array.isArray(sList) ? sList : []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleTask = async (task: Task) => {
    try {
      const updated = await api.updateTask(task.id, { completed: !task.completed });
      setTasks((prev) => (Array.isArray(prev) ? prev : []).map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      console.error('Task toggle error:', err);
    }
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;
    onQuickAsk(quickQuestion.trim());
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeConversations = Array.isArray(conversations) ? conversations : [];
  const safeDocuments = Array.isArray(documents) ? documents : [];
  const safeStudySessions = Array.isArray(studySessions) ? studySessions : [];

  const todayTasks = safeTasks.filter((t) => t.dueDate === todayStr || !t.completed);
  const completedCount = safeTasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Personalized Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 text-white overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-100 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Welcome back, {user.fullName}!</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            How can LifeMate AI assist you today?
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            As a <span className="font-bold underline underline-offset-2 text-white">{user.userType}</span>, you have full access to our multilingual AI Assistant, Smart Study Helper, Task Planner, and Document Helper.
          </p>

          {/* Quick AI Ask Box */}
          <form onSubmit={handleQuickSubmit} className="pt-2 flex items-center gap-2 max-w-xl">
            <div className="relative flex-1">
              <Bot className="w-5 h-5 text-emerald-300 absolute left-4 top-3.5" />
              <input
                type="text"
                value={quickQuestion}
                onChange={(e) => setQuickQuestion(e.target.value)}
                placeholder="Ask AI anything in English, Urdu or Roman Urdu..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-emerald-200/70 text-xs sm:text-sm focus:bg-white/20 outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 shadow-md transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">{todayTasks.length}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Active Tasks</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">{completedCount}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Completed</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">{safeStudySessions.length}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Study Sessions</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">{safeDocuments.length}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Saved Documents</div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Today's Tasks & Quick Tools */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Tasks Widget */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Today's Tasks</h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Stay organized and productive</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-400 text-xs">Loading tasks...</div>
            ) : todayTasks.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#fdfcfb] dark:bg-[#121814] border border-dashed border-[#e8f0e8] dark:border-[#2a3b2f] space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No pending tasks for today!</p>
                <p className="text-[11px] text-slate-400">Create a task to keep track of your goals.</p>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition cursor-pointer"
                >
                  + Add New Task
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task)}
                    className="p-3.5 rounded-2xl bg-[#fdfcfb] dark:bg-[#121814] border border-[#e8f0e8] dark:border-[#2a3b2f] flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                      />
                      <span
                        className={`text-xs font-medium ${
                          task.completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-800 dark:text-slate-200 font-semibold'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                        task.priority === 'High'
                          ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : task.priority === 'Medium'
                          ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('assistant')}
              className="p-5 rounded-2xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs hover:border-emerald-500 transition text-left space-y-2 group cursor-pointer"
            >
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 w-fit group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">AI Assistant</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Chat in English, Urdu & Roman Urdu</p>
            </button>

            <button
              onClick={() => setActiveTab('study')}
              className="p-5 rounded-2xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs hover:border-emerald-500 transition text-left space-y-2 group cursor-pointer"
            >
              <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 w-fit group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Study Helper</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">MCQs, flashcards & study plans</p>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className="p-5 rounded-2xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs hover:border-emerald-500 transition text-left space-y-2 group cursor-pointer"
            >
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 w-fit group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Document Helper</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">CVs, cover letters & emails</p>
            </button>
          </div>
        </div>

        {/* Right Col: Recent Activity */}
        <div className="space-y-8">
          {/* Recent Conversations */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Recent Conversations</span>
              </h2>
              <button
                onClick={() => setActiveTab('assistant')}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Open Chat
              </button>
            </div>

            {safeConversations.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No chat history yet.</p>
            ) : (
              <div className="space-y-2">
                {safeConversations.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setActiveTab('assistant')}
                    className="p-3 rounded-xl bg-[#fdfcfb] dark:bg-[#121814] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-[#e8f0e8] dark:border-[#2a3b2f] cursor-pointer transition flex items-center justify-between"
                  >
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{c.title}</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Documents */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Recent Documents</span>
              </h2>
              <button
                onClick={() => setActiveTab('documents')}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                All Docs
              </button>
            </div>

            {safeDocuments.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No saved documents yet.</p>
            ) : (
              <div className="space-y-2">
                {safeDocuments.slice(0, 4).map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setActiveTab('documents')}
                    className="p-3 rounded-xl bg-[#fdfcfb] dark:bg-[#121814] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-[#e8f0e8] dark:border-[#2a3b2f] cursor-pointer transition"
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{d.title}</div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                      <span>{d.docType}</span>
                      <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
