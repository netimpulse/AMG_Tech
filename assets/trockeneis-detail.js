(function() {
  const SELECTOR = '[data-section-id]';

  // Kapselt die Logik für eine einzelne Tab-Sektion
  class TrockeneisTabs {
    constructor(container) {
      this.container = container;
      this.pills = this.container.querySelectorAll('.te-pill');
      this.tabs = this.container.querySelectorAll('.te-tab');
      this.applyDynamicStyles();
      this.init();
    }
    
    // Setzt die CSS-Variablen aus dem Schema
    applyDynamicStyles() {
        const rootEl = this.container;
        const schemaSettings = JSON.parse(document.getElementById(`Shopify-Section-Settings-{{ section.id }}`).textContent);
        
        rootEl.style.setProperty('--fs-base', `${schemaSettings.fs_base}px`);
        rootEl.style.setProperty('--fs-h1', `${schemaSettings.fs_h1}px`);
        rootEl.style.setProperty('--fs-h2', `${schemaSettings.fs_h2}px`);
        rootEl.style.setProperty('--fs-h3', `${schemaSettings.fs_h3}px`);
        rootEl.style.setProperty('--color-body', schemaSettings.color_body);
        rootEl.style.setProperty('--color-head', schemaSettings.color_head);
        rootEl.style.setProperty('--hero-start', schemaSettings.hero_start);
        rootEl.style.setProperty('--hero-end', schemaSettings.hero_end);
        rootEl.style.setProperty('--hero-text', schemaSettings.hero_text);
        
        const pillbar = rootEl.querySelector('.te-pillbar');
        if (pillbar) {
            pillbar.style.setProperty('--pill-normal-bg', schemaSettings.pill_bg);
            pillbar.style.setProperty('--pill-normal-text', schemaSettings.pill_text);
            pillbar.style.setProperty('--pill-border-color', schemaSettings.pill_border);
            pillbar.style.setProperty('--pill-hover-bg', schemaSettings.pill_hover_bg);
            pillbar.style.setProperty('--pill-hover-text', schemaSettings.pill_hover_text);
            pillbar.style.setProperty('--pill-active-bg', schemaSettings.pill_active_bg);
            pillbar.style.setProperty('--pill-active-text', schemaSettings.pill_active_text);

            if (schemaSettings.sticky) {
                pillbar.classList.add('is-sticky');
                pillbar.style.top = `${schemaSettings.sticky_offset}px`;
            } else {
                pillbar.classList.remove('is-sticky');
            }
        }
    }

    init() {
      if (!this.pills.length || !this.tabs.length) {
        return;
      }
      
      this.container.addEventListener('click', this.handleClick.bind(this));
      
      // Initiale Aktivierung
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
      
      if (!targetTab) {
        targetTab = this.tabs[0];
      }

      if (!targetTab) return; // Nichts zu tun, wenn kein Tab vorhanden ist

      const activeHandle = targetTab.dataset.route;

      this.tabs.forEach(t => t.classList.toggle('is-active', t.dataset.route === activeHandle));
      this.pills.forEach(p => {
        const isActive = p.dataset.tab === activeHandle;
        p.classList.toggle('is-active', isActive);
        p.setAttribute('aria-selected', isActive.toString());
      });

      if (window.location.hash !== `#${activeHandle}`) {
        // Verhindert Sprünge im Editor
        if (!(typeof Shopify !== 'undefined' && Shopify.designMode)) {
            history.replaceState(null, '', `#${activeHandle}`);
        }
      }
    }
  }

  // Lade-Funktion, die aufgerufen wird, wenn die Seite oder die Sektion geladen wird
  const loadSection = (container) => {
    // Verhindert mehrfache Initialisierung durch eine einfache Überprüfung
    if (container.dataset.tabsInitialized === 'true') return;
    container.dataset.tabsInitialized = 'true';
    
    new TrockeneisTabs(container);
  };

  // Initiales Laden für alle Sektionen auf der Seite
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(SELECTOR).forEach(loadSection);
  });

  // Speziell für den Shopify Theme Editor
  if (typeof Shopify !== 'undefined' && Shopify.designMode) {
    document.addEventListener('shopify:section:load', (event) => {
      // `event.target` ist der `shopify-section`-Wrapper
      const container = event.target.querySelector(SELECTOR);
      if (container) {
        // Setzt den Initialisierungs-Status zurück und lädt die Sektion neu
        container.dataset.tabsInitialized = 'false';
        loadSection(container);
      }
    });
  }
})();