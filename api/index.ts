import app from "../server/index.js";

export default function handler(req: any, res: any) {
  const cleanup = () => {};

  try {
    // Preserve original API URL from Vercel headers
    const originalUrl =
      req.headers?.["x-forwarded-uri"] ||
      req.headers?.["x-invoke-path"] ||
      req.headers?.["x-matched-path"] ||
      req.headers?.["x-real-url"] ||
      req.headers?.["x-original-url"] ||
      req.url;

    if (originalUrl && typeof originalUrl === "string") {
      req.url = originalUrl;
    }

    // Ensure API routes start with /api
    if (req.url && !req.url.startsWith("/api/") && req.url !== "/api") {
      req.url = "/api" + (req.url.startsWith("/") ? req.url : "/" + req.url);
    }

    // Parse JSON body if needed
    if (typeof req.body === "string" && req.body.trim()) {
      try {
        req.body = JSON.parse(req.body);
      } catch {
        console.log("Body is not valid JSON");
      }
    }

    // Run Express app
    return app(req, res);

  } catch (error: any) {
    console.error("Vercel Function Error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        error: error?.message || "Server error occurred",
      });
    }
  }
}