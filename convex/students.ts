import { ConvexError, v } from "convex/values";
import { action, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { hashPassword, PBKDF2_ITERATIONS, randomB64 } from "./lib/crypto";
import type { Id } from "./_generated/dataModel";
import { checkNewPassword, checkNickname, normalizeUsername, requireParent } from "./lib/session";

const role = v.union(v.literal("parent"), v.literal("student"));

/** Parent only: create a student login. Students cannot sign themselves up. */
export const createStudent = action({
  args: { token: v.string(), username: v.string(), nickname: v.string(), password: v.string() },
  handler: async (ctx, args): Promise<Id<"profiles">> => {
    const parentId: Id<"profiles"> = await ctx.runQuery(internal.students.parentId, { token: args.token });
    const username = normalizeUsername(args.username);
    const nickname = checkNickname(args.nickname);
    checkNewPassword(args.password);
    const salt = randomB64(16);
    const passwordHash = await hashPassword(args.password, salt, PBKDF2_ITERATIONS);
    return await ctx.runMutation(internal.students.insertProfile, {
      username, nickname, role: "student", passwordHash, salt, iterations: PBKDF2_ITERATIONS, createdBy: parentId,
    });
  },
});

/** Parent only: give a student a new password. The student is signed out on every device. */
export const resetPassword = action({
  args: { token: v.string(), studentId: v.id("profiles"), password: v.string() },
  handler: async (ctx, { token, studentId, password }) => {
    await ctx.runQuery(internal.students.parentId, { token });
    checkNewPassword(password);
    const salt = randomB64(16);
    const passwordHash = await hashPassword(password, salt, PBKDF2_ITERATIONS);
    await ctx.runMutation(internal.students.setPassword, { studentId, passwordHash, salt, iterations: PBKDF2_ITERATIONS });
  },
});

/** Parent only: delete a student's login and sign them out everywhere. */
export const removeStudent = mutation({
  args: { token: v.string(), studentId: v.id("profiles") },
  handler: async (ctx, { token, studentId }) => {
    await requireParent(ctx, token);
    const s = await ctx.db.get(studentId);
    if (!s || s.role !== "student") throw new ConvexError("Student not found.");
    for (const session of await ctx.db.query("sessions").withIndex("by_profile", (q) => q.eq("profileId", studentId)).collect()) {
      await ctx.db.delete(session._id);
    }
    await ctx.db.delete(studentId);
  },
});

/** Parent only: every student login, oldest first. */
export const listStudents = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireParent(ctx, token);
    const all = await ctx.db.query("profiles").collect();
    return all
      .filter((p) => p.role === "student")
      .map((p) => ({ id: p._id, username: p.username, nickname: p.nickname, createdAt: p.createdAt }));
  },
});

export const parentId = internalQuery({
  args: { token: v.string() },
  handler: async (ctx, { token }) => (await requireParent(ctx, token))._id,
});

export const insertProfile = internalMutation({
  args: {
    username: v.string(), nickname: v.string(), role, passwordHash: v.string(), salt: v.string(),
    iterations: v.number(), createdBy: v.optional(v.id("profiles")),
  },
  handler: async (ctx, args) => {
    const taken = await ctx.db.query("profiles").withIndex("by_username", (q) => q.eq("username", args.username)).unique();
    if (taken) throw new ConvexError("That username is already taken. Try another one.");
    return await ctx.db.insert("profiles", { ...args, createdAt: Date.now(), failedLogins: 0 });
  },
});

export const setPassword = internalMutation({
  args: { studentId: v.id("profiles"), passwordHash: v.string(), salt: v.string(), iterations: v.number() },
  handler: async (ctx, { studentId, ...pw }) => {
    const s = await ctx.db.get(studentId);
    if (!s || s.role !== "student") throw new ConvexError("Student not found.");
    await ctx.db.patch(studentId, { ...pw, failedLogins: 0, lockedUntil: undefined });
    for (const session of await ctx.db.query("sessions").withIndex("by_profile", (q) => q.eq("profileId", studentId)).collect()) {
      await ctx.db.delete(session._id);
    }
  },
});
