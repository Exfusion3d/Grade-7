# How to build a lesson

Every lesson is ONE html file in `lessons/` that loads the shared engine. Copy `lessons/_template.html` to start.
The style reference is `../adventure.html` (the approved pilot): read its scenes to match tone, pacing, colours and animation richness.
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
   Say the exam answer out loud and show it on screen (e.g. a `stamp`), as the pilot does ("✔ Answer: B) Left and middle").
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
- `Lesson.start({id, num, unit, emoji, title, intro, scenes:[{t, run:async w=>{...}}]})`
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
- `ask(w,{q,o,a,why,src,top})`, `reveal(w,{q,model,src,top})`, `examCheck(w, list, {title})`.
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
Run every scene of your lesson in a real-time headless Chrome (the auto-player answers questions and plays games):

```bash
PY=/private/tmp/claude-501/-Users-mazen-Library-Application-Support-Claude-scratch-workspaces-b1764ace-7264-453d-a219-29795a7ebf67-059ba234-8500-4904-995b-fb0069298e36-scratch-2026-11-05-5e9a92/3afedcac-86a8-4749-8d4c-7510468ea255/scratchpad/venv/bin/python
CDP=/private/tmp/claude-501/-Users-mazen-Library-Application-Support-Claude-scratch-workspaces-b1764ace-7264-453d-a219-29795a7ebf67-059ba234-8500-4904-995b-fb0069298e36-scratch-2026-11-05-5e9a92/3afedcac-86a8-4749-8d4c-7510468ea255/scratchpad/lt/cdp.py
"$PY" -I "$CDP" "/Users/mazen/Documents/GitHub/Grade 7/lessons/<file>.html" <scene-number> /private/tmp/claude-501/-Users-mazen-Library-Application-Support-Claude-scratch-workspaces-b1764ace-7264-453d-a219-29795a7ebf67-059ba234-8500-4904-995b-fb0069298e36-scratch-2026-11-05-5e9a92/3afedcac-86a8-4749-8d4c-7510468ea255/scratchpad/lt/out/<name>-s<scene>.png 10 --fast
```
It prints `{"errs":[...],"ready":true|false,"text":"..."}` and saves a screenshot. `ready:true` = the scene finished.
`--fast` speeds animations up 40×; if a long scene is not ready yet, raise the wait (4th arg) to 20.
For custom interactive steps the auto-player cannot handle, define `window.AUTOPLAY=()=>{...}` *inside the scene*
only if needed — better: make sure your custom buttons use class `ex-btn` with text containing "Reveal", "Next question",
"Finish" or "Check" (the auto-player clicks those), or use `ask`/`sortGame`.
Then LOOK at each screenshot (Read the png) and fix overlaps, overflowing text, things off-stage, empty scenes.
Every scene must report `errs: []` and `ready: true`.
