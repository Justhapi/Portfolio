/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  // Static export — writes to out/ on `next build`
  output: "export",
  // GitHub Pages serves from /Portfolio (repo name); prefix all asset paths.
  // Only apply in production so local dev works at localhost:3000
  basePath: isProd ? "/Portfolio" : "",
  // Image optimisation requires a server, disable for static export
  images: {
    unoptimized: true,
  },
  // Bundle video files (webm/mp4) as static assets so case-study pages
  // can ES-import them alongside their co-located image files. Without
  // this, `import cover from './Cover.webm'` fails at build. Uses
  // Webpack's asset/resource loader (default hashed filename output
  // under /_next/static/media/).
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(webm|mp4)$/i,
      type: "asset/resource",
    });
    return config;
  },
};

export default nextConfig;
