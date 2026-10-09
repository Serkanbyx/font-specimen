/* Runs before the bundle so the first paint matches the saved scheme.
   The key matches `themeKey` in src/lib/theme.ts. Inline scripts are blocked by the production CSP. */
(function () {
  var key = 'font-specimen:theme';
  var mode = 'system';
  try {
    var stored = localStorage.getItem(key);
    if (stored === 'light' || stored === 'dark' || stored === 'system') mode = stored;
  } catch {
    mode = 'system';
  }
  var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var resolved = mode === 'system' ? (dark ? 'dark' : 'light') : mode;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
})();
