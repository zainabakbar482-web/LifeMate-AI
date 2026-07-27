import { Request, Response } from 'express';
import app from '../server';

export default async function handler(req: any, res: any) {
  try {
    // 1. Resolve original URL from Vercel proxy headers if present
    const originalUrl =
      req.headers?.['x-forwarded-uri'] ||
      req.headers?.['x-real-url'] ||
      req.headers?.['x-original-url'] ||
      req.url;

    if (originalUrl && typeof originalUrl === 'string') {
      req.url = originalUrl;
    }

    // Ensure API routes start with /api
    if (req.url && !req.url.startsWith('/api/') && req.url !== '/api') {
      req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
    }

    // 2. Safe parse body if passed as raw JSON string by serverless runtime
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch {
        // Keep original string if not valid JSON
      }
    }

    // 3. Forward to Express application
    return app(req, res);
  } catch (error: any) {
    console.error('Vercel Serverless Function Execution Error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: error?.message || 'A server error occurred during function invocation.',
      });
    }
  }
}

