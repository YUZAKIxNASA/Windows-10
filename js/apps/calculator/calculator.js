/* Calculator App */

class CalculatorApp {
  constructor() {
    this.window = null;
    this.display = '0';
    this.previousValue = null;
    this.currentOperation = null;
    this.shouldResetDisplay = false;
    window.calculatorApp = this;
    this.create();
  }

  create() {
    this.window = windowManager.createWindow({
      id: CONSTANTS.APPS.CALCULATOR,
      title: 'Calculator',
      icon: '🧮',
      width: 320,
      height: 400,
      x: 100,
      y: 100,
      onClose: () => { window.calculatorApp = null; }
    });

    this.render();
  }

  render() {
    const html = `
      <div class="calculator-container">
        <div class="calculator-display" id="calcDisplay">0</div>
        <div class="calculator-buttons">
          <button class="calc-btn clear" data-action="clear">AC</button>
          <button class="calc-btn" data-action="delete">←</button>
          <button class="calc-btn" data-action="percent">%</button>
          <button class="calc-btn operator" data-action="divide">÷</button>
          
          <button class="calc-btn" data-number="7">7</button>
          <button class="calc-btn" data-number="8">8</button>
          <button class="calc-btn" data-number="9">9</button>
          <button class="calc-btn operator" data-action="multiply">×</button>
          
          <button class="calc-btn" data-number="4">4</button>
          <button class="calc-btn" data-number="5">5</button>
          <button class="calc-btn" data-number="6">6</button>
          <button class="calc-btn operator" data-action="subtract">−</button>
          
          <button class="calc-btn" data-number="1">1</button>
          <button class="calc-btn" data-number="2">2</button>
          <button class="calc-btn" data-number="3">3</button>
          <button class="calc-btn operator" data-action="add">+</button>
          
          <button class="calc-btn zero" data-number="0">0</button>
          <button class="calc-btn" data-action="decimal">.</button>
          <button class="calc-btn equal" data-action="equals">=</button>
        </div>
      </div>
    `;

    this.window.setContent(html);
    this.setupEventListeners();
  }

  setupEventListeners() {
    const btns = this.window.contentElement.querySelectorAll('.calc-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => this.handleButtonClick(btn));
    });
  }

  handleButtonClick(btn) {
    const number = btn.dataset.number;
    const action = btn.dataset.action;

    if (number) {
      this.appendNumber(number);
    } else if (action) {
      switch (action) {
        case 'clear':
          this.clear();
          break;
        case 'delete':
          this.delete();
          break;
        case 'decimal':
          this.appendDecimal();
          break;
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
          this.setOperation(action);
          break;
        case 'equals':
          this.calculate();
          break;
      }
    }
  }

  appendNumber(num) {
    if (this.shouldResetDisplay) {
      this.display = num;
      this.shouldResetDisplay = false;
    } else {
      this.display = this.display === '0' ? num : this.display + num;
    }
    this.updateDisplay();
  }

  appendDecimal() {
    if (!this.display.includes('.')) {
      this.display += '.';
      this.updateDisplay();
    }
  }

  clear() {
    this.display = '0';
    this.previousValue = null;
    this.currentOperation = null;
    this.shouldResetDisplay = false;
    this.updateDisplay();
  }

  delete() {
    if (this.display.length > 1) {
      this.display = this.display.slice(0, -1);
    } else {
      this.display = '0';
    }
    this.updateDisplay();
  }

  setOperation(op) {
    if (this.currentOperation !== null) {
      this.calculate();
    }
    this.previousValue = parseFloat(this.display);
    this.currentOperation = op;
    this.shouldResetDisplay = true;
  }

  calculate() {
    if (this.currentOperation === null) return;

    const current = parseFloat(this.display);
    let result = this.previousValue;

    switch (this.currentOperation) {
      case 'add':
        result += current;
        break;
      case 'subtract':
        result -= current;
        break;
      case 'multiply':
        result *= current;
        break;
      case 'divide':
        result = current === 0 ? 0 : result / current;
        break;
    }

    this.display = result.toString();
    this.currentOperation = null;
    this.shouldResetDisplay = true;
    this.updateDisplay();
  }

  updateDisplay() {
    const displayEl = this.window.contentElement.querySelector('#calcDisplay');
    if (displayEl) {
      displayEl.textContent = this.display.length > 10 ? this.display.slice(0, 10) + '...' : this.display;
    }
  }

  focus() {
    windowManager.setActive(this.window);
  }
}