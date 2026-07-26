import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1a201c] rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-[#e8f0e8] dark:border-[#2a3b2f]">
        <div className="p-5 border-b border-[#e8f0e8] dark:border-[#2a3b2f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Privacy Policy</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#121814] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p className="font-medium text-slate-800 dark:text-slate-100">
            At LifeMate AI, we prioritize user privacy, data security, and transparent data handling practices.
          </p>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">1. Information We Collect</h3>
          <p>
            We collect account information (e.g., your name, email, user role/type) and user-generated data such as study notes, task entries, document templates, and assistant chat messages. All private records are tied to your unique authenticated account ID.
          </p>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">2. How We Use Your Data</h3>
          <p>
            Your data is used solely to provide personalized AI recommendations, maintain your personal tasks and documents, and deliver tailored responses matching your user profile (student, teacher, job seeker, professional, parent, general user).
          </p>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">3. Data Security & Storage</h3>
          <p>
            We store data securely using industry-standard hashing and encryption protocols. Your passwords are never stored in plain text, and API keys remain protected on our secure server runtime.
          </p>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">4. User Rights & Data Deletion</h3>
          <p>
            You retain complete ownership of your data. You may export or permanently delete your account and all associated records directly from the Settings menu at any time.
          </p>
        </div>
        <div className="p-4 border-t border-[#e8f0e8] dark:border-[#2a3b2f] flex justify-end bg-[#fdfcfb] dark:bg-[#121814]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

export function TermsModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1a201c] rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-[#e8f0e8] dark:border-[#2a3b2f]">
        <div className="p-5 border-b border-[#e8f0e8] dark:border-[#2a3b2f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Terms of Service</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#121814] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p className="font-medium text-slate-800 dark:text-slate-100">
            Welcome to LifeMate AI. By accessing or using our platform, you agree to comply with these terms.
          </p>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">1. Acceptable Use</h3>
          <p>
            LifeMate AI is an intelligent assistant platform designed for productivity, study assistance, document drafting, and task management. You agree not to use the service for illegal, abusive, or unauthorized purposes.
          </p>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">2. AI Content & Medical/Legal Disclaimer</h3>
          <p>
            AI-generated responses in LifeMate AI are produced by advanced language models for educational and informational support. They do not constitute official professional medical, legal, or financial advice. Always consult a certified professional for formal decisions.
          </p>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">3. Service Modifications</h3>
          <p>
            We continuously upgrade LifeMate AI to improve response quality, speed, and user experience. We reserve the right to modify or enhance platform features as necessary.
          </p>
        </div>
        <div className="p-4 border-t border-[#e8f0e8] dark:border-[#2a3b2f] flex justify-end bg-[#fdfcfb] dark:bg-[#121814]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
          >
            Accept Terms
          </button>
        </div>
      </div>
    </div>
  );
}

