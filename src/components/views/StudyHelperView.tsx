import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  FileText,
  HelpCircle,
  Layers,
  Calendar,
  Sparkles,
  Copy,
  Check,
  BookmarkPlus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCcw,
} from 'lucide-react';
import { StudyContentType, StudySession, MCQ, Flashcard, ShortQuestion, StudyPlanDay } from '../../types';
import { api } from '../../lib/api';
import { FormattedText } from '../FormattedText';

export function StudyHelperView() {
  const [activeTab, setActiveTab] = useState<'generator' | 'saved'>('generator');
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<StudyContentType>('explanation');
  const [language, setLanguage] = useState<string>('Auto');

  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [savedSessions, setSavedSessions] = useState<StudySession[]>([]);
  const [selectedSavedSession, setSelectedSavedSession] = useState<StudySession | null>(null);

  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // MCQ state
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    loadSavedSessions();
  }, []);

  async function loadSavedSessions() {
    try {
      const list = await api.getStudySessions();
      setSavedSessions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load study sessions', err);
      setSavedSessions([]);
    }
  }

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setResultData(null);
    setUserAnswers({});
    setCurrentCardIndex(0);
    setIsFlipped(false);

    try {
      const res = await api.generateStudyContent({
        topic: topic.trim(),
        contentType,
        language: language === 'Auto' ? undefined : language,
      });
      setResultData(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate study materials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSession = async () => {
    if (!resultData || !topic) return;
    try {
      const newSession = await api.saveStudySession({
        topic,
        contentType,
        content: resultData,
      });
      setSavedSessions((prev) => [newSession, ...(Array.isArray(prev) ? prev : [])]);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err: any) {
      setError('Failed to save study session');
    }
  };

  const handleDeleteSession = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await api.deleteStudySession(id);
      setSavedSessions((prev) => (Array.isArray(prev) ? prev : []).filter((s) => s.id !== id));
      if (selectedSavedSession?.id === id) {
        setSelectedSavedSession(null);
      }
    } catch (err) {
      setError('Failed to delete study session');
    }
  };

  const handleCopyText = (content: any) => {
    const textToCopy = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contentTypes: { type: StudyContentType; label: string; icon: any; desc: string }[] = [
    { type: 'explanation', label: '1. Explain Topic', icon: BookOpen, desc: 'Clear topic breakdown' },
    { type: 'summary', label: '2. Generate Summary', icon: FileText, desc: 'Key takeaways & notes' },
    { type: 'mcqs', label: '3. Generate MCQs', icon: HelpCircle, desc: '5 practice questions' },
    { type: 'short_questions', label: '4. Short Questions', icon: HelpCircle, desc: 'Core Q&A pairs' },
    { type: 'flashcards', label: '5. Flashcards', icon: Layers, desc: 'Interactive flip cards' },
    { type: 'study_plan', label: '6. Study Plan', icon: Calendar, desc: '5-day roadmap' },
  ];

  const languages = ['Auto', 'English', 'Urdu', 'Roman Urdu'];

  const renderContentData = (type: StudyContentType, data: any) => {
    if (type === 'explanation' || type === 'summary') {
      return (
        <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
          <FormattedText text={typeof data === 'string' ? data : JSON.stringify(data, null, 2)} />
        </div>
      );
    }

    if (type === 'flashcards' && Array.isArray(data)) {
      const card = data[currentCardIndex];
      const cardText = isFlipped ? card?.answer : card?.question;
      return (
        <div className="space-y-6 max-w-xl mx-auto py-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>
              Card {currentCardIndex + 1} of {data.length}
            </span>
            <span>Click card to flip</span>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[220px] p-8 rounded-3xl bg-gradient-to-br from-emerald-50/80 to-[#fdfcfb] dark:from-[#16221a] dark:to-[#121814] border-2 border-emerald-200/80 dark:border-emerald-900/60 shadow-lg cursor-pointer flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:scale-[1.01]"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">
              {isFlipped ? 'Answer (Back)' : 'Question (Front)'}
            </span>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
              <FormattedText text={cardText || ''} />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setCurrentCardIndex((prev) => Math.max(0, prev - 1));
                setIsFlipped(false);
              }}
              disabled={currentCardIndex === 0}
              className="p-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] disabled:opacity-40 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-xs font-bold text-emerald-800 dark:text-emerald-300 cursor-pointer"
            >
              Flip Card
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentCardIndex((prev) => Math.min(data.length - 1, prev + 1));
                setIsFlipped(false);
              }}
              disabled={currentCardIndex === data.length - 1}
              className="p-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] disabled:opacity-40 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    if (type === 'mcqs' && Array.isArray(data)) {
      return (
        <div className="space-y-6">
          {data.map((mcq: MCQ, idx: number) => {
            const selectedOpt = userAnswers[idx];
            return (
              <div key={idx} className="p-5 rounded-2xl bg-[#fdfcfb] dark:bg-[#121814] border border-[#e8f0e8] dark:border-[#2a3b2f] space-y-3">
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex gap-1.5">
                  <span>{idx + 1}.</span>
                  <FormattedText text={mcq.question} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Array.isArray(mcq.options) ? mcq.options : []).map((opt: string, optIdx: number) => {
                    const isSelected = selectedOpt === optIdx;
                    const isCorrect = optIdx === mcq.correctAnswer;
                    let btnStyle =
                      'bg-white dark:bg-[#1a201c] border-[#e8f0e8] dark:border-[#2a3b2f] text-slate-700 dark:text-slate-300';

                    if (selectedOpt !== undefined) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-600 text-white font-bold border-emerald-700';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-600 text-white font-bold border-rose-700';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => setUserAnswers({ ...userAnswers, [idx]: optIdx })}
                        className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${btnStyle}`}
                      >
                        <FormattedText text={opt} />
                      </button>
                    );
                  })}
                </div>

                {selectedOpt !== undefined && mcq.explanation && (
                  <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium border border-emerald-100 dark:border-emerald-900/40 flex items-start gap-1.5">
                    <span className="shrink-0">💡 Explanation:</span>
                    <FormattedText text={mcq.explanation} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (type === 'short_questions' && Array.isArray(data)) {
      return (
        <div className="space-y-4">
          {data.map((item: ShortQuestion, idx: number) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#fdfcfb] dark:bg-[#121814] border border-[#e8f0e8] dark:border-[#2a3b2f] space-y-2">
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex gap-1.5">
                <span>Q{idx + 1}:</span>
                <FormattedText text={item.question} />
              </div>
              <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                <FormattedText text={item.answer} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'study_plan' && Array.isArray(data)) {
      return (
        <div className="space-y-4">
          {data.map((day: StudyPlanDay, idx: number) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#fdfcfb] dark:bg-[#121814] border border-[#e8f0e8] dark:border-[#2a3b2f] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-600 text-white">
                  {day.day}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  <FormattedText text={day.focus} />
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {(Array.isArray(day.activities) ? day.activities : []).map((act, aIdx) => (
                  <div key={aIdx} className="pl-2">
                    <FormattedText text={act} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="text-xs text-slate-600 dark:text-slate-300 font-mono overflow-x-auto p-4 bg-[#fdfcfb] dark:bg-[#121814] rounded-2xl">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Study Helper</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Master topics with explanations, summaries, MCQs, flashcards, short Q&As & 5-day study plans (English, Urdu & Roman Urdu)
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
            Study Generator
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Saved Materials ({savedSessions.length})
          </button>
        </div>
      </div>

      {activeTab === 'generator' ? (
        <div className="space-y-8">
          {/* Input Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs space-y-6">
            <form onSubmit={(e) => handleGenerate(e)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Topic / Subject Name
                  </label>
                  <input
                    type="text"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Photosynthesis, Machine Learning, Nizam-e-Shamsi, Cell Division..."
                    className="w-full px-4 py-3 rounded-2xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-3 rounded-2xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-600 outline-none cursor-pointer"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang === 'Auto' ? '🌐 Auto-Detect' : lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Select Content Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Feature</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {contentTypes.map((item) => {
                    const Icon = item.icon;
                    const isSelected = contentType === item.type;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setContentType(item.type)}
                        className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                            : 'border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-600 dark:text-slate-400 hover:border-emerald-500/50'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="text-xs font-bold">{item.label}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating Educational Content...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Study Material</span>
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

          {/* Result Output Display */}
          {resultData && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e8f0e8] dark:border-[#2a3b2f] gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                    {contentType.replace('_', ' ')}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{topic}</h2>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleCopyText(resultData)}
                    className="p-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] hover:bg-emerald-50/50 dark:hover:bg-[#232c26] text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenerate()}
                    disabled={loading}
                    className="p-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] hover:bg-emerald-50/50 dark:hover:bg-[#232c26] text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Regenerate</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveSession}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    {savedSuccess ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                    <span>{savedSuccess ? 'Saved!' : 'Save Material'}</span>
                  </button>
                </div>
              </div>

              {renderContentData(contentType, resultData)}
            </div>
          )}
        </div>
      ) : (
        /* Saved Materials Tab */
        <div className="space-y-6">
          {savedSessions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] space-y-2">
              <GraduationCap className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No saved study materials yet</p>
              <p className="text-xs text-slate-400">Generate a study guide or quiz and click "Save Material".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Saved list sidebar */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved Sessions</h3>
                {savedSessions.map((session) => {
                  const isSelected = selectedSavedSession?.id === session.id;
                  return (
                    <div
                      key={session.id}
                      onClick={() => {
                        setSelectedSavedSession(session);
                        setUserAnswers({});
                        setCurrentCardIndex(0);
                        setIsFlipped(false);
                      }}
                      className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40'
                          : 'border-[#e8f0e8] dark:border-[#2a3b2f] bg-white dark:bg-[#1a201c] hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase">
                          {session.contentType.replace('_', ' ')}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSession(session.id, e)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{session.topic}</h4>
                      <p className="text-[10px] text-slate-400">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Saved content viewer */}
              <div className="md:col-span-2">
                {selectedSavedSession ? (
                  <div className="p-6 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-[#e8f0e8] dark:border-[#2a3b2f]">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                          {selectedSavedSession.contentType.replace('_', ' ')}
                        </span>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                          {selectedSavedSession.topic}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText(selectedSavedSession.content)}
                        className="p-2 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] hover:bg-emerald-50/50 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 transition cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>

                    {renderContentData(selectedSavedSession.contentType, selectedSavedSession.content)}
                  </div>
                ) : (
                  <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] text-slate-400 text-xs">
                    Select a saved study material on the left to view its contents.
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
