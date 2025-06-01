import { KEY_TO_RU_MAPPING, LAYOUT } from "./constants.js";

class KeyboardDemo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.keyMappings = {};
    this.activeModifiers = new Set();
    this.stylesLoaded = false;
    this.demoLang = 'RU';
    this.title = '🇷🇺 Русская клавиатура';
  }

  async connectedCallback() {
    await this.loadStyles();
    this.render();
    this.setupEventListeners();
    this.updateDemo();
  }

  async loadStyles() {
    if (!this.shadowRoot) return;
    if (!('adoptedStyleSheets' in this.shadowRoot)) {
      // Fallback: using link element
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'components/index.css';
      link.onload = () => {
        this.stylesLoaded = true;
      };
      this.shadowRoot.appendChild(link);
    }

    const response = await fetch('components/index.css');
    const css = await response.text();
    const sheet = new CSSStyleSheet();
    await sheet.replace(css);
    this.shadowRoot.adoptedStyleSheets = [sheet];
    this.stylesLoaded = true;
    return;
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.setupEventListeners();
      this.updateDemo();
    }
  }

  getDefaultLayout() {
    // Default Russian layout based on your existing code
    return LAYOUT
  }

  getCurrentKeyValue(keyData) {
    if (this.activeModifiers.has('alt') && this.activeModifiers.has('shift')) {
      return keyData.altShift || keyData.alt.toUpperCase();
    }
    if (this.activeModifiers.has('alt')) {
      return keyData.alt
    }
    if (this.activeModifiers.has('shift')) {
      return keyData.shift || this.getKeyBaseByLanguage(keyData.key).toUpperCase();
    }
    return this.getKeyBaseByLanguage(keyData.key);
  }

  updateDemo() {
    const titleEl = this.shadowRoot?.querySelector('.title');
    if (!titleEl) return;
    titleEl.textContent = this.title;

    const keys = this.shadowRoot?.querySelectorAll('.key');
    if (!keys) return;
    keys.forEach((keyElement, index) => {
      const keyData = this.getKeyDataByIndex(index);
      if (!keyData) return;
      keyElement.textContent = this.getCurrentKeyValue(keyData);
    });
  }

  getKeyDataByIndex(index) {
    const layout = this.getDefaultLayout();
    let currentIndex = 0;

    for (const row of layout.rows) {
      for (const keyData of row) {
        if (currentIndex === index) {
          return keyData;
        }
        currentIndex++;
      }
    }
    return null;
  }

  setupEventListeners() {
    /** @type {NodeListOf<HTMLDivElement> | undefined} */
    const modifiers = this.shadowRoot?.querySelectorAll('.modifier');
    const keyboardDemo = this.shadowRoot?.querySelector('.keyboard-demo');
    if (!keyboardDemo) return;
    if (!modifiers) return;

    modifiers.forEach(mod => {
      mod.addEventListener('click', (e) => {
        e.preventDefault();
        const modifierType = mod.dataset.modifier;

        mod.classList.toggle('active');

        // console.info(this.activeModifiers)
        if (mod.classList.contains('active')) {
          this.activeModifiers.add(modifierType);
        } else {
          this.activeModifiers.delete(modifierType);
        }

        this.updateDemo();

        // Dispatch custom event
        this.dispatchEvent(new CustomEvent('modifier-changed', {
          detail: {
            modifier: modifierType,
            active: mod.classList.contains('active'),
            activeModifiers: Array.from(this.activeModifiers)
          },
          bubbles: true
        }));
      });
    });

    // keyboardDemo.addEventListener('click', (e) => {
  }

  render() {
    if (!this.shadowRoot) return;

    const layout = this.getDefaultLayout();

    // Создаем контейнер для контента, не трогая стили
    const existingContent = this.shadowRoot.querySelector('.keyboard-demo');
    if (existingContent) {
      existingContent.remove();
    }

    const shiftButtonHtml = '<button class="modifier" data-modifier="shift">Shift</button>';
    const altButtonHtml = '<button class="modifier" data-modifier="alt">Alt</button>';
    const getKeyHtml = keyData =>
      `<div 
        class="key ${keyData.homeRow ? 'home-row' : ''}" 
        data-key="${keyData.key}"
      >
        ${this.getKeyBaseByLanguage(keyData.key)}
      </div>`;

    const container = document.createElement('div');
    container.className = 'keyboard-demo';
    container.innerHTML = `
      <h3 class="title">${this.title}</h3>
      ${layout.rows.map((row, rowIndex) => `
        <div class="keyboard-row">
          ${rowIndex === 3 ? shiftButtonHtml : ''}
          ${row.map(getKeyHtml).join('')}
          ${rowIndex === 3 ? altButtonHtml : ''}
        </div>
      `).join('')}
    `;

    this.appendLangSwitcher(container);
    this.shadowRoot.appendChild(container);
  }

  appendLangSwitcher(container) {
    const langSwitch = document.createElement('button');
    langSwitch.className = 'lang-switch';
    langSwitch.dataset.modifier = 'lang';
    langSwitch.textContent = this.demoLang;
    this.updateDemo();
    langSwitch.addEventListener('click', (e) => {
      e.preventDefault();
      langSwitch.textContent = this.demoLang;
      this.toggleDemoLang();
      this.toggleDemoTitle();
      this.updateDemo();
      // this.dispatchEvent(new CustomEvent('lang-changed', {
      //   detail: {
      //     lang: this.demoLang
      //   },
      //   bubbles: true
      // }));
    });
    container.appendChild(langSwitch);
  }

  toggleDemoLang() {
    this.demoLang = this.demoLang === 'EN' ? 'RU' : 'EN';
    return this.demoLang;
  }

  toggleDemoTitle() {
    this.title = this.demoLang === 'EN' ? '🇬🇧 English Keyboard' : '🇷🇺 Русская клавиатура';
    return this.title;
  }

  /** @param {string} keySymbol - The key symbol to convert. */
  getKeyBaseByLanguage(keySymbol) {
    const key = this.demoLang === 'RU' ? KEY_TO_RU_MAPPING?.[keySymbol] : keySymbol;
    // console.log(keyData, isUpperCase, keyData)
    if (!key) return '';
    const isUpperCase = this.isUpperCase()
    // console.log("🚀 ~ file: keyboard-demo.js ~ isUpperCase", isUpperCase)
    const result = isUpperCase ? key?.toUpperCase() : key
    // console.log("🚀 ~ file: keyboard-demo.js ~ func: getKeyBaseByLanguage ~ var: result", result)
    return result
  }

  isUpperCase() {
    // console.log("🚀 ~ file: keyboard-demo.js ~ func: isUpperCase ~ var: this.activeModifiers.has('shift')", this.activeModifiers)
    return this.activeModifiers.has('shift')
  }
}

customElements.define('keyboard-demo', KeyboardDemo);