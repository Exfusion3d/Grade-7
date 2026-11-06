import { ConvexError, v } from "convex/values";
import { internalAction, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { hashPassword, PBKDF2_ITERATIONS, randomB64 } from "./lib/crypto";
import { checkNewPassword, checkNickname, normalizeUsername } from "./lib/session";

declare const process: { env: Record<string, string | undefined> };

/**
 * One-time setup: create the parent/teacher login. The password is read from the deployment's
 * PARENT_PASSWORD environment variable, so it never appears in code, logs or chat.
 * Refuses to run if a parent login already exists.
 */
export const createParent = internalAction({
  args: { username: v.string(), nickname: v.string() },
  handler: async (ctx, args) => {
    if (await ctx.runQuery(internal.setup.hasParent, {})) throw new ConvexError("A parent login already exists.");
    const password = process.env.PARENT_PASSWORD;
    if (!password) throw new ConvexError("Set PARENT_PASSWORD on this deployment first.");
    checkNewPassword(password);
    const salt = randomB64(16);
    const passwordHash = await hashPassword(password, salt, PBKDF2_ITERATIONS);
    await ctx.runMutation(internal.students.insertProfile, {
      username: normalizeUsername(args.username), nickname: checkNickname(args.nickname), role: "parent",
      passwordHash, salt, iterations: PBKDF2_ITERATIONS,
    });
    return "Parent login created.";
  },
});

export const hasParent = internalQuery({
  args: {},
  handler: async (ctx) => (await ctx.db.query("profiles").collect()).some((p) => p.role === "parent"),
});
