import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// The public website lives in the repo root; the dashboard reuses its
// Firebase config and logo from there instead of keeping copies.
const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@site': siteRoot },
  },
  server: {
    // Listen on IPv4 so both http://localhost:5173 and http://127.0.0.1:5173 work
    // (by default Node may bind only the IPv6 ::1 address on Windows)
    host: '127.0.0.1',
    port: 5173,
    fs: { allow: [siteRoot] },
  },
  build: {
    // The Firestore SDK alone is ~580 kB; it's lazy-loaded after sign-in, so that's fine
    chunkSizeWarningLimit: 700,
  },
})
