import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Globe2,
  Moon,
  Sun,
  Bell,
  Shield,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { User, UserSettings } from '../../types';
import { api } from '../../lib/api';

interface SettingsViewProps {
  user: User;
  isDark: boolean;
  toggleTheme: () => void;
  onAccountDeleted: () => void;
}

export function SettingsView({ user, isDark, toggleTheme, onAccountDeleted }: SettingsViewProps) {
  const [languagePref, setLanguagePref] = useState<'English' | 'Urdu' | 'Roman Urdu'>(
    user.languagePref || 'English'
  );
  const [themePref, setThemePref] = useState<'light' | 'dark' | 'system'>(user.themePref || 'system');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user.notificationsEnabled ?? true);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const s = await api.getSettings();
      setLanguagePref(s.languagePref);
      setThemePref(s.themePref);
      setNotificationsEnabled(s.notificationsEnabled);
    } catch (err) {
      console.error(err);
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setError(null);

    try {
      await api.updateSettings({
        languagePref,
        themePref,
        notificationsEnabled,
      });

      setSuccessMsg('Settings saved successfully!');
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.deleteAccount();
      api.logout();
      onAccountDeleted();
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Settings & Preferences</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customize language, theme, notifications, and manage account security
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Language Preference */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#e8f0e8] dark:border-[#2a3b2f]">
            <Globe2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Preferred Assistant Language</h2>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            The AI Assistant will automatically prioritize responding in your chosen language when possible.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'English', label: 'English', desc: 'Standard clear responses' },
              { id: 'Urdu', label: 'Urdu (اردو)', desc: 'Nastaliq Urdu script' },
              { id: 'Roman Urdu', label: 'Roman Urdu', desc: 'Casual conversational Urdu' },
            ].map((lang) => {
              const isSelected = languagePref === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setLanguagePref(lang.id as any)}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">{lang.label}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{lang.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Theme Preference */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#e8f0e8] dark:border-[#2a3b2f]">
            {isDark ? <Moon className="w-5 h-5 text-emerald-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Appearance & Theme</h2>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#fdfcfb] dark:bg-[#121814] border border-[#e8f0e8] dark:border-[#2a3b2f]">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Dark Theme Mode</div>
              <div className="text-[10px] text-slate-400">Toggle dark canvas for comfortable night viewing</div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                isDark ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-800'
              }`}
            >
              {isDark ? 'Dark Mode On' : 'Light Mode On'}
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#e8f0e8] dark:border-[#2a3b2f]">
            <Bell className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Notifications & Alerts</h2>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#fdfcfb] dark:bg-[#121814] border border-[#e8f0e8] dark:border-[#2a3b2f]">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Task & Activity Reminders</div>
              <div className="text-[10px] text-slate-400">Receive in-app alerts for due tasks and study plans</div>
            </div>

            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-600 cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-rose-200/60 dark:border-rose-900/40 text-rose-600 dark:text-rose-400">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-base font-bold">Danger Zone</h2>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Permanently delete your LifeMate AI account and erase all associated tasks, chat history, saved study materials, and documents. This action cannot be undone.
        </p>

        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete My Account</span>
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1a201c] border border-rose-300 dark:border-rose-800 space-y-3">
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
              Are you completely sure? All your saved data will be deleted immediately.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Permanently'}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
