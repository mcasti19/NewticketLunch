/**
 * Dark mode toggle logic with persistence across sessions.
 * Uses the data-theme attribute on the document.documentElement to toggle dark mode.
 * Persists the user's preference in localStorage under the key 'theme'.
 */

const THEME_KEY = 'theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

/**
 * Apply the given theme by setting the data-theme attribute on the root element.
 * @param {string} theme - 'dark' or 'light'
 */
export function applyTheme(theme) {
  if (theme === DARK_THEME) {
    document.documentElement.setAttribute('data-theme', DARK_THEME);
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

/**
 * Get the saved theme from localStorage.
 * @returns {string|null} 'dark', 'light', or null if no preference saved.
 */
export function getSavedTheme() {
  return localStorage.getItem(THEME_KEY);
}

/**
 * Save the theme preference to localStorage.
 * @param {string} theme - 'dark' or 'light'
 */
export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Toggle the theme between dark and light.
 * Saves the preference and applies the theme.
 */
export function toggleTheme() {
  const currentTheme = getSavedTheme() || LIGHT_THEME;
  const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
  saveTheme(newTheme);
  applyTheme(newTheme);
}

/**
 * Initialize theme on page load.
 * Applies saved theme or defaults to light.
 */
export function initTheme() {
  const savedTheme = getSavedTheme();
  if (savedTheme === DARK_THEME) {
    applyTheme(DARK_THEME);
  } else {
    applyTheme(LIGHT_THEME);
  }
}
