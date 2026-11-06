# Grade 7 Science: Exam Review (project handoff)

Read this first. It says what this project is, what already exists, the decisions already made, and how to keep
building in the same style. For the details of writing a lesson, read `lessons/LESSON-GUIDE.md`.

## What this is
A revision website for one Grade 7 student (Cambridge curriculum) preparing for a Science exam. It is built from the
school's review worksheet: **"Class 7 Cambridge Worksheet Midterm 2026"** (Pakistan English School Kuwait, Class 7 C/D),
which covers **Unit 4 Grouping & identifying organisms, Unit 5 Properties of materials, Unit 9 Electricity**.
The original PDF is at `~/Downloads/Class 7 Cambridge Worksheet Midterm 2026.pdf` (23 pages; several pages are images
only). Every worksheet question and its answer-key answer is transcribed in `source/worksheet-by-lesson.md`.

- **Live site:** https://exfusion3d.github.io/Grade-7/
- **Repo:** https://github.com/Exfusion3d/Grade-7 (public, branch `main`, GitHub account `Exfusion3d`)
- **Main device:** the student's **iPhone** (Safari, often added to the Home Screen). Also used on Mac.
- The parent (the user) directs the work. Before building anything bigger, they like to see a plan first and approve it.

## What exists
| Path | What it is |
|---|---|
| `index.html` | Home page: 14 lessons grouped by unit (the `UNITS` array in its script), a progress bar and ✅ per finished lesson, plus links to the quiz and the study guide |
| `adventure.html` | **Lesson 5, Periodic Table Adventure**: the approved pilot and the style reference for all lessons. A standalone file (it does not use the shared engine) |
| `lessons/l01`–`l04`, `l06`–`l14-*.html` | 13 lessons on the shared engine, each with about 9 animated, narrated scenes |
| `lessons/engine.js`, `lessons/engine.css` | Shared lesson engine: page layout, Professor Atom narration and voice, animation helpers, exam check, sort game, navigation, progress saving |
| `lessons/LESSON-GUIDE.md`, `lessons/_template.html` | How to write a lesson (API, layout, tone, testing) and a minimal working example |
| `quiz.html` | **Science Quest**: 111 interactive questions in 4 levels (Unit 4, Unit 5, Unit 9, and a 25-question mixed "Final Boss"), 10 question types, points, streaks, stars and "practise my mistakes" |
| `study-guide.pdf` | 16-page printable study guide with a one-page cheat sheet. Printed from `source/study-guide-source.html` |
| `source/worksheet-by-lesson.md` | Every worksheet question grouped by the lesson that teaches it (the coverage map) |
| `tools/test/` | Headless-Chrome scene tester (`runall.py`, `cdp.py`, `fastpatch.html`) |
| `.github/workflows/pages.yml` | Publishes the site on every push to `main` |
| `icon-180.png` | Home-screen icon (Professor Atom) |

### The 14 lessons (worksheet coverage)
Unit 4: 1 Life processes (MRS GREN, plants vs animals) · 2 Viruses · 3 Species & classification · 4 Dichotomous keys.
Unit 5: 5 Metals & non-metals (`adventure.html`) · 6 Choosing materials (hardness, strength, density, transparency,
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
  "stamp" showing the exam answer), at least one hands-on activity, an **Exam check** using the worksheet's real
  questions word for word, and a recap scene with badges and confetti. Finishing the last scene marks the lesson ✅.
- **Look:** a fixed 960×520 stage scaled to fit the screen; purple/blue gradients; colours: purple #6a45d8, blue #2c66cf,
  green #18a058, orange #e06a1b, metal orange #f7ad5f, non-metal blue #5d9cf5, yellow #ffd84d, ink #1f2433. Emoji,
  CSS shapes and inline SVG only (no images, no external libraries or fonts). Designed for landscape; on a phone held
  upright, a "turn your phone sideways" screen appears with a "keep it upright anyway" option.
- **Language:** written for a 12-year-old: short spoken sentences, **British spelling** (colour, aluminium, sulfur), and
  memory tricks ("MRS GREN", "I Should Never Cry" for magnetic metals, "AMmeter measures AMps").
- **Accuracy:** the worksheet's answer key is the authority for exam answers. Where the key simplifies, teach the key's
  answer and add a gentle note. Notes already added: steel is an alloy, not a pure metal (the key lists it as a metal);
  ligers are treated as infertile (in reality, females occasionally are not).
- **No personal data:** the site is public. Progress and settings are stored only in the browser's localStorage:
  `g7_done_l01`…`g7_done_l14`, `pta_voice`, `pta_vname`, `pta_rate`, `pta_sound`, and `sq_*` (quiz).

## How to continue
- **New lesson:** copy `lessons/_template.html`, follow `lessons/LESSON-GUIDE.md`, give it the next id (`l15`…), and add
  it to the `UNITS` array in `index.html`. Lessons are independent files, so several can be built in parallel.
- **Engine change:** `lessons/engine.js` is shared by 13 lessons. After changing it, re-run the tester on **all** lessons.
- **Test before publishing:** run `.venv/bin/python tools/test/runall.py`. One-time setup:
  `python3 -m venv .venv && .venv/bin/pip install websocket-client`. All scenes must pass. Look at the screenshots
  in `tools/test/shots/`. The tester mutes all sound.
- **Publish:** commit and push to `main`. The Actions workflow deploys in about 1–2 minutes. If a deploy hangs, GitHub
  may be stuck on an old Pages deployment: cancel it with
  `gh api -X POST repos/Exfusion3d/Grade-7/pages/deployments/<sha>/cancel`, then re-run the workflow.
- **Rebuild the study guide PDF** after editing `source/study-guide-source.html` (command in `README.md`).

## Known gaps and ideas (not done yet)
- Not yet tested on a real iPhone or iPad. Lesson 13 uses CSS `offset-path`, which needs Safari 16 or newer.
- `adventure.html` (Lesson 5) still has its own copy of the engine code. It could be moved onto `lessons/engine.js`.
- Engine ideas from building the lessons:
  - an `img` field for `ask`/`reveal` (pictures in exam questions);
  - a shared `stamp()` helper;
  - shared circuit and meter drawing helpers (Lessons 11–14 each carry their own copy);
  - letting `pop()` stop holding opacity after it finishes.
- The quiz and the lessons are separate. The quiz could link each question back to its lesson.
- Small inconsistency: the circuit lessons use different example current values (L11: 0.2 A per cell; L12: 0.6 A
  divided by the number of lamps; L13 and the quiz: 0.5 A × cells ÷ lamps). Each lesson is self-consistent.
