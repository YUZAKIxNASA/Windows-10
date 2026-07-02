/* Settings App */

class SettingsApp {
  constructor() {
    this.window = null;
    window.settingsApp = this;
    this.create();
  }

  create() {
    this.window = windowManager.createWindow({
      id: CONSTANTS.APPS.SETTINGS,
      title: 'Settings',
      icon: '⚙️',
      width: 900,
      height: 700,
      x: 200,
      y: 100,
      onClose: () => { window.settingsApp = null; }
    });

    this.render();
  }

  render() {
    const html = `
      <div class="settings-container">
        <div class="settings-sidebar">
          <button class="settings-nav-btn active" data-section="system">🖥️ System</button>
          <button class="settings-nav-btn" data-section="display">🎨 Display</button>
          <button class="settings-nav-btn" data-section="personalization">🎭 Personalization</button>
          <button class="settings-nav-btn" data-section="apps">📦 Apps</button>
          <button class="settings-nav-btn" data-section="accounts">👤 Accounts</button>
          <button class="settings-nav-btn" data-section="privacy">🔒 Privacy</button>
        </div>
        <div class="settings-content" id="settingsContent">
          <!-- Settings sections will be rendered here -->
        </div>
      </div>
    `;

    this.window.setContent(html);
    this.renderSystemSettings();
    this.setupEventListeners();
  }

  renderSystemSettings() {
    const content = `
      <div class="settings-section">
        <h2>System Settings</h2>
        <div class="settings-item">
          <label>Device Name</label>
          <input type="text" value="DESKTOP-USER" class="settings-input" readonly>
        </div>
        <div class="settings-item">
          <label>Windows Version</label>
          <input type="text" value="Windows 10 Professional" class="settings-input" readonly>
        </div>
        <div class="settings-item">
          <label>Processor</label>
          <input type="text" value="Intel Core i7" class="settings-input" readonly>
        </div>
        <div class="settings-item">
          <label>RAM</label>
          <input type="text" value="16 GB" class="settings-input" readonly>
        </div>
        <div class="settings-item">
          <label>Theme</label>
          <select class="settings-select" id="themeSelect">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>
    `;

    const contentEl = this.window.contentElement.querySelector('#settingsContent');
    contentEl.innerHTML = content;

    const themeSelect = contentEl.querySelector('#themeSelect');
    if (themeSelect && themeManager) {
      themeSelect.value = themeManager.getTheme();
      themeSelect.addEventListener('change', (e) => {
        themeManager.setTheme(e.target.value);
      });
    }
  }

  setupEventListeners() {
    const navBtns = this.window.contentElement.querySelectorAll('.settings-nav-btn');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        navBtns.forEach(b => HELPERS.removeClass(b, 'active'));
        HELPERS.addClass(btn, 'active');
        const section = btn.dataset.section;
        this.renderSection(section);
      });
    });
  }

  renderSection(section) {
    const contentEl = this.window.contentElement.querySelector('#settingsContent');
    const sections = {
      system: this.renderSystemSettings.bind(this),
      display: this.renderDisplaySettings.bind(this),
      personalization: this.renderPersonalizationSettings.bind(this),
      apps: this.renderAppsSettings.bind(this),
      accounts: this.renderAccountsSettings.bind(this),
      privacy: this.renderPrivacySettings.bind(this)
    };

    if (sections[section]) {
      sections[section]();
    }
  }

  renderDisplaySettings() {
    const content = `
      <div class="settings-section">
        <h2>Display Settings</h2>
        <div class="settings-item">
          <label>Brightness</label>
          <input type="range" min="0" max="100" value="100" class="settings-slider">
        </div>
        <div class="settings-item">
          <label>Scaling</label>
          <select class="settings-select"><option>100%</option><option>125%</option><option>150%</option></select>
        </div>
      </div>
    `;
    HELPERS.setHTML(this.window.contentElement.querySelector('#settingsContent'), content);
  }

  renderPersonalizationSettings() {
    const content = `
      <div class="settings-section">
        <h2>Personalization Settings</h2>
        <p>Customize your desktop experience</p>
      </div>
    `;
    HELPERS.setHTML(this.window.contentElement.querySelector('#settingsContent'), content);
  }

  renderAppsSettings() {
    const content = `
      <div class="settings-section">
        <h2>Apps & Features</h2>
        <div class="settings-item">Calculator</div>
        <div class="settings-item">Notepad</div>
        <div class="settings-item">Paint</div>
      </div>
    `;
    HELPERS.setHTML(this.window.contentElement.querySelector('#settingsContent'), content);
  }

  renderAccountsSettings() {
    const content = `
      <div class="settings-section">
        <h2>Account Settings</h2>
        <div class="settings-item">Username: User</div>
      </div>
    `;
    HELPERS.setHTML(this.window.contentElement.querySelector('#settingsContent'), content);
  }

  renderPrivacySettings() {
    const content = `
      <div class="settings-section">
        <h2>Privacy & Security</h2>
        <p>Manage your privacy settings</p>
      </div>
    `;
    HELPERS.setHTML(this.window.contentElement.querySelector('#settingsContent'), content);
  }

  focus() {
    windowManager.setActive(this.window);
  }
}