import React, { useState } from 'react';
import {
  Bot,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Users,
  Heart,
  Smile,
  ShieldCheck,
  RefreshCw,
  KeyRound,
} from 'lucide-react';
import { UserType, User } from '../../types';
import { api, setToken } from '../../lib/api';

interface AuthViewsProps {
  initialMode?: 'login' | 'signup' | 'verify' | 'forgot';
  onAuthSuccess: (user: User) => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
}

export function AuthViews({ initialMode = 'login', onAuthSuccess, onSwitchMode }: AuthViewsProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'verify' | 'forgot' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<UserType>('Student');
  const [verifyCode, setVerifyCode] = useState('');
  const [demoVerifyCode, setDemoVerifyCode] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const userTypeOptions: { type: UserType; desc: string; icon: any }[] = [
    { type: 'Student', desc: 'Studies, assignments & exams', icon: GraduationCap },
    { type: 'Teacher', desc: 'Lesson plans & grading notes', icon: GraduationCap },
    { type: 'Job Seeker', desc: 'CVs, cover letters & applications', icon: Briefcase },
    { type: 'Professional', desc: 'Emails, summaries & tasks', icon: Users },
    { type: 'Parent', desc: 'Family organization & school notices', icon: Heart },
    { type: 'General User', desc: 'Personal productivity & daily chats', icon: Smile },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) throw new Error('Please enter your full name');
        if (!email.trim()) throw new Error('Please enter a valid email address');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');

        const res = await api.register({
          email,
          password,
          fullName,
          userType,
        });

        setToken(res.token);
        setPendingUser(res.user);
        if (res.verificationCode) {
          setDemoVerifyCode(res.verificationCode);
        }
        setSuccessMsg('Account created successfully! Please verify your email.');
        setMode('verify');
      } else if (mode === 'login') {
        if (!email.trim() || !password) throw new Error('Please enter email and password');

        const res = await api.login({ email, password });
        setToken(res.token);
        onAuthSuccess(res.user);
      } else if (mode === 'verify') {
        if (!verifyCode.trim()) throw new Error('Please enter the 6-digit verification code');

        const targetEmail = email || pendingUser?.email || '';
        const res = await api.verifyEmail({ email: targetEmail, code: verifyCode });
        setSuccessMsg(res.message);
        setTimeout(() => {
          onAuthSuccess(res.user);
        }, 1000);
      } else if (mode === 'forgot') {
        if (!email.trim()) throw new Error('Please enter your email address');

        const res = await api.forgotPassword(email);
        setSuccessMsg(res.message);
        if (res.simulationToken) {
          setResetToken(res.simulationToken);
        }
        setMode('reset');
      } else if (mode === 'reset') {
        if (!resetToken.trim()) throw new Error('Password reset token is required');
        if (!newPassword || newPassword.length < 6) throw new Error('New password must be at least 6 characters');

        const res = await api.resetPassword({
          email,
          resetToken,
          newPassword,
        });

        setSuccessMsg(res.message);
        setTimeout(() => setMode('login'), 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const targetEmail = email || pendingUser?.email || '';
      const res = await api.resendVerification(targetEmail);
      setSuccessMsg(res.message);
      if (res.verificationCode) {
        setDemoVerifyCode(res.verificationCode);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fadeIn">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#1a201c] p-8 rounded-3xl border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
            {mode === 'verify' ? <ShieldCheck className="w-7 h-7" /> : mode === 'forgot' || mode === 'reset' ? <KeyRound className="w-7 h-7" /> : <Bot className="w-7 h-7" />}
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'login' && 'Welcome Back to LifeMate AI'}
            {mode === 'verify' && 'Verify Your Email'}
            {mode === 'forgot' && 'Reset Your Password'}
            {mode === 'reset' && 'Set New Password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'signup' && 'Join LifeMate AI to unlock smart assistance tailored to your role.'}
            {mode === 'login' && 'Enter your email and password to access your dashboard.'}
            {mode === 'verify' && `Enter the 6-digit code sent to ${email || pendingUser?.email || 'your email'}.`}
            {mode === 'forgot' && 'Enter your registered email address to receive reset instructions.'}
            {mode === 'reset' && 'Enter your reset token and new password.'}
          </p>
        </div>

        {/* Banners */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Demo Helper Banner for Verification Code / Reset Token */}
        {mode === 'verify' && demoVerifyCode && (
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/60 text-teal-800 dark:text-teal-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Simulated Verification Code: <strong className="font-mono text-sm">{demoVerifyCode}</strong></span>
            </div>
            <button
              type="button"
              onClick={() => setVerifyCode(demoVerifyCode)}
              className="text-[11px] font-bold text-teal-700 dark:text-teal-300 hover:underline"
            >
              Auto-fill
            </button>
          </div>
        )}

        {mode === 'reset' && resetToken && (
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/60 text-teal-800 dark:text-teal-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-teal-600" />
              <span>Reset Token: <strong className="font-mono text-xs">{resetToken}</strong></span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-emerald-700 dark:text-emerald-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Khan"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'signup' || mode === 'forgot' || mode === 'reset') && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-700 dark:text-emerald-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-700 dark:text-emerald-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">I am a:</label>
              <div className="grid grid-cols-2 gap-2">
                {userTypeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = userType === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setUserType(opt.type)}
                      className={`p-2.5 rounded-xl text-left border transition flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold'
                          : 'border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span className="text-[11px] font-semibold">{opt.type}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {mode === 'verify' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">6-Digit Verification Code</label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    placeholder="e.g. 123456"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white font-mono tracking-widest text-center text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Resend Code
                </button>
                {pendingUser && (
                  <button
                    type="button"
                    onClick={() => onAuthSuccess(pendingUser)}
                    className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium cursor-pointer"
                  >
                    Skip for now →
                  </button>
                )}
              </div>
            </div>
          )}

          {mode === 'reset' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Reset Token / Code</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-emerald-700 dark:text-emerald-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="e.g. RST-123456"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-700 dark:text-emerald-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'login' && 'Sign In'}
                  {mode === 'verify' && 'Verify Email'}
                  {mode === 'forgot' && 'Send Reset Instructions'}
                  {mode === 'reset' && 'Update Password'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer switch */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-[#e8f0e8] dark:border-[#263529]">
          {mode === 'login' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  onSwitchMode('signup');
                }}
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Sign Up Free
              </button>
            </p>
          )}

          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  onSwitchMode('login');
                }}
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}

          {(mode === 'forgot' || mode === 'reset' || mode === 'verify') && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

