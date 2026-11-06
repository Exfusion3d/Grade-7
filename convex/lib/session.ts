import { ConvexError } from "convex/values";
import type { QueryCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";
import { sha256 } from "./crypto";

export const SESSION_DAYS = 180; // students stay signed in on their own device
export const MAX_FAILED_LOGINS = 5;
export const LOCK_MINUTES = 5;

/** The signed-in profile for a session token, or null if the token is missing, unknown or expired. */
export async function profileFromToken(ctx: QueryCtx, token: string | undefined): Promise<Doc<"profiles"> | null> {
  if (!token) return null;
  const tokenHash = await sha256(token);
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_tokenHash", (q) => q.eq("tokenHash", tokenHash))
    .unique();
  if (!session || session.expiresAt < Date.now()) return null;
  return await ctx.db.get(session.profileId);
}

export async function requireProfile(ctx: QueryCtx, token: string | undefined): Promise<Doc<"profiles">> {
  const profile = await profileFromToken(ctx, token);
  if (!profile) throw new ConvexError("Please sign in again.");
  return profile;
}

export async function requireParent(ctx: QueryCtx, token: string | undefined): Promise<Doc<"profiles">> {
  const profile = await requireProfile(ctx, token);
  if (profile.role !== "parent") throw new ConvexError("Only the parent or teacher can do that.");
  return profile;
}

/** Usernames: 3-20 characters, letters, digits, dot, dash or underscore; stored lowercase. */
export function normalizeUsername(raw: string): string {
  const u = raw.trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,20}$/.test(u)) {
    throw new ConvexError("Usernames need 3 to 20 letters or numbers (dots, dashes and underscores are fine).");
  }
  return u;
}

export function checkNewPassword(password: string): void {
  if (password.length < 6) throw new ConvexError("Passwords need at least 6 characters.");
  if (password.length > 100) throw new ConvexError("That password is too long.");
}

export function checkNickname(raw: string): string {
  const n = raw.trim();
  if (n.length < 1 || n.length > 30) throw new ConvexError("Nicknames need 1 to 30 characters.");
  return n;
}
