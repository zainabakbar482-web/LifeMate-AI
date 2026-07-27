import { Request, Response } from 'express';
import app from '../server';

export default function handler(req: Request, res: Response) {
  try {
    return app(req, res);
  } catch (err: any) {
    console.error('Vercel serverless function execution error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: err?.message || 'Internal serverless execution error' });
    }
  }
}

