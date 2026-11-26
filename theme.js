(() => {
  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;

  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch {
    // Keep the toggle working when browser storage is unavailable.
  }

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
      toggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
  };

  const preferredTheme = () => preference || (systemTheme.matches ? 'dark' : 'light');
  applyTheme(preferredTheme());

  systemTheme.addEventListener('change', () => {
    if (!preference) applyTheme(preferredTheme());
  });

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    applyTheme(preferredTheme());
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(preference);
      try {
        localStorage.setItem('theme', preference);
      } catch {
        // The selected theme still applies for the current visit.
      }
    });
  });
})();
