import React from 'react';
import { Bot, Sun, Moon, LogOut, Menu, User as UserIcon, Settings, ChevronDown, Sparkles } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export function Navbar({
  user,
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  onLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
}: NavbarProps) {
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#fdfcfb]/90 dark:bg-[#161c18]/90 backdrop-blur-md border-b border-[#e8f0e8] dark:border-[#263529] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Logo */}
          <div className="flex items-center gap-3">
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div
              onClick={() => setActiveTab(user ? 'dashboard' : 'landing')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1">
                  LifeMate<span className="text-emerald-600 dark:text-emerald-400">AI</span>
                </span>
                <span className="text-[10px] font-medium text-emerald-800/70 dark:text-emerald-300/70 -mt-1 hidden sm:inline">
                  Smart Daily Companion
                </span>
              </div>
            </div>
          </div>

          {/* Center Navigation for Guest */}
          {!user && (
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => setActiveTab('landing')}
                className={`text-sm font-medium transition ${
                  activeTab === 'landing'
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('features');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else setActiveTab('landing');
                }}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition"
              >
                Features
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('benefits');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else setActiveTab('landing');
                }}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition"
              >
                For Everyone
              </button>
            </nav>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-emerald-800" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 transition border border-[#e8f0e8] dark:border-[#263529]"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {user.fullName}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {user.userType}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#1a221d] shadow-xl border border-[#e8f0e8] dark:border-[#263529] p-2 z-50 animate-fadeIn"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="p-3 border-b border-[#e8f0e8] dark:border-[#263529] mb-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {user.userType}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveTab('profile')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-600" />
                      View Profile
                    </button>

                    <button
                      onClick={() => setActiveTab('settings')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                    >
                      <Settings className="w-4 h-4 text-emerald-600" />
                      Settings
                    </button>

                    <div className="border-t border-[#e8f0e8] dark:border-[#263529] my-1"></div>

                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('login')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('signup')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
