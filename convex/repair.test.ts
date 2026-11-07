/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";

declare const process: { env: Record<string, string | undefined> };

const modules = import.meta.glob("./**/*.*s");

test("a lost quiz level result is rebuilt from its saved answers, once", async () => {
  const t = convexTest(schema, modules);
  process.env.PARENT_PASSWORD = "parent-pass-123";
  await t.action(internal.setup.createParent, { username: "mum", nickname: "Mum" });
  const parent = await t.action(api.auth.signIn, { username: "mum", password: "parent-pass-123" });
  await t.action(api.students.createStudent, { token: parent.token, username: "celine", nickname: "celine", password: "secret1" });
  const s = await t.action(api.auth.signIn, { username: "celine", password: "secret1" });

  const answers = Array.from({ length: 30 }, (_, i) => ({
    clientId: "a" + i, questionId: `u4-${String(i + 1).padStart(2, "0")}`, lessonId: "l01", source: "quiz" as const, correct: i >= 2, at: 1000 + i,
  }));
  answers.push({ clientId: "x", questionId: "u5-01", lessonId: "l05", source: "quiz", correct: false, at: 2000 }); // other level: ignored
  await t.mutation(api.progress.recordAnswers, { token: s.token, answers });

  expect(await t.mutation(internal.repair.restoreQuizRun, { username: "celine", mode: "u4" })).toBe("Restored celine's u4 result: 28/30 (93%), 3 stars.");
  const p = await t.query(api.progress.myProgress, { token: s.token });
  expect(p.quizBest.u4).toMatchObject({ right: 28, total: 30, stars: 3 });

  await expect(t.mutation(internal.repair.restoreQuizRun, { username: "celine", mode: "u4" })).rejects.toThrow(/already has/);
  await expect(t.mutation(internal.repair.restoreQuizRun, { username: "celine", mode: "u9" })).rejects.toThrow(/no saved/);
  await expect(t.mutation(internal.repair.restoreQuizRun, { username: "mum", mode: "u4" })).rejects.toThrow(/No student/);
});
