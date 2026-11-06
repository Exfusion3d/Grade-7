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
  await t.action(internal.setup.createParent, { username: "Mum", nickname: "Mum" });
  const parent = await t.action(api.auth.signIn, { username: "mum", password: "parent-pass-123" });
  return { t, parent };
}

describe("sign-in", () => {
  let ctx: Awaited<ReturnType<typeof setUp>>;
  beforeEach(async () => { ctx = await setUp(); });

  test("the parent can sign in and is recognised", async () => {
    expect(ctx.parent.role).toBe("parent");
    expect(await ctx.t.query(api.auth.me, { token: ctx.parent.token })).toEqual({ username: "mum", nickname: "Mum", role: "parent" });
  });

  test("a wrong password or unknown user is refused with the same message", async () => {
    await expect(ctx.t.action(api.auth.signIn, { username: "mum", password: "nope-nope" })).rejects.toThrow(/don't match/);
    await expect(ctx.t.action(api.auth.signIn, { username: "nobody", password: "whatever1" })).rejects.toThrow(/don't match/);
  });

  test("five wrong tries lock the login, even for the right password", async () => {
    for (let i = 0; i < 5; i++) {
      await expect(ctx.t.action(api.auth.signIn, { username: "mum", password: "wrong-" + i })).rejects.toThrow();
    }
    await expect(ctx.t.action(api.auth.signIn, { username: "mum", password: "parent-pass-123" })).rejects.toThrow(/Too many/);
  });

  test("signing out ends the session", async () => {
    await ctx.t.mutation(api.auth.signOut, { token: ctx.parent.token });
    expect(await ctx.t.query(api.auth.me, { token: ctx.parent.token })).toBeNull();
  });

  test("an unknown token is not signed in", async () => {
    expect(await ctx.t.query(api.auth.me, { token: "made-up" })).toBeNull();
    expect(await ctx.t.query(api.auth.me, {})).toBeNull();
  });

  test("a second parent login cannot be created", async () => {
    await expect(ctx.t.action(internal.setup.createParent, { username: "dad", nickname: "Dad" })).rejects.toThrow(/already exists/);
  });
});

describe("student logins", () => {
  let ctx: Awaited<ReturnType<typeof setUp>>;
  beforeEach(async () => { ctx = await setUp(); });
  const add = (token: string, username = "Sara.K", password = "rocket7") =>
    ctx.t.action(api.students.createStudent, { token, username, nickname: "Sara", password });

  test("the parent creates a student, who can then sign in", async () => {
    await add(ctx.parent.token);
    const s = await ctx.t.action(api.auth.signIn, { username: "SARA.K", password: "rocket7" });
    expect(s).toMatchObject({ username: "sara.k", nickname: "Sara", role: "student" });
    const list = await ctx.t.query(api.students.listStudents, { token: ctx.parent.token });
    expect(list.map((x) => x.username)).toEqual(["sara.k"]);
  });

  test("usernames must be unique and valid, passwords at least 6 characters", async () => {
    await add(ctx.parent.token);
    await expect(add(ctx.parent.token)).rejects.toThrow(/taken/);
    await expect(add(ctx.parent.token, "a b")).rejects.toThrow(/Usernames/);
    await expect(add(ctx.parent.token, "tom", "12345")).rejects.toThrow(/6 characters/);
  });

  test("a student cannot create, list, reset or remove logins", async () => {
    const id = await add(ctx.parent.token);
    const s = await ctx.t.action(api.auth.signIn, { username: "sara.k", password: "rocket7" });
    await expect(add(s.token, "friend")).rejects.toThrow(/Only the parent/);
    await expect(ctx.t.query(api.students.listStudents, { token: s.token })).rejects.toThrow(/Only the parent/);
    await expect(ctx.t.action(api.students.resetPassword, { token: s.token, studentId: id, password: "hacked1" })).rejects.toThrow(/Only the parent/);
    await expect(ctx.t.mutation(api.students.removeStudent, { token: s.token, studentId: id })).rejects.toThrow(/Only the parent/);
  });

  test("nobody signed out can create a login", async () => {
    await expect(add("made-up")).rejects.toThrow(/sign in/);
  });

  test("a password reset signs the student out and the new password works", async () => {
    const id = await add(ctx.parent.token);
    const s = await ctx.t.action(api.auth.signIn, { username: "sara.k", password: "rocket7" });
    await ctx.t.action(api.students.resetPassword, { token: ctx.parent.token, studentId: id, password: "planet9" });
    expect(await ctx.t.query(api.auth.me, { token: s.token })).toBeNull();
    await expect(ctx.t.action(api.auth.signIn, { username: "sara.k", password: "rocket7" })).rejects.toThrow();
    await expect(ctx.t.action(api.auth.signIn, { username: "sara.k", password: "planet9" })).resolves.toMatchObject({ role: "student" });
  });

  test("removing a student deletes the login and its sessions", async () => {
    const id = await add(ctx.parent.token);
    const s = await ctx.t.action(api.auth.signIn, { username: "sara.k", password: "rocket7" });
    await ctx.t.mutation(api.students.removeStudent, { token: ctx.parent.token, studentId: id });
    expect(await ctx.t.query(api.auth.me, { token: s.token })).toBeNull();
    await expect(ctx.t.action(api.auth.signIn, { username: "sara.k", password: "rocket7" })).rejects.toThrow();
  });

  test("the parent login cannot be reset or removed through the student tools", async () => {
    const parentId = (await ctx.t.run((c) => c.db.query("profiles").collect()))[0]._id;
    await expect(ctx.t.action(api.students.resetPassword, { token: ctx.parent.token, studentId: parentId, password: "newpass1" })).rejects.toThrow(/not found/);
    await expect(ctx.t.mutation(api.students.removeStudent, { token: ctx.parent.token, studentId: parentId })).rejects.toThrow(/not found/);
  });

  test("passwords and session tokens are never stored in plain text", async () => {
    await add(ctx.parent.token);
    const s = await ctx.t.action(api.auth.signIn, { username: "sara.k", password: "rocket7" });
    const dump = JSON.stringify(await ctx.t.run(async (c) => [await c.db.query("profiles").collect(), await c.db.query("sessions").collect()]));
    expect(dump).not.toContain("rocket7");
    expect(dump).not.toContain(s.token);
  });
});
