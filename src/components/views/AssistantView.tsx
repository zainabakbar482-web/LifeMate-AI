import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  Globe2,
  Sparkles,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  User as UserIcon,
} from 'lucide-react';
import { Conversation, Message } from '../../types';
import { api } from '../../lib/api';
import { FormattedText } from '../FormattedText';

interface AssistantViewProps {
  initialPrompt?: string;
}

export function AssistantView({ initialPrompt }: AssistantViewProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputContent, setInputContent] = useState('');

  const [loadingConv, setLoadingConv] = useState(true);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (initialPrompt && conversations.length > 0) {
      handleSendPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (currentConvId) {
      fetchMessages(currentConvId);
    } else {
      setMessages([]);
    }
  }, [currentConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sendingMsg]);

  async function fetchConversations() {
    try {
      setLoadingConv(true);
      const convs = await api.getConversations();
      const safeConvs = Array.isArray(convs) ? convs : [];
      setConversations(safeConvs);
      if (safeConvs.length > 0 && !currentConvId) {
        setCurrentConvId(safeConvs[0].id);
      } else if (safeConvs.length === 0) {
        handleNewChat();
      }
    } catch (err: any) {
      console.error('Fetch conversations error:', err);
      setConversations([]);
    } finally {
      setLoadingConv(false);
    }
  }

  async function fetchMessages(convId: string) {
    try {
      setError(null);
      const msgs = await api.getMessages(convId);
      setMessages(Array.isArray(msgs) ? msgs : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load messages');
      setMessages([]);
    }
  }

  async function handleNewChat() {
    try {
      setError(null);
      const newC = await api.createConversation('New Conversation');
      setConversations((prev) => [newC, ...(Array.isArray(prev) ? prev : [])]);
      setCurrentConvId(newC.id);
      setMessages([]);
    } catch (err: any) {
      setError(err.message || 'Failed to create new chat');
    }
  }

  async function handleDeleteChat(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await api.deleteConversation(id);
      const updated = (Array.isArray(conversations) ? conversations : []).filter((c) => c.id !== id);
      setConversations(updated);
      if (currentConvId === id) {
        setCurrentConvId(updated.length > 0 ? updated[0].id : null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete chat');
    }
  }

  async function handleClearAllChats() {
    if (!window.confirm('Are you sure you want to clear all chat conversations?')) return;
    try {
      await api.clearConversations();
      setConversations([]);
      setCurrentConvId(null);
      setMessages([]);
      handleNewChat();
    } catch (err: any) {
      setError(err.message || 'Failed to clear chats');
    }
  }

  async function handleSendPrompt(promptText: string) {
    if (!promptText.trim() || sendingMsg) return;

    let targetConvId = currentConvId;
    if (!targetConvId) {
      try {
        const newC = await api.createConversation('New Conversation');
        targetConvId = newC.id;
        setConversations([newC, ...conversations]);
        setCurrentConvId(newC.id);
      } catch (err: any) {
        setError('Failed to create chat room');
        return;
      }
    }

    const tempUserMsg: Message = {
      id: 'temp_user_' + Date.now(),
      conversationId: targetConvId,
      userId: 'me',
      role: 'user',
      content: promptText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...(Array.isArray(prev) ? prev : []), tempUserMsg]);
    setInputContent('');
    setSendingMsg(true);
    setError(null);

    try {
      const res = await api.sendMessage(targetConvId, promptText);
      setMessages((prev) =>
        (Array.isArray(prev) ? prev : []).map((m) => (m.id === tempUserMsg.id ? res.userMessage : m)).concat(res.modelMessage)
      );

      setLastFailedPrompt(null);
      // Refresh title in list if updated
      setConversations((prev) =>
        (Array.isArray(prev) ? prev : []).map((c) => (c.id === targetConvId ? { ...c, title: promptText.slice(0, 30) } : c))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      setLastFailedPrompt(promptText);
    } finally {
      setSendingMsg(false);
    }
  }

  const handleRetry = () => {
    if (lastFailedPrompt) {
      handleSendPrompt(lastFailedPrompt);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-4 animate-fadeIn">
      {/* Sidebar Chat History */}
      <div className="w-full md:w-64 bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] rounded-3xl p-4 flex flex-col justify-between shrink-0 shadow-xs">
        <div className="space-y-4">
          <button
            onClick={handleNewChat}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Chat History</span>
              {conversations.length > 0 && (
                <button
                  onClick={handleClearAllChats}
                  className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
                  title="Clear All Chats"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {loadingConv ? (
              <div className="text-center py-4 text-xs text-slate-400">Loading chats...</div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-400">No chats yet.</div>
            ) : (
              <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto space-y-1 pr-1">
                {conversations.map((conv) => {
                  const isActive = conv.id === currentConvId;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => setCurrentConvId(conv.id)}
                      className={`group flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs transition ${
                        isActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50/50 dark:hover:bg-[#232c26]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{conv.title}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteChat(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Language Badges Info */}
        <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-[11px] text-emerald-800 dark:text-emerald-300 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Multilingual Support</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Speaks English, Urdu (اردو), and Roman Urdu seamlessly.
          </p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] rounded-3xl flex flex-col overflow-hidden shadow-xs">
        {/* Header Bar */}
        <div className="p-4 border-b border-[#e8f0e8] dark:border-[#2a3b2f] flex items-center justify-between bg-[#fdfcfb]/80 dark:bg-[#121814]/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>LifeMate AI Assistant</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  Online
                </span>
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Ask questions, generate ideas, or request simple topic explanations
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="m-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
            <div className="flex items-center gap-2">
              {lastFailedPrompt && (
                <button
                  onClick={handleRetry}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] flex items-center gap-1 hover:bg-rose-700 transition cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              )}
              <button onClick={() => setError(null)} className="text-xs font-bold underline cursor-pointer">
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Messages List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.length === 0 && !sendingMsg ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto py-12">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Start a Conversation</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ask LifeMate AI anything! Try typing in English, Urdu, or Roman Urdu.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-2">
                {[
                  'Explain photosynthesis in simple English',
                  'Urdu me mujhey time management tips do',
                  'Roman Urdu: Resume kaise banayein?',
                  'Help me brainstorm a presentation outline',
                ].map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendPrompt(sample)}
                    className="p-3 rounded-xl bg-[#fdfcfb] dark:bg-[#121814] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-[#e8f0e8] dark:border-[#2a3b2f] text-left text-xs font-medium text-slate-700 dark:text-slate-300 transition cursor-pointer"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                      isUser
                        ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[82%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap relative group ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-600/10'
                        : 'bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-slate-100 rounded-tl-none border border-[#e8f0e8] dark:border-[#2a3b2f]'
                    }`}
                  >
                    <FormattedText text={msg.content} />

                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 text-slate-500 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
                        title="Copy Response"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {sendingMsg && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-[#fdfcfb] dark:bg-[#121814] border border-[#e8f0e8] dark:border-[#2a3b2f] text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span>Thinking in your language...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-[#e8f0e8] dark:border-[#2a3b2f] bg-white dark:bg-[#1a201c]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(inputContent);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Ask anything... (English, اردو, Roman Urdu)"
              className="flex-1 px-4 py-3 rounded-2xl bg-[#fdfcfb] dark:bg-[#121814] border border-[#e8f0e8] dark:border-[#2a3b2f] text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
            />
            <button
              type="submit"
              disabled={!inputContent.trim() || sendingMsg}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
