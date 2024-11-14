import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://full-stack-open-part3-hut6.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
