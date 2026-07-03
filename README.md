# Windows 10 Professional Desktop Simulation

link - yuzakixnasa.github.io/Windows-10/

A complete, educational HTML5/CSS3/JavaScript simulation of Windows 10 desktop environment. 100% original code, no external dependencies, fully functional offline.

## Project Structure

### Core Files
- `index.html` - Main application shell and entry point
- `js/core/app.js` - Main application initialization and boot sequence

### Utilities
- `js/utils/constants.js` - Global constants and configuration
- `js/utils/helpers.js` - Shared utility functions
- `js/utils/window-manager.js` - Window creation and management system

### Theme System
- `js/theme/theme-manager.js` - Theme switching logic
- `css/themes/light.css` - Light theme styles
- `css/themes/dark.css` - Dark theme styles
- `css/themes/auto.css` - Auto theme detection

### Boot System
- `js/boot/boot-sequence.js` - BIOS and boot animation
- `css/boot/boot.css` - Boot screen styling

### Lock & Login
- `js/auth/lock-screen.js` - Lock screen logic
- `js/auth/login-screen.js` - Login screen logic
- `css/auth/lock-screen.css` - Lock screen styling
- `css/auth/login-screen.css` - Login screen styling

### Desktop
- `js/desktop/desktop.js` - Desktop core functionality
- `js/desktop/desktop-icons.js` - Desktop icon management
- `js/desktop/context-menu.js` - Right-click context menu
- `css/desktop/desktop.css` - Desktop styling

### Taskbar
- `js/taskbar/taskbar.js` - Taskbar core logic
- `js/taskbar/start-menu.js` - Start menu functionality
- `js/taskbar/quick-settings.js` - Quick settings panel
- `js/taskbar/system-tray.js` - System tray icons and clock
- `css/taskbar/taskbar.css` - Taskbar styling
- `css/taskbar/start-menu.css` - Start menu styling
- `css/taskbar/quick-settings.css` - Quick settings styling

### Applications

#### Calculator
- `js/apps/calculator/calculator.js` - Calculator logic
- `js/apps/calculator/calculator-display.js` - Display management
- `js/apps/calculator/calculator-keyboard.js` - Keyboard input
- `css/apps/calculator/calculator.css` - Calculator styling

#### Notepad
- `js/apps/notepad/notepad.js` - Notepad logic
- `js/apps/notepad/notepad-editor.js` - Editor functionality
- `js/apps/notepad/notepad-file.js` - File operations
- `css/apps/notepad/notepad.css` - Notepad styling

#### Paint
- `js/apps/paint/paint.js` - Paint core logic
- `js/apps/paint/paint-canvas.js` - Canvas management
- `js/apps/paint/paint-tools.js` - Drawing tools
- `js/apps/paint/paint-colors.js` - Color picker
- `css/apps/paint/paint.css` - Paint styling

#### File Explorer
- `js/apps/file-explorer/file-explorer.js` - File explorer core
- `js/apps/file-explorer/file-browser.js` - Directory browsing
- `js/apps/file-explorer/file-system.js` - Virtual file system
- `js/apps/file-explorer/file-operations.js` - Copy, move, delete
- `css/apps/file-explorer/file-explorer.css` - File explorer styling

#### Settings
- `js/apps/settings/settings.js` - Settings core
- `js/apps/settings/settings-system.js` - System settings
- `js/apps/settings/settings-personalization.js` - Personalization
- `js/apps/settings/settings-devices.js` - Devices settings
- `css/apps/settings/settings.css` - Settings styling

#### Terminal
- `js/apps/terminal/terminal.js` - Terminal core
- `js/apps/terminal/terminal-shell.js` - Shell simulation
- `js/apps/terminal/terminal-commands.js` - Command handler
- `css/apps/terminal/terminal.css` - Terminal styling

#### Task Manager
- `js/apps/task-manager/task-manager.js` - Task manager core
- `js/apps/task-manager/task-processes.js` - Process list
- `js/apps/task-manager/task-performance.js` - Performance stats
- `css/apps/task-manager/task-manager.css` - Task manager styling

#### Photos
- `js/apps/photos/photos.js` - Photos app logic
- `js/apps/photos/photo-viewer.js` - Photo viewing
- `js/apps/photos/photo-gallery.js` - Gallery grid
- `css/apps/photos/photos.css` - Photos styling

#### Media Player
- `js/apps/media-player/media-player.js` - Media player core
- `js/apps/media-player/media-controls.js` - Playback controls
- `js/apps/media-player/media-playlist.js` - Playlist management
- `css/apps/media-player/media-player.css` - Media player styling

#### Clock
- `js/apps/clock/clock.js` - Clock app logic
- `js/apps/clock/clock-time.js` - Time display
- `js/apps/clock/clock-alarm.js` - Alarm functionality
- `css/apps/clock/clock.css` - Clock styling

#### Calendar
- `js/apps/calendar/calendar.js` - Calendar core
- `js/apps/calendar/calendar-grid.js` - Calendar grid
- `js/apps/calendar/calendar-events.js` - Event management
- `css/apps/calendar/calendar.css` - Calendar styling

#### Weather
- `js/apps/weather/weather.js` - Weather app logic
- `js/apps/weather/weather-display.js` - Weather display
- `js/apps/weather/weather-forecast.js` - Forecast management
- `css/apps/weather/weather.css` - Weather styling

#### Snipping Tool
- `js/apps/snipping-tool/snipping-tool.js` - Snipping tool logic
- `js/apps/snipping-tool/snipping-canvas.js` - Canvas for snips
- `css/apps/snipping-tool/snipping-tool.css` - Snipping tool styling

### Styles Architecture
- `css/core/global.css` - Global resets and base styles
- `css/core/variables.css` - CSS custom properties (variables)
- `css/core/animations.css` - Reusable animations
- `css/core/glassmorphism.css` - Glassmorphism effects
- `css/core/fluent-design.css` - Fluent design system
- `css/ui/buttons.css` - Button components
- `css/ui/windows.css` - Window styling
- `css/ui/inputs.css` - Input components
- `css/ui/menus.css` - Menu components

### Assets
- `assets/icons/` - SVG icons
- `assets/wallpapers/` - Default wallpapers
- `assets/sounds/` - Sound effects (data URIs)
- `assets/config/` - Configuration files

## Features

✅ **Boot System**
- Animated BIOS screen
- Windows logo animation
- Loading spinner
- Recovery and Safe Mode screens

✅ **Lock & Login**
- Lock screen with time/date
- Password, PIN, and biometric login
- Smooth transitions

✅ **Desktop**
- Desktop icons with drag-and-drop
- Context menu (right-click)
- Icon management and renaming
- Multiple selection
- Desktop refresh

✅ **Taskbar**
- Pinned application icons
- Running app indicators
- Start menu integration
- Quick settings panel
- System tray with clock
- Volume, brightness controls

✅ **Start Menu**
- Search functionality
- Pinned apps
- Recommended section
- All apps list
- Power button

✅ **Applications**
- Calculator (Standard + Scientific)
- Notepad with text editing
- Paint with drawing tools
- File Explorer with file system
- Settings panel
- Terminal with command simulation
- Task Manager with performance monitoring
- Photos app with gallery
- Media Player
- Clock with alarms
- Calendar with events
- Weather app
- Snipping Tool

✅ **UI/UX**
- Glassmorphism effects
- Fluent Design System
- Dark/Light/Auto themes
- Smooth animations (60 FPS)
- GPU acceleration
- Responsive layout
- Accessibility features

✅ **Performance**
- Lazy loading
- Component-based architecture
- Memory optimized
- No external dependencies
- Offline support
- Clean, maintainable code

## Getting Started

1. Clone the repository
2. Open `index.html` in a modern web browser
3. The system will automatically boot up
4. Press any key on lock screen to continue
5. Enter default password or leave blank to login

## Keyboard Shortcuts

- `Win` - Open Start Menu
- `Win + E` - Open File Explorer
- `Win + V` - Open Calculator
- `Win + N` - Open Notepad
- `Win + T` - Open Task Manager
- `Ctrl + Alt + Del` - Task Manager
- `Win + X` - Quick Links Menu
- `Alt + Tab` - Switch applications
- `Win + D` - Show/Hide desktop
- `F5` - Refresh desktop

## Browser Compatibility

- Chrome/Chromium (Recommended)
- Firefox
- Safari
- Edge
- Any modern browser supporting ES6+

## System Requirements

- 10MB storage space
- 512MB RAM minimum
- JavaScript enabled
- Modern GPU (for smooth animations)

## License

Educational Project - All Rights Reserved

## Contributing

This is a personal educational project. Use it to learn web development and UI/UX design.

---

**Last Updated:** July 2, 2026
**Version:** 1.0.0
