/** @type {import('next').NextConfig} */

// Base path for GitHub Pages project sites (e.g. "/m-g-bryllup").
// Set by the GitHub Actions workflow from the Pages "base_path" output.
// Empty for local dev and for custom-domain deploys.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',          // static HTML export to ./out
  trailingSlash: true,       // play nice with GitHub Pages directory routing
  images: { unoptimized: true },
  basePath,
};

export default nextConfig;
