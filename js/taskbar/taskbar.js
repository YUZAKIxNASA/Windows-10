/* Taskbar Module - Taskbar Functionality */

class Taskbar {
  constructor() {
    this.taskbar = HELPERS.$('#taskbar');
    this.taskbarApps = HELPERS.$('#taskbarApps');
    this.startBtn = HELPERS.$('#startBtn');
    this.systemTray = HELPERS.$('#systemTray');
    this.taskbarClock = HELPERS.$('#taskbarClock');
    this.runningApps = new Map();
    this.init();
  }

  init() {
    this.renderPinnedApps();
    this.setupEventListeners();
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  }

  renderPinnedApps() {
    this.taskbarApps.innerHTML = '';
    CONSTANTS.PINNED_APPS.forEach(app => {
      const appBtn = HELPERS.createButton('', 'taskbar-app-btn');
      appBtn.innerHTML = app.icon;
      appBtn.title = app.name;
      appBtn.dataset.appId = app.app;
      
      appBtn.addEventListener('click', () => this.launchApp(app));
      this.taskbarApps.appendChild(appBtn);
    });
  }

  launchApp(app) {
    switch (app.app) {
      case CONSTANTS.APPS.CALCULATOR:
        if (!window.calculatorApp) new CalculatorApp();
        else window.calculatorApp.focus();
        break;
      case CONSTANTS.APPS.NOTEPAD:
        if (!window.notepadApp) new NotepadApp();
        else window.notepadApp.focus();
        break;
      case CONSTANTS.APPS.PAINT:
        if (!window.paintApp) new PaintApp();
        else window.paintApp.focus();
        break;
      case CONSTANTS.APPS.FILE_EXPLORER:
        if (!window.fileExplorerApp) new FileExplorerApp();
        else window.fileExplorerApp.focus();
        break;
      case CONSTANTS.APPS.SETTINGS:
        if (!window.settingsApp) new SettingsApp();
        else window.settingsApp.focus();
        break;
    }
  }

  setupEventListeners() {
    this.startBtn.addEventListener('click', () => this.toggleStartMenu());
  }

  toggleStartMenu() {
    const startMenu = HELPERS.$('#startMenu');
    HELPERS.toggleClass(startMenu, 'hidden');
  }

  updateClock() {
    const now = new Date();
    HELPERS.setText(this.taskbarClock, HELPERS.formatTime(now));
  }
}

// Initialize
let taskbar = null;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    taskbar = new Taskbar();
  });
} else {
  taskbar = new Taskbar();
}