import {
  AuthResponse,
  User,
  UserType,
  Task,
  Conversation,
  Message,
  Document,
  StudySession,
  StudyContentType,
  DocumentType,
  UserSettings,
} from '../types';

const TOKEN_KEY = 'lifemate_auth_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'An unexpected error occurred');
  }

  return data as T;
}

export const api = {
  // Auth
  register: (payload: { email: string; password: string; fullName: string; userType: UserType }) =>
    request<AuthResponse>('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

  verifyEmail: (payload: { email: string; code: string }) =>
    request<{ message: string; user: User }>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  resendVerification: (email: string) =>
    request<{ message: string; verificationCode?: string }>('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  getMe: () => request<User>('/api/auth/me'),

  updateProfile: (payload: { fullName?: string; userType?: UserType }) =>
    request<User>('/api/auth/update-profile', { method: 'PUT', body: JSON.stringify(payload) }),

  forgotPassword: (email: string) =>
    request<{ message: string; simulationToken?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (payload: { email: string; resetToken: string; newPassword: string }) =>
    request<{ message: string }>('/api/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) }),

  deleteAccount: () => request<{ message: string }>('/api/auth/delete-account', { method: 'DELETE' }),

  logout: () => {
    removeToken();
  },

  // Settings
  getSettings: () => request<UserSettings>('/api/settings'),
  updateSettings: (payload: Partial<UserSettings>) =>
    request<{ message: string }>('/api/settings', { method: 'PUT', body: JSON.stringify(payload) }),

  // Tasks
  getTasks: () => request<Task[]>('/api/tasks'),
  createTask: (payload: { title: string; description?: string; priority: 'High' | 'Medium' | 'Low'; dueDate: string }) =>
    request<Task>('/api/tasks', { method: 'POST', body: JSON.stringify(payload) }),
  updateTask: (id: string, payload: Partial<Task>) =>
    request<Task>(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteTask: (id: string) => request<{ message: string }>(`/api/tasks/${id}`, { method: 'DELETE' }),

  // Assistant / Conversations
  getConversations: () => request<Conversation[]>('/api/conversations'),
  createConversation: (title?: string) =>
    request<Conversation>('/api/conversations', { method: 'POST', body: JSON.stringify({ title }) }),
  deleteConversation: (id: string) => request<{ message: string }>(`/api/conversations/${id}`, { method: 'DELETE' }),
  clearConversations: () => request<{ message: string }>('/api/conversations', { method: 'DELETE' }),
  getMessages: (conversationId: string) => request<Message[]>(`/api/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: string, content: string) =>
    request<{ userMessage: Message; modelMessage: Message }>(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  // Study Helper
  generateStudyContent: (payload: { topic: string; contentType: StudyContentType; language?: string }) =>
    request<{ topic: string; contentType: StudyContentType; data: any }>('/api/ai/study', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getStudySessions: () => request<StudySession[]>('/api/study-sessions'),
  saveStudySession: (payload: { topic: string; contentType: StudyContentType; content: any }) =>
    request<StudySession>('/api/study-sessions', { method: 'POST', body: JSON.stringify(payload) }),
  deleteStudySession: (id: string) => request<{ message: string }>(`/api/study-sessions/${id}`, { method: 'DELETE' }),

  // Document Helper
  generateDocument: (payload: {
    docType: DocumentType;
    info: string;
    purpose?: string;
    tone?: string;
    instructions?: string;
    language?: string;
  }) =>
    request<{ docType: DocumentType; content: string }>('/api/ai/document', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getDocuments: () => request<Document[]>('/api/documents'),
  saveDocument: (payload: {
    docType: DocumentType;
    title: string;
    content: string;
    info?: string;
    tone?: string;
    instructions?: string;
  }) => request<Document>('/api/documents', { method: 'POST', body: JSON.stringify(payload) }),
  deleteDocument: (id: string) => request<{ message: string }>(`/api/documents/${id}`, { method: 'DELETE' }),
};
