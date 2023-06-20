import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.cachedFixedWindow(1, "10s"),
  ephemeralCache: new Map(),
  analytics: false,
});

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent
): Promise<Response | undefined> {
  const ip = request.ip ?? "127.0.0.1";

  const { success, pending, limit, reset, remaining } = await ratelimit.limit(
    `ratelimit_middleware_${ip}`
  );
  event.waitUntil(pending);

  const res = success
    ? NextResponse.next()
    : new NextResponse("Too many requests", { status: 429 });

  res.headers.set("X-RateLimit-Limit", limit.toString());
  res.headers.set("X-RateLimit-Remaining", remaining.toString());
  res.headers.set("X-RateLimit-Reset", reset.toString());
  return res;
}

export const config = {
  matcher: "/completion",
};