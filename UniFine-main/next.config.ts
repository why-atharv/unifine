import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Removed output: "standalone" — Netlify uses its own serverless adapter */
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: false,
  // don't write AGENTS.md / CLAUDE.md into the repo on every `next dev`
  agentRules: false,
};

export default nextConfig;
