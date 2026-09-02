/* Main Application Initialization - js/core/app.js */

class MainApp {
  constructor() {
    this.initialized = false;
    this.init();
  }

  async init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      await this.start();
    }
  }

  async start() {
    if (this.initialized) return;
    this.initialized = true;

    // Ensure window manager is ready
    if (typeof windowManager === 'undefined') {
      console.warn('WindowManager not initialized');
      return;
    }

    // Ensure desktop is ready
    if (typeof desktop === 'undefined') {
      console.warn('Desktop not initialized');
      return;
    }

    // Ensure taskbar is ready
    if (typeof taskbar === 'undefined') {
      console.warn('Taskbar not initialized');
      return;
    }

    console.log('✓ Windows 10 Desktop Simulation Ready');
  }
}

// Initialize Main App
let mainApp = null;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    mainApp = new MainApp();
  });
} else {
  mainApp = new MainApp();
}
