import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Core libs rarely change -> their own long-cached chunk.
        // Heavy libs (recharts, framer-motion, ...) stay with the lazy routes that use them.
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom)\//.test(id)) {
            return "react-vendor";
          }
          return undefined;
        },
      },
    },
  },
});
