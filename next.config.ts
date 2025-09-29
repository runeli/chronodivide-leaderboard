import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // skipTrailingSlashRedirect: true,

  // Add caching headers to reduce function invocations
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, stale-while-revalidate=600",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, stale-while-revalidate=300",
          },
        ],
      },
    ];
  },

  // Enable experimental features for better caching
  experimental: {
    optimizePackageImports: ["@mui/material", "@mui/icons-material"],
  },
};

export default nextConfig;
