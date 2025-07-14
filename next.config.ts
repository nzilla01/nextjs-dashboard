import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      loaders: {}, // empty object disables turbo features safely
    },
  },
};

export default nextConfig;
