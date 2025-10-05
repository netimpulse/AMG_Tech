/* ===== Trockeneis Detail Tabs – JS ===== */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.te-detail');
  if (!root) return;

  // read settings from data-* and push into CSS vars
  const applyVars = () => {
    const d = root.dataset;

    // Typography
    root.style.setProperty('--fs-base', (d.fsBase || d.fsBase === '0') ? `${d.fsBase}px` : `${d.fsBase}px`);
    root.style.setProperty('--fs-h1', `${d.fsH1}px`);
    root.style.setProperty('--fs-h2', `${d.fsH2}px`);
    root.style.setProperty('--fs-h3', `${d.fsH3}px`);
    root.style.setProperty('--color-body', d.colorBody || '#0f172a');
    root.style.setProperty('--color-head', d.colorHead || '#0f172a');

    // Hero
    root.style.setProperty('--hero-start', d.heroStart || '#0b1220');
    root.style.setProperty('--hero-end', d.heroEnd || '#0f172a');
    root.style.setProperty('--hero-text', d.heroText || '#e6f6ff');

    // Pills
    const pillbar = root.querySelector('.te-pillbar');
    if (pillbar) {
      pillbar.style.setProperty('--pill-normal-bg', d.pillNormalBg || '#fff');
      pillbar.style.setProperty('--pill-normal-text', d.pillNormalText || '#0f172a');
      pillbar.style.setProperty('--pill-border-color', d.pillBorder || 'rgba(2,6,23,.12)');
      pillbar.style.setProperty('--pill-hover-bg', d.pillHoverBg || '#e6f6ff');
      pillbar.style.setProperty('--pill-hover-text', d.pillHoverText || '#0284c7');
      pillbar.style.setProperty('--pill-active-bg', d.pillActiveBg || '#0ea5e9');
      pillbar.style.setProperty('--pill-active-text', d.pillActiveText || '#fff');
    }

    // Sticky
    const sticky = d.sticky === 'true';
    const off = parseInt(d.stickyOffset || '0', 10);
    if (sticky && pillbar) {
      pillbar.classList.add('is-sticky');
      pillbar.style.top = `${off}px`;
    } else {
      pillbar?.classList.remove('is-sticky');
    }
  };

  const getTabs = () => [...root.querySelectorAll('.te-tab')];
  const getPills = () => [...root.querySelectorAll('.te-pill')];

  const activate = (handle) => {
    // remove hash '#'
    const h = (handle || '').replace('#','');
    const tabs = getTabs();
    const pills = getPills();

    let target = tabs.find(t => t.dataset.route === h);
    if (!target && tabs.length) target = tabs[0];

    tabs.forEach(t => t.classList.toggle('is-active', t === target));
    pills.forEach(p => {
      const isAct = p.dataset.tab === target?.dataset.route;
      p.classList.toggle('is-active', isAct);
      p.setAttribute('aria-selected', isAct ? 'true' : 'false');
    });

    // update hash without jumping
    if (target && window.location.hash !== `#${target.dataset.route}`) {
      history.replaceState(null, '', `#${target.dataset.route}`);
    }

    // scroll to top of section (keine harte Animation in Editor)
    const pillbar = root.querySelector('.te-pillbar');
    const offset = parseInt(root.dataset.stickyOffset || '0', 10);
    const y = root.getBoundingClientRect().top + window.scrollY - (pillbar?.offsetHeight || 0) - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // Events
  root.addEventListener('click', (e) => {
    const a = e.target.closest('.te-pill');
    if (!a) return;
    e.preventDefault();
    activate(a.getAttribute('href'));
  });

  window.addEventListener('hashchange', () => activate(location.hash));

  // Init
  applyVars();
  // On theme editor change, re-apply vars (Shopify Editor triggers re-render, but safe):
  document.addEventListener('shopify:section:load', applyVars);
  document.addEventListener('shopify:section:reorder', applyVars);
  document.addEventListener('shopify:block:select', applyVars);
  document.addEventListener('shopify:block:deselect', applyVars);

  // initial tab from hash or first
  activate(location.hash || null);
});
