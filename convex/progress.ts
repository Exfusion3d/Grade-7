import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireProfile } from "./lib/session";

const LESSON = /^l\d\d$/;
const checkLesson = (id: string) => { if (!LESSON.test(id)) throw new ConvexError("Unknown lesson."); };
const MAX_BATCH = 200;

/** Save how far the signed-in student got in a lesson. */
export const saveLesson = mutation({
  args: { token: v.string(), lessonId: v.string(), scene: v.number(), step: v.optional(v.number()), done: v.boolean() },
  handler: async (ctx, { token, lessonId, scene, step, done }) => {
    const me = await requireProfile(ctx, token);
    checkLesson(lessonId);
    const row = await ctx.db
      .query("lessonProgress")
      .withIndex("by_profile_lesson", (q) => q.eq("profileId", me._id).eq("lessonId", lessonId))
      .unique();
    const now = Date.now();
    if (row) await ctx.db.patch(row._id, { lastScene: scene, step, done: row.done || done, updatedAt: now });
    else await ctx.db.insert("lessonProgress", { profileId: me._id, lessonId, lastScene: scene, step, done, updatedAt: now });
  },
});

/** Save answers (sent in batches; a resent answer with the same clientId is ignored). */
export const recordAnswers = mutation({
  args: {
    token: v.string(),
    answers: v.array(v.object({
      clientId: v.string(), questionId: v.string(), lessonId: v.string(),
      source: v.union(v.literal("quiz"), v.literal("lesson")), correct: v.boolean(), at: v.number(),
    })),
  },
  handler: async (ctx, { token, answers }) => {
    const me = await requireProfile(ctx, token);
    if (answers.length > MAX_BATCH) throw new ConvexError("Too many answers at once.");
    let saved = 0;
    for (const a of answers) {
      checkLesson(a.lessonId);
      if (a.questionId.length > 120 || a.clientId.length > 64) throw new ConvexError("Bad answer.");
      const dup = await ctx.db
        .query("answers")
        .withIndex("by_profile_client", (q) => q.eq("profileId", me._id).eq("clientId", a.clientId))
        .unique();
      if (dup) continue;
      await ctx.db.insert("answers", { ...a, profileId: me._id, at: Math.min(a.at, Date.now()) });
      saved++;
    }
    return saved;
  },
});

/** Save a finished quiz level. */
export const recordQuizRun = mutation({
  args: {
    token: v.string(),
    run: v.object({
      clientId: v.string(), mode: v.string(), right: v.number(), total: v.number(),
      score: v.number(), stars: v.number(), at: v.number(),
    }),
  },
  handler: async (ctx, { token, run }) => {
    const me = await requireProfile(ctx, token);
    if (run.clientId.length > 64 || run.mode.length > 20) throw new ConvexError("Bad quiz result.");
    const dup = await ctx.db
      .query("quizRuns")
      .withIndex("by_profile_client", (q) => q.eq("profileId", me._id).eq("clientId", run.clientId))
      .unique();
    if (!dup) await ctx.db.insert("quizRuns", { ...run, profileId: me._id, at: Math.min(run.at, Date.now()) });
  },
});

/** The signed-in student's own progress: lessons, answer counts and best quiz result per level. */
export const myProgress = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const me = await requireProfile(ctx, token);
    const lessons = await ctx.db
      .query("lessonProgress")
      .withIndex("by_profile_lesson", (q) => q.eq("profileId", me._id))
      .collect();
    const runs = await ctx.db.query("quizRuns").withIndex("by_profile", (q) => q.eq("profileId", me._id)).collect();
    const best: Record<string, { right: number; total: number; stars: number }> = {};
    for (const r of runs) {
      const b = best[r.mode];
      if (!b || r.right / r.total > b.right / b.total) best[r.mode] = { right: r.right, total: r.total, stars: r.stars };
    }
    const answers = await ctx.db.query("answers").withIndex("by_profile", (q) => q.eq("profileId", me._id)).collect();
    return {
      lessons: lessons.map((l) => ({ lessonId: l.lessonId, lastScene: l.lastScene, step: l.step, done: l.done, updatedAt: l.updatedAt })),
      quizBest: best,
      answered: answers.length,
      correct: answers.filter((a) => a.correct).length,
    };
  },
});

/** Save (or, with state null, clear) the signed-in student's unfinished quiz level. */
export const saveQuizState = mutation({
  args: { token: v.string(), mode: v.string(), state: v.union(v.string(), v.null()) },
  handler: async (ctx, { token, mode, state }) => {
    const me = await requireProfile(ctx, token);
    if (mode.length > 20 || (state && state.length > 20_000)) throw new ConvexError("Bad quiz state.");
    const row = await ctx.db
      .query("quizState")
      .withIndex("by_profile_mode", (q) => q.eq("profileId", me._id).eq("mode", mode))
      .unique();
    if (state === null) { if (row) await ctx.db.delete(row._id); return; }
    if (row) await ctx.db.patch(row._id, { state, updatedAt: Date.now() });
    else await ctx.db.insert("quizState", { profileId: me._id, mode, state, updatedAt: Date.now() });
  },
});

/** The signed-in student's unfinished quiz levels and where they are in each lesson, for "continue". */
export const resumeInfo = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const me = await requireProfile(ctx, token);
    const quizzes = await ctx.db.query("quizState").withIndex("by_profile_mode", (q) => q.eq("profileId", me._id)).collect();
    const lessons = await ctx.db.query("lessonProgress").withIndex("by_profile_lesson", (q) => q.eq("profileId", me._id)).collect();
    return {
      quizzes: quizzes.map((q) => ({ mode: q.mode, state: q.state, updatedAt: q.updatedAt })),
      lessons: lessons.map((l) => ({ lessonId: l.lessonId, lastScene: l.lastScene, step: l.step, done: l.done, updatedAt: l.updatedAt })),
    };
  },
});
