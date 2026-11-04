import type { NextConfig } from "next";
// Static export so the wireframe can be hosted on Cloudflare Pages as a throwaway preview.
const nextConfig: NextConfig = { output: "export", trailingSlash: true, images: { unoptimized: true } };
export default nextConfig;
