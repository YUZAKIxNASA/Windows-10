/* Desktop Module - Desktop Functionality */

class Desktop {
  constructor() {
    this.desktopElement = HELPERS.$('#desktop');
    this.desktopIcons = HELPERS.$('#desktopIcons');
    this.contextMenu = HELPERS.$('#desktopContextMenu');
    this.wallpaperEl = HELPERS.$('#desktopWallpaper');
    this.selectedIcon = null;
    this.init();
  }

  init() {
    this.renderDesktopIcons();
    this.setupEventListeners();
    this.applyWallpaper();
  }

  renderDesktopIcons() {
    this.desktopIcons.innerHTML = '';
    CONSTANTS.DESKTOP_ICONS.forEach((iconData, index) => {
      const iconEl = HELPERS.createDiv('desktop-icon-item');
      iconEl.innerHTML = `
        <div class="desktop-icon-wrapper">
          <div class="desktop-icon-image">${iconData.icon}</div>
          <div class="desktop-icon-label">${iconData.name}</div>
        </div>
      `;
      iconEl.dataset.iconId = iconData.id;
      iconEl.style.gridColumn = (index % CONSTANTS.DESKTOP.GRID_COLUMNS) + 1;
      
      iconEl.addEventListener('dblclick', () => this.openIcon(iconData));
      iconEl.addEventListener('click', (e) => this.selectIcon(iconEl, e));
      iconEl.addEventListener('contextmenu', (e) => this.showContextMenu(e));
      
      this.desktopIcons.appendChild(iconEl);
    });
  }

  selectIcon(iconEl, e) {
    if (this.selectedIcon) {
      HELPERS.removeClass(this.selectedIcon, 'selected');
    }
    this.selectedIcon = iconEl;
    HELPERS.addClass(iconEl, 'selected');
    e.preventDefault();
  }

  openIcon(iconData) {
    switch (iconData.id) {
      case 'this-pc':
        this.openFileExplorer('C:/');
        break;
      case 'documents':
        this.openFileExplorer(CONSTANTS.FILE_SYSTEM.FOLDERS.DOCUMENTS);
        break;
      case 'downloads':
        this.openFileExplorer(CONSTANTS.FILE_SYSTEM.FOLDERS.DOWNLOADS);
        break;
      case 'recycle-bin':
        this.showNotification('Recycle Bin', 'The recycle bin is empty');
        break;
    }
  }

  openFileExplorer(path) {
    if (window.fileExplorerApp) {
      window.fileExplorerApp.open(path);
    } else {
      this.showNotification('File Explorer', 'Opening ' + path);
    }
  }

  showContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    
    this.contextMenu.style.display = 'block';
    this.contextMenu.style.left = e.clientX + 'px';
    this.contextMenu.style.top = e.clientY + 'px';
    
    const handleClick = () => {
      this.contextMenu.style.display = 'none';
      document.removeEventListener('click', handleClick);
    };
    
    document.addEventListener('click', handleClick);
  }

  showNotification(title, message) {
    const notification = HELPERS.createDiv('notification-toast');
    notification.innerHTML = `
      <div class="notification-header">${title}</div>
      <div class="notification-body">${message}</div>
    `;
    
    const container = HELPERS.$('#notificationContainer');
    container.appendChild(notification);
    
    HELPERS.addClass(notification, 'animate-slideInUp');
    
    setTimeout(() => {
      HELPERS.addClass(notification, 'animate-slideOutRight');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  applyWallpaper() {
    const wallpaper = HELPERS.getStorage(
      CONSTANTS.STORAGE.WALLPAPER,
      CONSTANTS.WALLPAPERS.DEFAULT
    );
    this.wallpaperEl.style.background = wallpaper;
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      if (this.selectedIcon && !e.target.closest('.desktop-icon-item')) {
        HELPERS.removeClass(this.selectedIcon, 'selected');
        this.selectedIcon = null;
      }
    });
  }
}

// Initialize
let desktop = null;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    desktop = new Desktop();
  });
} else {
  desktop = new Desktop();
}