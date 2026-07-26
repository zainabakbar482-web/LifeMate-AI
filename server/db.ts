import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User, Conversation, Message, Task, Document, StudySession } from '../src/types.js';

export interface DBUser extends User {
  passwordHash: string;
  verificationCode?: string;
  resetToken?: string;
}

interface DBData {
  users: DBUser[];
  conversations: Conversation[];
  messages: Message[];
  tasks: Task[];
  documents: Document[];
  studySessions: StudySession[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

function ensureDBDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

function getInitialDB(): DBData {
  return {
    users: [],
    conversations: [],
    messages: [],
    tasks: [],
    documents: [],
    studySessions: [],
  };
}

export function loadDB(): DBData {
  ensureDBDir();
  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialDB();
    saveDB(initial);
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    if (!raw || !raw.trim()) {
      const initial = getInitialDB();
      saveDB(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed?.users) ? parsed.users : [],
      conversations: Array.isArray(parsed?.conversations) ? parsed.conversations : [],
      messages: Array.isArray(parsed?.messages) ? parsed.messages : [],
      tasks: Array.isArray(parsed?.tasks) ? parsed.tasks : [],
      documents: Array.isArray(parsed?.documents) ? parsed.documents : [],
      studySessions: Array.isArray(parsed?.studySessions) ? parsed.studySessions : [],
    };
  } catch (err) {
    console.error('Error reading db.json, repairing with fresh DB format:', err);
    const initial = getInitialDB();
    saveDB(initial);
    return initial;
  }
}

export function saveDB(data: DBData): void {
  ensureDBDir();
  const tmpFile = `${DB_FILE}.tmp`;
  try {
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    try {
      fs.renameSync(tmpFile, DB_FILE);
    } catch {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      if (fs.existsSync(tmpFile)) {
        try { fs.unlinkSync(tmpFile); } catch {}
      }
    }
  } catch (err) {
    console.error('Error saving database to db.json:', err);
  }
}

// Password hashing utility using native Node crypto scrypt
export function hashPassword(password: string): string {
  const salt = 'lifemate_salt_2026_safe';
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
