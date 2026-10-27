import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    // Every signed-in page waits for the sign-in check on purpose, so only validate
    // pages for "instant navigation" if they opt in with `export const instant`.
    instantInsights: { validationLevel: "manual-warning" },
  },
};

export default nextConfig;
