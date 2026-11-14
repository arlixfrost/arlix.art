import type { NextConfig } from "next";
import { execSync } from "child_process";
// Static export, published on GitHub Pages (see .github/workflows/pages.yml).
// BUILD: the commit this build comes from; the page compares it with /version.txt to pick up a fresh version at once.
const build = process.env.GITHUB_SHA || (() => { try { return execSync("git rev-parse HEAD").toString().trim(); } catch { return "dev"; } })();
const nextConfig: NextConfig = { output: "export", trailingSlash: true, images: { unoptimized: true }, env: { NEXT_PUBLIC_BUILD: build } };
export default nextConfig;
