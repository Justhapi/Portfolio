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
};

export default nextConfig;
