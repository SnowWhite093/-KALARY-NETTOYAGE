const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.getElementById('main-nav');
const year = document.getElementById('year');
const quoteForm = document.getElementById('quote-form');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (quoteForm) {
  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(quoteForm);
    const service = formData.get('service');
    const location = formData.get('location');
    const details = formData.get('details');
    const message = [
      'Bonjour Kalary Nettoyage, je souhaite demander un devis.',
      `Service : ${service}`,
      `Commune : ${location}`,
      details ? `Précisions : ${details}` : '',
    ].filter(Boolean).join('\n');

    window.location.href = `https://wa.me/41779978663?text=${encodeURIComponent(message)}`;
  });
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const revealTargets = document.querySelectorAll(
    '.service-card, .gallery-card, .trust-item, .why-card, .step',
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach((target) => {
      target.classList.add('reveal-on-scroll');
      revealObserver.observe(target);
    });
  }

  const scrollLayers = document.querySelectorAll('.scroll-layer[data-scroll-speed]');
  const storyScenes = document.querySelectorAll('.story-scene');

  if (scrollLayers.length || storyScenes.length) {
    let updateScheduled = false;

    const updateScrollEffects = () => {
      const viewportCenter = window.innerHeight / 2;

      scrollLayers.forEach((layer) => {
        const bounds = layer.getBoundingClientRect();
        const speed = Number(layer.dataset.scrollSpeed);
        const previousOffset = Number.parseFloat(layer.style.getPropertyValue('--scroll-y')) || 0;
        const distance = (viewportCenter - bounds.top - bounds.height / 2 + previousOffset) * speed;
        const offset = Math.max(-48, Math.min(48, distance));
        layer.style.setProperty('--scroll-y', `${offset.toFixed(2)}px`);
      });

      storyScenes.forEach((scene) => {
        const bounds = scene.getBoundingClientRect();
        const distance = viewportCenter - (bounds.top + bounds.height / 2);
        const progress = Math.max(0, 1 - Math.abs(distance) / window.innerHeight);
        const imageOffset = Math.max(-72, Math.min(72, distance * 0.1));

        scene.style.setProperty('--scene-y', `${imageOffset.toFixed(2)}px`);
        scene.style.setProperty('--scene-copy-y', `${((1 - progress) * 18).toFixed(2)}px`);
        scene.style.setProperty('--scene-opacity', (0.72 + progress * 0.28).toFixed(2));
      });

      updateScheduled = false;
    };

    const scheduleScrollUpdate = () => {
      if (!updateScheduled) {
        updateScheduled = true;
        window.requestAnimationFrame(updateScrollEffects);
      }
    };

    window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
    window.addEventListener('resize', scheduleScrollUpdate);
    scheduleScrollUpdate();
  }
}
