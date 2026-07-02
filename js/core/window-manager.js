/* Window Manager - Core Window System */

class WindowManager {
  constructor() {
    this.windows = new Map();
    this.activeWindow = null;
    this.zIndexBase = 500;
    this.windowContainer = HELPERS.$('#windowContainer');
    this.init();
  }

  init() {
    // Listen for window interactions
    document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
  }

  createWindow(config) {
    const id = config.id || HELPERS.generateId();
    const window = new WindowElement({
      ...config,
      id,
      manager: this
    });

    this.windows.set(id, window);
    this.setActive(window);
    return window;
  }

  setActive(window) {
    if (this.activeWindow) {
      HELPERS.removeClass(this.activeWindow.element, 'active');
    }
    this.activeWindow = window;
    HELPERS.addClass(window.element, 'active');
    window.element.style.zIndex = this.zIndexBase + this.windows.size * 100;
  }

  closeWindow(id) {
    const window = this.windows.get(id);
    if (window) {
      window.close();
      this.windows.delete(id);
    }
  }

  minimizeWindow(id) {
    const window = this.windows.get(id);
    if (window) window.minimize();
  }

  maximizeWindow(id) {
    const window = this.windows.get(id);
    if (window) window.maximize();
  }

  getWindow(id) {
    return this.windows.get(id);
  }

  getAll() {
    return Array.from(this.windows.values());
  }

  handleMouseDown(e) {
    const titlebar = e.target.closest('.window-titlebar');
    if (titlebar) {
      const windowEl = titlebar.closest('.window');
      const id = windowEl.dataset.windowId;
      const window = this.windows.get(id);
      if (window) {
        this.setActive(window);
        window.startDrag(e);
      }
    }
  }

  handleMouseMove(e) {
    if (this.activeWindow && this.activeWindow.isDragging) {
      this.activeWindow.drag(e);
    }
  }

  handleMouseUp() {
    if (this.activeWindow) {
      this.activeWindow.stopDrag();
    }
  }
}

class WindowElement {
  constructor(config) {
    this.id = config.id;
    this.title = config.title || 'Untitled';
    this.icon = config.icon || '📄';
    this.width = config.width || CONSTANTS.WINDOW.DEFAULT_WIDTH;
    this.height = config.height || CONSTANTS.WINDOW.DEFAULT_HEIGHT;
    this.x = config.x || 50;
    this.y = config.y || 50;
    this.minWidth = config.minWidth || CONSTANTS.WINDOW.MIN_WIDTH;
    this.minHeight = config.minHeight || CONSTANTS.WINDOW.MIN_HEIGHT;
    this.isMaximized = false;
    this.isMinimized = false;
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.manager = config.manager;
    this.onClose = config.onClose;
    this.render();
  }

  render() {
    this.element = HELPERS.createDiv('window');
    this.element.dataset.windowId = this.id;
    this.element.style.width = this.width + 'px';
    this.element.style.height = this.height + 'px';
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';

    // Titlebar
    const titlebar = HELPERS.createDiv('window-titlebar');
    const titleContent = HELPERS.createDiv('window-title');
    titleContent.innerHTML = `<span class="window-icon">${this.icon}</span><span>${this.title}</span>`;
    titlebar.appendChild(titleContent);

    // Controls
    const controls = HELPERS.createDiv('window-controls');
    const minimizeBtn = HELPERS.createButton('_', 'window-control-btn');
    const maximizeBtn = HELPERS.createButton('□', 'window-control-btn');
    const closeBtn = HELPERS.createButton('×', 'window-control-btn close');

    minimizeBtn.addEventListener('click', () => this.minimize());
    maximizeBtn.addEventListener('click', () => this.toggleMaximize());
    closeBtn.addEventListener('click', () => this.close());

    controls.appendChild(minimizeBtn);
    controls.appendChild(maximizeBtn);
    controls.appendChild(closeBtn);
    titlebar.appendChild(controls);

    // Content
    this.contentElement = HELPERS.createDiv('window-content');
    if (typeof this.render_content === 'function') {
      this.render_content();
    }

    this.element.appendChild(titlebar);
    this.element.appendChild(this.contentElement);
    this.manager.windowContainer.appendChild(this.element);
  }

  startDrag(e) {
    this.isDragging = true;
    const rect = this.element.getBoundingClientRect();
    this.dragOffsetX = e.clientX - rect.left;
    this.dragOffsetY = e.clientY - rect.top;
  }

  drag(e) {
    if (!this.isMaximized) {
      this.x = e.clientX - this.dragOffsetX;
      this.y = e.clientY - this.dragOffsetY;
      this.element.style.left = this.x + 'px';
      this.element.style.top = this.y + 'px';
    }
  }

  stopDrag() {
    this.isDragging = false;
  }

  minimize() {
    this.isMinimized = true;
    HELPERS.addClass(this.element, 'minimized');
  }

  restore() {
    this.isMinimized = false;
    HELPERS.removeClass(this.element, 'minimized');
  }

  toggleMaximize() {
    if (this.isMaximized) {
      this.restore();
    } else {
      this.maximize();
    }
  }

  maximize() {
    this.isMaximized = true;
    HELPERS.addClass(this.element, 'maximized');
  }

  restoreSize() {
    this.isMaximized = false;
    HELPERS.removeClass(this.element, 'maximized');
    this.element.style.width = this.width + 'px';
    this.element.style.height = this.height + 'px';
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }

  close() {
    HELPERS.addClass(this.element, 'closing');
    setTimeout(() => {
      this.element.remove();
      if (this.onClose) this.onClose();
      this.manager.windows.delete(this.id);
    }, 200);
  }

  setContent(html) {
    this.contentElement.innerHTML = html;
  }

  setTitle(title) {
    this.title = title;
  }
}

// Initialize
let windowManager = null;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    windowManager = new WindowManager();
  });
} else {
  windowManager = new WindowManager();
}