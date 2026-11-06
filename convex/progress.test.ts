/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { beforeEach, describe, expect, test } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";

declare const process: { env: Record<string, string | undefined> };

const modules = import.meta.glob("./**/*.*s");

async function setUp() {
  const t = convexTest(schema, modules);
  process.env.PARENT_PASSWORD = "parent-pass-123";
  await t.action(internal.setup.createParent, { username: "mum", nickname: "Mum" });
  const parent = await t.action(api.auth.signIn, { username: "mum", password: "parent-pass-123" });
  const addStudent = async (username: string) => {
    const id = await t.action(api.students.createStudent, { token: parent.token, username, nickname: username, password: "secret1" });
    const s = await t.action(api.auth.signIn, { username, password: "secret1" });
    return { id, token: s.token };
  };
  return { t, parent, addStudent };
}

const answer = (clientId: string, questionId: string, correct: boolean, lessonId = "l05") =>
  ({ clientId, questionId, lessonId, source: "quiz" as const, correct, at: Date.now() });

describe("progress", () => {
  let ctx: Awaited<ReturnType<typeof setUp>>;
  beforeEach(async () => { ctx = await setUp(); });

  test("lesson progress is saved and 'done' stays done", async () => {
    const s = await ctx.addStudent("sara");
    await ctx.t.mutation(api.progress.saveLesson, { token: s.token, lessonId: "l03", scene: 4, done: false });
    await ctx.t.mutation(api.progress.saveLesson, { token: s.token, lessonId: "l03", scene: 9, done: true });
    await ctx.t.mutation(api.progress.saveLesson, { token: s.token, lessonId: "l03", scene: 2, done: false });
    const p = await ctx.t.query(api.progress.myProgress, { token: s.token });
    expect(p.lessons).toMatchObject([{ lessonId: "l03", lastScene: 2, done: true }]);
  });

  test("answers are saved once even if sent twice", async () => {
    const s = await ctx.addStudent("sara");
    const batch = [answer("a1", "u5-01", true), answer("a2", "u5-02", false)];
    expect(await ctx.t.mutation(api.progress.recordAnswers, { token: s.token, answers: batch })).toBe(2);
    expect(await ctx.t.mutation(api.progress.recordAnswers, { token: s.token, answers: batch })).toBe(0);
    const p = await ctx.t.query(api.progress.myProgress, { token: s.token });
    expect(p).toMatchObject({ answered: 2, correct: 1 });
  });

  test("quiz runs keep the best result per level", async () => {
    const s = await ctx.addStudent("sara");
    const run = (clientId: string, right: number) => ({ clientId, mode: "u5", right, total: 10, score: right * 100, stars: 1, at: Date.now() });
    await ctx.t.mutation(api.progress.recordQuizRun, { token: s.token, run: run("r1", 6) });
    await ctx.t.mutation(api.progress.recordQuizRun, { token: s.token, run: run("r2", 9) });
    await ctx.t.mutation(api.progress.recordQuizRun, { token: s.token, run: run("r2", 9) });
    const p = await ctx.t.query(api.progress.myProgress, { token: s.token });
    expect(p.quizBest.u5).toMatchObject({ right: 9, total: 10 });
    expect(await ctx.t.run((c) => c.db.query("quizRuns").collect())).toHaveLength(2);
  });

  test("each student only sees their own progress", async () => {
    const a = await ctx.addStudent("sara");
    const b = await ctx.addStudent("omar");
    await ctx.t.mutation(api.progress.recordAnswers, { token: a.token, answers: [answer("x", "u4-01", true)] });
    expect((await ctx.t.query(api.progress.myProgress, { token: b.token })).answered).toBe(0);
    expect((await ctx.t.query(api.progress.myProgress, { token: a.token })).answered).toBe(1);
  });

  test("nothing is saved without a valid sign-in, or for an unknown lesson", async () => {
    const s = await ctx.addStudent("sara");
    await expect(ctx.t.mutation(api.progress.saveLesson, { token: "nope", lessonId: "l01", scene: 1, done: false })).rejects.toThrow(/sign in/);
    await expect(ctx.t.mutation(api.progress.recordAnswers, { token: "nope", answers: [answer("y", "u4-01", true)] })).rejects.toThrow(/sign in/);
    await expect(ctx.t.mutation(api.progress.saveLesson, { token: s.token, lessonId: "lesson-x", scene: 1, done: false })).rejects.toThrow(/Unknown lesson/);
  });

  test("removing a student also removes their progress", async () => {
    const s = await ctx.addStudent("sara");
    await ctx.t.mutation(api.progress.saveLesson, { token: s.token, lessonId: "l01", scene: 9, done: true });
    await ctx.t.mutation(api.progress.recordAnswers, { token: s.token, answers: [answer("z", "u4-01", false)] });
    await ctx.t.mutation(api.students.removeStudent, { token: ctx.parent.token, studentId: s.id });
    const left = await ctx.t.run(async (c) => [
      ...(await c.db.query("lessonProgress").collect()), ...(await c.db.query("answers").collect()),
    ]);
    expect(left).toHaveLength(0);
  });

  test("an unfinished quiz level and the place in a lesson can be resumed, and cleared", async () => {
    const s = await ctx.addStudent("sara");
    await ctx.t.mutation(api.progress.saveQuizState, { token: s.token, mode: "u5", state: '{"i":3}' });
    await ctx.t.mutation(api.progress.saveQuizState, { token: s.token, mode: "u5", state: '{"i":4}' });
    await ctx.t.mutation(api.progress.saveLesson, { token: s.token, lessonId: "l06", scene: 9, step: 2, done: false });
    let r = await ctx.t.query(api.progress.resumeInfo, { token: s.token });
    expect(r.quizzes).toMatchObject([{ mode: "u5", state: '{"i":4}' }]);
    expect(r.lessons).toMatchObject([{ lessonId: "l06", lastScene: 9, step: 2 }]);
    await ctx.t.mutation(api.progress.saveQuizState, { token: s.token, mode: "u5", state: null });
    r = await ctx.t.query(api.progress.resumeInfo, { token: s.token });
    expect(r.quizzes).toEqual([]);
    const other = await ctx.addStudent("omar");
    expect((await ctx.t.query(api.progress.resumeInfo, { token: other.token })).lessons).toEqual([]);
  });
});
