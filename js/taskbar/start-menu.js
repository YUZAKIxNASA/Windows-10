/* Start Menu Module - Start Menu Functionality */

class StartMenu {
  constructor() {
    this.startMenu = HELPERS.$('#startMenu');
    this.startSearchInput = HELPERS.$('#startSearchInput');
    this.startPinned = HELPERS.$('#startPinned');
    this.startRecommended = HELPERS.$('#startRecommended');
    this.startSettings = HELPERS.$('#startSettings');
    this.startPower = HELPERS.$('#startPower');
    this.init();
  }

  init() {
    this.renderPinnedApps();
    this.renderRecommendedApps();
    this.setupEventListeners();
  }

  renderPinnedApps() {
    this.startPinned.innerHTML = '';
    CONSTANTS.PINNED_APPS.forEach(app => {
      const appTile = HELPERS.createDiv('start-app-tile');
      appTile.innerHTML = `
        <div class="app-tile-icon">${app.icon}</div>
        <div class="app-tile-name">${app.name}</div>
      `;
      appTile.addEventListener('click', () => this.launchApp(app));
      this.startPinned.appendChild(appTile);
    });
  }

  renderRecommendedApps() {
    this.startRecommended.innerHTML = '';
    const recommendedApps = [
      { name: 'Settings', icon: '⚙️', app: CONSTANTS.APPS.SETTINGS },
      { name: 'File Explorer', icon: '📁', app: CONSTANTS.APPS.FILE_EXPLORER },
      { name: 'Task Manager', icon: '📊', app: CONSTANTS.APPS.TASK_MANAGER },
      { name: 'Terminal', icon: '🖥️', app: CONSTANTS.APPS.TERMINAL }
    ];

    recommendedApps.forEach(app => {
      const item = HELPERS.createDiv('start-recommended-item');
      item.innerHTML = `<span>${app.icon}</span><span>${app.name}</span>`;
      item.addEventListener('click', () => this.launchApp(app));
      this.startRecommended.appendChild(item);
    });
  }

  launchApp(app) {
    if (taskbar) taskbar.launchApp(app);
  }

  setupEventListeners() {
    this.startSettings.addEventListener('click', () => {
      this.launchApp({ app: CONSTANTS.APPS.SETTINGS });
    });

    this.startPower.addEventListener('click', () => {
      this.showPowerMenu();
    });

    this.startSearchInput.addEventListener('input', (e) => {
      this.search(e.target.value);
    });
  }

  search(query) {
    // Search functionality would filter apps
    console.log('Searching for:', query);
  }

  showPowerMenu() {
    const powerMenu = HELPERS.$('#powerMenu');
    HELPERS.toggleClass(powerMenu, 'hidden');
  }
}

// Initialize
let startMenu = null;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    startMenu = new StartMenu();
  });
} else {
  startMenu = new StartMenu();
}