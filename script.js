(() => {
  const navLinks = [...document.querySelectorAll('.sidebar nav a')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const activate = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === '#' + id;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) activate(visible.target.id);
  }, { rootMargin: '-20% 0px -55% 0px', threshold: [0.05, 0.2, 0.5] });

  sections.forEach((section) => observer.observe(section));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const demoVideo = document.querySelector('.grocery-demo');

  if (demoVideo) {
    if (reduceMotion) {
      demoVideo.removeAttribute('autoplay');
      demoVideo.pause();
    } else {
      const demoObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          demoVideo.play().catch(() => {});
        } else {
          demoVideo.pause();
        }
      }, { threshold: 0.35 });

      demoObserver.observe(demoVideo);
    }
  }

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealTargets = [...document.querySelectorAll(
      '.section-heading, .feature-card, .project-card, .experience-intro, .timeline li, .skill-grid article, .contact .eyebrow, .contact h2, .contact > p, .contact .hero-actions'
    )];

    revealTargets.forEach((element, index) => {
      element.classList.add('reveal-item');
      element.style.setProperty('--reveal-delay', (index % 3) * 65 + 'ms');
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealTargets.forEach((element) => revealObserver.observe(element));
  }


  const sidebar = document.querySelector('.sidebar');
  const menuToggle = document.querySelector('.menu-toggle');
  const menuOverlay = document.querySelector('.menu-overlay');

  const setMenuOpen = (open) => {
    if (!sidebar || !menuToggle || !menuOverlay) return;
    sidebar.classList.toggle('menu-open', open);
    menuOverlay.classList.toggle('visible', open);
    document.body.classList.toggle('menu-active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuOverlay.setAttribute('aria-hidden', String(!open));
  };

  menuToggle?.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });
  menuOverlay?.addEventListener('click', () => setMenuOpen(false));
  navLinks.forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100) setMenuOpen(false);
  });

  const filterButtons = [...document.querySelectorAll('.project-filter')];
  const projectCards = [...document.querySelectorAll('.project-grid .project-card')];
  const projectCount = document.querySelector('.project-count');

  const applyProjectFilter = (filter) => {
    const visibleCards = [];
    projectCards.forEach((card) => {
      const categories = (card.dataset.category || '').split(' ');
      const visible = filter === 'all' || categories.includes(filter);
      card.hidden = !visible;
      card.classList.remove('filter-fill');
      if (visible) visibleCards.push(card);
    });

    if (filter !== 'all') {
      visibleCards.forEach((card) => {
        if (!card.matches('.automation-project, .media-project, .backup-project')) {
          card.classList.add('filter-fill');
        }
      });
    }

    filterButtons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    if (projectCount) {
      projectCount.textContent = 'Showing ' + visibleCards.length + ' additional project' + (visibleCards.length === 1 ? '' : 's');
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => applyProjectFilter(button.dataset.filter || 'all'));
  });

})();
