import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { requireParent } from "./lib/session";
import { overviewFor, wrongQuestionsFor } from "./lib/overview";

/** Parent only: every student with their progress summary, for the parent/teacher page. */
export const students = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireParent(ctx, token);
    const all = (await ctx.db.query("profiles").collect()).filter((p) => p.role === "student");
    return await Promise.all(all.map(async (p) => ({
      id: p._id, username: p.username, nickname: p.nickname, createdAt: p.createdAt,
      locked: !!p.lockedUntil && p.lockedUntil > Date.now(),
      ...(await overviewFor(ctx, p._id)),
    })));
  },
});

/** Parent only: one student's details: the summary, the questions they still get wrong, and recent quiz levels. */
export const student = query({
  args: { token: v.string(), studentId: v.id("profiles") },
  handler: async (ctx, { token, studentId }) => {
    await requireParent(ctx, token);
    const p = await ctx.db.get(studentId);
    if (!p || p.role !== "student") throw new ConvexError("Student not found.");
    const runs = await ctx.db.query("quizRuns").withIndex("by_profile", (q) => q.eq("profileId", studentId)).order("desc").take(10);
    return {
      id: p._id, username: p.username, nickname: p.nickname, createdAt: p.createdAt,
      ...(await overviewFor(ctx, studentId)),
      wrongQuestions: await wrongQuestionsFor(ctx, studentId),
      recentRuns: runs.map((r) => ({ mode: r.mode, right: r.right, total: r.total, stars: r.stars, at: r.at })),
    };
  },
});
