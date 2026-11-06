# Grade 7 Science: Exam Review (project handoff)

Read this first. It says what this project is, what already exists, the decisions already made, and how to keep
building in the same style. For the details of writing a lesson, read `lessons/LESSON-GUIDE.md`.

## What this is
A revision website for one Grade 7 student (Cambridge curriculum) preparing for a Science exam. It is built from the
school's review worksheet: **"Class 7 Cambridge Worksheet Midterm 2026"** (Pakistan English School Kuwait, Class 7 C/D),
which covers **Unit 4 Grouping & identifying organisms, Unit 5 Properties of materials, Unit 9 Electricity**.
The original PDF is at `~/Downloads/Class 7 Cambridge Worksheet Midterm 2026.pdf` (23 pages; several pages are images
only). Every worksheet question and its answer-key answer is transcribed in `source/worksheet-by-lesson.md`.

- **Live site:** https://tutor.gocortex.app (Cortex hosting, the production deployment). The old GitHub Pages site
  (exfusion3d.github.io/Grade-7) is no longer used or updated.
- **Repo:** https://github.com/Exfusion3d/Grade-7 (public, branch `main`, GitHub account `Exfusion3d`)
- **Main device:** the student's **iPhone** (Safari, often added to the Home Screen). Also used on Mac.
- The parent (the user) directs the work. Before building anything bigger, they like to see a plan first and approve it.

## What exists
| Path | What it is |
|---|---|
| `index.html` | Home page: "Hi, nickname" and Sign out, **Lessons to revise** (lessons with questions whose latest answer was wrong, from `progress:myOverview`; decided: quiz questions and lesson Exam check questions count separately, so each is cleared only where it was missed), 14 lessons grouped by unit (the `UNITS` array in its script) with ✅ per finished lesson and "continue at scene N", a progress bar, best quiz stars, plus links to the quiz and the study guide. All per student: it no longer reads the device-wide `g7_done_*` keys |
| `lessons/l01`–`l14-*.html` | All 14 lessons on the shared engine, each with about 9 animated, narrated scenes. Lesson 5 (`l05-metals-nonmetals.html`, 14 scenes) is the approved pilot and the style reference for all lessons |
| `adventure.html` | Redirect to Lesson 5 (its old address), so old links and Home Screen bookmarks keep working |
| `lessons/engine.js`, `lessons/engine.css` | Shared lesson engine: page layout, Professor Atom narration and voice, animation helpers, exam check, sort game, navigation, progress saving |
| `lessons/LESSON-GUIDE.md`, `lessons/_template.html` | How to write a lesson (API, layout, tone, testing) and a minimal working example |
| `quiz.html` | **Science Quest**: 111 interactive questions in 4 levels (Unit 4, Unit 5, Unit 9, and a 25-question mixed "Final Boss"), 10 question types, points, streaks, stars and "practise my mistakes". Each question has `l:` (the lesson that teaches it); the results screen lists "Lessons to revise" from the mistakes |
| `study-guide.pdf` | 16-page printable study guide with a one-page cheat sheet. Printed from `source/study-guide-source.html` |
| `source/worksheet-by-lesson.md` | Every worksheet question grouped by the lesson that teaches it (the coverage map) |
| `convex/` | **Student accounts (in progress, stages 1–5 of 6 done):** Convex back end with parent-created username/password logins, hashed passwords and session tokens. See `convex/README.md`. Tests: `bun run test`. Preview pushes it to the Development database; releases deploy it to Production |
| `admin.html` | **Parent/teacher page** (parent login only; the home page shows a "👪 Parent page" button to the parent): a card per student (last active, lessons finished, quiz stars, lessons to revise), details (all lessons, quiz results, questions to fix with their wording), add a student, reset a password, remove a student. Uses `convex/parent.ts` |
| `login.html`, `gate.js`, `src/account.js` | Sign-in page and login gate. Every page loads `gate.js` and `src/account.js` (tagged `data-account`) at the top of `<head>`; signed-out visitors go to `login.html?next=…`. The session token is in localStorage (`g7_token`, cached user `g7_me`). The scene tester strips the `data-account` lines so lessons run without an account. New pages need the same two tags |
| `tools/test/` | Headless-Chrome scene tester (`runall.py`, `cdp.py`, `fastpatch.html`) |
| `icon-180.png` | Home-screen icon (Professor Atom) |
| `package.json`, `vite.config.mjs`, `bun.lock` | Vite multi-page build: `bun run dev` previews the site; `bun run build` outputs it to `dist/` (git-ignored), which is what Cortex deploys to tutor.gocortex.app. New pages in the root or `lessons/` are picked up automatically; files only linked with `<a>` or loaded from JS go in the `copied` list in `vite.config.mjs` |

### The 14 lessons (worksheet coverage)
Unit 4: 1 Life processes (MRS GREN, plants vs animals) · 2 Viruses · 3 Species & classification · 4 Dichotomous keys.
Unit 5: 5 Metals & non-metals (Periodic Table Adventure) · 6 Choosing materials (hardness, strength, density, transparency,
insulators) · 7 Alloys & rusting (carats) · 8 Particles & heat (expansion, boiling and condensing) · 9 Acids, alkalis & pH
(litmus, Chen's chart) · 10 Hazard symbols & lab safety.
Unit 9: 11 Current & components (symbols) · 12 Measuring current (ammeter, reading a meter) · 13 Series circuits ·
14 Conductors & insulators.
Every worksheet question is taught in at least one lesson and asked in that lesson's "Exam check" scene.

## The style to keep (decided and approved)
- **Professor Atom**, a smiling yellow atom mascot, narrates every line. The text appears in a speech bubble and is
  **spoken aloud** with the device's built-in voice (Web Speech API). Scenes wait for the voice to finish. Controls:
  voice on/off, voice picker (prefers a British voice), speed, and tap the bubble to hear it again. Sound effects have a
  separate 🔊 toggle.
- **Lesson shape:** a Start screen, then about 9 scenes: a hook, teaching scenes (each with its own animation and an on-screen
  worksheet card (`wsCard`) showing the worksheet question word for word with its answer stamped underneath), at least one hands-on activity, an **Exam check** using the worksheet's real
  questions word for word, and a recap scene with badges and confetti. Finishing the last scene marks the lesson ✅.
- **Look:** a fixed 960×520 stage scaled to fit the screen; purple/blue gradients; colours: purple #6a45d8, blue #2c66cf,
  green #18a058, orange #e06a1b, metal orange #f7ad5f, non-metal blue #5d9cf5, yellow #ffd84d, ink #1f2433. Emoji,
  CSS shapes and inline SVG only (no images, no external libraries or fonts). Designed for landscape; on a phone held
  upright, a "turn your phone sideways" screen appears with a "keep it upright anyway" option.
  **Every landscape screen** (phones held sideways, iPad, Mac, Windows) uses the **side-panel layout** (approved): the stage fills the
  height and Professor Atom, his words and the buttons sit in a 300 px panel on the right; voice settings are behind ⚙️.
  Portrait screens (e.g. an upright iPad) keep the stacked layout: header, speech bubble, stage, footer.
  Lesson stages are unchanged (still 960×520); it is all in `fit()` in `engine.js` and the `body.side` rules in `engine.css`.
- **Language:** written for a 12-year-old: short spoken sentences, **British spelling** (colour, aluminium, sulfur), and
  memory tricks ("MRS GREN", "I Should Never Cry" for magnetic metals, "AMmeter measures AMps").
- **Accuracy:** the worksheet's answer key is the authority for exam answers. Where the key simplifies, teach the key's
  answer and add a gentle note. Notes already added: steel is an alloy, not a pure metal (the key lists it as a metal);
  ligers are treated as infertile (in reality, females occasionally are not).
- **Minimal personal data:** every page needs a login that the parent creates (username + password, no email). Only a
  username and nickname are stored per student, in Convex. Progress and settings are still in the browser's localStorage
  (`g7_done_l01`…`g7_done_l14`, `pta_*`, `sq_*`); progress is also saved to the student's account: lesson scenes and
  completion and Exam check answers from `engine.js`, quiz answers and level results from `quiz.html`, via `track()` →
  `window.__track` → `Account.track` (an offline-safe queue in localStorage, `g7_queue_<username>`). Quiz questions have
  permanent ids (`u4-01`…): never renumber them; add new questions at the end of their unit.
  **Resuming:** a lesson's start screen offers "Continue at scene N" (and the Exam check question reached) or "Start
  from the beginning"; the quiz menu lists unfinished levels under "Continue where you left off". Resume points are
  cached in `g7_resume_<username>` and merged with Convex (`progress:resumeInfo`), so they follow the student between devices.

## How to continue
- **New lesson:** copy `lessons/_template.html`, follow `lessons/LESSON-GUIDE.md`, give it the next id (`l15`…), and add
  it to the `UNITS` array in `index.html`. Lessons are independent files, so several can be built in parallel.
- **Engine change:** `lessons/engine.js` is shared by all 14 lessons. After changing it, re-run the tester on **all** lessons.
- **Test before publishing:** run `.venv/bin/python tools/test/runall.py`. One-time setup:
  `python3 -m venv .venv && .venv/bin/pip install websocket-client`. All scenes must pass. Look at the screenshots
  in `tools/test/shots/`. The tester mutes all sound.
- **Publish:** commit (and push to `main`), then create a Cortex release with Deploy App on. Cortex builds `dist/` and
  deploys it to https://tutor.gocortex.app after the user confirms. Note that unknown paths there return the home page,
  not a 404, so check a new page's title (not just the status code) when confirming a deploy.
- **Rebuild the study guide PDF** after editing `source/study-guide-source.html` (command in `README.md`).

## Known gaps and ideas (not done yet)
- Not yet tested on a real iPhone or iPad. Lesson 13 uses CSS `offset-path`, which needs Safari 16 or newer.
- Engine ideas from building the lessons:
  - an `img` field for `ask`/`reveal` (pictures in exam questions);
  - shared circuit and meter drawing helpers (Lessons 11–14 each carry their own copy);
  - letting `pop()` stop holding opacity after it finishes.
- Small inconsistency: the circuit lessons use different example current values (L11: 0.2 A per cell; L12: 0.6 A
  divided by the number of lamps; L13 and the quiz: 0.5 A × cells ÷ lamps). Each lesson is self-consistent.
