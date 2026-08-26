/** @type {import('next').NextConfig} */

/**
 * CRITICAL: This project is deployed as a static HTML export.
 * It runs on a shared server alongside a decoupled Laravel REST API.
 *
 * Rules enforced by this config:
 * - output: 'export'   → generates the /out directory of static HTML/JS/CSS
 * - No SSR             → all data fetching is client-side via services/api.js
 * - No API routes      → all API endpoints live on the Laravel backend
 * - images.unoptimized → required because Next.js Image Optimization needs a Node server
 */
const nextConfig = {
  allowedDevOrigins: ['192.168.56.1'],
};

module.exports = nextConfig;
