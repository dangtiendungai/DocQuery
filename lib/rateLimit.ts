import { NextRequest } from "next/server";

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (for production, use Redis or similar)
const store: RateLimitStore = {};

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000); // Clean up every minute

export function rateLimit(config: RateLimitConfig) {
  return async (request: NextRequest, identifier: string) => {
    const now = Date.now();
    const key = identifier;
    const entry = store[key];

    if (!entry || entry.resetTime < now) {
      // Create new entry or reset expired entry
      store[key] = {
        count: 1,
        resetTime: now + config.windowMs,
      };
      return { success: true, remaining: config.maxRequests - 1 };
    }

    if (entry.count >= config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      return {
        success: false,
        remaining: 0,
        retryAfter,
        message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
      };
    }

    entry.count += 1;
    return {
      success: true,
      remaining: config.maxRequests - entry.count,
    };
  };
}

// Get user identifier from request
export function getUserIdentifier(request: NextRequest): string {
  // Try to get user ID from auth token
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    // For now, use IP as fallback, but ideally extract user ID from token
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    return `user:${ip}`;
  }

  // Fallback to IP address
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  return `ip:${ip}`;
}

// Predefined rate limiters
export const rateLimiters = {
  // Upload: 10 uploads per hour
  upload: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
  }),

  // Query: 100 queries per hour
  query: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 100,
  }),

  // General API: 200 requests per hour
  api: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 200,
  }),

  // Auth: 10 attempts per 15 minutes
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10,
  }),
};
