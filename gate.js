/* Login gate, loaded first in every page's <head>. Signed-out visitors go straight to the sign-in page,
   before anything else loads or speaks. src/account.js then checks the session is still valid. */
(function () {
  if (window.__TEST__) return; // the scene tester runs lessons without an account
  var token = null;
  try { token = localStorage.getItem('g7_token'); } catch (e) {}
  if (token) return;
  document.documentElement.style.display = 'none';
  var login = new URL('login.html', document.currentScript.src);
  login.searchParams.set('next', location.pathname + location.search + location.hash);
  location.replace(login.href);
})();
