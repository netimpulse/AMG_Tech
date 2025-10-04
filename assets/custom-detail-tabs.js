// Custom Detail Tabs – Hash routing & active pills
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.detail-tabs').forEach(section => {
    const links = Array.from(section.querySelectorAll('.pillbar__link'));
    const routes = Array.from(section.querySelectorAll('.route'));

    function activateByHandle(handle) {
      let h = handle || (links[0]?.dataset.target);
      if (!h) return;

      routes.forEach(r => r.classList.toggle('is-active', r.dataset.route === h));
      links.forEach(a => a.classList.toggle('is-active', a.dataset.target === h));
      // Scroll to top of section for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Initial: from hash or first tab
    const hash = window.location.hash.replace('#','');
    if (hash && links.some(a => a.dataset.target === hash)) {
      activateByHandle(hash);
    } else {
      activateByHandle();
    }

    // Click handling – also update URL hash
    links.forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = a.dataset.target;
        history.replaceState(null, '', `#${target}`);
        activateByHandle(target);
      });
    });

    // React to hash changes (if other components update it)
    window.addEventListener('hashchange', () => {
      const h = location.hash.replace('#','');
      if (h) activateByHandle(h);
    });
  });
});
