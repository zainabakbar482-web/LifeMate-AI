import React, { useState, useEffect } from 'react';
import { User } from './types';
import { api, getToken } from './lib/api';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PrivacyModal, TermsModal } from './components/Modals/LegalModals';

// Views
import { LandingView } from './components/views/LandingView';
import { AuthViews } from './components/views/AuthViews';
import { DashboardView } from './components/views/DashboardView';
import { AssistantView } from './components/views/AssistantView';
import { StudyHelperView } from './components/views/StudyHelperView';
import { TaskPlannerView } from './components/views/TaskPlannerView';
import { DocumentHelperView } from './components/views/DocumentHelperView';
import { ProfileView } from './components/views/ProfileView';
import { SettingsView } from './components/views/SettingsView';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // Quick Ask state
  const [assistantPrompt, setAssistantPrompt] = useState<string>('');

  // Theme state
  const [isDark, setIsDark] = useState<boolean>(false);

  // Modals
  const [privacyOpen, setPrivacyOpen] = useState<boolean>(false);
  const [termsOpen, setTermsOpen] = useState<boolean>(false);

  // Mobile navigation
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check dark theme preference
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    // Authenticate existing session token
    checkCurrentSession();
  }, []);

  async function checkCurrentSession() {
    const token = getToken();
    if (!token) {
      setInitialLoading(false);
      return;
    }

    try {
      const me = await api.getMe();
      if (me && me.id) {
        setUser(me);
        setActiveTab('dashboard');
      } else {
        api.logout();
        setUser(null);
        setActiveTab('landing');
      }
    } catch (_err) {
      // Invalid or expired token: clear stale token and show landing page
      api.logout();
      setUser(null);
      setActiveTab('landing');
    } finally {
      setInitialLoading(false);
    }
  }

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setActiveTab('landing');
  };

  const handleQuickAsk = (promptText: string) => {
    setAssistantPrompt(promptText);
    setActiveTab('assistant');
  };

  // Protected route check
  const protectedTabs = ['dashboard', 'assistant', 'study', 'tasks', 'documents', 'profile', 'settings'];
  const isProtectedRoute = protectedTabs.includes(activeTab);

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Loading LifeMate AI...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar Navigation */}
        {user && (
          <Sidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            mobileOpen={mobileMenuOpen}
            setMobileOpen={setMobileMenuOpen}
          />
        )}

        {/* Main Content Area */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 ${!user ? 'w-full max-w-7xl mx-auto' : ''}`}>
          {/* Unauthenticated Protected Access Warning */}
          {isProtectedRoute && !user && (
            <div className="py-12">
              <AuthViews
                initialMode="login"
                onAuthSuccess={handleAuthSuccess}
                onSwitchMode={(mode) => setActiveTab(mode)}
              />
            </div>
          )}

          {/* Landing View */}
          {activeTab === 'landing' && (
            <LandingView
              onGetStarted={() => setActiveTab(user ? 'dashboard' : 'signup')}
              onLogin={() => setActiveTab(user ? 'dashboard' : 'login')}
              openPrivacy={() => setPrivacyOpen(true)}
              openTerms={() => setTermsOpen(true)}
            />
          )}

          {/* Login View */}
          {activeTab === 'login' && !user && (
            <AuthViews
              initialMode="login"
              onAuthSuccess={handleAuthSuccess}
              onSwitchMode={(mode) => setActiveTab(mode)}
            />
          )}

          {/* Signup View */}
          {activeTab === 'signup' && !user && (
            <AuthViews
              initialMode="signup"
              onAuthSuccess={handleAuthSuccess}
              onSwitchMode={(mode) => setActiveTab(mode)}
            />
          )}

          {/* Protected Views */}
          {user && (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView user={user} setActiveTab={setActiveTab} onQuickAsk={handleQuickAsk} />
              )}

              {activeTab === 'assistant' && <AssistantView initialPrompt={assistantPrompt} />}

              {activeTab === 'study' && <StudyHelperView />}

              {activeTab === 'tasks' && <TaskPlannerView />}

              {activeTab === 'documents' && <DocumentHelperView />}

              {activeTab === 'profile' && (
                <ProfileView
                  user={user}
                  onUpdateUser={(updated) => setUser(updated)}
                  onLogout={handleLogout}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  user={user}
                  isDark={isDark}
                  toggleTheme={toggleTheme}
                  onAccountDeleted={handleLogout}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Legal Modals */}
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </div>
  );
}
