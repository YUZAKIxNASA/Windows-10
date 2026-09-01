/* Browser local storage wrapper - js/apps/browser/storage.js */

const BrowserStorage = (function() {
  const inMemory = new Map();

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Fallback to in-memory
      inMemory.set(key, value);
    }
  }

  function safeGet(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : (inMemory.has(key) ? inMemory.get(key) : defaultValue);
    } catch (e) {
      return inMemory.has(key) ? inMemory.get(key) : defaultValue;
    }
  }

  function safeRemove(key) {
    try { localStorage.removeItem(key); } catch (e) { inMemory.delete(key); }
  }

  return {
    set: safeSet,
    get: safeGet,
    remove: safeRemove
  };
})();
