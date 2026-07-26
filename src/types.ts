export type UserType = 
  | 'Student' 
  | 'Teacher' 
  | 'Job Seeker' 
  | 'Professional' 
  | 'Parent' 
  | 'General User';

export interface User {
  id: string;
  email: string;
  fullName: string;
  userType: UserType;
  isVerified?: boolean;
  languagePref?: 'English' | 'Urdu' | 'Roman Urdu';
  themePref?: 'light' | 'dark' | 'system';
  notificationsEnabled?: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  verificationCode?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'model';
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate: string; // YYYY-MM-DD or ISO string
  completed: boolean;
  createdAt: string;
}

export type DocumentType = 
  | 'CV Content' 
  | 'Cover Letter' 
  | 'Job Application' 
  | 'Formal Email' 
  | 'Professional Message' 
  | 'Simple Application' 
  | 'Personal Statement';

export interface Document {
  id: string;
  userId: string;
  docType: DocumentType;
  title: string;
  content: string;
  info?: string;
  tone?: string;
  instructions?: string;
  createdAt: string;
}

export type StudyContentType = 
  | 'explanation' 
  | 'summary' 
  | 'mcqs' 
  | 'short_questions' 
  | 'flashcards' 
  | 'study_plan';

export interface Flashcard {
  question: string;
  answer: string;
}

export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface ShortQuestion {
  question: string;
  answer: string;
}

export interface StudyPlanDay {
  day: string;
  focus: string;
  activities: string[];
}

export interface StudyContentPayload {
  explanation?: string;
  summary?: string;
  mcqs?: MCQ[];
  shortQuestions?: ShortQuestion[];
  flashcards?: Flashcard[];
  studyPlan?: StudyPlanDay[];
}

export interface StudySession {
  id: string;
  userId: string;
  topic: string;
  contentType: StudyContentType;
  content: StudyContentPayload;
  createdAt: string;
}

export interface UserSettings {
  languagePref: 'English' | 'Urdu' | 'Roman Urdu';
  themePref: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  privacySettings: {
    dataSharing: boolean;
    activityLogging: boolean;
  };
}
