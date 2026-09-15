import type { NextConfig } from "next";

// Server-only (not exposed to the browser) — where the Express API actually
// lives. In production this proxies /api/* through the frontend's own domain,
// so the browser only ever talks to one origin (no CORS, no cross-site cookies).
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` }];
  },
};

export default nextConfig;
