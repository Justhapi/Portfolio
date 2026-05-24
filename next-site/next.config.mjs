/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export for GitHub Pages deployment
  output: "export",
  // Next.js image optimisation requires a server; disable for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
