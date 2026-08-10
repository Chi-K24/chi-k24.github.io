(() => {
  const navLinks = [...document.querySelectorAll('.sidebar nav a')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const activate = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
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

})();
