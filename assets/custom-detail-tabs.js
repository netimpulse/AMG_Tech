class CustomTabsSection extends HTMLElement {
  constructor() {
    super();
    this.navLinks = this.querySelectorAll('.pillbar .nav-link');
    this.routes = this.querySelectorAll('.route-detail');

    this.navLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = link.getAttribute('href');
        this.showRoute(targetId);
        // Optional: Update URL hash without jumping
        // history.pushState(null, null, targetId);
      });
    });
  }

  showRoute(hash) {
    const targetRouteId = hash.replace('#', '');

    this.routes.forEach(route => {
      route.classList.toggle('active', route.dataset.route === targetRouteId);
    });

    this.navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === hash);
    });

    // Scroll to the top of the section container smoothly
    window.scrollTo({
      top: this.offsetTop,
      behavior: 'smooth'
    });
  }
}

customElements.define('custom-tabs-section', CustomTabsSection);