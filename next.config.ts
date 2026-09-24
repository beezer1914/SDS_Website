import type { NextConfig } from "next";

// Static export: the whole site is plain HTML on Netlify's CDN.
// Content changes (Sanity publish, ChapterOps event updates) trigger a Netlify rebuild.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // matches the old WordPress URLs (/history/, /the-founders/)
  images: { unoptimized: true },
};

export default nextConfig;
