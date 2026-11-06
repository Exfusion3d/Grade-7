import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // One row per login. Only a username and a nickname: no email or real name.
  profiles: defineTable({
    username: v.string(), // lowercase, unique
    nickname: v.string(),
    role: v.union(v.literal("parent"), v.literal("student")),
    passwordHash: v.string(), // PBKDF2-SHA256, base64
    salt: v.string(), // base64
    iterations: v.number(),
    createdBy: v.optional(v.id("profiles")),
    createdAt: v.number(),
    failedLogins: v.number(),
    lockedUntil: v.optional(v.number()),
  }).index("by_username", ["username"]),

  // Signed-in devices. The browser keeps the token; only its SHA-256 hash is stored here.
  sessions: defineTable({
    profileId: v.id("profiles"),
    tokenHash: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
  })
    .index("by_tokenHash", ["tokenHash"])
    .index("by_profile", ["profileId"]),
});
