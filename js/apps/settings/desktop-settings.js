/* Desktop Settings App - js/apps/settings/desktop-settings.js */

class DesktopSettingsApp {
  constructor() {
    this.window = null;
    this.app = null;
    this.createWindow();
  }

  createWindow() {
    this.window = windowManager.createWindow({
      title: '⚙️ Desktop Settings',
      icon: '⚙️',
      width: 700,
      height: 600,
      minWidth: 500,
      minHeight: 400,
      onClose: () => this._onWindowClose(),
      render_content: () => this._renderContent()
    });

    this.app = this;
    window.desktopSettingsApp = this;
  }

  focus() {
    if (this.window) this.window.manager.setActive(this.window);
  }

  _renderContent() {
    const container = this.window.contentElement;
    container.innerHTML = '';
    container.classList.add('desktop-settings-app');

    const header = HELPERS.createDiv('settings-header');
    header.innerHTML = '<h2>Desktop Settings</h2>';

    const tabsContainer = HELPERS.createDiv('settings-tabs');
    const tab1 = HELPERS.createButton('Items', 'settings-tab active');
    const tab2 = HELPERS.createButton('Layout', 'settings-tab');
    const tab3 = HELPERS.createButton('Reset', 'settings-tab');
    tabsContainer.appendChild(tab1);
    tabsContainer.appendChild(tab2);
    tabsContainer.appendChild(tab3);

    const content = HELPERS.createDiv('settings-content');
    const itemsPanel = HELPERS.createDiv('settings-panel active');
    const layoutPanel = HELPERS.createDiv('settings-panel');
    const resetPanel = HELPERS.createDiv('settings-panel');

    // Items Panel - Show/Hide Controls
    this._renderItemsPanel(itemsPanel);

    // Layout Panel - Grid/Free Controls
    this._renderLayoutPanel(layoutPanel);

    // Reset Panel - Reset Options
    this._renderResetPanel(resetPanel);

    content.appendChild(itemsPanel);
    content.appendChild(layoutPanel);
    content.appendChild(resetPanel);

    container.appendChild(header);
    container.appendChild(tabsContainer);
    container.appendChild(content);

    // Tab switching
    tab1.addEventListener('click', () => this._switchTab(0, [itemsPanel, layoutPanel, resetPanel], [tab1, tab2, tab3]));
    tab2.addEventListener('click', () => this._switchTab(1, [itemsPanel, layoutPanel, resetPanel], [tab1, tab2, tab3]));
    tab3.addEventListener('click', () => this._switchTab(2, [itemsPanel, layoutPanel, resetPanel], [tab1, tab2, tab3]));
  }

  _switchTab(tabIndex, panels, tabs) {
    panels.forEach((panel, idx) => {
      if (idx === tabIndex) {
        HELPERS.addClass(panel, 'active');
      } else {
        HELPERS.removeClass(panel, 'active');
      }
    });

    tabs.forEach((tab, idx) => {
      if (idx === tabIndex) {
        HELPERS.addClass(tab, 'active');
      } else {
        HELPERS.removeClass(tab, 'active');
      }
    });
  }

  _renderItemsPanel(panel) {
    panel.innerHTML = '';
    panel.classList.add('items-panel');

    const title = HELPERS.createDiv('section-title');
    title.textContent = 'Desktop Items';
    panel.appendChild(title);

    const description = HELPERS.createDiv('section-description');
    description.textContent = 'Choose which items to show on your desktop';
    panel.appendChild(description);

    const itemsList = HELPERS.createDiv('items-list');

    // Get all desktop items (CONSTANTS + Browser + other apps)
    const allItems = this._getAllDesktopItems();
    const visibility = desktopCustomization ? desktopCustomization.getVisibilityState() : {};

    allItems.forEach(item => {
      const itemRow = HELPERS.createDiv('item-row');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'item-checkbox';
      checkbox.checked = visibility[item.id] !== false;
      checkbox.dataset.itemId = item.id;

      const label = HELPERS.createDiv('item-label');
      label.innerHTML = `<span class="item-icon">${item.icon}</span><span class="item-name">${item.name}</span>`;

      itemRow.appendChild(checkbox);
      itemRow.appendChild(label);

      checkbox.addEventListener('change', () => {
        if (desktopCustomization) {
          desktopCustomization.setItemVisibility(item.id, checkbox.checked);
        }
      });

      itemsList.appendChild(itemRow);
    });

    panel.appendChild(itemsList);
  }

  _renderLayoutPanel(panel) {
    panel.innerHTML = '';
    panel.classList.add('layout-panel');

    const title = HELPERS.createDiv('section-title');
    title.textContent = 'Layout Mode';
    panel.appendChild(title);

    const description = HELPERS.createDiv('section-description');
    description.textContent = 'Choose how desktop items are arranged';
    panel.appendChild(description);

    const currentMode = desktopCustomization ? desktopCustomization.getLayoutMode() : 'grid';

    // Grid Mode
    const gridOption = HELPERS.createDiv('mode-option');
    const gridRadio = document.createElement('input');
    gridRadio.type = 'radio';
    gridRadio.name = 'layout-mode';
    gridRadio.value = 'grid';
    gridRadio.checked = currentMode === 'grid';
    gridRadio.className = 'mode-radio';

    const gridLabel = HELPERS.createDiv('mode-label');
    gridLabel.innerHTML = `
      <div class="mode-icon">📊</div>
      <div class="mode-info">
        <div class="mode-title">Automatic Grid</div>
        <div class="mode-desc">Icons are arranged in a neat grid</div>
      </div>
    `;

    gridOption.appendChild(gridRadio);
    gridOption.appendChild(gridLabel);
    panel.appendChild(gridOption);

    // Free Mode
    const freeOption = HELPERS.createDiv('mode-option');
    const freeRadio = document.createElement('input');
    freeRadio.type = 'radio';
    freeRadio.name = 'layout-mode';
    freeRadio.value = 'free';
    freeRadio.checked = currentMode === 'free';
    freeRadio.className = 'mode-radio';

    const freeLabel = HELPERS.createDiv('mode-label');
    freeLabel.innerHTML = `
      <div class="mode-icon">🖱️</div>
      <div class="mode-info">
        <div class="mode-title">Free Position</div>
        <div class="mode-desc">Drag icons anywhere on your desktop</div>
      </div>
    `;

    freeOption.appendChild(freeRadio);
    freeOption.appendChild(freeLabel);
    panel.appendChild(freeOption);

    // Event listeners
    gridRadio.addEventListener('change', () => {
      if (desktopCustomization && gridRadio.checked) {
        desktopCustomization.setLayoutMode('grid');
      }
    });

    freeRadio.addEventListener('change', () => {
      if (desktopCustomization && freeRadio.checked) {
        desktopCustomization.setLayoutMode('free');
      }
    });
  }

  _renderResetPanel(panel) {
    panel.innerHTML = '';
    panel.classList.add('reset-panel');

    const title = HELPERS.createDiv('section-title');
    title.textContent = 'Reset Desktop';
    panel.appendChild(title);

    // Reset Positions
    const resetPosSection = HELPERS.createDiv('reset-section');
    resetPosSection.innerHTML = `
      <div class="reset-item">
        <div class="reset-info">
          <div class="reset-title">Reset Icon Positions</div>
          <div class="reset-desc">Restore icons to their default positions</div>
        </div>
        <button class="reset-button" id="resetPositionsBtn">Reset</button>
      </div>
    `;
    panel.appendChild(resetPosSection);

    // Reset Everything
    const resetAllSection = HELPERS.createDiv('reset-section');
    resetAllSection.innerHTML = `
      <div class="reset-item">
        <div class="reset-info">
          <div class="reset-title">Reset All Settings</div>
          <div class="reset-desc">Restore all desktop settings to default</div>
        </div>
        <button class="reset-button danger" id="resetAllBtn">Reset All</button>
      </div>
    `;
    panel.appendChild(resetAllSection);

    // Button handlers
    const resetPosBtn = panel.querySelector('#resetPositionsBtn');
    const resetAllBtn = panel.querySelector('#resetAllBtn');

    resetPosBtn.addEventListener('click', () => {
      if (desktopCustomization) {
        desktopCustomization.resetPositions();
        this._showNotification('Icon Positions Reset', 'All icons have been restored to their default positions');
      }
    });

    resetAllBtn.addEventListener('click', () => {
      if (confirm('Are you sure? This will reset all desktop settings to default.')) {
        if (desktopCustomization) {
          desktopCustomization.resetLayout();
          this._showNotification('Desktop Reset', 'All desktop settings have been restored to default');
          // Refresh items panel
          const itemsPanel = this.window.contentElement.querySelector('.items-panel');
          if (itemsPanel) {
            this._renderItemsPanel(itemsPanel);
          }
        }
      }
    });
  }

  _getAllDesktopItems() {
    const items = [];

    // Add items from CONSTANTS.DESKTOP_ICONS
    CONSTANTS.DESKTOP_ICONS.forEach(icon => {
      items.push({
        id: icon.id,
        name: icon.name,
        icon: icon.icon
      });
    });

    // Add Browser if not already present
    if (!items.find(item => item.id === 'browser')) {
      items.push({
        id: 'browser',
        name: 'Browser',
        icon: '🌐'
      });
    }

    return items;
  }

  _showNotification(title, message) {
    const notification = HELPERS.createDiv('notification-toast');
    notification.innerHTML = `
      <div class="notification-header">${title}</div>
      <div class="notification-body">${message}</div>
    `;

    const container = HELPERS.$('#notificationContainer');
    if (container) {
      container.appendChild(notification);
      setTimeout(() => {
        HELPERS.addClass(notification, 'animate-slideOutRight');
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  }

  _onWindowClose() {
    window.desktopSettingsApp = null;
  }
}

function launchDesktopSettingsApp() {
  if (window.desktopSettingsApp) {
    window.desktopSettingsApp.focus();
  } else {
    new DesktopSettingsApp();
  }
}

window.LaunchDesktopSettingsApp = launchDesktopSettingsApp;
