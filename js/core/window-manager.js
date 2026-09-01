/* Window Manager - Core Window System with Mobile Support */

class WindowManager {
  constructor() {
    this.windows = new Map();
    this.activeWindow = null;
    this.zIndexBase = 500;
    this.zIndexCounter = 500;
    this.windowContainer = HELPERS.$('#windowContainer');
    this.taskbar = HELPERS.$('#taskbar');
    this.init();
  }

  init() {
    // Use Pointer Events for cross-device support (mouse, touch, stylus, etc.)
    document.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    document.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    document.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    document.addEventListener('pointercancel', (e) => this.handlePointerCancel(e));

    // Handle window resize and orientation change
    window.addEventListener('resize', () => this.handleViewportChange());
    window.addEventListener('orientationchange', () => this.handleViewportChange());
  }

  /**
   * Get viewport dimensions accounting for taskbar
   */
  getViewportBounds() {
    const taskbarHeight = CONSTANTS.TASKBAR.HEIGHT || 48;
    return {
      width: window.innerWidth,
      height: window.innerHeight - taskbarHeight,
      taskbarHeight: taskbarHeight,
      fullHeight: window.innerHeight
    };
  }

  /**
   * Calculate responsive window size based on viewport
   */
  calculateResponsiveSize(requestedWidth, requestedHeight) {
    const bounds = this.getViewportBounds();
    const margin = 20; // Safe margin from edges
    
    // Maximum width: viewport width minus margins
    const maxWidth = Math.max(300, bounds.width - margin * 2);
    
    // Maximum height: available desktop height minus margins
    const maxHeight = Math.max(200, bounds.height - margin * 2);

    // Calculate actual window size
    let width = requestedWidth;
    let height = requestedHeight;

    // On mobile/tablet, reduce window size
    if (bounds.width < 500) {
      // Very small mobile - nearly full screen
      width = Math.min(requestedWidth, maxWidth);
      height = Math.min(requestedHeight, maxHeight);
    } else if (bounds.width < 900) {
      // Tablet - responsive sizing
      width = Math.min(requestedWidth * 0.85, maxWidth);
      height = Math.min(requestedHeight * 0.85, maxHeight);
    } else {
      // Desktop - use requested size but respect bounds
      width = Math.min(requestedWidth, maxWidth);
      height = Math.min(requestedHeight, maxHeight);
    }

    // Ensure minimum dimensions
    width = Math.max(300, width);
    height = Math.max(200, height);

    return { width, height };
  }

  /**
   * Constrain window position to viewport boundaries
   */
  constrainPosition(x, y, width, height) {
    const bounds = this.getViewportBounds();
    const margin = 20;

    // Minimum position (0, 0)
    let constrainedX = Math.max(0, x);
    let constrainedY = Math.max(0, y);

    // Maximum position - keep window fully visible
    constrainedX = Math.min(constrainedX, bounds.width - width);
    constrainedY = Math.min(constrainedY, bounds.height - height);

    // Ensure title bar is visible (at least 30px)
    constrainedY = Math.max(0, constrainedY);

    return {
      x: constrainedX,
      y: constrainedY
    };
  }

  createWindow(config) {
    const id = config.id || HELPERS.generateId();
    
    // Calculate responsive dimensions
    const responsive = this.calculateResponsiveSize(
      config.width || CONSTANTS.WINDOW.DEFAULT_WIDTH,
      config.height || CONSTANTS.WINDOW.DEFAULT_HEIGHT
    );

    // Calculate valid starting position
    const position = this.calculateWindowPosition(responsive.width, responsive.height);

    const window = new WindowElement({
      ...config,
      id,
      width: responsive.width,
      height: responsive.height,
      x: position.x,
      y: position.y,
      manager: this
    });

    this.windows.set(id, window);
    this.setActive(window);
    return window;
  }

  /**
   * Calculate sensible starting position for new windows
   */
  calculateWindowPosition(width, height) {
    const bounds = this.getViewportBounds();
    
    // Base position with some offset
    let x = 50 + (this.windows.size * 20) % 100;
    let y = 50 + (this.windows.size * 20) % 100;

    // Constrain to bounds
    const constrained = this.constrainPosition(x, y, width, height);
    return constrained;
  }

  setActive(window) {
    if (this.activeWindow) {
      HELPERS.removeClass(this.activeWindow.element, 'active');
    }
    this.activeWindow = window;
    HELPERS.addClass(window.element, 'active');
    
    // Use incremental z-index system
    this.zIndexCounter++;
    window.element.style.zIndex = this.zIndexCounter;
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

  handlePointerDown(e) {
    const titlebar = e.target.closest('.window-titlebar');
    if (!titlebar) return;

    // Ignore if clicking on control buttons
    if (e.target.closest('.window-controls')) return;

    const windowEl = titlebar.closest('.window');
    if (!windowEl) return;

    const id = windowEl.dataset.windowId;
    const window = this.windows.get(id);
    if (window) {
      this.setActive(window);
      window.startDrag(e);
    }
  }

  handlePointerMove(e) {
    if (this.activeWindow && this.activeWindow.isDragging) {
      this.activeWindow.drag(e);
    }
  }

  handlePointerUp(e) {
    if (this.activeWindow) {
      this.activeWindow.stopDrag();
    }
  }

  handlePointerCancel(e) {
    if (this.activeWindow) {
      this.activeWindow.stopDrag();
    }
  }

  /**
   * Handle viewport changes (resize, orientation)
   */
  handleViewportChange() {
    this.windows.forEach((window) => {
      if (!window.isMaximized) {
        // Validate window position against new viewport
        const constrained = this.constrainPosition(
          window.x,
          window.y,
          window.width,
          window.height
        );

        if (constrained.x !== window.x || constrained.y !== window.y) {
          window.x = constrained.x;
          window.y = constrained.y;
          window.element.style.left = window.x + 'px';
          window.element.style.top = window.y + 'px';
        }

        // Check if window needs to be resized for small viewports
        const bounds = this.getViewportBounds();
        if (window.width > bounds.width - 40) {
          window.width = Math.max(300, bounds.width - 40);
          window.element.style.width = window.width + 'px';
        }
        if (window.height > bounds.height - 40) {
          window.height = Math.max(200, bounds.height - 40);
          window.element.style.height = window.height + 'px';
        }
      }
    });
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
    this.pointerId = null;
    
    // Store original size/position for restore
    this.savedWidth = this.width;
    this.savedHeight = this.height;
    this.savedX = this.x;
    this.savedY = this.y;
    
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
    titlebar.style.touchAction = 'none'; // Prevent default touch behavior during drag
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
    this.pointerId = e.pointerId;
    
    // Capture pointer to ensure events continue even if pointer leaves element
    e.target.closest('.window-titlebar').setPointerCapture(e.pointerId);
    
    const rect = this.element.getBoundingClientRect();
    this.dragOffsetX = e.clientX - rect.left;
    this.dragOffsetY = e.clientY - rect.top;
    
    HELPERS.addClass(this.element, 'dragging');
  }

  drag(e) {
    if (!this.isDragging || this.isMaximized) return;

    // Calculate new position
    let newX = e.clientX - this.dragOffsetX;
    let newY = e.clientY - this.dragOffsetY;

    // Constrain to viewport bounds
    const constrained = this.manager.constrainPosition(
      newX,
      newY,
      this.width,
      this.height
    );

    this.x = constrained.x;
    this.y = constrained.y;

    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }

  stopDrag() {
    if (this.isDragging && this.pointerId !== null) {
      // Release pointer capture
      const titlebar = this.element.querySelector('.window-titlebar');
      if (titlebar) {
        try {
          titlebar.releasePointerCapture(this.pointerId);
        } catch (e) {
          // Element may not have captured this pointer
        }
      }
    }

    this.isDragging = false;
    this.pointerId = null;
    HELPERS.removeClass(this.element, 'dragging');
  }

  minimize() {
    this.isMinimized = true;
    HELPERS.addClass(this.element, 'minimized');
  }

  restore() {
    this.isMinimized = false;
    HELPERS.removeClass(this.element, 'minimized');
    this.manager.setActive(this);
  }

  toggleMaximize() {
    if (this.isMaximized) {
      this.restoreSize();
    } else {
      this.maximize();
    }
  }

  maximize() {
    // Save current state before maximizing
    this.savedWidth = this.width;
    this.savedHeight = this.height;
    this.savedX = this.x;
    this.savedY = this.y;

    this.isMaximized = true;
    HELPERS.addClass(this.element, 'maximized');
  }

  restoreSize() {
    this.isMaximized = false;
    HELPERS.removeClass(this.element, 'maximized');

    // Restore saved dimensions
    this.width = this.savedWidth;
    this.height = this.savedHeight;
    this.x = this.savedX;
    this.y = this.savedY;

    // Validate restored position against current viewport
    const constrained = this.manager.constrainPosition(
      this.x,
      this.y,
      this.width,
      this.height
    );

    this.x = constrained.x;
    this.y = constrained.y;

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
