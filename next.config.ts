import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  output: 'export',
  trailingSlash: true,
  ...(isProd && isGithubPages && {
    basePath: '/identus-ofa',
    assetPrefix: '/identus-ofa',
  }),
  images: {
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    // Configure externals - dependencies that should not be bundled
    config.externals = [
      ...(config.externals || ['rxjs']),
    ];

    // Enable top-level await
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true
    };

    return config;
  },
};

export default nextConfig;
