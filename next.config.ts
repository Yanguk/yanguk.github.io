import type { NextConfig } from "next";
import path from "node:path";

const markdownLoader = path.join(process.cwd(), "scripts/raw-md-loader.cjs");

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  output: "export",
  turbopack: {
    rules: {
      "*.md": {
        loaders: [markdownLoader],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.md$/,
      use: markdownLoader,
    });

    return config;
  },
};

export default nextConfig;
