import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  BookmarkPlus,
  Trash2,
  AlertCircle,
  Briefcase,
  Mail,
  Send,
  UserCheck,
  FileCheck,
  RefreshCcw,
  Globe,
} from 'lucide-react';
import { DocumentType, Document } from '../../types';
import { api } from '../../lib/api';
import { FormattedText } from '../FormattedText';

export function DocumentHelperView() {
  const [activeTab, setActiveTab] = useState<'generator' | 'saved'>('generator');

  const [docType, setDocType] = useState<DocumentType>('CV Content');
  const [info, setInfo] = useState('');
  const [purpose, setPurpose] = useState('');
  const [tone, setTone] = useState('Professional & Formal');
  const [language, setLanguage] = useState('Auto');
  const [instructions, setInstructions] = useState('');

  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [savedDocs, setSavedDocs] = useState<Document[]>([]);
  const [selectedSavedDoc, setSelectedSavedDoc] = useState<Document | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadSavedDocs();
  }, []);

  async function loadSavedDocs() {
    try {
      const list = await api.getDocuments();
      setSavedDocs(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load documents', err);
      setSavedDocs([]);
    }
  }

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!info.trim() && !purpose.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.generateDocument({
        docType,
        info: info.trim(),
        purpose: purpose.trim(),
        tone,
        language: language === 'Auto' ? undefined : language,
        instructions: instructions.trim(),
      });
      setGeneratedContent(res.content);
    } catch (err: any) {
      setError(err.message || 'Failed to generate document');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDoc = async () => {
    if (!generatedContent) return;
    try {
      const newDoc = await api.saveDocument({
        docType,
        title: `${docType} (${language !== 'Auto' ? language : 'Generated'}) - ${new Date().toLocaleDateString()}`,
        content: generatedContent,
        info,
        tone,
        instructions,
      });
      setSavedDocs((prev) => [newDoc, ...(Array.isArray(prev) ? prev : [])]);
      setSelectedSavedDoc(newDoc);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      setError('Failed to save document');
    }
  };

  const handleDeleteDoc = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await api.deleteDocument(id);
      setSavedDocs((prev) => (Array.isArray(prev) ? prev : []).filter((d) => d.id !== id));
      if (selectedSavedDoc?.id === id) {
        setSelectedSavedDoc(null);
      }
    } catch (err) {
      setError('Failed to delete document');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const docTypesList: { type: DocumentType; icon: any; label: string }[] = [
    { type: 'CV Content', icon: Briefcase, label: 'CV Content' },
    { type: 'Cover Letter', icon: FileCheck, label: 'Cover Letter' },
    { type: 'Job Application', icon: Send, label: 'Job Application' },
    { type: 'Formal Email', icon: Mail, label: 'Formal Email' },
    { type: 'Professional Message', icon: UserCheck, label: 'Professional Msg' },
    { type: 'Simple Application', icon: FileText, label: 'Simple Leave App' },
    { type: 'Personal Statement', icon: FileText, label: 'Personal Statement' },
  ];

  const toneOptions = [
    'Professional & Formal',
    'Confident & Persuasive',
    'Polite & Respectful',
    'Concise & Direct',
    'Academic & Authoritative',
    'Warm & Enthusiastic',
  ];

  const languages = ['Auto', 'English', 'Urdu', 'Roman Urdu'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Document Helper</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Draft professional CVs, cover letters, formal emails & statements in English, Urdu or Roman Urdu
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#fdfcfb] dark:bg-[#121814] border border-[#e8f0e8] dark:border-[#2a3b2f] rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'generator'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Doc Generator
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Saved Docs ({savedDocs.length})
          </button>
        </div>
      </div>

      {activeTab === 'generator' ? (
        <div className="space-y-8">
          {/* Generator Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-sm space-y-6">
            <form onSubmit={(e) => handleGenerate(e)} className="space-y-6">
              {/* Doc Type Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Document Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {docTypesList.map((item) => {
                    const Icon = item.icon;
                    const isSelected = docType === item.type;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setDocType(item.type)}
                        className={`p-3 rounded-2xl border text-left transition flex flex-col items-start gap-2 cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs'
                            : 'border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-600 dark:text-slate-400 hover:border-emerald-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-emerald-600" />
                        <span className="text-[11px] font-bold leading-tight">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Inputs: Personal Info & Purpose */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Personal Information & Qualifications
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                    placeholder={`e.g. Name: Muhammad Usman\nQualification: BS Computer Science\nSkills: React, Node.js, Python\nExperience: 2 years in Web Development...`}
                    className="w-full p-4 rounded-2xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Purpose / Target Role / Recipient
                  </label>
                  <textarea
                    rows={4}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder={`e.g. Applying for Full Stack Developer at Systems Ltd / Sick Leave request to HR Manager / Requesting meeting for project demo...`}
                    className="w-full p-4 rounded-2xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Tone, Language & Special Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                  >
                    {toneOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang === 'Auto' ? '🌐 Auto-Detect' : lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Additional Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Keep under 200 words, include bullet points..."
                    className="w-full px-4 py-3 rounded-2xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || (!info.trim() && !purpose.trim())}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Drafting Professional Content...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Document</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => handleGenerate()}
                className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 transition cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Result Output Card */}
          {generatedContent && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e8f0e8] dark:border-[#2a3b2f] gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Generated {docType}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{docType}</h2>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleCopy(generatedContent)}
                    className="p-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] hover:bg-[#fdfcfb] dark:hover:bg-[#121814] text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenerate()}
                    disabled={loading}
                    className="p-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] hover:bg-[#fdfcfb] dark:hover:bg-[#121814] text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Regenerate</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveDoc}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    {savedSuccess ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                    <span>{savedSuccess ? 'Saved!' : 'Save Document'}</span>
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#fdfcfb] dark:bg-[#121814] border border-[#e8f0e8] dark:border-[#2a3b2f] text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-sans leading-relaxed">
                <FormattedText text={generatedContent} />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Saved Documents Tab */
        <div className="space-y-6">
          {savedDocs.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] space-y-2">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No saved documents yet</p>
              <p className="text-xs text-slate-400">Draft a document and click "Save Document" to keep it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Document List Sidebar */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved Documents</h3>
                {savedDocs.map((doc) => {
                  const isSelected = selectedSavedDoc?.id === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedSavedDoc(doc)}
                      className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40'
                          : 'border-[#e8f0e8] dark:border-[#2a3b2f] bg-white dark:bg-[#1a201c] hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 uppercase">
                          {doc.docType}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteDoc(doc.id, e)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{doc.title}</h4>
                      <p className="text-[10px] text-slate-400">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Saved Document Detail Viewer */}
              <div className="md:col-span-2">
                {selectedSavedDoc ? (
                  <div className="p-6 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-[#e8f0e8] dark:border-[#2a3b2f]">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                          {selectedSavedDoc.docType}
                        </span>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedSavedDoc.title}</h2>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedSavedDoc.content)}
                          className="p-2 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] hover:bg-[#fdfcfb] dark:hover:bg-[#121814] text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 transition cursor-pointer"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDoc(selectedSavedDoc.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#fdfcfb] dark:bg-[#121814] border border-[#e8f0e8] dark:border-[#2a3b2f] text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed">
                      <FormattedText text={selectedSavedDoc.content} />
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] text-slate-400 text-xs">
                    Select a saved document on the left to view its contents.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
