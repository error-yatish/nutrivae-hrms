import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@nutrivae/shared": path.resolve(__dirname, "../../packages/shared/src/index.ts"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@common": path.resolve(__dirname, "./src/common"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@modules": path.resolve(__dirname, "./src/modules"),
      "@pages": path.resolve(__dirname, "./src/pages")
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          query: ["@tanstack/react-query"],
          charts: ["recharts"]
        }
      }
    }
  }
});
