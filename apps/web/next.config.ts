import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Les packages du monorepo sont consommes directement depuis leur source TS.
  transpilePackages: ['@tacynt/shared', '@tacynt/config'],
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
