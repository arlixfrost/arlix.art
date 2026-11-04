import type { NextConfig } from "next";
// Static export, published on GitHub Pages (see .github/workflows/pages.yml).
const nextConfig: NextConfig = { output: "export", trailingSlash: true, images: { unoptimized: true } };
export default nextConfig;
