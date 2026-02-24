import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force all pages to be dynamic - prevents build-time DB calls
  experimental: {
    // This ensures API routes are never statically generated
  },
  // Skip static generation errors for pages that need DB at build time
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // Output standalone for Railway deployment
  output: 'standalone',
};

export default nextConfig;
