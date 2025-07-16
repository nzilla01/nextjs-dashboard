import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      loaders: {}, // empty object disables turbo features safely
    },
    ppr: 'incremental'
  },
};

export default nextConfig;
