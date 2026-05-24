/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export — writes to out/ on `next build`
  output: "export",
  // GitHub Pages serves from /Portfolio (repo name); prefix all asset paths
  basePath: "/Portfolio",
  // Image optimisation requires a server, disable for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
