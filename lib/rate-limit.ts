// Simple in-memory rate limiting without Redis
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = {
  async limit(ip: string) {
    const now = Date.now();
    const windowMs = 3600 * 1000; // 1 hour
    const maxRequests = 5;

    const record = rateLimitStore.get(ip) || { count: 0, resetTime: now + windowMs };

    // Reset if time window passed
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
    }

    record.count++;
    rateLimitStore.set(ip, record);

    const success = record.count <= maxRequests;

    return {
      success,
      limit: maxRequests,
      reset: new Date(record.resetTime),
      remaining: Math.max(0, maxRequests - record.count),
    };
  }
};