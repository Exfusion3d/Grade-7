/* Student accounts in the browser: sign in, sign out, and keep pages behind the login.
   Loaded as a module by every page (and bundled by Vite). The session token lives in localStorage
   (g7_token) with a cached copy of the user (g7_me), so pages open instantly and offline;
   the token is re-checked with Convex in the background. */
import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const TOKEN = "g7_token", ME = "g7_me";
const url = import.meta.env.VITE_CONVEX_URL;
const client = url ? new ConvexClient(url) : null;

const read = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const write = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} };
const message = (e) => (typeof e?.data === "string" ? e.data : "Can't reach the server. Check the internet connection and try again.");

/** The sign-in page's address, remembering where to come back to. */
function loginUrl(next) {
  const u = new URL("/login.html", location.origin);
  if (next) u.searchParams.set("next", next);
  return u.href;
}

function goToLogin() {
  write(TOKEN, null); write(ME, null);
  location.replace(loginUrl(location.pathname + location.search + location.hash));
}

/** Fill in elements that show who is signed in: [data-nickname]. */
function showUser(user) {
  document.querySelectorAll("[data-nickname]").forEach((el) => { el.textContent = user.nickname; });
  document.documentElement.dataset.role = user.role;
}

export const Account = {
  token: () => read(TOKEN),
  user: () => { try { return JSON.parse(read(ME)); } catch (e) { return null; } },

  async signIn(username, password) {
    if (!client) throw new Error("Sign-in isn't set up on this site yet.");
    try {
      const { token, ...user } = await client.action(api.auth.signIn, { username, password });
      write(TOKEN, token); write(ME, JSON.stringify(user));
      return user;
    } catch (e) { throw new Error(message(e)); }
  },

  async signOut() {
    const token = read(TOKEN);
    write(TOKEN, null); write(ME, null);
    if (client && token) { try { await client.mutation(api.auth.signOut, { token }); } catch (e) {} }
    location.replace(loginUrl());
  },

  /** Re-check the session. Signs out on an expired or revoked session; keeps going when offline. */
  async verify() {
    const token = read(TOKEN);
    if (!token) return goToLogin();
    if (!client) return;
    try {
      const user = await client.query(api.auth.me, { token });
      if (!user) return goToLogin();
      write(ME, JSON.stringify(user));
      showUser(user);
    } catch (e) { /* offline: trust the cached user for now */ }
  },
};
window.Account = Account;

// Every page except the sign-in page needs a signed-in user.
if (!document.documentElement.hasAttribute("data-public")) {
  const cached = Account.user();
  const ready = () => { if (cached) showUser(cached); Account.verify(); };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", ready) : ready();
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-signout]")) { e.preventDefault(); Account.signOut(); }
  });
}
