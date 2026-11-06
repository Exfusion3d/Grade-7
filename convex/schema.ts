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

  // How far each student got in each lesson. `done` stays true once the last scene is reached.
  lessonProgress: defineTable({
    profileId: v.id("profiles"),
    lessonId: v.string(), // "l01".."l14"
    lastScene: v.number(), // 1-based scene last opened
    step: v.optional(v.number()), // within that scene, e.g. the Exam check question reached (0-based)
    done: v.boolean(),
    updatedAt: v.number(),
  }).index("by_profile_lesson", ["profileId", "lessonId"]),

  // Every answer to a quiz question or a lesson Exam check question, first try only.
  answers: defineTable({
    profileId: v.id("profiles"),
    clientId: v.string(), // random id from the browser, so a resent answer is not counted twice
    questionId: v.string(), // quiz: "u5-03"; lesson: "l05:Unit 5 · MCQ 1"
    lessonId: v.string(), // the lesson that teaches it
    source: v.union(v.literal("quiz"), v.literal("lesson")),
    correct: v.boolean(),
    at: v.number(),
  })
    .index("by_profile", ["profileId", "at"])
    .index("by_profile_client", ["profileId", "clientId"]),

  // A quiz level the student has started but not finished, so it can be continued (one per level).
  quizState: defineTable({
    profileId: v.id("profiles"),
    mode: v.string(),
    state: v.string(), // JSON written by quiz.html: question ids, position, score, streak, mistakes
    updatedAt: v.number(),
  }).index("by_profile_mode", ["profileId", "mode"]),

  // Each finished quiz level.
  quizRuns: defineTable({
    profileId: v.id("profiles"),
    clientId: v.string(),
    mode: v.string(), // "u4", "u5", "u9", "boss" or "retry"
    right: v.number(),
    total: v.number(),
    score: v.number(),
    stars: v.number(),
    at: v.number(),
  })
    .index("by_profile", ["profileId", "at"])
    .index("by_profile_client", ["profileId", "clientId"]),
});
