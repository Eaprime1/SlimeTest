/**
 * MobileControlPanel - Touch-friendly control panel for mobile devices
 * Provides a floating button and overlay panel with collapsible sections
 */

class MobileControlPanel {
  constructor() {
    this.isOpen = false;
    this.activeSections = new Set(['simulation']); // Track which sections are expanded
    this.init();
  }

  init() {
    this.createFloatingButton();
    this.createControlPanel();
    this.attachEventListeners();
  }

  /**
   * Creates the floating button that toggles the control panel
   */
  createFloatingButton() {
    const button = document.createElement('button');
    button.id = 'mobile-control-toggle';
    button.className = 'mobile-control-toggle';
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="5" r="1"/>
        <circle cx="12" cy="12" r="1"/>
        <circle cx="12" cy="19" r="1"/>
        <line x1="4" y1="5" x2="9" y2="5"/>
        <line x1="15" y1="5" x2="20" y2="5"/>
        <line x1="4" y1="12" x2="9" y2="12"/>
        <line x1="15" y1="12" x2="20" y2="12"/>
        <line x1="4" y1="19" x2="9" y2="19"/>
        <line x1="15" y1="19" x2="20" y2="19"/>
      </svg>
    `;
    button.setAttribute('aria-label', 'Toggle Mobile Controls');
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });
    document.body.appendChild(button);
    this.button = button;
  }

  /**
   * Creates the main control panel with collapsible sections
   */
  createControlPanel() {
    const panel = document.createElement('div');
    panel.id = 'mobile-control-panel';
    panel.className = 'mobile-control-panel';
    panel.style.display = 'none';

    panel.innerHTML = `
      <div class="mobile-control-header">
        <h3>Controls</h3>
        <button class="mobile-control-close" aria-label="Close">&times;</button>
      </div>
      <div class="mobile-control-content">
        ${this.buildSimulationSection()}
        ${this.buildDisplaySection()}
        ${this.buildViewSection()}
        ${this.buildInfoSection()}
      </div>
    `;

    document.body.appendChild(panel);
    this.panel = panel;

    // Attach close button handler
    const closeBtn = panel.querySelector('.mobile-control-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
    });

    // Attach section toggle handlers
    const sectionHeaders = panel.querySelectorAll('.mobile-section-header');
    sectionHeaders.forEach(header => {
      header.addEventListener('click', (e) => {
        const section = header.dataset.section;
        this.toggleSection(section);
      });
    });

    // Attach button handlers
    this.attachControlHandlers();
  }

  /**
   * Build Simulation Control Section
   */
  buildSimulationSection() {
    return `
      <div class="mobile-section" data-section="simulation">
        <div class="mobile-section-header" data-section="simulation">
          <span class="mobile-section-title">Simulation</span>
          <span class="mobile-section-arrow">▼</span>
        </div>
        <div class="mobile-section-content">
          <div class="mobile-button-row">
            <button class="mobile-btn mobile-btn-primary" data-action="pause">
              <span class="mobile-btn-icon">⏸</span>
              <span class="mobile-btn-label">Pause/Play</span>
            </button>
            <button class="mobile-btn mobile-btn-secondary" data-action="reset">
              <span class="mobile-btn-icon">↻</span>
              <span class="mobile-btn-label">Reset</span>
            </button>
          </div>
          <div class="mobile-button-row">
            <button class="mobile-btn" data-action="step">
              <span class="mobile-btn-icon">⏭</span>
              <span class="mobile-btn-label">Step</span>
            </button>
            <button class="mobile-btn" data-action="auto">
              <span class="mobile-btn-icon">⚡</span>
              <span class="mobile-btn-label">Auto Toggle</span>
            </button>
          </div>
          <div class="mobile-button-row">
            <button class="mobile-btn" data-action="speed-down">
              <span class="mobile-btn-icon">−</span>
              <span class="mobile-btn-label">Slower</span>
            </button>
            <button class="mobile-btn" data-action="speed-up">
              <span class="mobile-btn-icon">+</span>
              <span class="mobile-btn-label">Faster</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Build Display Control Section
   */
  buildDisplaySection() {
    return `
      <div class="mobile-section" data-section="display">
        <div class="mobile-section-header" data-section="display">
          <span class="mobile-section-title">Display</span>
          <span class="mobile-section-arrow">▶</span>
        </div>
        <div class="mobile-section-content" style="display: none;">
          <div class="mobile-button-row">
            <button class="mobile-btn" data-action="toggle-trails">
              <span class="mobile-btn-icon">〰</span>
              <span class="mobile-btn-label">Trails</span>
            </button>
            <button class="mobile-btn" data-action="toggle-links">
              <span class="mobile-btn-icon">⎯</span>
              <span class="mobile-btn-label">Links</span>
            </button>
          </div>
          <div class="mobile-button-row">
            <button class="mobile-btn" data-action="toggle-fertility">
              <span class="mobile-btn-icon">▦</span>
              <span class="mobile-btn-label">Fertility</span>
            </button>
            <button class="mobile-btn" data-action="toggle-signal">
              <span class="mobile-btn-icon">◉</span>
              <span class="mobile-btn-label">Signal</span>
            </button>
          </div>
          <div class="mobile-button-row">
            <button class="mobile-btn" data-action="toggle-resources">
              <span class="mobile-btn-icon">●</span>
              <span class="mobile-btn-label">Resources</span>
            </button>
            <button class="mobile-btn" data-action="toggle-participation">
              <span class="mobile-btn-icon">✱</span>
              <span class="mobile-btn-label">Effects</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Build View Control Section
   */
  buildViewSection() {
    return `
      <div class="mobile-section" data-section="view">
        <div class="mobile-section-header" data-section="view">
          <span class="mobile-section-title">View</span>
          <span class="mobile-section-arrow">▶</span>
        </div>
        <div class="mobile-section-content" style="display: none;">
          <div class="mobile-button-row">
            <button class="mobile-btn" data-action="zoom-in">
              <span class="mobile-btn-icon">🔍+</span>
              <span class="mobile-btn-label">Zoom In</span>
            </button>
            <button class="mobile-btn" data-action="zoom-out">
              <span class="mobile-btn-icon">🔍−</span>
              <span class="mobile-btn-label">Zoom Out</span>
            </button>
          </div>
          <div class="mobile-button-row">
            <button class="mobile-btn" data-action="reset-view">
              <span class="mobile-btn-icon">⊙</span>
              <span class="mobile-btn-label">Reset View</span>
            </button>
            <button class="mobile-btn" data-action="follow">
              <span class="mobile-btn-icon">⊕</span>
              <span class="mobile-btn-label">Follow</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Build Info/Panels Section
   */
  buildInfoSection() {
    return `
      <div class="mobile-section" data-section="info">
        <div class="mobile-section-header" data-section="info">
          <span class="mobile-section-title">Info & Panels</span>
          <span class="mobile-section-arrow">▶</span>
        </div>
        <div class="mobile-section-content" style="display: none;">
          <div class="mobile-button-row">
            <button class="mobile-btn" data-action="toggle-hud">
              <span class="mobile-btn-icon">ⓘ</span>
              <span class="mobile-btn-label">HUD (U)</span>
            </button>
            <button class="mobile-btn" data-action="toggle-dashboard">
              <span class="mobile-btn-icon">⊞</span>
              <span class="mobile-btn-label">Dashboard (H)</span>
            </button>
          </div>
          <div class="mobile-button-row">
            <button class="mobile-btn" data-action="toggle-training">
              <span class="mobile-btn-icon">📊</span>
              <span class="mobile-btn-label">Training (L)</span>
            </button>
            <button class="mobile-btn" data-action="toggle-config">
              <span class="mobile-btn-icon">⚙</span>
              <span class="mobile-btn-label">Config (O)</span>
            </button>
          </div>
          <div class="mobile-button-row">
            <button class="mobile-btn" data-action="toggle-hotkeys">
              <span class="mobile-btn-icon">⌨</span>
              <span class="mobile-btn-label">Hotkeys (K)</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Toggle a collapsible section
   */
  toggleSection(sectionName) {
    const section = this.panel.querySelector(`.mobile-section[data-section="${sectionName}"]`);
    if (!section) return;

    const content = section.querySelector('.mobile-section-content');
    const arrow = section.querySelector('.mobile-section-arrow');

    if (this.activeSections.has(sectionName)) {
      // Collapse
      this.activeSections.delete(sectionName);
      content.style.display = 'none';
      arrow.textContent = '▶';
    } else {
      // Expand
      this.activeSections.add(sectionName);
      content.style.display = 'block';
      arrow.textContent = '▼';
    }
  }

  /**
   * Attach event handlers to control buttons
   */
  attachControlHandlers() {
    const buttons = this.panel.querySelectorAll('[data-action]');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        this.handleAction(action);
      });
    });
  }

  /**
   * Handle control actions by simulating keyboard events
   */
  handleAction(action) {
    const keyMap = {
      // Simulation
      'pause': ' ',
      'reset': 'r',
      'step': '.',
      'auto': 'a',
      'speed-down': '-',
      'speed-up': '+',

      // Display
      'toggle-trails': 't',
      'toggle-links': 'j',
      'toggle-fertility': 'f',
      'toggle-signal': 'w',
      'toggle-resources': 'q',
      'toggle-participation': 'p',

      // View
      'zoom-in': '=',
      'zoom-out': '-',
      'reset-view': '0',
      'follow': 'c',

      // Info/Panels
      'toggle-hud': 'u',
      'toggle-dashboard': 'h',
      'toggle-training': 'l',
      'toggle-config': 'o',
      'toggle-hotkeys': 'k'
    };

    const key = keyMap[action];
    if (key) {
      // Simulate keyboard event
      const event = new KeyboardEvent('keydown', {
        key: key,
        code: key === ' ' ? 'Space' : `Key${key.toUpperCase()}`,
        bubbles: true
      });
      document.dispatchEvent(event);
    }
  }

  /**
   * Attach panel event listeners
   */
  attachEventListeners() {
    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen &&
          !this.panel.contains(e.target) &&
          !this.button.contains(e.target)) {
        this.close();
      }
    });

    // Prevent panel clicks from closing it
    this.panel.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Handle keyboard shortcut (B key) to toggle mobile panel
    document.addEventListener('keydown', (e) => {
      if (e.key === 'b' || e.key === 'B') {
        this.toggle();
      }
    });
  }

  /**
   * Toggle panel open/closed
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open the control panel
   */
  open() {
    this.isOpen = true;
    this.panel.style.display = 'flex';
    this.button.classList.add('active');

    // Add animation
    requestAnimationFrame(() => {
      this.panel.classList.add('mobile-panel-open');
    });
  }

  /**
   * Close the control panel
   */
  close() {
    this.isOpen = false;
    this.panel.classList.remove('mobile-panel-open');
    this.button.classList.remove('active');

    // Wait for animation before hiding
    setTimeout(() => {
      if (!this.isOpen) {
        this.panel.style.display = 'none';
      }
    }, 200);
  }

  /**
   * Show the floating button (for mobile devices)
   */
  show() {
    this.button.style.display = 'flex';
  }

  /**
   * Hide the floating button (for desktop)
   */
  hide() {
    this.button.style.display = 'none';
    this.close();
  }
}

// Auto-detect mobile and show/hide accordingly
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
}
