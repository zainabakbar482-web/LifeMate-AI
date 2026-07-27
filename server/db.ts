import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User, Conversation, Message, Task, Document, StudySession } from '../src/types';

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

// In-memory DB cache for serverless environments
let inMemoryDB: DBData | null = null;

// Determine writable directory for Serverless (Vercel uses /tmp)
const isServerless = Boolean(process.env.VERCEL || process.env.VERCEL_ENV || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DB_DIR = isServerless ? path.join('/tmp', 'lifemate_data') : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');
const SEED_FILE = path.join(process.cwd(), 'data', 'db.json');

function ensureDBDir() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('Could not create DB directory (serverless filesystem constraint):', err);
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
  if (inMemoryDB) {
    return inMemoryDB;
  }

  ensureDBDir();

  let raw: string | null = null;

  // Attempt 1: Read from writable runtime DB_FILE (/tmp/lifemate_data/db.json)
  try {
    if (fs.existsSync(DB_FILE)) {
      raw = fs.readFileSync(DB_FILE, 'utf-8');
    }
  } catch (err) {
    console.warn('Could not read runtime DB file:', err);
  }

  // Attempt 2: Read from static seed file bundled in project
  if (!raw) {
    try {
      if (fs.existsSync(SEED_FILE)) {
        raw = fs.readFileSync(SEED_FILE, 'utf-8');
      }
    } catch (err) {
      console.warn('Could not read seed DB file:', err);
    }
  }

  if (raw && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      inMemoryDB = {
        users: Array.isArray(parsed?.users) ? parsed.users : [],
        conversations: Array.isArray(parsed?.conversations) ? parsed.conversations : [],
        messages: Array.isArray(parsed?.messages) ? parsed.messages : [],
        tasks: Array.isArray(parsed?.tasks) ? parsed.tasks : [],
        documents: Array.isArray(parsed?.documents) ? parsed.documents : [],
        studySessions: Array.isArray(parsed?.studySessions) ? parsed.studySessions : [],
      };
      return inMemoryDB;
    } catch (err) {
      console.error('Error parsing db json, initializing fresh DB:', err);
    }
  }

  inMemoryDB = getInitialDB();
  saveDB(inMemoryDB);
  return inMemoryDB;
}

export function saveDB(data: DBData): void {
  inMemoryDB = data;
  try {
    ensureDBDir();
    const tmpFile = `${DB_FILE}.tmp`;
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
    console.warn('Filesystem write not allowed on serverless platform, relying on in-memory store:', err);
  }
}

// Password hashing utility using native Node crypto scrypt
export function hashPassword(password: string): string {
  try {
    const salt = 'lifemate_salt_2026_safe';
    const pwdStr = String(password || '');
    return crypto.scryptSync(pwdStr, salt, 64).toString('hex');
  } catch (err) {
    console.error('Password hash computation fallback:', err);
    return 'pwd_hash_' + String(password);
  }
}

export function verifyPassword(password: string, hash: string): boolean {
  try {
    return hashPassword(password) === hash;
  } catch {
    return false;
  }
}

