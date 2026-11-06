// Copies the plain-HTML site into dist/ for static hosting.
const fs = require("fs");
const path = require("path");

const out = path.join(__dirname, "dist");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);

const include = ["index.html", "adventure.html", "quiz.html", "study-guide.pdf", "icon-180.png", ".nojekyll", "lessons", "source"];
for (const name of include) {
  fs.cpSync(path.join(__dirname, name), path.join(out, name), { recursive: true });
}
console.log("Built site into dist/");
