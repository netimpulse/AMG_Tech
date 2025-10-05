(function() {
  const SELECTOR = '.te-detail[data-section-id]';

  // Kapselt die Logik für eine einzelne Tab-Sektion
  class TrockeneisTabs {
    constructor(container) {
      this.container = container;
      this.sectionId = this.container.dataset.sectionId;
      this.pills = this.container.querySelectorAll('.te-pill');
      this.tabs = this.container.querySelectorAll('.te-tab');
      this.applyDynamicStyles();
      this.init();
    }
    
    // Setzt die CSS-Variablen aus den Schema-Einstellungen
    applyDynamicStyles() {
        const settingsEl = document.getElementById(`Shopify-Section-Settings-${this.sectionId}`);
        if (!settingsEl) return;
        
        const settings = JSON.parse(settingsEl.textContent);
        
        this.container.style.setProperty('--fs-base', `${settings.fs_base}px`);
        this.container.style.setProperty('--fs-h1', `${settings.fs_h1}px`);
        this.container.style.setProperty('--fs-h2', `${settings.fs_h2}px`);
        this.container.style.setProperty('--fs-h3', `${settings.fs_h3}px`);
        this.container.style.setProperty('--color-body', settings.color_body);
        this.container.style.setProperty('--color-head', settings.color_head);
        this.container.style.setProperty('--hero-start', settings.hero_start);
        this.container.style.setProperty('--hero-end', settings.hero_end);
        this.container.style.setProperty('--hero-text', settings.hero_text);
        
        const pillbar = this.container.querySelector('.te-pillbar');
        if (pillbar) {
            pillbar.style.setProperty('--pill-normal-bg', settings.pill_bg);
            pillbar.style.setProperty('--pill-normal-text', settings.pill_text);
            pillbar.style.setProperty('--pill-border-color', settings.pill_border);
            pillbar.style.setProperty('--pill-hover-bg', settings.pill_hover_bg);
            pillbar.style.setProperty('--pill-hover-text', settings.pill_hover_text);
            pillbar.style.setProperty('--pill-active-bg', settings.pill_active_bg);
            pillbar.style.setProperty('--pill-active-text', settings.pill_active_text);

            if (settings.sticky) {
                pillbar.classList.add('is-sticky');
                pillbar.style.top = `${settings.sticky_offset}px`;
            } else {
                pillbar.classList.remove('is-sticky');
            }
        }
    }

    init() {
      if (!this.pills.length || !this.tabs.length) return;
      this.container.addEventListener('click', this.handleClick.bind(this));
      const initialHandle = window.location.hash || (this.pills.length > 0 ? this.pills[0].getAttribute('href') : null);
      this.activateTab(initialHandle);
    }

    handleClick(event) {
      const pill = event.target.closest('.te-pill');
      if (pill) {
        event.preventDefault();
        this.activateTab(pill.getAttribute('href'));
      }
    }

    activateTab(handle) {
      const cleanHandle = (handle || '').replace('#', '');
      let targetTab = Array.from(this.tabs).find(t => t.dataset.route === cleanHandle);
      if (!targetTab) targetTab = this.tabs[0];
      if (!targetTab) return;

      const activeHandle = targetTab.dataset.route;
      this.tabs.forEach(t => t.classList.toggle('is-active', t.dataset.route === activeHandle));
      this.pills.forEach(p => {
        const isActive = p.dataset.tab === activeHandle;
        p.classList.toggle('is-active', isActive);
        p.setAttribute('aria-selected', isActive.toString());
      });

      if (window.location.hash !== `#${activeHandle}` && !Shopify.designMode) {
        history.replaceState(null, '', `#${activeHandle}`);
      }
    }
  }

  const loadSection = (container) => {
    if (container.dataset.tabsInitialized === 'true') return;
    container.dataset.tabsInitialized = 'true';
    new TrockeneisTabs(container);
  };

  const initSections = () => {
    document.querySelectorAll(SELECTOR).forEach(loadSection);
  };

  document.addEventListener('DOMContentLoaded', initSections);

  if (typeof Shopify !== 'undefined' && Shopify.designMode) {
    document.addEventListener('shopify:section:load', (event) => {
      const container = event.target.querySelector(SELECTOR);
      if (container) {
        container.dataset.tabsInitialized = 'false';
        loadSection(container);
      }
    });
  }
})();