import { ConvexError, v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { normalizeUsername } from "./lib/session";

/**
 * Parent-run repair: rebuild a student's lost quiz level result from the answers they saved during it.
 * (Before the fix in src/account.js, a finished level's result could be dropped from the save queue while
 * its answers still arrived.) Internal, so only the deployment owner can run it, from the Convex dashboard
 * or a Cortex confirm card. Uses each question's latest quiz answer and the quiz's own star rule.
 * Refuses if the level already has a result, so running it twice changes nothing.
 */
export const restoreQuizRun = internalMutation({
  args: { username: v.string(), mode: v.union(v.literal("u4"), v.literal("u5"), v.literal("u9")) },
  handler: async (ctx, { username, mode }) => {
    const student = await ctx.db.query("profiles").withIndex("by_username", (q) => q.eq("username", normalizeUsername(username))).unique();
    if (!student || student.role !== "student") throw new ConvexError("No student with that username.");
    const runs = await ctx.db.query("quizRuns").withIndex("by_profile", (q) => q.eq("profileId", student._id)).collect();
    if (runs.some((r) => r.mode === mode)) throw new ConvexError(`${username} already has a ${mode} result.`);

    const answers = await ctx.db.query("answers").withIndex("by_profile", (q) => q.eq("profileId", student._id)).collect(); // oldest first
    const latest = new Map<string, { correct: boolean; at: number }>();
    for (const a of answers) if (a.source === "quiz" && a.questionId.startsWith(mode + "-")) latest.set(a.questionId, a);
    if (!latest.size) throw new ConvexError(`${username} has no saved ${mode} quiz answers.`);

    const total = latest.size;
    const right = [...latest.values()].filter((a) => a.correct).length;
    const pct = Math.round((right / total) * 100);
    const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0; // same rule as quiz.html
    const at = Math.max(...[...latest.values()].map((a) => a.at));
    await ctx.db.insert("quizRuns", { profileId: student._id, clientId: `restored-${mode}`, mode, right, total, score: right * 100, stars, at });
    return `Restored ${username}'s ${mode} result: ${right}/${total} (${pct}%), ${stars} star${stars === 1 ? "" : "s"}.`;
  },
});
