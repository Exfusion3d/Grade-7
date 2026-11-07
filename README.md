# Grade 7 Science: Exam Review

Revision site for the Grade 7 Cambridge Science review worksheet (Units 4, 5 and 9), hosted by Cortex.

**Live site:** https://tutor.gocortex.app

| Page | What it is |
|---|---|
| `index.html` | Home page: all lessons by unit with progress ticks, plus the quiz and study guide |
| `lessons/l01`–`l14-*.html` | Lessons 1–14: animated scenes with the spoken tutor, Professor Atom (Lesson 5, the Periodic Table Adventure, was the original pilot) |
| `adventure.html` | Redirect to Lesson 5's old address |
| `lessons/engine.js`, `engine.css` | Shared lesson engine: narration and voice, animations, exam checks, sort games |
| `lessons/LESSON-GUIDE.md`, `_template.html` | How to write a new lesson |
| `quiz.html` | Science Quest: 111 interactive questions across Units 4, 5 and 9 |
| `study-guide.pdf` | Printable study guide with explanations and a one-page cheat sheet |
| `source/worksheet-by-lesson.md` | Every worksheet question, grouped by the lesson that teaches it |
| `source/study-guide-source.html` | HTML source the PDF was printed from |

Everything is plain HTML, CSS and JavaScript. Vite builds it as a multi-page site (`bun run build` outputs to `dist/`; `bun run dev` serves it locally).
The tutor voice uses the device's built-in speech (Web Speech API).

## Updating the site

New pages in the root or `lessons/` are picked up automatically. Any new file that is only linked with a plain `<a>` tag or loaded from JavaScript must be added to the `copied` list in `vite.config.mjs`, or it won't be published.

Edit the files, commit, then create a release in Cortex with Deploy App on. Cortex runs `bun run build` and serves `dist/` at https://tutor.gocortex.app.

To rebuild the PDF after editing `source/study-guide-source.html`:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer --virtual-time-budget=5000 --print-to-pdf=study-guide.pdf "file://$PWD/source/study-guide-source.html"
```

The Maths guide (`maths-study-guide.pdf`) is printed the same way from `source/maths/study-guide-source.html`:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer --virtual-time-budget=5000 --print-to-pdf=maths-study-guide.pdf "file://$PWD/source/maths/study-guide-source.html"
```
