import { configDefaults, coverageConfigDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "happy-dom", // jsdom ki jagah ye fast hai
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    clearMocks: true,
    exclude: [...configDefaults.exclude, ".next", "src/test/**/*"],
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [...coverageConfigDefaults.exclude, "src/**/index.ts"],
    },
  },
});
