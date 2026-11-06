import { ConvexError, v } from "convex/values";
import { action, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { hashPassword, PBKDF2_ITERATIONS, randomB64, sameString, sha256 } from "./lib/crypto";
import type { Id } from "./_generated/dataModel";
import { LOCK_MINUTES, MAX_FAILED_LOGINS, profileFromToken, SESSION_DAYS } from "./lib/session";

type Who = { username: string; nickname: string; role: "parent" | "student" };
type LoginInfo = { id: Id<"profiles">; salt: string; iterations: number; passwordHash: string; lockedUntil?: number } | null;

const WRONG = "That username and password don't match. Try again!";

/** Sign in with a username and password. Returns a session token for the browser to keep. */
export const signIn = action({
  args: { username: v.string(), password: v.string() },
  handler: async (ctx, { username, password }): Promise<Who & { token: string }> => {
    const info: LoginInfo = await ctx.runQuery(internal.auth.loginInfo, { username: username.trim().toLowerCase() });
    if (!info) {
      await hashPassword(password, randomB64(16), PBKDF2_ITERATIONS); // same work as a real check
      throw new ConvexError(WRONG);
    }
    if (info.lockedUntil && info.lockedUntil > Date.now()) {
      throw new ConvexError("Too many wrong tries. Wait a few minutes, then try again.");
    }
    const hash = await hashPassword(password, info.salt, info.iterations);
    if (!sameString(hash, info.passwordHash)) {
      await ctx.runMutation(internal.auth.recordFailure, { profileId: info.id });
      throw new ConvexError(WRONG);
    }
    const token = randomB64(32);
    const who: Who = await ctx.runMutation(internal.auth.startSession, { profileId: info.id, tokenHash: await sha256(token) });
    return { token, ...who };
  },
});

export const signOut = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const tokenHash = await sha256(token);
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_tokenHash", (q) => q.eq("tokenHash", tokenHash))
      .unique();
    if (session) await ctx.db.delete(session._id);
  },
});

/** The signed-in user (nickname, username, role), or null when the token is not valid. */
export const me = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, { token }) => {
    const p = await profileFromToken(ctx, token);
    return p ? { username: p.username, nickname: p.nickname, role: p.role } : null;
  },
});

export const loginInfo = internalQuery({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    const p = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();
    return p && { id: p._id, salt: p.salt, iterations: p.iterations, passwordHash: p.passwordHash, lockedUntil: p.lockedUntil };
  },
});

export const recordFailure = internalMutation({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, { profileId }) => {
    const p = await ctx.db.get(profileId);
    if (!p) return;
    const failed = p.failedLogins + 1;
    if (failed >= MAX_FAILED_LOGINS) {
      await ctx.db.patch(profileId, { failedLogins: 0, lockedUntil: Date.now() + LOCK_MINUTES * 60_000 });
    } else {
      await ctx.db.patch(profileId, { failedLogins: failed });
    }
  },
});

export const startSession = internalMutation({
  args: { profileId: v.id("profiles"), tokenHash: v.string() },
  handler: async (ctx, { profileId, tokenHash }) => {
    const p = await ctx.db.get(profileId);
    if (!p) throw new ConvexError(WRONG);
    const now = Date.now();
    await ctx.db.patch(profileId, { failedLogins: 0, lockedUntil: undefined });
    for (const s of await ctx.db.query("sessions").withIndex("by_profile", (q) => q.eq("profileId", profileId)).collect()) {
      if (s.expiresAt < now) await ctx.db.delete(s._id);
    }
    await ctx.db.insert("sessions", { profileId, tokenHash, createdAt: now, expiresAt: now + SESSION_DAYS * 86_400_000 });
    return { username: p.username, nickname: p.nickname, role: p.role };
  },
});
