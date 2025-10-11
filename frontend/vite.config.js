import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // default Vite port, change if needed
    proxy: {
      // Proxy all /api requests to Django backend
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  css: {
    postcss: "./postcss.config.js", // ensures TailwindCSS works
  },
});
