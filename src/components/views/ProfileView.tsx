import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Save,
  AlertCircle,
  LogOut,
  ShieldCheck,
  Briefcase,
  Users,
  Heart,
  Smile,
  BookOpen,
  Copy,
  Check,
  KeyRound,
  RefreshCw,
} from 'lucide-react';
import { User, UserType } from '../../types';
import { api } from '../../lib/api';

interface ProfileViewProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  setActiveTab: (tab: string) => void;
}

export function ProfileView({ user, onUpdateUser, onLogout, setActiveTab }: ProfileViewProps) {
  const [fullName, setFullName] = useState(user.fullName);
  const [userType, setUserType] = useState<UserType>(user.userType);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState(false);

  // Verification modal / inline form state
  const [verifying, setVerifying] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifySuccess, setVerifySuccess] = useState<string | null>(null);
  const [demoCode, setDemoCode] = useState<string | null>(null);

  const userTypeOptions: { type: UserType; icon: any }[] = [
    { type: 'Student', icon: GraduationCap },
    { type: 'Teacher', icon: BookOpen },
    { type: 'Job Seeker', icon: Briefcase },
    { type: 'Professional', icon: Users },
    { type: 'Parent', icon: Heart },
    { type: 'General User', icon: Smile },
  ];

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const updated = await api.updateProfile({
        fullName: fullName.trim(),
        userType,
      });
      onUpdateUser(updated);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResendCode = async () => {
    setVerifyError(null);
    setVerifySuccess(null);
    try {
      const res = await api.resendVerification(user.email);
      setVerifySuccess(res.message);
      if (res.verificationCode) {
        setDemoCode(res.verificationCode);
      }
    } catch (err: any) {
      setVerifyError(err.message || 'Failed to resend verification code');
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;

    setVerifyError(null);
    setVerifySuccess(null);

    try {
      const res = await api.verifyEmail({ email: user.email, code: verifyCode });
      onUpdateUser(res.user);
      setVerifySuccess(res.message);
      setTimeout(() => {
        setVerifying(false);
      }, 1500);
    } catch (err: any) {
      setVerifyError(err.message || 'Failed to verify email');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-md">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{user.fullName}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
          {user.userType}
        </span>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-[#e8f0e8] dark:border-[#2a3b2f] pb-3">
          Profile Details
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">User ID</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  readOnly
                  value={user.id}
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb]/70 dark:bg-[#121814]/70 text-slate-600 dark:text-slate-400 font-mono text-[11px] outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyUserId}
                  className="absolute right-2.5 p-1 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                  title="Copy User ID"
                >
                  {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb]/60 dark:bg-[#121814]/60 text-slate-500 text-xs outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">User Role / Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {userTypeOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = userType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setUserType(opt.type)}
                    className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-semibold">{opt.type}</span>
                  </button>
                );
              })}
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
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Account Info Stats */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-[#e8f0e8] dark:border-[#2a3b2f] pb-3">
          Account Status
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#fdfcfb] dark:bg-[#121814] border border-[#e8f0e8] dark:border-[#2a3b2f] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className={`w-5 h-5 ${user.isVerified ? 'text-emerald-600' : 'text-amber-500'}`} />
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">Email Verification</div>
                <div className={`text-[10px] font-semibold ${user.isVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {user.isVerified ? 'Verified & Active' : 'Unverified Account'}
                </div>
              </div>
            </div>

            {!user.isVerified && (
              <button
                onClick={() => {
                  setVerifying(true);
                  handleResendCode();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition cursor-pointer"
              >
                Verify Now
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#fdfcfb] dark:bg-[#121814] border border-[#e8f0e8] dark:border-[#2a3b2f]">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200">Account Created</div>
              <div className="text-[10px] text-slate-400">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Active Member'}
              </div>
            </div>
          </div>
        </div>

        {/* Inline Verification Form if Unverified */}
        {verifying && !user.isVerified && (
          <form onSubmit={handleVerifyEmail} className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200">Enter 6-Digit Verification Code</h3>
              <button
                type="button"
                onClick={() => setVerifying(false)}
                className="text-[11px] font-bold text-slate-500 hover:underline"
              >
                Close
              </button>
            </div>

            {demoCode && (
              <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 p-2 rounded-lg font-mono">
                Code: {demoCode}
              </p>
            )}

            {verifyError && <p className="text-xs text-rose-600">{verifyError}</p>}
            {verifySuccess && <p className="text-xs text-emerald-600">{verifySuccess}</p>}

            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                maxLength={6}
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="123456"
                className="flex-1 px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-[#121814] text-xs font-mono outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
              >
                Verify Code
              </button>
              <button
                type="button"
                onClick={handleResendCode}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                title="Resend Code"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        <div className="pt-4 flex items-center justify-between border-t border-[#e8f0e8] dark:border-[#2a3b2f]">
          <button
            onClick={() => setActiveTab('settings')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Go to Settings & Privacy →
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-100 transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

