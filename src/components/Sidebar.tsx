import React from 'react';
import {
  LayoutDashboard,
  Bot,
  GraduationCap,
  CheckSquare,
  FileText,
  User as UserIcon,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({ user, activeTab, setActiveTab, mobileOpen, setMobileOpen }: SidebarProps) {
  if (!user) return null;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'assistant', label: 'AI Assistant', icon: Bot, badge: 'Multilingual' },
    { id: 'study', label: 'Study Helper', icon: GraduationCap, badge: 'AI' },
    { id: 'tasks', label: 'Task Planner', icon: CheckSquare, badge: null },
    { id: 'documents', label: 'Document Helper', icon: FileText, badge: 'Smart' },
    { id: 'profile', label: 'Profile', icon: UserIcon, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-[#161c18] border-r border-[#e8f0e8] dark:border-[#263529] transition-transform duration-300 flex flex-col justify-between p-4 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          <div className="flex items-center justify-between lg:hidden mb-4 pb-2 border-b border-[#e8f0e8] dark:border-[#263529]">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800/60 dark:text-emerald-400/60">Navigation</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-700 dark:text-emerald-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card inside Sidebar */}
        <div className="mt-auto pt-4 border-t border-[#e8f0e8] dark:border-[#263529]">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/40 dark:from-[#1a231d] dark:to-[#161c18] border border-[#e8f0e8] dark:border-[#263529] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.fullName}</p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 truncate">{user.userType}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
