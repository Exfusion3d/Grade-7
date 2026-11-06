# Convex backend

Student accounts and progress for the site. The project is linked to a Convex deployment: Preview pushes these functions to
Development, and each Cortex release deploys them to Production before the website.

| File | What it does |
|---|---|
| `schema.ts` | Tables: `profiles` (username, nickname, role, hashed password), `sessions` (hashed sign-in tokens), `lessonProgress` (incl. `step`, the Exam check question reached), `answers`, `quizRuns`, `quizState` |
| `auth.ts` | `signIn` (username + password → session token), `signOut`, `me` |
| `students.ts` | Parent-only: `createStudent`, `resetPassword`, `removeStudent`, `listStudents`. There is no self sign-up |
| `progress.ts` | Each student's progress: `saveLesson` (last scene, done), `recordAnswers` (quiz and Exam check answers, first try), `recordQuizRun` (finished quiz levels), `myProgress`, and resuming: `saveQuizState` (unfinished quiz level, one per level), `resumeInfo`. Resent saves are ignored by `clientId` |
| `setup.ts` | One-time `createParent`: makes the parent login, reading its password from the `PARENT_PASSWORD` variable |
| `lib/` | Password hashing (PBKDF2), token hashing, session checks, input rules, and `overview.ts` (a student's summary and Lessons to revise, shared by `progress:myOverview` and the parent page) |
| `*.test.ts` | Tests, run with `bun run test` |

Passwords and session tokens are only stored hashed. Five wrong passwords lock a login for 5 minutes.
