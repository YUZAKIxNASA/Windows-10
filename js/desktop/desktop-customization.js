/* Desktop Customization Module - Desktop Items Management */

class DesktopCustomization {
  constructor() {
    this.desktopIcons = HELPERS.$('#desktopIcons');
    this.desktop = HELPERS.$('#desktop');
    
    // Layout modes
    this.layoutMode = HELPERS.getStorage('windows10_desktop_layout_mode', 'grid');
    
    // Track custom positions (for free mode)
    this.customPositions = HELPERS.getStorage('windows10_desktop_positions', {});
    
    // Track visibility state
    this.itemVisibility = HELPERS.getStorage('windows10_desktop_visibility', this.getDefaultVisibility());
    
    // Dragging state
    this.draggedItem = null;
    this.dragOffset = { x: 0, y: 0 };
    this.isDragging = false;
    this.dragPointer = null;
    
    this.init();
  }

  getDefaultVisibility() {
    const visibility = {};
    CONSTANTS.DESKTOP_ICONS.forEach(icon => {
      visibility[icon.id] = true;
    });
    // Add Browser if not already present
    if (!visibility['browser']) {
      visibility['browser'] = true;
    }
    return visibility;
  }

  init() {
    this.setupDragListeners();
    this.applyLayoutMode();
    this.applyVisibility();
  }

  setupDragListeners() {
    document.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    document.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    document.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    document.addEventListener('pointercancel', (e) => this.handlePointerCancel(e));
  }

  handlePointerDown(e) {
    // Only handle if layout is in free position mode
    if (this.layoutMode !== 'free') return;

    const iconItem = e.target.closest('.desktop-icon-item');
    if (!iconItem || !this.desktopIcons.contains(iconItem)) return;

    // Don't drag if clicking on a control or double-click
    if (e.target.closest('.desktop-icon-label') && e.detail === 1) {
      this.startDrag(e, iconItem);
    }
  }

  startDrag(e, iconItem) {
    this.isDragging = true;
    this.draggedItem = iconItem;
    this.dragPointer = e.pointerId;

    const rect = iconItem.getBoundingClientRect();
    const parentRect = this.desktopIcons.getBoundingClientRect();

    this.dragOffset.x = e.clientX - rect.left;
    this.dragOffset.y = e.clientY - rect.top;

    // Set pointer capture
    try {
      iconItem.setPointerCapture(e.pointerId);
    } catch (err) {
      // Fallback if pointer capture fails
    }

    HELPERS.addClass(iconItem, 'dragging');
    e.preventDefault();
  }

  handlePointerMove(e) {
    if (!this.isDragging || !this.draggedItem) return;

    const parentRect = this.desktopIcons.getBoundingClientRect();
    let newX = e.clientX - parentRect.left - this.dragOffset.x;
    let newY = e.clientY - parentRect.top - this.dragOffset.y;

    // Constrain to desktop bounds
    const iconSize = 80;
    const padding = 10;
    newX = Math.max(0, Math.min(newX, parentRect.width - iconSize - padding));
    newY = Math.max(0, Math.min(newY, parentRect.height - iconSize - padding));

    this.draggedItem.style.position = 'absolute';
    this.draggedItem.style.left = newX + 'px';
    this.draggedItem.style.top = newY + 'px';
  }

  handlePointerUp(e) {
    if (!this.isDragging || !this.draggedItem) return;

    const iconId = this.draggedItem.dataset.iconId;
    if (iconId) {
      // Save position
      const rect = this.draggedItem.getBoundingClientRect();
      const parentRect = this.desktopIcons.getBoundingClientRect();
      
      const x = rect.left - parentRect.left;
      const y = rect.top - parentRect.top;

      this.customPositions[iconId] = { x, y };
      HELPERS.setStorage('windows10_desktop_positions', this.customPositions);
    }

    HELPERS.removeClass(this.draggedItem, 'dragging');
    
    try {
      this.draggedItem.releasePointerCapture(this.dragPointer);
    } catch (err) {
      // Pointer may not have been captured
    }

    this.isDragging = false;
    this.draggedItem = null;
    this.dragPointer = null;
  }

  handlePointerCancel(e) {
    if (this.draggedItem) {
      HELPERS.removeClass(this.draggedItem, 'dragging');
    }
    this.isDragging = false;
    this.draggedItem = null;
  }

  applyLayoutMode() {
    const iconsContainer = this.desktopIcons;
    
    if (this.layoutMode === 'grid') {
      // Grid layout - auto positioning
      HELPERS.removeClass(iconsContainer, 'free-position-mode');
      iconsContainer.style.display = 'grid';
      iconsContainer.style.gridTemplateColumns = 'repeat(auto-fit, 80px)';
      iconsContainer.style.gap = '16px';
      
      // Clear inline positions
      iconsContainer.querySelectorAll('.desktop-icon-item').forEach(item => {
        item.style.position = '';
        item.style.left = '';
        item.style.top = '';
      });
    } else {
      // Free position mode
      HELPERS.addClass(iconsContainer, 'free-position-mode');
      iconsContainer.style.display = 'block';
      iconsContainer.style.position = 'relative';
      
      // Apply custom positions
      iconsContainer.querySelectorAll('.desktop-icon-item').forEach(item => {
        const iconId = item.dataset.iconId;
        if (iconId && this.customPositions[iconId]) {
          const pos = this.customPositions[iconId];
          item.style.position = 'absolute';
          item.style.left = pos.x + 'px';
          item.style.top = pos.y + 'px';
        } else {
          item.style.position = 'absolute';
          item.style.left = '0px';
          item.style.top = '0px';
        }
      });
    }
  }

  applyVisibility() {
    const iconsContainer = this.desktopIcons;
    iconsContainer.querySelectorAll('.desktop-icon-item').forEach(item => {
      const iconId = item.dataset.iconId;
      if (iconId && this.itemVisibility.hasOwnProperty(iconId)) {
        if (this.itemVisibility[iconId]) {
          HELPERS.show(item);
        } else {
          HELPERS.hide(item);
        }
      }
    });
  }

  setLayoutMode(mode) {
    if (mode !== 'grid' && mode !== 'free') return;
    
    this.layoutMode = mode;
    HELPERS.setStorage('windows10_desktop_layout_mode', mode);
    this.applyLayoutMode();
  }

  toggleItemVisibility(itemId) {
    if (!this.itemVisibility.hasOwnProperty(itemId)) return;
    
    this.itemVisibility[itemId] = !this.itemVisibility[itemId];
    HELPERS.setStorage('windows10_desktop_visibility', this.itemVisibility);
    this.applyVisibility();
  }

  setItemVisibility(itemId, visible) {
    this.itemVisibility[itemId] = visible;
    HELPERS.setStorage('windows10_desktop_visibility', this.itemVisibility);
    this.applyVisibility();
  }

  resetPositions() {
    this.customPositions = {};
    HELPERS.setStorage('windows10_desktop_positions', {});
    this.applyLayoutMode();
  }

  resetLayout() {
    this.setLayoutMode('grid');
    this.resetPositions();
    this.itemVisibility = this.getDefaultVisibility();
    HELPERS.setStorage('windows10_desktop_visibility', this.itemVisibility);
    this.applyVisibility();
  }

  getLayoutMode() {
    return this.layoutMode;
  }

  getItemVisibility(itemId) {
    return this.itemVisibility[itemId] !== false;
  }

  getVisibilityState() {
    return { ...this.itemVisibility };
  }
}

// Initialize
let desktopCustomization = null;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    desktopCustomization = new DesktopCustomization();
  });
} else {
  desktopCustomization = new DesktopCustomization();
}
