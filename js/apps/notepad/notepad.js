/* Notepad App */

class NotepadApp {
  constructor() {
    this.window = null;
    this.content = '';
    this.filename = 'Untitled.txt';
    this.isDirty = false;
    window.notepadApp = this;
    this.create();
  }

  create() {
    this.window = windowManager.createWindow({
      id: CONSTANTS.APPS.NOTEPAD,
      title: 'Notepad',
      icon: '📝',
      width: 700,
      height: 500,
      x: 200,
      y: 150,
      onClose: () => { window.notepadApp = null; }
    });

    this.render();
  }

  render() {
    const html = `
      <div class="notepad-container">
        <div class="notepad-menu">
          <button id="notepadNew" class="notepad-menu-btn">New</button>
          <button id="notepadOpen" class="notepad-menu-btn">Open</button>
          <button id="notepadSave" class="notepad-menu-btn">Save</button>
          <button id="notepadFont" class="notepad-menu-btn">Font</button>
        </div>
        <textarea id="notepadText" class="notepad-textarea" placeholder="Start typing..."></textarea>
        <div class="notepad-status">
          <span id="notepadStatus">Untitled.txt</span>
        </div>
      </div>
    `;

    this.window.setContent(html);
    this.setupEventListeners();
  }

  setupEventListeners() {
    const textarea = this.window.contentElement.querySelector('#notepadText');
    const newBtn = this.window.contentElement.querySelector('#notepadNew');
    const saveBtn = this.window.contentElement.querySelector('#notepadSave');

    textarea.addEventListener('input', () => {
      this.content = textarea.value;
      this.isDirty = true;
      this.updateTitle();
    });

    newBtn.addEventListener('click', () => this.newFile());
    saveBtn.addEventListener('click', () => this.saveFile());
  }

  newFile() {
    if (this.isDirty) {
      if (confirm('Save changes to ' + this.filename + '?')) {
        this.saveFile();
      }
    }
    this.content = '';
    this.filename = 'Untitled.txt';
    this.isDirty = false;
    this.updateDisplay();
  }

  saveFile() {
    // In a real app, this would save to disk
    this.isDirty = false;
    this.updateTitle();
    alert('File saved: ' + this.filename);
  }

  updateDisplay() {
    const textarea = this.window.contentElement.querySelector('#notepadText');
    if (textarea) textarea.value = this.content;
    this.updateTitle();
  }

  updateTitle() {
    const prefix = this.isDirty ? '* ' : '';
    this.window.setTitle(prefix + this.filename);
  }

  focus() {
    windowManager.setActive(this.window);
  }
}