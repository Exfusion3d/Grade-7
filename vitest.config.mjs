import { defineConfig } from "vitest/config";

// Tests for the Convex back end (convex/*.test.ts), run in-memory with convex-test.
export default defineConfig({
  test: {
    include: ["convex/**/*.test.ts"],
    environment: "edge-runtime",
    server: { deps: { inline: ["convex-test"] } },
  },
});
