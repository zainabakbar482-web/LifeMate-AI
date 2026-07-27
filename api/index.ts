import app from "../server";

export default function handler(req: any, res: any) {
  try {
    const originalUrl =
      req.headers?.["x-forwarded-uri"] ||
      req.headers?.["x-invoke-path"] ||
      req.headers?.["x-matched-path"] ||
      req.headers?.["x-real-url"] ||
      req.headers?.["x-original-url"] ||
      req.url;

    if (typeof originalUrl === "string") {
      req.url = originalUrl;
    }

    if (req.url && !req.url.startsWith("/api")) {
      req.url = `/api${req.url}`;
    }

    if (typeof req.body === "string" && req.body.trim()) {
      try {
        req.body = JSON.parse(req.body);
      } catch {
        req.body = req.body;
      }
    }

    return app(req, res);

  } catch (error: any) {
    console.error("Serverless Function Error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        error: error.message || "Internal Server Error",
      });
    }
  }
}