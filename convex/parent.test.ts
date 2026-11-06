/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";

declare const process: { env: Record<string, string | undefined> };
const modules = import.meta.glob("./**/*.*s");

describe("parent page", () => {
  test("the parent sees every student's progress and the questions they still get wrong; students cannot", async () => {
    const t = convexTest(schema, modules);
    process.env.PARENT_PASSWORD = "parent-pass-123";
    await t.action(internal.setup.createParent, { username: "mum", nickname: "Mum" });
    const parent = await t.action(api.auth.signIn, { username: "mum", password: "parent-pass-123" });
    const id = await t.action(api.students.createStudent, { token: parent.token, username: "sara", nickname: "Sara", password: "secret1" });
    await t.action(api.students.createStudent, { token: parent.token, username: "omar", nickname: "Omar", password: "secret1" });
    const sara = await t.action(api.auth.signIn, { username: "sara", password: "secret1" });
    const now = Date.now();
    const a = (clientId: string, questionId: string, correct: boolean, at: number) =>
      ({ clientId, questionId, lessonId: "l05", source: "quiz" as const, correct, at });
    await t.mutation(api.progress.recordAnswers, { token: sara.token, answers: [
      a("1", "u5-01", false, now - 5000), a("2", "u5-01", false, now - 4000), a("3", "u5-02", false, now - 3000),
      a("4", "u5-02", true, now - 2000), a("5", "u5-03", true, now - 1000),
    ] });
    await t.mutation(api.progress.saveLesson, { token: sara.token, lessonId: "l05", scene: 14, done: true });

    const list = await t.query(api.parent.students, { token: parent.token });
    expect(list.map((s) => s.username).sort()).toEqual(["omar", "sara"]);
    const s = list.find((x) => x.username === "sara")!;
    expect(s.revise).toMatchObject([{ lessonId: "l05", wrong: 1 }]);
    expect(s.lessons).toMatchObject([{ lessonId: "l05", done: true }]);

    const d = await t.query(api.parent.student, { token: parent.token, studentId: id });
    expect(d.wrongQuestions).toMatchObject([{ questionId: "u5-01", misses: 2, tries: 2 }]);

    await expect(t.query(api.parent.students, { token: sara.token })).rejects.toThrow(/Only the parent/);
    await expect(t.query(api.parent.student, { token: sara.token, studentId: id })).rejects.toThrow(/Only the parent/);
  });
});
