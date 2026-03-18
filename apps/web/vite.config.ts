import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          motion: ["framer-motion"],
          icons: ["lucide-react"],
          state: ["zustand"],
        },
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.ts"],

    // ⏱️ Timeouts — prevents hanging tests from freezing CI
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 5000,

    // 🧠 Isolation & concurrency
    isolate: true,
    maxConcurrency: 5,

    // 🧹 Auto-cleanup mocks between every test (no leakage)
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,

    // 🔍 Observability
    logHeapUsage: true,

    // 🧪 Test file discovery
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    exclude: ["node_modules", "tests/e2e/**"],

    // 📊 Coverage (only applied with --coverage flag)
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/",
        "src/tests/",
        "src/types/",
        "tests/e2e/",
        "*.config.ts",
        "dist/",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
});
