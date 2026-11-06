/* Student accounts in the browser: sign in, sign out, and keep pages behind the login.
   Loaded as a module by every page (and bundled by Vite). The session token lives in localStorage
   (g7_token) with a cached copy of the user (g7_me), so pages open instantly and offline;
   the token is re-checked with Convex in the background. */
import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const TOKEN = "g7_token", ME = "g7_me";
const url = import.meta.env.VITE_CONVEX_URL;
const client = url ? new ConvexClient(url) : null;

const read = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const write = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} };
const message = (e) => (typeof e?.data === "string" ? e.data : "Can't reach the server. Check the internet connection and try again.");

/** The sign-in page's address, remembering where to come back to. */
function loginUrl(next) {
  const u = new URL("/login.html", location.origin);
  if (next) u.searchParams.set("next", next);
  return u.href;
}

function goToLogin() {
  write(TOKEN, null); write(ME, null);
  location.replace(loginUrl(location.pathname + location.search + location.hash));
}

/** Fill in elements that show who is signed in: [data-nickname]. */
function showUser(user) {
  document.querySelectorAll("[data-nickname]").forEach((el) => { el.textContent = user.nickname; });
  document.documentElement.dataset.role = user.role;
}

/* ---------- progress saving ----------
   Lessons and the quiz call Account.track.*. Each save waits in a per-user queue in localStorage
   (so nothing is lost offline or when the page closes) and is sent to Convex in the background. */
const queueKey = () => { const u = Account.user(); return u ? "g7_queue_" + u.username : null; };
const loadQueue = () => { try { return JSON.parse(read(queueKey()) || "[]"); } catch (e) { return []; } };
const saveQueue = (q) => { const k = queueKey(); if (k) write(k, JSON.stringify(q.slice(-2000))); };
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random().toString(36).slice(2));
let flushing = false;

function enqueue(item) {
  if (!queueKey()) return;
  let q = loadQueue();
  if (item.kind === "quizState") q = q.filter((x) => !(x.kind === "quizState" && x.mode === item.mode)); // only the latest matters
  q.push(item); saveQueue(q); flush();
}

/* ---------- resume points ----------
   Where the student is in each lesson and their unfinished quiz levels, cached per user in localStorage
   (g7_resume_<username>) so lessons/engine.js and quiz.html can read it instantly, and merged with the
   server copy (newest wins) so it follows the student between devices. Pages listen for "g7-resume". */
const resumeKey = () => { const u = Account.user(); return u ? "g7_resume_" + u.username : null; };
function loadResume() {
  try { return Object.assign({ lessons: {}, quizzes: {} }, JSON.parse(read(resumeKey()) || "{}")); } catch (e) { return { lessons: {}, quizzes: {} }; }
}
function saveResume(r) { const k = resumeKey(); if (k) write(k, JSON.stringify(r)); }

async function refreshResume() {
  const token = read(TOKEN);
  if (!client || !token || !resumeKey()) return;
  try {
    const server = await client.query(api.progress.resumeInfo, { token });
    const r = loadResume();
    for (const l of server.lessons) {
      const mine = r.lessons[l.lessonId];
      if (!mine || l.updatedAt > mine.at) r.lessons[l.lessonId] = { lastScene: l.lastScene, step: l.step, done: l.done, at: l.updatedAt };
    }
    const serverModes = new Set(server.quizzes.map((q) => q.mode));
    for (const q of server.quizzes) {
      const mine = r.quizzes[q.mode];
      if (!mine || q.updatedAt > mine.at) { try { r.quizzes[q.mode] = { ...JSON.parse(q.state), at: q.updatedAt }; } catch (e) {} }
    }
    // a level finished on another device is gone from the server: drop it here too, unless this device has newer, unsent play
    const pending = new Set(loadQueue().filter((x) => x.kind === "quizState").map((x) => x.mode));
    for (const mode of Object.keys(r.quizzes)) if (!serverModes.has(mode) && !pending.has(mode)) delete r.quizzes[mode];
    saveResume(r);
    dispatchEvent(new Event("g7-resume"));
  } catch (e) { /* offline: keep the cached copy */ }
}

async function flush() {
  const token = read(TOKEN);
  if (flushing || !client || !token) return;
  flushing = true;
  try {
    for (;;) {
      const q = loadQueue();
      if (!q.length) break;
      const first = q[0];
      let sent = 1;
      try {
        if (first.kind === "answer") {
          while (sent < q.length && sent < 100 && q[sent].kind === "answer") sent++;
          await client.mutation(api.progress.recordAnswers, { token, answers: q.slice(0, sent).map(({ kind, ...a }) => a) });
        } else if (first.kind === "lesson") {
          const { kind, ...l } = first;
          await client.mutation(api.progress.saveLesson, { token, ...l });
        } else if (first.kind === "quizRun") {
          const { kind, ...run } = first;
          await client.mutation(api.progress.recordQuizRun, { token, run });
        } else if (first.kind === "quizState") {
          await client.mutation(api.progress.saveQuizState, { token, mode: first.mode, state: first.state });
        }
      } catch (e) {
        // The server refused it (not a network problem): drop it so the queue doesn't get stuck,
        // unless the session ended, in which case keep it for the next sign-in.
        if (typeof e?.data !== "string" || /sign in/i.test(e.data)) throw e;
      }
      saveQueue(loadQueue().slice(sent));
    }
  } catch (e) {
    /* offline or server busy: keep the queue and try again later */
  } finally { flushing = false; }
}

export const Account = {
  /** Progress saving, used by lessons/engine.js and quiz.html. */
  track: {
    lesson: (lessonId, scene, done, step) => {
      const r = loadResume(), old = r.lessons[lessonId];
      r.lessons[lessonId] = { lastScene: scene, step, done: !!done || !!old?.done, at: Date.now() };
      saveResume(r);
      enqueue({ kind: "lesson", lessonId, scene, done: !!done, ...(step != null ? { step } : {}) });
    },
    /** Save (or, with null, clear) an unfinished quiz level. */
    quizState: (mode, state) => {
      const r = loadResume();
      if (state) r.quizzes[mode] = { ...state, at: Date.now() }; else delete r.quizzes[mode];
      saveResume(r);
      enqueue({ kind: "quizState", mode, state: state ? JSON.stringify(state) : null });
    },
    answer: ({ questionId, lessonId, source, correct }) =>
      enqueue({ kind: "answer", clientId: newId(), questionId: String(questionId).slice(0, 120), lessonId, source, correct: !!correct, at: Date.now() }),
    quizRun: ({ mode, right, total, score, stars }) =>
      enqueue({ kind: "quizRun", clientId: newId(), mode, right, total, score, stars, at: Date.now() }),
  },
  flush,
  resume: loadResume,

  token: () => read(TOKEN),
  user: () => { try { return JSON.parse(read(ME)); } catch (e) { return null; } },

  async signIn(username, password) {
    if (!client) throw new Error("Sign-in isn't set up on this site yet.");
    try {
      const { token, ...user } = await client.action(api.auth.signIn, { username, password });
      write(TOKEN, token); write(ME, JSON.stringify(user));
      return user;
    } catch (e) { throw new Error(message(e)); }
  },

  async signOut() {
    const token = read(TOKEN);
    write(TOKEN, null); write(ME, null);
    if (client && token) { try { await client.mutation(api.auth.signOut, { token }); } catch (e) {} }
    location.replace(loginUrl());
  },

  /** Re-check the session. Signs out on an expired or revoked session; keeps going when offline. */
  async verify() {
    const token = read(TOKEN);
    if (!token) return goToLogin();
    if (!client) return;
    try {
      const user = await client.query(api.auth.me, { token });
      if (!user) return goToLogin();
      write(ME, JSON.stringify(user));
      showUser(user);
    } catch (e) { /* offline: trust the cached user for now */ }
  },
};
window.Account = Account;

// Saves made before this module loaded (lessons/engine.js and quiz.html queue them in window.__track).
for (const [method, args] of Array.isArray(window.__track) ? window.__track : []) Account.track[method](...args);
window.__track = { push: ([method, args]) => Account.track[method](...args) };
addEventListener("online", flush);
setInterval(flush, 30000);
flush();

// Every page except the sign-in page needs a signed-in user.
if (!document.documentElement.hasAttribute("data-public")) {
  const cached = Account.user();
  const ready = async () => { if (cached) showUser(cached); await Account.verify(); refreshResume(); };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", ready) : ready();
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-signout]")) { e.preventDefault(); Account.signOut(); }
  });
}
