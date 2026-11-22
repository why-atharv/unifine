import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Removed output: "standalone" — Vercel handles this automatically */
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: false,
  // don't write AGENTS.md / CLAUDE.md into the repo on every `next dev`
  agentRules: false,
};

export default nextConfig;
