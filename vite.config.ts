/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages and most static hosts cannot send response headers, so the
// policy ships as a meta tag. Dev mode is skipped because HMR injects inline code.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "font-src 'self'",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ');

function contentSecurityPolicyPlugin(): Plugin {
  return {
    name: 'font-specimen:csp',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '<!-- csp -->',
        `<meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy}" />`,
      );
    },
  };
}

export default defineConfig({
  // Relative base keeps the build portable: hash routing means index.html is
  // always the document, so it works at a domain root or under /<repo>/.
  base: './',
  plugins: [react(), contentSecurityPolicyPlugin()],
  build: {
    target: 'es2022',
    // The entry includes the whole catalogue's metadata (home renders real
    // family names). 207 families sit above Vite's default 500 kB hint.
    chunkSizeWarningLimit: 700,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
