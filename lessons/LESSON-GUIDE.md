# How to build a lesson

Every lesson is ONE html file that loads the shared engine. Science lessons live in `lessons/` (copy `lessons/_template.html`);
Maths lessons live in `maths/` and also load `maths/maths.js` (copy `maths/m01-writing-expressions.html`). The rest of this
guide applies to every subject; for Maths read "Pi the Robot" for "Professor Atom", and the questions are in
`../source/maths/worksheet-transcript.md` (teach the correct answer where the sheet's `[CHECK]` says it is wrong,
without mentioning the sheet). Once a lesson passes the tester, set its `href` in `subjects.js` so it appears on the site.
French lessons live in `french/` and load `french/french.js` (copy `french/f01-ma-journee.html`); see "French" below.
The style reference is `l05-metals-nonmetals.html` (the approved pilot): read its scenes to match tone, pacing, colours and animation richness.
The questions each lesson must cover are in `../source/worksheet-by-lesson.md`.

## Audience and tone
- A Grade 7 (12-year-old) Cambridge student. Plain English, British spelling (colour, aluminium, sulfur).
- Professor Atom speaks every line aloud (text-to-speech), so write `say()` lines as natural spoken sentences:
  one or two short sentences (max ~35 words), `<b>bold</b>` for key words, at most one emoji per line.
- Fun and visual: every scene animates something (moving, growing, popping, glowing, looping). Never a static wall of text.
- Scientifically accurate. Use the worksheet's own answers/wording for exam answers.

## Lesson shape (6–9 scenes)
1. A hook scene that sets up the big idea with an animation.
2. 3–6 teaching scenes, each explaining one idea with its own animation, covering ALL the lesson's worksheet questions.
   Say the exam answer out loud and show it on screen with `wsCard`, which shows the worksheet question word for word
   and stamps the answer under it. Never show an answer without its question.
3. At least one hands-on moment (sortGame, a button the student taps, a slider, a toggle, a "which one?" pick).
4. A last-but-one or last "Exam check" scene using `examCheck(w,[...])` with the lesson's real worksheet questions:
   MCQs as `{src,q,o,a,why}`, written questions as `{src,q,model}`. Cover every worksheet question of the lesson
   somewhere in the lesson (teaching scene or exam check); the exam check should include most of them.
5. Final scene: a short recap (badges/cards popping in, like the pilot's "You did it!" scene) + `confetti()`.
   Reaching the end of the last scene marks the lesson complete automatically.

## Stage and layout
- The stage is a fixed **960 × 520** px canvas. Position everything absolutely with `mk(cls, css, html, parent)`.
- Keep everything inside the stage (it clips). Leave ~8–13 px margins. Check text does not overflow boxes.
- Typical layouts: 4 cards of 222×244 at x = 13 + i*237 (two rows at y = 8 and 266); 2×2 panels of 460×200 at
  (13|487, 8|216); full-width panel 933 wide at x=13.

## Engine API (globals from engine.js)
- `Lesson.start({id, num, unit, emoji, title, intro, scenes:[{t, run:async w=>{...}}]})`. Other subjects add
  `subject`, `home`, `guide`, `mascot` (all in `MATHS` for Maths) and `part` ('Chapter 2', shown instead of 'Unit N').
- Maths only (`maths.js`): `frac(n,d)` draws a fraction (spoken "n over d"); `buildExpr(w,{q,tiles,answer})` lets the
  student tap tiles to build an expression and resolves to `{ok,built,y}`. In Maths lessons the voice reads × − + / &lt; &gt;
  as times, minus, plus, over, less than, greater than.
- **Maths teaching pattern (required, approved after the first pilot was too fast):** teach every worksheet question with
  `teachQ(w,{src,q,read,keys,before,steps,answer,why})` from `maths.js`, never with `wsCard`. It shows the question with no
  answer and reads it aloud, lights up the key words (`keys: [[word, spoken meaning]]`), tries a real number first
  (`before` steps with `try:true`), waits for the student to tap **Show me**, builds the working one line at a time
  (`steps: [{show, say, act}]`, `act` runs an animation first), then stamps the answer and explains `why`.
  `point(el)` glides a 👉 to whatever Pi is talking about. One question per screen (`clear()` between them).
- **French (`french.js`, tutor Coco the Parrot 🦜):** write every French string as `fr(french, english)`: it is spoken with
  a French voice, tapping it on the stage says it again, and the **🇬🇧 English** button (header; key `T`) swaps every
  `fr()` on the page to its English. When Coco explains a French word in English, use `fw('mot')` (stays French in both
  modes): `${fw('Lieu')} means place`. Teach every worksheet question with `teachFR(w,{src,q,read,keys,before,steps,answer,why})`
  (the same pattern as Maths' `teachQ`; `keys: [[French word, spoken meaning, English word]]`). Exam check items add
  `en` (the question in English), `oe` (each choice in English) and, for written questions, `men`; `src`/`q` stay
  literal strings. Also: `conjCard(x,y,wd,{verb,en,rows:[[pronoun,form,ending,english]]})` (rows appear with
  `show(i,w)`), `buildSentence(w,{q,tiles,answer})` (tap words in order), `endF(form,ending)` (ending in red),
  `clear(keep)`. Test French lessons in both modes: `QS=en=1` runs the tester with English on (shots end in `-en`).
- **Islamic Studies (`islamic.js`, tutor Hudhud the Hoopoe 🐦):** write every Arabic string as `ar(arabic, english, sounds)`
  (spoken with an Arabic voice; 🇬🇧 swaps it to English; 🔤 shows the sounds under it). `aw(arabic, sounds)` is an Arabic word
  explained in English (stays Arabic). Mark question keywords with `kw(arabic, sounds)` inside `q` and `kw(english)` inside `en`.
  Teach every worksheet question with `clueCard(w,{src,q,en,kind,keys,clue,answer,why})` (`answer: [[arabic, sounds, meaning]]`
  blocks), then let the student `buildAR` and `traceAR` the answers. Exam check items: `q`/`o`/`model` in Arabic with `en`, `oe`,
  `otr` (sounds) and `men`. Style reference: `islamic/i02-angels.html`. Test with and without `QS=en=1`.
- `w(ms)` — wait at least ms AND until the voice finishes the current line. Always `await w(...)` after `say(...)`
  before the next `say` (typical 2500–4000 ms). Cancel-safe when the student changes scene.
- `w.until(()=>cond)` — wait for an interactive condition (e.g. a button was tapped).
- `say(html)` — narration bubble + voice.
- `mk(cls, css, html, parent?)` — absolutely-positioned div (parent defaults to the stage).
- `an(el, keyframes, opts)` — Web Animation, returns a promise (fill forwards). `loop(el, keyframes, ms, opts)` — infinite.
- `pop(el, delay?)`, `shake(el)`, `confetti(n)`, `yay()`, `boo()`, `beep(freq, dur)`.
- `card(x,y,w,h,title,desc,color)` → returns the inner `.area` (198×132) for a mini animation.
- `panel(x,y,w,h,title,caption)` → panel element (children are positioned inside it).
- `btn(cls, css, html, onclick)` — clickable element. Classes: `bigbtn` (big coloured), `ex-btn` (purple), `ex-btn green`.
- `sortGame(w,{bins, items:[[text,binIndex]], top, colors, intro})` → `{ok,total,wrong}` after the student presses Check.
- `wsCard(css,{src,q,a},parent?)` — worksheet card: `src` label ('Worksheet · Unit 5 · MCQ 10'), the question `q`
  word for word, then the answer `a` ('✔ A) Hardness') stamped underneath. `css` gives left/top/width; height is automatic.
- `ask(w,{q,o,a,why,whyNot,src,top})`, `reveal(w,{q,model,src,top})`, `examCheck(w, list, {title})`. `ask` reads the question, then
  shows and reads each choice; `whyNot: {index: text}` explains why a wrong choice is wrong (give one for every wrong option).
- CSS helper classes: `stamp`, `card`, `panel`, `tag`, `chipk`, `clue`, `info`, `big-emoji`, `legend`.
- Periodic-table helpers also exist (`makeTable`, `flyFrom`, `SYM`, `NAME`, `kind`) if useful.
- Colours used in the pilot: purple #6a45d8, blue #2c66cf, green #18a058/#17935b, orange #e06a1b/#d66a0a,
  metal orange #f7ad5f, non-metal blue #5d9cf5, yellow #ffd84d, red #e04848, ink #1f2433.

## Rules
- No external files, libraries, fonts or images: emoji, CSS shapes and inline SVG only.
- Do not edit `engine.js`, `engine.css`, other lessons, or anything outside your own lesson files.
  If you think the engine needs a change, say so in your final report instead.
- Use template literals (backticks) for `say` strings; escape any backtick inside them.
- Interactive steps must not dead-end: every `w.until` has a visible button or game that can satisfy it.

## Testing (required before you finish)
One-time setup (from the project root):
```bash
python3 -m venv .venv && .venv/bin/pip install websocket-client
```
Play every scene of a lesson in headless Chrome (an auto-player answers questions, plays sort games and presses
"Reveal / Next question / Finish / Check" buttons; sound and voice are muted; animations run 40× faster):
```bash
.venv/bin/python tools/test/runall.py l07          # one lesson (or several: l07 m01), or no args for all lessons
```
It prints `total scenes: N passing: N` plus a `PROBLEM` line for any scene that errors or never finishes, and saves
each scene's final frame to `tools/test/shots/<lesson>-s<scene>.png`. LOOK at those screenshots (Read the png) and fix
overlaps, overflowing text, things off-stage or empty scenes.

To check a single scene (e.g. scene 4) and keep its screenshot:
```bash
.venv/bin/python tools/test/cdp.py "$PWD/lessons/l07-alloys-rusting.html" 4 /tmp/l07-s4.png 22 --fast
```
Prints `{"n":<scenes>,"errs":[...],"ready":true|false,"text":"..."}`. `ready:true` means the scene finished.

For custom interactive steps the auto-player cannot handle, set `window.AUTOPLAY=()=>{...}` inside that scene
(the engine clears it on every scene change), or use `ask`/`sortGame`/`ex-btn` buttons whose text contains
"Reveal", "Next question", "Finish" or "Check". Every scene must pass with `errs: []` and `ready: true`.

### Engine gotchas
- `pop()` and `an()` keep their end state (fill: forwards), so setting `style.opacity`/`transform` afterwards has no
  effect; animate again with `an()` or remove the element instead.
- `ask`/`reveal` put the question HTML into the narration bubble too, so put pictures in `src`, not in `q`.
- Write "amps" in spoken text if you like; the voice already reads "2.2 A" as "2.2 amps" and "____" as "blank".
- Don't reuse engine class names (`sg-chip`, `ex-opt`, `ex-btn`) for decoration; the auto-player clicks them.
