import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kenaz-ip.s3.ap-northeast-2.amazonaws.com",
        pathname: "**",
      },
    ],
    unoptimized: true,
  },
  experimental: {
    scrollRestoration: true,
    webpackMemoryOptimizations: true
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

module.exports = withNextIntl(nextConfig);
