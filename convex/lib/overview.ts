import type { QueryCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

/**
 * A student's progress summary, used by the home page (their own) and the parent page.
 * Lessons to revise: for every question, only the most recent answer counts. A lesson is on the list while it has
 * questions whose latest answer was wrong, so it drops off once those questions are answered correctly again.
 */
export async function overviewFor(ctx: QueryCtx, profileId: Id<"profiles">) {
  const lessons = await ctx.db.query("lessonProgress").withIndex("by_profile_lesson", (q) => q.eq("profileId", profileId)).collect();
  const runs = await ctx.db.query("quizRuns").withIndex("by_profile", (q) => q.eq("profileId", profileId)).collect();
  const answers = await ctx.db.query("answers").withIndex("by_profile", (q) => q.eq("profileId", profileId)).collect(); // oldest first

  const quizBest: Record<string, { right: number; total: number; stars: number; pct: number }> = {};
  for (const r of runs) {
    const pct = r.total ? Math.round((r.right / r.total) * 100) : 0;
    if (r.mode !== "retry" && (!quizBest[r.mode] || pct > quizBest[r.mode].pct)) quizBest[r.mode] = { right: r.right, total: r.total, stars: r.stars, pct };
  }

  const latest = new Map<string, { lessonId: string; correct: boolean; at: number }>();
  for (const a of answers) latest.set(a.questionId, { lessonId: a.lessonId, correct: a.correct, at: a.at });
  const byLesson = new Map<string, { wrong: number; lastAt: number }>();
  for (const [, a] of latest) {
    if (a.correct) continue;
    const e = byLesson.get(a.lessonId) ?? { wrong: 0, lastAt: 0 };
    e.wrong++; e.lastAt = Math.max(e.lastAt, a.at);
    byLesson.set(a.lessonId, e);
  }
  const revise = [...byLesson.entries()]
    .map(([lessonId, e]) => ({ lessonId, wrong: e.wrong, lastAt: e.lastAt }))
    .sort((a, b) => b.wrong - a.wrong || b.lastAt - a.lastAt);

  // Islamic Studies Memory Trainer (islamic-trainer.html): saved like a quiz level, mode "itrainer"
  const tr = await ctx.db.query("quizState").withIndex("by_profile_mode", (q) => q.eq("profileId", profileId).eq("mode", "itrainer")).unique();
  let trainer: { mastered: number; seen: number; total: number } | null = null;
  try {
    const st = tr ? JSON.parse(tr.state) : null;
    if (st) trainer = { mastered: Number(st.mastered) || 0, seen: Number(st.seen) || 0, total: Number(st.total) || 0 };
  } catch (e) { trainer = null; }

  const lastActive = Math.max(0, ...lessons.map((l) => l.updatedAt), ...answers.map((a) => a.at), ...runs.map((r) => r.at));
  return {
    lessons: lessons.map((l) => ({ lessonId: l.lessonId, lastScene: l.lastScene, done: l.done })),
    quizBest,
    revise,
    answered: answers.length,
    correct: answers.filter((a) => a.correct).length,
    lastActive: lastActive || null,
    trainer,
  };
}

/** The questions a student currently has wrong (latest answer wrong), with how often they missed each one. */
export async function wrongQuestionsFor(ctx: QueryCtx, profileId: Id<"profiles">) {
  const answers = await ctx.db.query("answers").withIndex("by_profile", (q) => q.eq("profileId", profileId)).collect();
  const byQ = new Map<string, { questionId: string; lessonId: string; source: "quiz" | "lesson"; tries: number; misses: number; lastAt: number; latestCorrect: boolean }>();
  for (const a of answers) {
    const e = byQ.get(a.questionId) ?? { questionId: a.questionId, lessonId: a.lessonId, source: a.source, tries: 0, misses: 0, lastAt: 0, latestCorrect: false };
    e.tries++; if (!a.correct) e.misses++;
    e.lastAt = a.at; e.latestCorrect = a.correct;
    byQ.set(a.questionId, e);
  }
  return [...byQ.values()]
    .filter((q) => !q.latestCorrect)
    .map(({ latestCorrect, ...q }) => q)
    .sort((a, b) => b.misses - a.misses || b.lastAt - a.lastAt);
}
