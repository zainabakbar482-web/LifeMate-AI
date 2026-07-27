import { Request, Response } from 'express';
import app from '../server';

export default function handler(req: any, res: any) {
  try {
    // Preserve requested API path on Vercel rewrites
    const originalUrl =
      req.headers?.['x-forwarded-uri'] ||
      req.headers?.['x-real-url'] ||
      req.headers?.['x-original-url'] ||
      req.url;

    if (originalUrl && typeof originalUrl === 'string' && originalUrl.startsWith('/api')) {
      req.url = originalUrl;
    }

    // Ensure URL begins with /api
    if (req.url && !req.url.startsWith('/api/') && req.url !== '/api') {
      req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
    }

    // Invoke Express app directly
    return app(req, res);
  } catch (error: any) {
    console.error('Vercel Serverless Function Handler Error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: error?.message || 'A server error occurred during function invocation.',
      });
    }
  }
}



