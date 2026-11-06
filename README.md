# Grade 7 Science: Exam Review

Revision site for the Grade 7 Cambridge Science review worksheet (Units 4, 5 and 9), published with GitHub Pages.

**Live site:** https://exfusion3d.github.io/Grade-7/

| Page | What it is |
|---|---|
| `index.html` | Home page with links to everything |
| `adventure.html` | Periodic Table Adventure: 13 animated scenes with a spoken tutor (Professor Atom) |
| `quiz.html` | Science Quest: 111 interactive questions across Units 4, 5 and 9 |
| `study-guide.pdf` | Printable study guide with explanations and a one-page cheat sheet |
| `source/study-guide-source.html` | HTML source the PDF was printed from |

Everything is plain HTML, CSS and JavaScript with no build step and no external dependencies.
The tutor voice uses the device's built-in speech (Web Speech API).

## Updating the site

Edit the files, then commit and push to `main`. GitHub Pages republishes automatically within a minute or two.

To rebuild the PDF after editing `source/study-guide-source.html`:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer --virtual-time-budget=5000 --print-to-pdf=study-guide.pdf "file://$PWD/source/study-guide-source.html"
```
