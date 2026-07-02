/* Theme Manager - Dark/Light/Auto Theme System */

class ThemeManager {
  constructor() {
    this.currentTheme = CONSTANTS.THEME.LIGHT;
    this.init();
  }

  init() {
    this.loadTheme();
    this.setupMediaQueryListener();
    this.setupThemeToggle();
  }

  loadTheme() {
    const savedTheme = HELPERS.getStorage(CONSTANTS.STORAGE.THEME, CONSTANTS.THEME.LIGHT);
    this.setTheme(savedTheme);
  }

  setTheme(theme) {
    // Remove all theme classes
    document.body.classList.remove(
      CONSTANTS.THEME.LIGHT,
      CONSTANTS.THEME.DARK,
      CONSTANTS.THEME.AUTO
    );

    // Add new theme class
    document.body.classList.add(theme);
    this.currentTheme = theme;

    // Save to storage
    HELPERS.setStorage(CONSTANTS.STORAGE.THEME, theme);

    // Dispatch event
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  toggleTheme() {
    const themes = [CONSTANTS.THEME.LIGHT, CONSTANTS.THEME.DARK, CONSTANTS.THEME.AUTO];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }

  getTheme() {
    return this.currentTheme;
  }

  isDarkMode() {
    if (this.currentTheme === CONSTANTS.THEME.AUTO) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.currentTheme === CONSTANTS.THEME.DARK;
  }

  setupMediaQueryListener() {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', (e) => {
      if (this.currentTheme === CONSTANTS.THEME.AUTO) {
        document.dispatchEvent(new CustomEvent('themechange', {
          detail: { theme: this.currentTheme, isDark: e.matches }
        }));
      }
    });
  }

  setupThemeToggle() {
    // Listen for theme toggle requests
    document.addEventListener('toggletheme', () => {
      this.toggleTheme();
    });
  }
}

// Initialize Theme Manager
let themeManager = null;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
  });
} else {
  themeManager = new ThemeManager();
}