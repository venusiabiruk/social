import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      // Allow images from localhost:9000/videos
      // {
      //   protocol: "https",
      //   hostname: "a223539ccf6caa2d76459c9727d276e6.r2.cloudflarestorage.com", // your cloudflare storage domain
      //   pathname: "/**",
      // },
      {
        protocol: "http",
        hostname: "localhost", // local backend
        port: "9000",
        pathname: "/**",
      },
      // Allow images from Cloudflare R2
      {
        protocol: "https",
        hostname: "a223539ccf6caa2d76459c9727d276e6.r2.cloudflarestorage.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/schedule",
        destination: "http://localhost:8000/schedule",
      },
      {
        source: "/generate/:path*",
        destination: "http://localhost:8000/generate/:path*",
      },
      {
        source: "/render/:path*",
        destination: "http://localhost:8000/render/:path*",
      },
      {
        source: "/tasks/:path*",
        destination: "http://localhost:8000/tasks/:path*",
      },
      {
        source: "/export",
        destination: "http://localhost:8000/export",
      },
    ];
  },
};

export default nextConfig;
