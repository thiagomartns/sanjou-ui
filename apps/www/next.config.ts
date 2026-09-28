import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Linting runs from the repo root (`pnpm lint`), not inside `next build`.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
