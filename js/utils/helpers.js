/* Helper Functions - Windows 10 Utilities */

const HELPERS = {
  // DOM Helpers
  $(selector) {
    return document.querySelector(selector);
  },
  
  $$(selector) {
    return document.querySelectorAll(selector);
  },
  
  createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  },
  
  createDiv(className = '', innerHTML = '') {
    return this.createElement('div', className, innerHTML);
  },
  
  createButton(text, className = '') {
    const btn = this.createElement('button', `fluent-button ${className}`);
    btn.textContent = text;
    return btn;
  },
  
  // Class Management
  addClass(element, className) {
    if (element) element.classList.add(className);
  },
  
  removeClass(element, className) {
    if (element) element.classList.remove(className);
  },
  
  toggleClass(element, className) {
    if (element) element.classList.toggle(className);
  },
  
  hasClass(element, className) {
    return element ? element.classList.contains(className) : false;
  },
  
  // Text Content
  setText(element, text) {
    if (element) element.textContent = text;
  },
  
  getText(element) {
    return element ? element.textContent : '';
  },
  
  setHTML(element, html) {
    if (element) element.innerHTML = html;
  },
  
  getHTML(element) {
    return element ? element.innerHTML : '';
  },
  
  // Attributes
  setAttribute(element, attr, value) {
    if (element) element.setAttribute(attr, value);
  },
  
  getAttribute(element, attr) {
    return element ? element.getAttribute(attr) : null;
  },
  
  removeAttribute(element, attr) {
    if (element) element.removeAttribute(attr);
  },
  
  // Styles
  setStyle(element, prop, value) {
    if (element) element.style[prop] = value;
  },
  
  setStyles(element, styles) {
    if (!element) return;
    Object.keys(styles).forEach(key => {
      element.style[key] = styles[key];
    });
  },
  
  getStyle(element, prop) {
    return element ? window.getComputedStyle(element).getPropertyValue(prop) : '';
  },
  
  // Events
  addEventListener(element, event, handler) {
    if (element) element.addEventListener(event, handler);
  },
  
  removeEventListener(element, event, handler) {
    if (element) element.removeEventListener(event, handler);
  },
  
  on(element, event, handler) {
    this.addEventListener(element, event, handler);
  },
  
  off(element, event, handler) {
    this.removeEventListener(element, event, handler);
  },
  
  onClick(element, handler) {
    this.addEventListener(element, 'click', handler);
  },
  
  onDblClick(element, handler) {
    this.addEventListener(element, 'dblclick', handler);
  },
  
  onHover(element, enterHandler, leaveHandler) {
    this.addEventListener(element, 'mouseenter', enterHandler);
    if (leaveHandler) this.addEventListener(element, 'mouseleave', leaveHandler);
  },
  
  // Animation
  animate(element, animationName, duration = 250) {
    return new Promise(resolve => {
      this.addClass(element, animationName);
      setTimeout(() => {
        this.removeClass(element, animationName);
        resolve();
      }, duration);
    });
  },
  
  // Timeout/Interval
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  // Local Storage
  setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage quota exceeded', e);
    }
  },
  
  getStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },
  
  removeStorage(key) {
    localStorage.removeItem(key);
  },
  
  clearStorage() {
    localStorage.clear();
  },
  
  // Number/Math
  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },
  
  // String
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  truncate(str, length = 50) {
    return str.length > length ? str.substring(0, length) + '...' : str;
  },
  
  // Array
  shuffleArray(arr) {
    return [...arr].sort(() => 0.5 - Math.random());
  },
  
  // Check Existence
  exists(element) {
    return element !== null && element !== undefined;
  },
  
  isEmpty(value) {
    return value === null || value === undefined || value === '' || 
           (Array.isArray(value) && value.length === 0) || 
           (typeof value === 'object' && Object.keys(value).length === 0);
  },
  
  // UUID Generation
  generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
  },
  
  // Time Formatting
  formatTime(date = new Date()) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  },
  
  formatDate(date = new Date()) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  },
  
  // Debounce
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // Position
  getPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      width: rect.width,
      height: rect.height,
      x: rect.x,
      y: rect.y
    };
  },
  
  // Show/Hide
  show(element) {
    this.removeClass(element, 'hidden');
    element.style.display = '';
  },
  
  hide(element) {
    this.addClass(element, 'hidden');
    element.style.display = 'none';
  },
  
  isVisible(element) {
    return element && element.offsetParent !== null && !this.hasClass(element, 'hidden');
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HELPERS;
}