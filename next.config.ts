import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Keep desktop candidates and offer smaller sources for mobile layouts.
    deviceSizes: [320, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [32, 48, 64, 96, 128, 256],
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
};

export default nextConfig;
