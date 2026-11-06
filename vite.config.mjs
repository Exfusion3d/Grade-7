import { cpSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { defineConfig } from "vite";

const root = import.meta.dirname;
// Every page in these folders is built automatically, so new lessons deploy
// without a config change. Names starting with _ are skipped.
const pages = (dir) =>
  readdirSync(join(root, dir))
    .filter((name) => name.endsWith(".html") && !name.startsWith("_"))
    .map((name) => resolve(root, dir, name));
// Vite doesn't pick these up: engine.js is a classic script and the PDF is a
// plain link, so they are copied into dist as they are.
const copied = ["lessons/engine.js", "study-guide.pdf", "source"];

export default defineConfig({
  root,
  base: "./",
  server: {
    host: true,
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
    allowedHosts: true,
  },
  build: { rollupOptions: { input: [...pages("."), ...pages("lessons")] } },
  plugins: [
    {
      name: "copy-unbundled-files",
      closeBundle() {
        for (const file of copied) {
          const target = join(root, "dist", file);
          mkdirSync(dirname(target), { recursive: true });
          cpSync(join(root, file), target, { recursive: true });
        }
      },
    },
  ],
});
