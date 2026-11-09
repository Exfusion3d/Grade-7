import { cpSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { defineConfig } from "vite";

const root = import.meta.dirname;
// Every page in these folders is built automatically, so new lessons deploy
// without a config change. Names starting with _ (templates) or . (tester temp files) are skipped.
const pages = (dir) =>
  readdirSync(join(root, dir))
    .filter((name) => name.endsWith(".html") && !/^[_.]/.test(name))
    .map((name) => resolve(root, dir, name));
// Vite doesn't pick these up: gate.js, subjects.js, engine.js, maths.js, french.js and islamic.js are classic scripts and the PDF is a
// plain link, so they are copied into dist as they are.
const copied = ["gate.js", "subjects.js", "lessons/engine.js", "maths/maths.js", "french/french.js", "islamic/islamic.js", "study-guide.pdf", "maths-study-guide.pdf", "french-study-guide.pdf", "islamic-study-guide.pdf", "source"];

export default defineConfig({
  root,
  base: "./",
  server: {
    host: true,
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
    allowedHosts: true,
  },
  build: { rollupOptions: { input: [...pages("."), ...pages("lessons"), ...pages("maths"), ...pages("french"), ...pages("islamic")] } },
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
