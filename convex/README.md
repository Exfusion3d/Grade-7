# Convex backend

Student accounts for the site. The project is linked to a Convex deployment: Preview pushes these functions to
Development, and each Cortex release deploys them to Production before the website.

| File | What it does |
|---|---|
| `schema.ts` | Tables: `profiles` (username, nickname, role, hashed password) and `sessions` (hashed sign-in tokens) |
| `auth.ts` | `signIn` (username + password → session token), `signOut`, `me` |
| `students.ts` | Parent-only: `createStudent`, `resetPassword`, `removeStudent`, `listStudents`. There is no self sign-up |
| `setup.ts` | One-time `createParent`: makes the parent login, reading its password from the `PARENT_PASSWORD` variable |
| `lib/` | Password hashing (PBKDF2), token hashing, session checks and input rules |
| `auth.test.ts` | Tests, run with `bun run test` |

Passwords and session tokens are only stored hashed. Five wrong passwords lock a login for 5 minutes.
