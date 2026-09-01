/* Browser app JavaScript - js/apps/browser/browser.js
   Integrates with WindowManager and creates a Browser window.
*/

(function() {
  // Configuration keys
  const STORAGE_KEYS = {
    BOOKMARKS: (CONSTANTS && CONSTANTS.STORAGE && CONSTANTS.STORAGE.BROWSER && CONSTANTS.STORAGE.BROWSER.BOOKMARKS) || 'windows10_browser_bookmarks',
    HISTORY: (CONSTANTS && CONSTANTS.STORAGE && CONSTANTS.STORAGE.BROWSER && CONSTANTS.STORAGE.BROWSER.HISTORY) || 'windows10_browser_history',
    SETTINGS: (CONSTANTS && CONSTANTS.STORAGE && CONSTANTS.STORAGE.BROWSER && CONSTANTS.STORAGE.BROWSER.SETTINGS) || 'windows10_browser_settings',
    CLOSED_TABS: (CONSTANTS && CONSTANTS.STORAGE && CONSTANTS.STORAGE.BROWSER && CONSTANTS.STORAGE.BROWSER.CLOSED_TABS) || 'windows10_browser_closed_tabs'
  };

  const DEFAULTS = {
    homepage: (typeof CONSTANTS !== 'undefined' && CONSTANTS.BROWSER_HOME) ? CONSTANTS.BROWSER_HOME : 'https://www.google.com',
    searchEngine: (typeof CONSTANTS !== 'undefined' && CONSTANTS.DEFAULT_SEARCH_ENGINE) ? CONSTANTS.DEFAULT_SEARCH_ENGINE : 'https://www.google.com/search?q='
  };

  // Utility: safe storage
  const storageSet = (key, value) => {
    if (typeof BrowserStorage !== 'undefined') BrowserStorage.set(key, value);
    else HELPERS.setStorage(key, value);
  };
  const storageGet = (key, defaultVal) => {
    if (typeof BrowserStorage !== 'undefined') return BrowserStorage.get(key, defaultVal);
    return HELPERS.getStorage(key, defaultVal);
  };
  const storageRemove = (key) => {
    if (typeof BrowserStorage !== 'undefined') BrowserStorage.remove(key);
    else HELPERS.removeStorage(key);
  };

  class Tab {
    constructor({ id, title = 'New Tab', url = '', favicon = '🌐', history = [], historyIndex = -1, loading = false }) {
      this.id = id || HELPERS.generateId();
      this.title = title;
      this.url = url;
      this.favicon = favicon;
      this.history = history;
      this.historyIndex = historyIndex;
      this.loading = loading;
    }
  }

  class BrowserApp {
    constructor() {
      this.window = null;
      this.dom = null;
      this.tabs = [];
      this.activeTabId = null;
      this.closedTabs = storageGet(STORAGE_KEYS.CLOSED_TABS, []);
      this.bookmarks = storageGet(STORAGE_KEYS.BOOKMARKS, []);
      this.history = storageGet(STORAGE_KEYS.HISTORY, []);
      this.settings = storageGet(STORAGE_KEYS.SETTINGS, { homepage: DEFAULTS.homepage, searchEngine: DEFAULTS.searchEngine });
      this.isOnline = navigator.onLine;
      this._keyHandler = this._onKeyDown.bind(this);
      this._onOnline = this._onOnline.bind(this);
      this._onOffline = this._onOffline.bind(this);
      this.createWindow();
    }

    createWindow() {
      this.window = windowManager.createWindow({
        title: '🌐 Browser',
        icon: '🌐',
        width: 1000,
        height: 700,
        minWidth: 360,
        minHeight: 300,
        onClose: () => this._onWindowClose(),
        render_content: () => this._renderContent()
      });

      window.browserApp = this;
    }

    focus() { if (this.window) this.window.manager.setActive(this.window); }

    _renderContent() {
      const container = this.window.contentElement;
      container.innerHTML = '';
      container.classList.add('browser-app');

      const top = HELPERS.createDiv('browser-top');
      const tabbar = HELPERS.createDiv('browser-tabbar');
      top.appendChild(tabbar);

      const nav = HELPERS.createDiv('browser-nav');
      const navButtons = HELPERS.createDiv('nav-buttons');
      const backBtn = HELPERS.createButton('←', 'browser-button'); backBtn.setAttribute('aria-label','Back');
      const forwardBtn = HELPERS.createButton('→', 'browser-button'); forwardBtn.setAttribute('aria-label','Forward');
      const reloadBtn = HELPERS.createButton('↻', 'browser-button'); reloadBtn.setAttribute('aria-label','Reload');
      const stopBtn = HELPERS.createButton('×', 'browser-button'); stopBtn.setAttribute('aria-label','Stop');
      const homeBtn = HELPERS.createButton('🏠', 'browser-button'); homeBtn.setAttribute('aria-label','Home');

      navButtons.appendChild(backBtn); navButtons.appendChild(forwardBtn); navButtons.appendChild(reloadBtn); navButtons.appendChild(stopBtn); navButtons.appendChild(homeBtn);
      nav.appendChild(navButtons);

      const addressWrap = HELPERS.createDiv('browser-address');
      const security = HELPERS.createDiv('security'); security.className = 'security'; security.textContent = '🔒';
      this.addressInput = HELPERS.createElement('input','', ''); this.addressInput.type = 'text'; this.addressInput.placeholder = 'Search the web or enter web address'; this.addressInput.setAttribute('aria-label','Address bar');
      addressWrap.appendChild(security); addressWrap.appendChild(this.addressInput);

      const bookmarkBtn = HELPERS.createButton('⭐', 'browser-button'); bookmarkBtn.setAttribute('aria-label','Bookmark');

      nav.appendChild(addressWrap); nav.appendChild(bookmarkBtn);

      const progress = HELPERS.createDiv('browser-progress'); const progressBar = HELPERS.createDiv('bar'); progressBar.className='bar'; progress.appendChild(progressBar);

      const content = HELPERS.createDiv('browser-content'); const pageArea = HELPERS.createDiv('browser-page-area'); content.appendChild(pageArea);

      const downloads = HELPERS.createDiv('browser-downloads'); downloads.style.display='none'; content.appendChild(downloads); this.downloadsEl = downloads;

      this.dom = { container, tabbar, nav, backBtn, forwardBtn, reloadBtn, stopBtn, homeBtn, bookmarkBtn, addressWrap, addressInput: this.addressInput, progressBar, content, pageArea, downloads };

      container.appendChild(top); container.appendChild(nav); container.appendChild(progress); container.appendChild(content);

      if (this.tabs.length === 0) this._createNewTab();
      this._renderTabsUI();

      backBtn.addEventListener('click', () => this.goBack());
      forwardBtn.addEventListener('click', () => this.goForward());
      reloadBtn.addEventListener('click', () => this.reload());
      stopBtn.addEventListener('click', () => this.stop());
      homeBtn.addEventListener('click', () => this.navigateTo(this.settings.homepage || DEFAULTS.homepage));
      bookmarkBtn.addEventListener('click', () => this.toggleBookmark());

      this.addressInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); this._onAddressEnter(); } else if (e.key === 'Escape') { e.preventDefault(); this.addressInput.blur(); } });

      const newTabBtn = HELPERS.createDiv('browser-new-tab'); newTabBtn.title='New Tab'; newTabBtn.textContent='+'; newTabBtn.setAttribute('aria-label','New Tab'); newTabBtn.addEventListener('click', (e)=>{ this._createNewTab(); }); tabbar.appendChild(newTabBtn);

      document.addEventListener('keydown', this._keyHandler);
      window.addEventListener('online', this._onOnline);
      window.addEventListener('offline', this._onOffline);
    }

    _renderTabsUI() {
      const tabbar = this.dom.tabbar;
      tabbar.innerHTML = '';
      this.tabs.forEach(tab => {
        const tabEl = HELPERS.createDiv('browser-tab'); tabEl.dataset.tabId = tab.id; tabEl.tabIndex = 0;
        const favicon = HELPERS.createDiv('favicon'); favicon.innerHTML = tab.favicon || '🌐';
        const title = HELPERS.createDiv('title'); title.textContent = tab.title || this._extractHostname(tab.url) || 'New Tab';
        const close = HELPERS.createElement('button','close-tab'); close.textContent = '×'; close.title='Close tab'; close.addEventListener('click',(e)=>{ e.stopPropagation(); this.closeTab(tab.id); });
        tabEl.appendChild(favicon); tabEl.appendChild(title); tabEl.appendChild(close);
        tabEl.addEventListener('click', () => this.switchTab(tab.id));
        tabEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.switchTab(tab.id); });
        if (tab.id === this.activeTabId) HELPERS.addClass(tabEl,'active');
        tabbar.appendChild(tabEl);
      });

      const newTabBtn = HELPERS.createDiv('browser-new-tab'); newTabBtn.title='New Tab'; newTabBtn.textContent='+'; newTabBtn.addEventListener('click', ()=>this._createNewTab()); tabbar.appendChild(newTabBtn);
      this._renderActiveTabContent();
    }

    _createNewTab(url = '') {
      const t = new Tab({ title: 'New Tab', url: '', history: [], historyIndex: -1, favicon: '🌐' });
      this.tabs.push(t);
      this.switchTab(t.id);
      if (url) this.navigateTo(url);
      this._saveClosedTabs();
      this._renderTabsUI();
      return t;
    }

    _reopenLastClosed() {
      const closed = this.closedTabs || [];
      if (!closed.length) return;
      const data = closed.pop();
      const tab = new Tab({ title: data.title || 'New Tab', url: data.url || '', favicon: data.favicon || '🌐', history: data.history || [], historyIndex: data.historyIndex || -1 });
      this.tabs.push(tab);
      this.switchTab(tab.id);
      if (tab.url) this.navigateTo(tab.url);
      this._persistClosedTabs();
      this._renderTabsUI();
    }

    _saveClosedTabs() { this._persistClosedTabs(); }
    _persistClosedTabs() { storageSet(STORAGE_KEYS.CLOSED_TABS, this.closedTabs || []); }

    switchTab(tabId) { if (this.activeTabId === tabId) return; this.activeTabId = tabId; this._renderTabsUI(); }

    closeTab(tabId) {
      const idx = this.tabs.findIndex(t => t.id === tabId);
      if (idx === -1) return;
      const [removed] = this.tabs.splice(idx,1);
      this.closedTabs = this.closedTabs || [];
      this.closedTabs.push({ id: removed.id, title: removed.title, url: removed.url, favicon: removed.favicon, history: removed.history, historyIndex: removed.historyIndex });
      this._persistClosedTabs();
      if (this.activeTabId === tabId) {
        const newActive = this.tabs[idx] || this.tabs[idx-1];
        if (newActive) this.switchTab(newActive.id);
        else this._createNewTab();
      } else { this._renderTabsUI(); }
    }

    _renderActiveTabContent() {
      const pageArea = this.dom.pageArea; pageArea.innerHTML = '';
      const tab = this.tabs.find(t => t.id === this.activeTabId);
      if (!tab) return;
      this.dom.addressInput.value = tab.url || '';
      if (!tab.url) {
        const empty = HELPERS.createDiv('browser-empty'); empty.innerHTML = `<div style="font-size:28px">🌐</div><div style="font-size:18px">Browser</div><div style="max-width:520px;color:var(--muted-text, rgba(0,0,0,0.6))">Search the web or enter an address</div>`;
        const quick = HELPERS.createDiv('browser-home-grid');
        const quickSites = [
          {name:'GitHub', url:'https://github.com', icon:'🐱'},
          {name:'YouTube', url:'https://youtube.com', icon:'▶️'},
          {name:'Google', url:'https://google.com', icon:'🔎'},
          {name:'ChatGPT', url:'https://chat.openai.com', icon:'💬'},
          {name:'Downloads', url:'', icon:'⬇️'},
          {name:'Settings', url:'', icon:'⚙️'}
        ];
        quickSites.forEach(s => { const c = HELPERS.createDiv('home-card'); c.innerHTML = `<div style="font-size:20px">${s.icon}</div><div>${s.name}</div>`; if (s.url) c.addEventListener('click', () => this.navigateTo(s.url)); quick.appendChild(c); });
        pageArea.appendChild(empty); pageArea.appendChild(quick); return;
      }

      const iframe = document.createElement('iframe'); iframe.className = 'browser-iframe'; iframe.src = tab.url; iframe.setAttribute('referrerpolicy','no-referrer-when-downgrade'); iframe.onload = () => this._onIframeLoad(iframe, tab); iframe.onerror = () => this._onIframeError(iframe, tab);
      pageArea.appendChild(iframe); tab.loading = true; this._setProgressIndeterminate(true); tab._iframe = iframe; this._renderTabsUI();
    }

    _onIframeLoad(iframe, tab) {
      tab.loading = false; this._setProgressIndeterminate(false);
      try {
        const doc = iframe.contentDocument;
        if (doc) {
          const title = doc.title || this._extractHostname(tab.url);
          tab.title = title;
          const icons = doc.querySelectorAll('link[rel~="icon"]');
          if (icons && icons.length) { const href = icons[0].href; tab.favicon = `<img src="${href}" style="width:16px;height:16px">`; } else { tab.favicon = '🌐'; }
        }
      } catch (e) {
        tab.title = this._extractHostname(tab.url) || tab.title; tab.favicon = '🌐';
        setTimeout(() => { try { let emptyBody = false; const doc = iframe.contentDocument; if (doc) emptyBody = doc.body && doc.body.childElementCount === 0; if (emptyBody) this._showBlockedOverlay(iframe, tab); } catch (err) { this._showBlockedOverlay(iframe, tab); } }, 250);
      }
      this._persistHistory(tab); this._renderTabsUI();
    }

    _onIframeError(iframe, tab) { tab.loading = false; this._setProgressIndeterminate(false); this._showErrorPage(tab, 'Unable to load page'); }

    _showBlockedOverlay(iframe, tab) {
      const overlay = HELPERS.createDiv('browser-error'); overlay.innerHTML = `<div style="font-size:20px">Unable to display this page</div>\n        <div>This website may prevent embedding in an iframe (X-Frame-Options / Content-Security-Policy).</div>\n        <div style="display:flex;gap:8px">\n          <button class="fluent-button" id="tryAgain">Try Again</button>\n          <button class="fluent-button" id="openExternal">Open Externally</button>\n        </div>`;
      const parent = iframe.parentElement; overlay.style.position='absolute'; overlay.style.top='0'; overlay.style.left='0'; overlay.style.right='0'; overlay.style.bottom='0'; overlay.style.background='rgba(255,255,255,0.95)'; overlay.style.zIndex='1000'; parent.appendChild(overlay);
      overlay.querySelector('#tryAgain').addEventListener('click', () => { overlay.remove(); iframe.src = tab.url; });
      overlay.querySelector('#openExternal').addEventListener('click', () => { window.open(tab.url, '_blank', 'noopener'); });
    }

    _showErrorPage(tab, message) { const pageArea = this.dom.pageArea; pageArea.innerHTML = ''; const err = HELPERS.createDiv('browser-error'); err.innerHTML = `<div style="font-size:20px">Unable to load page</div><div>${message}</div><div style="display:flex;gap:8px"><button class="fluent-button" id="tryAgain">Try Again</button><button class="fluent-button" id="openExternal">Open Externally</button></div>`; pageArea.appendChild(err); err.querySelector('#tryAgain').addEventListener('click', () => this.navigateTo(tab.url)); err.querySelector('#openExternal').addEventListener('click', () => window.open(tab.url, '_blank', 'noopener')); }

    _extractHostname(url) { if (!url) return ''; try { const u = new URL(url); return u.hostname; } catch (e) { try { const u = new URL('https://' + url); return u.hostname; } catch (e2) { return url; } } }

    _onAddressEnter() { const raw = this.dom.addressInput.value.trim(); if (!raw) return; this.navigateTo(this._parseAddressOrSearch(raw)); }

    _parseAddressOrSearch(input) { if (/^\s*https?:\/\//i.test(input)) return input; if (/^[\w-]+(\.[\w-]+)+/.test(input)) { return input.startsWith('http') ? input : 'https://' + input; } const q = encodeURIComponent(input); return (this.settings && this.settings.searchEngine) ? this.settings.searchEngine + q : DEFAULTS.searchEngine + q; }

    navigateTo(rawUrl) { const tab = this.tabs.find(t => t.id === this.activeTabId); if (!tab) return; const url = rawUrl; if (!tab.history) tab.history = []; tab.history = tab.history.slice(0, tab.historyIndex + 1); tab.history.push(url); tab.historyIndex = tab.history.length - 1; tab.url = url; tab.loading = true; this._renderActiveTabContent(); }

    goBack() { const tab = this.tabs.find(t => t.id === this.activeTabId); if (!tab || tab.historyIndex <= 0) return; tab.historyIndex--; tab.url = tab.history[tab.historyIndex]; this._renderActiveTabContent(); }
    goForward() { const tab = this.tabs.find(t => t.id === this.activeTabId); if (!tab || tab.historyIndex >= (tab.history.length - 1)) return; tab.historyIndex++; tab.url = tab.history[tab.historyIndex]; this._renderActiveTabContent(); }
    reload() { const tab = this.tabs.find(t => t.id === this.activeTabId); if (!tab || !tab._iframe) return; try { tab._iframe.contentWindow.location.reload(); } catch (e) { tab._iframe.src = tab.url; } }
    stop() { const tab = this.tabs.find(t => t.id === this.activeTabId); if (!tab || !tab._iframe) return; try { const src = tab._iframe.src; tab._iframe.src = 'about:blank'; tab._iframe.src = src; } catch (e) {} }

    toggleBookmark() { const tab = this.tabs.find(t => t.id === this.activeTabId); if (!tab) return; const exists = this.bookmarks.find(b => b.url === tab.url); if (exists) { this.bookmarks = this.bookmarks.filter(b => b.url !== tab.url); } else { this.bookmarks.push({ title: tab.title || this._extractHostname(tab.url), url: tab.url, favicon: tab.favicon, dateAdded: new Date().toISOString() }); } storageSet(STORAGE_KEYS.BOOKMARKS, this.bookmarks); }

    _persistHistory(tab) { this.history = this.history || []; this.history.unshift({ title: tab.title || this._extractHostname(tab.url), url: tab.url, time: new Date().toISOString() }); if (this.history.length > 500) this.history.length = 500; storageSet(STORAGE_KEYS.HISTORY, this.history); }

    _setProgressIndeterminate(active) { const bar = this.dom.progressBar; if (!bar) return; if (active) { bar.style.width = '30%'; bar.style.transition = 'none'; setTimeout(() => { bar.style.transition = 'width 1200ms linear'; bar.style.width = '80%'; }, 20); } else { bar.style.transition = 'width 200ms linear'; bar.style.width = '100%'; setTimeout(() => { bar.style.width = '0%'; }, 300); } }

    _onKeyDown(e) { if (!this.window) return; if (windowManager && windowManager.activeWindow && windowManager.activeWindow.id !== this.window.id) return; const ctrl = e.ctrlKey || e.metaKey; const shift = e.shiftKey;
      if (ctrl && e.key.toLowerCase() === 'l') { e.preventDefault(); this.dom.addressInput.focus(); this.dom.addressInput.select(); return; }
      if (ctrl && e.key.toLowerCase() === 't') { e.preventDefault(); this._createNewTab(); return; }
      if (ctrl && e.key.toLowerCase() === 'w') { e.preventDefault(); this.closeTab(this.activeTabId); return; }
      if (ctrl && shift && e.key.toLowerCase() === 't') { e.preventDefault(); this._reopenLastClosed(); return; }
      if (ctrl && e.key.toLowerCase() === 'r') { e.preventDefault(); this.reload(); return; }
      if (ctrl && e.key.toLowerCase() === 'd') { e.preventDefault(); this.toggleBookmark(); return; }
      if (ctrl && e.key === 'Tab') { e.preventDefault(); const idx = this.tabs.findIndex(t => t.id === this.activeTabId); if (idx === -1) return; let nextIdx = shift ? (idx - 1 + this.tabs.length) % this.tabs.length : (idx + 1) % this.tabs.length; this.switchTab(this.tabs[nextIdx].id); return; }
      if (e.key === 'Escape') { this.stop(); this.dom.addressInput.blur(); }
    }

    _onWindowClose() { document.removeEventListener('keydown', this._keyHandler); window.removeEventListener('online', this._onOnline); window.removeEventListener('offline', this._onOffline); storageSet(STORAGE_KEYS.BOOKMARKS, this.bookmarks || []); storageSet(STORAGE_KEYS.HISTORY, this.history || []); storageSet(STORAGE_KEYS.SETTINGS, this.settings || {}); if (window.browserApp === this) window.browserApp = null; }

    _onOnline() { this.isOnline = true; }
    _onOffline() { this.isOnline = false; }
  }

  function launchBrowserFromTaskbar(app) { if (window.browserApp) { window.browserApp.focus(); } else { new BrowserApp(); } }

  window.LaunchBrowserApp = launchBrowserFromTaskbar;
  if (typeof CONSTANTS !== 'undefined' && CONSTANTS.APPS) { CONSTANTS.APPS.BROWSER = 'browser'; }

})();
