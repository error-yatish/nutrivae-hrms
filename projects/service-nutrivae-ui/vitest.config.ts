import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
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
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true
  }
});
