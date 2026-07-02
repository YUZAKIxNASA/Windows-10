/* File Explorer App */

class FileExplorerApp {
  constructor() {
    this.window = null;
    this.currentPath = 'C:/';
    this.fileSystem = this.initializeFileSystem();
    window.fileExplorerApp = this;
    this.create();
  }

  initializeFileSystem() {
    return {
      'C:/': {
        folders: ['Users', 'Windows', 'Program Files'],
        files: ['config.sys', 'autoexec.bat']
      },
      'C:/Users/': {
        folders: ['User', 'Public'],
        files: []
      },
      'C:/Users/User/': {
        folders: ['Desktop', 'Documents', 'Downloads', 'Pictures', 'Videos', 'Music'],
        files: []
      },
      'C:/Users/User/Documents': {
        folders: [],
        files: ['resume.docx', 'notes.txt', 'project.xlsx']
      },
      'C:/Users/User/Downloads': {
        folders: [],
        files: ['image.jpg', 'archive.zip', 'setup.exe']
      }
    };
  }

  create() {
    this.window = windowManager.createWindow({
      id: CONSTANTS.APPS.FILE_EXPLORER,
      title: 'File Explorer',
      icon: '📁',
      width: 800,
      height: 600,
      x: 150,
      y: 100,
      onClose: () => { window.fileExplorerApp = null; }
    });

    this.render();
  }

  render() {
    const html = `
      <div class="file-explorer-container">
        <div class="file-explorer-header">
          <button id="fileExplorerBack" class="explorer-btn">← Back</button>
          <div class="address-bar">
            <input type="text" id="explorerPath" class="explorer-path-input" value="${this.currentPath}" readonly>
          </div>
          <button id="fileExplorerRefresh" class="explorer-btn">🔄 Refresh</button>
        </div>
        <div class="file-explorer-content" id="fileExplorerContent">
          <!-- Files and folders will be rendered here -->
        </div>
      </div>
    `;

    this.window.setContent(html);
    this.renderContent();
    this.setupEventListeners();
  }

  renderContent() {
    const content = this.fileSystem[this.currentPath];
    const contentEl = this.window.contentElement.querySelector('#fileExplorerContent');
    contentEl.innerHTML = '';

    if (content) {
      // Render folders
      content.folders.forEach(folder => {
        const folderEl = HELPERS.createDiv('file-item folder-item');
        folderEl.innerHTML = `<div class="file-icon">📁</div><div class="file-name">${folder}</div>`;
        folderEl.addEventListener('dblclick', () => this.navigateTo(folder));
        contentEl.appendChild(folderEl);
      });

      // Render files
      content.files.forEach(file => {
        const fileEl = HELPERS.createDiv('file-item file-item');
        fileEl.innerHTML = `<div class="file-icon">📄</div><div class="file-name">${file}</div>`;
        contentEl.appendChild(fileEl);
      });
    }
  }

  navigateTo(folder) {
    const newPath = this.currentPath.endsWith('/') ? this.currentPath + folder : this.currentPath + '/' + folder;
    if (this.fileSystem[newPath] || this.fileSystem[newPath + '/']) {
      this.currentPath = newPath.endsWith('/') ? newPath : newPath + '/';
      this.render();
    }
  }

  goBack() {
    const parts = this.currentPath.split('/').filter(p => p);
    if (parts.length > 1) {
      parts.pop();
      this.currentPath = '/' + parts.join('/') + '/';
    } else {
      this.currentPath = 'C:/';
    }
    this.render();
  }

  setupEventListeners() {
    const backBtn = this.window.contentElement.querySelector('#fileExplorerBack');
    const refreshBtn = this.window.contentElement.querySelector('#fileExplorerRefresh');

    backBtn.addEventListener('click', () => this.goBack());
    refreshBtn.addEventListener('click', () => this.render());
  }

  open(path) {
    if (this.fileSystem[path] || this.fileSystem[path + '/']) {
      this.currentPath = path.endsWith('/') ? path : path + '/';
      if (this.window) {
        this.render();
        windowManager.setActive(this.window);
      }
    }
  }

  focus() {
    windowManager.setActive(this.window);
  }
}