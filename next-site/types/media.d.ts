/**
 * Module declarations for media assets imported via ES modules.
 * Webpack's asset/resource loader (configured in next.config.mjs)
 * bundles these files and returns a URL string at build time.
 */
declare module "*.webm" {
  const src: string;
  export default src;
}
declare module "*.mp4" {
  const src: string;
  export default src;
}
