import { Request, Response } from 'express';
import app from '../server';

export default function handler(req: any, res: any) {
  return new Promise((resolve) => {
    // Resolve promise when serverless response finishes or closes
    res.on('finish', resolve);
    res.on('close', resolve);
    res.on('error', (err: any) => {
      console.error('Vercel serverless response stream error:', err);
      resolve(null);
    });

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

      // 2. Parse body if passed as raw JSON string by serverless runtime
      if (typeof req.body === 'string' && req.body.trim()) {
        try {
          req.body = JSON.parse(req.body);
        } catch {
          // Keep raw string if parsing fails
        }
      }

      // 3. Delegate request execution to Express app
      app(req, res);
    } catch (error: any) {
      console.error('Vercel Serverless Function Execution Error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          error: error?.message || 'A server error occurred during function invocation.',
        });
      } else {
        resolve(null);
      }
    }
  });
}


