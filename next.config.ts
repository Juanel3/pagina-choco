import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: "/**" },
      { pathname: "/_next/static/media/**" },
    ],
  },
};

export default nextConfig;
