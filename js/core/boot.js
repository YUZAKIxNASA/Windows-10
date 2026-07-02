/* Boot Sequence - Windows 10 Boot Animation */

class BootSequence {
  constructor() {
    this.bootScreen = HELPERS.$('#bootScreen');
    this.loadingScreen = HELPERS.$('#loadingScreen');
    this.lockScreen = HELPERS.$('#lockScreen');
    this.desktopEnvironment = HELPERS.$('#desktopEnvironment');
    this.bootMessage = HELPERS.$('#bootMessage');
  }

  async start() {
    await this.showBIOS();
    await this.showLoading();
    await this.showLockScreen();
    await this.showDesktop();
  }

  async showBIOS() {
    HELPERS.show(this.bootScreen);
    const messages = [
      'Initializing System...',
      'Loading Drivers...',
      'Detecting Hardware...',
      'Starting Services...',
      'Loading Kernel...',
      'Initializing Display...',
      'Ready to boot...'
    ];

    for (const message of messages) {
      HELPERS.setText(this.bootMessage, message);
      await HELPERS.delay(300);
    }

    await HELPERS.delay(CONSTANTS.BOOT.BIOS_DURATION);
    HELPERS.addClass(this.bootScreen, 'hidden');
  }

  async showLoading() {
    HELPERS.removeClass(this.loadingScreen, 'hidden');
    await HELPERS.delay(CONSTANTS.BOOT.LOADING_DURATION);
    HELPERS.addClass(this.loadingScreen, 'hidden');
  }

  async showLockScreen() {
    HELPERS.removeClass(this.lockScreen, 'hidden');
    this.updateLockScreenTime();
    setInterval(() => this.updateLockScreenTime(), 60000);
    
    // Wait for user interaction
    await new Promise(resolve => {
      const handleKeyPress = () => {
        document.removeEventListener('keydown', handleKeyPress);
        document.removeEventListener('click', handleKeyPress);
        resolve();
      };
      document.addEventListener('keydown', handleKeyPress);
      document.addEventListener('click', handleKeyPress);
    });

    HELPERS.addClass(this.lockScreen, 'hidden');
  }

  updateLockScreenTime() {
    const now = new Date();
    const timeEl = HELPERS.$('#lockTime');
    const dateEl = HELPERS.$('#lockDate');
    
    if (timeEl) {
      HELPERS.setText(timeEl, HELPERS.formatTime(now));
    }
    if (dateEl) {
      HELPERS.setText(dateEl, HELPERS.formatDate(now));
    }
  }

  async showDesktop() {
    HELPERS.removeClass(this.desktopEnvironment, 'hidden');
    // Desktop will be initialized by main app
  }
}

// Start boot sequence when DOM is ready
let bootSequence = null;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    bootSequence = new BootSequence();
    bootSequence.start();
  });
} else {
  bootSequence = new BootSequence();
  bootSequence.start();
}