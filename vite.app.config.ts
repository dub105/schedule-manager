import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Used for Capacitor (native app) builds — no base path, no PWA plugin
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
});
