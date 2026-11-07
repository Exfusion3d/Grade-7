# Grade 7: Exam Review (project handoff)

Read this first. It says what this project is, what already exists, the decisions already made, and how to keep
building in the same style. For the details of writing a lesson, read `lessons/LESSON-GUIDE.md`.

## What this is
A revision website for one Grade 7 student (Cambridge curriculum), organised by **subject**: **Science** (complete) and
**Maths** (being built), with French, KSS, Arabic and Islamic Studies planned ("coming soon" cards). Each subject is built
from the school's own review worksheet, the same way. Science is built from the
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
| `index.html` | **Home page**: "Hi, nickname", Parent page button and Sign out, an overall progress bar, **Lessons to revise** across all subjects (each with a subject label; decided: quiz questions and lesson Exam check questions count separately), and a **card per subject** (finished lessons, progress bar; planned subjects show "Coming soon"). Also the iPhone tips and the voice help (`#voice-help`, linked from every lesson). Once per device, the first student to sign in is offered to import Science lessons ticked before logins existed (old `g7_done_*` keys; remembered in `g7_legacy_done`) |
| `subjects.js` | **The subject catalogue** (classic script, loaded by the home, subject and parent pages): every subject with its units/chapters and lessons `[id, href, emoji, title]` (href null = planned, shown as "coming soon"), quiz and study-guide cards, plus the shared page renderers (`renderHome`, `renderSubject`, `renderRevise`). Lesson ids are one letter per subject + two digits: `l` = Science, `m` = Maths |
| `science.html`, `maths.html`, `site.css` | Subject pages (lessons by unit or chapter with ✅ and "continue at scene N", progress bar, that subject's Lessons to revise, quiz and study guide cards), all drawn from `subjects.js`. `site.css` is shared by the home and subject pages |
| `lessons/l01`–`l14-*.html` | All 14 **Science** lessons on the shared engine, each with about 9 animated, narrated scenes. Lesson 5 (`l05-metals-nonmetals.html`, 14 scenes) is the approved pilot and the style reference for all lessons |
| `adventure.html` | Redirect to Lesson 5 (its old address), so old links and Home Screen bookmarks keep working |
| `lessons/engine.js`, `lessons/engine.css` | Shared lesson engine for **every subject** (a lesson passes `subject`, `home`, `part`, `guide` and `mascot` to `Lesson.start`; Science lessons leave them out and get Professor Atom): page layout, Professor Atom narration and voice, animation helpers, exam check, sort game, navigation, progress saving |
| `lessons/LESSON-GUIDE.md`, `lessons/_template.html` | How to write a lesson (API, layout, tone, testing) and a minimal working example |
| `maths/` | **Maths lessons** (`m01-writing-expressions.html` …) and `maths.js` (Pi the Robot, the Maths tutor; `frac()` fractions; `buildExpr()` "tap the tiles to build the expression" activity). Maths lessons load `../lessons/engine.js` then `maths.js` and start with `Object.assign({}, MATHS, {...})` |
| `source/maths/worksheet-transcript.md` | The Maths 2nd Term worksheet (34 handwritten pages, Chapters 2, 4, 6, 9, 10) transcribed word for word. `[CHECK]` marks the sheet's wrong worked answers, `[?]` hard-to-read spots |
| `quiz.html` | **Science Quest**: 111 interactive questions in 4 levels (Unit 4, Unit 5, Unit 9, and a 25-question mixed "Final Boss"), 10 question types, points, streaks, stars and "practise my mistakes". Each question has `l:` (the lesson that teaches it); the results screen lists "Lessons to revise" from the mistakes |
| `maths-quiz.html` | **Maths Quest** (Pi, orange; silent like Science Quest): a level per chapter (`c2`, `c4`, `c6`, `c9`, `c10`) plus a 25-question Final Boss (`mboss`, mixed; opens when every level has questions) and `mretry` (practise mistakes). **All built: 112 questions (Ch 2: 30, Ch 4: 25, Ch 6: 12, Ch 9: 25, Ch 10: 20).** About half worksheet questions, half the same kinds with new numbers. Types: typed answers on an on-screen keypad (checked by value, so `2n + m` = `m + 2n`; `simplest:true` nudges unsimplified answers; `mist` gives a message for a known wrong answer), pick one / quick fire (with `whyNot`), match, build it (tiles), number line (inequalities), put in order. Question ids `c2-01`… are permanent; keep `q:` on the same line as `id:` (the parent page reads the wording). Each quiz lists only its own unfinished levels. Test: `node tools/test/quizcheck.js` (offline answer check) and `tools/test/quizplay.py <level> <dir>` (headless play-through with screenshots) |
| `maths-study-guide.pdf` | 30-page Maths study guide: a section per lesson (big idea, method, every worksheet question worked out with the correct answers, Watch out / memory-trick boxes, 3 "Try these" questions), a one-page cheat sheet and an answer key. Printed from `source/maths/study-guide-source.html` (command in `README.md`) |
| `study-guide.pdf` | 16-page printable study guide with a one-page cheat sheet. Printed from `source/study-guide-source.html` |
| `source/worksheet-by-lesson.md` | Every worksheet question grouped by the lesson that teaches it (the coverage map) |
| `convex/` | **Student accounts (all 6 stages built; not live yet, see "Going live" below):** Convex back end with parent-created username/password logins, hashed passwords and session tokens. See `convex/README.md`. Tests: `bun run test`. Preview pushes it to the Development database; releases deploy it to Production |
| `admin.html` | **Parent/teacher page** (parent login only; the home page shows a "👪 Parent page" button to the parent): a card per student (last active, lessons finished, quiz stars, lessons to revise), details (all lessons, quiz results, questions to fix with their wording), add a student, reset a password, remove a student. Uses `convex/parent.ts` |
| `login.html`, `gate.js`, `src/account.js` | Sign-in page and login gate. Every page loads `gate.js` and `src/account.js` (tagged `data-account`) at the top of `<head>`; signed-out visitors go to `login.html?next=…`. The session token is in localStorage (`g7_token`, cached user `g7_me`). The scene tester strips the `data-account` lines so lessons run without an account. New pages need the same two tags |
| `tools/test/` | Headless-Chrome scene tester (`runall.py`, `cdp.py`, `fastpatch.html`) |
| `icon-180.png` | Home-screen icon (Professor Atom) |
| `package.json`, `vite.config.mjs`, `bun.lock` | Vite multi-page build: `bun run dev` previews the site; `bun run build` outputs it to `dist/` (git-ignored), which is what Cortex deploys to tutor.gocortex.app. New pages in the root or `lessons/` are picked up automatically; files only linked with `<a>` or loaded from JS go in the `copied` list in `vite.config.mjs` |

### Science: the 14 lessons (worksheet coverage)
Unit 4: 1 Life processes (MRS GREN, plants vs animals) · 2 Viruses · 3 Species & classification · 4 Dichotomous keys.
Unit 5: 5 Metals & non-metals (Periodic Table Adventure) · 6 Choosing materials (hardness, strength, density, transparency,
insulators) · 7 Alloys & rusting (carats) · 8 Particles & heat (expansion, boiling and condensing) · 9 Acids, alkalis & pH
(litmus, Chen's chart) · 10 Hazard symbols & lab safety.
Unit 9: 11 Current & components (symbols) · 12 Measuring current (ammeter, reading a meter) · 13 Series circuits ·
14 Conductors & insulators.
Every worksheet question is taught in at least one lesson and asked in that lesson's "Exam check" scene.

### Maths: 15 lessons (all built: `maths/m01`–`m15`)
Tutor: **Pi the Robot** 🤖 (orange). Ch 2 Expressions, formulae & equations: 1 Writing expressions (Ex 2.1) (rebuilt with the step-by-step `teachQ` pattern after the parent found the first version too fast; every Maths lesson uses it, see LESSON-GUIDE) ·
2 Substituting into expressions and formulae (Ex 2.2, Ch 9 Getting started Q4) · 3 Simplifying & like terms, algebra
pyramids (Ex 2.3) · 4 Expanding brackets (Ex 2.4) · 5 Solving equations (Ex 2.5) · 6 Inequalities (Ex 2.6).
Ch 4 Decimals: 7 Ordering & comparing (Ex 4.1) · 8 Mental methods (Ex 4.2, 4.3) · 9 Multiplying decimals (Ex 4.3 Q8, 4.5) ·
10 Dividing decimals & money problems (Ex 4.3 Q4–5, 4.4). Ch 6: 11 Types of data, questionnaires, mode, median & mean.
Ch 9: 12 Order of operations & negative numbers (Getting started Q1–3) · 13 Sequences & patterns (Ex 9.1, 9.2) ·
14 The nth term & function machines (Ex 9.3, 9.4). Ch 10: 15 Percentages, fractions & decimals (Ex 10.1, 10.2).
Lesson 10 teaches Ex 4.4 Q6 a) as 27.852 ÷ 12 = 2.321 (the sheet's 27.853 does not give its own answer). Maths Quest (`maths-quiz.html`) and the study guide (`maths-study-guide.pdf`) are built.
Worksheet cards cite the exercise: `Worksheet · Ex 2.1 · Q6 v)`. Exam check `src`/`q` must be literal strings (the
parent page reads them from the lesson file to show a missed question's wording).

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
  **Maths is different (decided):** about a dozen of the Maths sheet's worked answers are wrong (marked `[CHECK]` in the
  transcript). Lessons teach the **correct answer only and never mention that the sheet differs**; obvious typos in the
  question wording are fixed silently. BIDMAS is taught properly (× and ÷ equal, + and − equal, left to right).
- **Minimal personal data:** every page needs a login that the parent creates (username + password, no email). Only a
  username and nickname are stored per student, in Convex. Progress and settings are still in the browser's localStorage
  (`pta_*` voice and sound settings, `sq_*` quiz best scores, `g7_resume_*`/`g7_overview_*`/`g7_queue_*` per-user caches); progress is also saved to the student's account: lesson scenes and
  completion and Exam check answers from `engine.js`, quiz answers and level results from `quiz.html`, via `track()` →
  `window.__track` → `Account.track` (an offline-safe queue in localStorage, `g7_queue_<username>`). Quiz questions have
  permanent ids (`u4-01`…): never renumber them; add new questions at the end of their unit.
  **Resuming:** a lesson's start screen offers "Continue at scene N" (and the Exam check question reached) or "Start
  from the beginning"; the quiz menu lists unfinished levels under "Continue where you left off". Resume points are
  cached in `g7_resume_<username>` and merged with Convex (`progress:resumeInfo`), so they follow the student between devices.

## How to continue
- **New lesson:** copy `lessons/_template.html` (Science) or `maths/m01-writing-expressions.html` (Maths), follow
  `lessons/LESSON-GUIDE.md`, give it the next id of its subject, and set its `href` in `subjects.js` (that makes it live on
  the home, subject and parent pages). Lessons are independent files, so several can be built in parallel.
- **New subject:** transcribe its worksheet into `source/<subject>/`, get the parent's approval of a lesson plan, then add
  it to `subjects.js` (a new id letter, e.g. `f` French), make its page like `maths.html` (and a `.hero.<id>` colour in
  `site.css`), put its lessons in a folder of their own with a helper file like `maths/maths.js` (tutor, voice), add the
  folder to `pages()`/`copied` in `vite.config.mjs` and to `DIRS` in `tools/test/runall.py`. Arabic will need right-to-left
  layout and an Arabic voice; Qur'an verses should be shown as exact text and not read by the synthetic voice.
- **Engine change:** `lessons/engine.js` is shared by every lesson of every subject. After changing it, re-run the tester on **all** lessons.
- **Test before publishing:** run `.venv/bin/python tools/test/runall.py` (on Linux, set `CHROME` to a Chromium that
  runs with `--no-sandbox`). One-time setup:
  `python3 -m venv .venv && .venv/bin/pip install websocket-client`. All scenes must pass. Look at the screenshots
  in `tools/test/shots/`. The tester mutes all sound. A run of every lesson takes over 10 minutes, so test Science and Maths
  in separate batches; memory is limited, so set `WORKERS=2` (default 6 browsers) if anything else is running.
- **Publish:** commit (and push to `main`), then create a Cortex release with Deploy App on. Cortex builds `dist/` and
  deploys it to https://tutor.gocortex.app after the user confirms. Note that unknown paths there return the home page,
  not a 404, so check a new page's title (not just the status code) when confirming a deploy.
- **Rebuild the study guide PDFs** after editing `source/study-guide-source.html` or `source/maths/study-guide-source.html` (commands in `README.md`).

## Going live with student accounts (not done yet)
`main` needs logins on the **Production** Convex database before it is released, or every page asks for a login nobody has:
1. Save `PARENT_PASSWORD` for Production (secure Cortex box), then run `setup:createParent` on Production.
2. Sign in on the live site as the parent and add each student on the parent page.
3. Remove the Development test logins `test.student` and `test.parent` (and their progress).
4. Release, and check the live bundle points at the Production Convex URL (`VITE_CONVEX_URL` at build time).

## Known gaps and ideas (not done yet)
- Not yet tested on a real iPhone or iPad. Lesson 13 uses CSS `offset-path`, which needs Safari 16 or newer.
- Engine ideas from building the lessons:
  - an `img` field for `ask`/`reveal` (pictures in exam questions);
  - shared circuit and meter drawing helpers (Lessons 11–14 each carry their own copy);
  - letting `pop()` stop holding opacity after it finishes.
- Small inconsistency: the circuit lessons use different example current values (L11: 0.2 A per cell; L12: 0.6 A
  divided by the number of lamps; L13 and the quiz: 0.5 A × cells ÷ lamps). Each lesson is self-consistent.
