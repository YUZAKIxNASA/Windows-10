/* Constants - Windows 10 Configuration */

const CONSTANTS = {
  // App Configuration
  APP_NAME: 'Windows 10 Desktop Simulation',
  APP_VERSION: '1.0.0',
  THEME: {
    LIGHT: 'light-theme',
    DARK: 'dark-theme',
    AUTO: 'auto-theme'
  },
  
  // Boot Timing
  BOOT: {
    BIOS_DURATION: 2000,
    LOADING_DURATION: 3000,
    LOCK_SCREEN_DURATION: 1000
  },
  
  // Animations
  ANIMATION: {
    FAST: 150,
    BASE: 250,
    SLOW: 400
  },
  
  // Window Management
  WINDOW: {
    MIN_WIDTH: 300,
    MIN_HEIGHT: 200,
    DEFAULT_WIDTH: 600,
    DEFAULT_HEIGHT: 400,
    TITLEBAR_HEIGHT: 40,
    Z_INDEX_INCREMENT: 100
  },
  
  // Taskbar
  TASKBAR: {
    HEIGHT: 48,
    ICON_SIZE: 32,
    ICON_SPACING: 8
  },
  
  // Desktop
  DESKTOP: {
    ICON_SIZE: 64,
    ICON_SPACING: 16,
    GRID_COLUMNS: 10
  },
  
  // Applications
  APPS: {
    CALCULATOR: 'calculator',
    NOTEPAD: 'notepad',
    PAINT: 'paint',
    FILE_EXPLORER: 'file-explorer',
    SETTINGS: 'settings',
    TERMINAL: 'terminal',
    TASK_MANAGER: 'task-manager',
    PHOTOS: 'photos',
    MEDIA_PLAYER: 'media-player',
    CLOCK: 'clock',
    CALENDAR: 'calendar',
    WEATHER: 'weather',
    SNIPPING_TOOL: 'snipping-tool'
  },
  
  // Desktop Icons
  DESKTOP_ICONS: [
    { id: 'this-pc', name: 'This PC', icon: '🖥️', type: 'folder' },
    { id: 'documents', name: 'Documents', icon: '📁', type: 'folder' },
    { id: 'downloads', name: 'Downloads', icon: '⬇️', type: 'folder' },
    { id: 'recycle-bin', name: 'Recycle Bin', icon: '🗑️', type: 'system' },
  ],
  
  // Taskbar Pinned Apps
  PINNED_APPS: [
    { id: 'file-explorer', name: 'File Explorer', icon: '📁', app: 'file-explorer' },
    { id: 'calculator', name: 'Calculator', icon: '🧮', app: 'calculator' },
    { id: 'notepad', name: 'Notepad', icon: '📝', app: 'notepad' },
    { id: 'paint', name: 'Paint', icon: '🎨', app: 'paint' },
    { id: 'settings', name: 'Settings', icon: '⚙️', app: 'settings' },
  ],
  
  // Default Wallpapers (using gradients as fallback)
  WALLPAPERS: {
    DEFAULT: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    FOREST: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    OCEAN: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    SUNSET: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    MIDNIGHT: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
  },
  
  // Sounds (would be replaced with actual audio files)
  SOUNDS: {
    STARTUP: 'startup',
    SHUTDOWN: 'shutdown',
    LOGIN: 'login',
    NOTIFICATION: 'notification',
    ERROR: 'error',
    SUCCESS: 'success',
    CLICK: 'click'
  },
  
  // Keyboard Shortcuts
  SHORTCUTS: {
    START_MENU: 'Win',
    FILE_EXPLORER: 'Win+E',
    CALCULATOR: 'Win+V',
    NOTEPAD: 'Win+N',
    TASK_MANAGER: 'Win+T',
    TASK_MANAGER_ALT: 'Ctrl+Alt+Del',
    QUICK_MENU: 'Win+X',
    ALT_TAB: 'Alt+Tab',
    SHOW_DESKTOP: 'Win+D',
    REFRESH: 'F5'
  },
  
  // File System (Virtual)
  FILE_SYSTEM: {
    ROOT: 'C:/',
    FOLDERS: {
      DOCUMENTS: 'C:/Users/User/Documents',
      DOWNLOADS: 'C:/Users/User/Downloads',
      PICTURES: 'C:/Users/User/Pictures',
      VIDEOS: 'C:/Users/User/Videos',
      MUSIC: 'C:/Users/User/Music',
      DESKTOP: 'C:/Users/User/Desktop'
    }
  },
  
  // Default Login
  LOGIN: {
    USERNAME: 'User',
    PASSWORD: '',
    PIN: '0000',
    METHODS: ['password', 'pin', 'biometric']
  },
  
  // Storage Keys
  STORAGE: {
    THEME: 'windows10_theme',
    WALLPAPER: 'windows10_wallpaper',
    SETTINGS: 'windows10_settings',
    LOGGED_IN: 'windows10_logged_in',
    WINDOW_POSITIONS: 'windows10_window_positions'
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONSTANTS;
}