/* ============================================================
   SELMA H — Main JavaScript
   Ultra-High Performance, Zero-Lag Desktop & Mobile Engine
   ============================================================ */

/* ============================================================
   UTILS & ENVIRONMENT
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 1024);

/* ============================================================
   NATIVE HARDWARE-ACCELERATED SCROLL (0ms latency on all devices)
   ============================================================ */
function initScroll() {
  document.documentElement.style.scrollBehavior = 'smooth';
}

/* ============================================================
   CURSEUR PERSONNALISÉ (Ultra-light, Desktop only)
   ============================================================ */
function initCursor() {
  if (isTouchDevice || prefersReducedMotion) return;

  const cursor = document.createElement('div');
  const follower = document.createElement('div');
  cursor.className = 'cursor';
  follower.className = 'cursor-follower';
  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;
  let isMoving = false;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(animateFollower);
    }
  }, { passive: true });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.2;
    followerY += (mouseY - followerY) * 0.2;
    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;

    if (Math.abs(mouseX - followerX) > 0.1 || Math.abs(mouseY - followerY) > 0.1) {
      requestAnimationFrame(animateFollower);
    } else {
      isMoving = false;
    }
  }

  $$('a, button, [role="button"], .collection-card, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('cursor-hover'), { passive: true });
    el.addEventListener('mouseleave', () => follower.classList.remove('cursor-hover'), { passive: true });
  });
}

/* ============================================================
   HEADER SCROLL (Passive + RAF Throttled)
   ============================================================ */
function initNav() {
  const header = $('#header');
  if (!header) return;

  const isIndex = document.body.dataset.page === 'accueil';

  if (!isIndex) {
    header.classList.add('opaque');
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY > 30;
        if (scrolled) {
          header.classList.add('scrolled');
          header.classList.remove('opaque');
        } else {
          header.classList.remove('scrolled');
          if (!isIndex) header.classList.add('opaque');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   MENU MOBILE (Ultra-responsive)
   ============================================================ */
function initMobileMenu() {
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  if (!hamburger || !mobileMenu) return;

  function toggleMenu() {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open.toString());
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);

  $$('.mobile-menu-nav a, .mobile-menu-rdv', mobileMenu).forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================================
   HERO ENTRANCE ANIMATIONS (GPU Composite Layer)
   ============================================================ */
function initHeroAnimations() {
  const hero = $('#hero');
  if (!hero) return;

  const elements = [
    hero.querySelector('.hero-eyebrow'),
    hero.querySelector('.hero-title'),
    hero.querySelector('.hero-baseline'),
    hero.querySelector('.hero-desc'),
    hero.querySelector('.hero-ctas')
  ].filter(Boolean);

  if (prefersReducedMotion || typeof gsap === 'undefined') {
    elements.forEach(node => {
      node.style.opacity = '1';
      node.style.transform = 'none';
    });
    const scrollEl = $('.hero-scroll');
    if (scrollEl) scrollEl.style.opacity = '1';
    return;
  }

  gsap.to(elements, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power2.out'
  });

  const scrollEl = $('.hero-scroll');
  if (scrollEl) {
    gsap.to(scrollEl, { opacity: 1, delay: 0.5, duration: 0.4 });
  }
}

/* ============================================================
   SCROLL REVEAL (IntersectionObserver + Instant Unobserve)
   ============================================================ */
function initScrollReveal() {
  const revealEls = $$('.reveal');
  if (!revealEls.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 60px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* ============================================================
   FIL DORÉ ANIMÉ (IntersectionObserver + Instant Unobserve)
   ============================================================ */
function initStitchLines() {
  const lines = $$('.stitch-line');
  if (!lines.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    lines.forEach(l => l.classList.add('animated'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  lines.forEach(l => observer.observe(l));
}

/* ============================================================
   FAQ ACCORDÉON
   ============================================================ */
function initFaq() {
  const items = $$('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => {
        i.classList.remove('open');
        const b = i.querySelector('.faq-question');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ============================================================
   FILTRES GALERIE
   ============================================================ */
function filterGallery(category, btn) {
  $$('.gallery-filter-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');

  const items = $$('.gallery-item');
  items.forEach(item => {
    const cat = item.dataset.categorie;
    const shouldShow = (category === 'tout' || cat === category);

    if (shouldShow) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
}

/* ============================================================
   FORMULAIRE CONTACT — Web3Forms
   ============================================================ */
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';

    if (submitBtn) {
      submitBtn.textContent = 'Envoi en cours…';
      submitBtn.disabled = true;
    }

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        showToast('Votre demande a bien été envoyée. Selma H vous contactera sous 48h. ✦');
        form.reset();
      } else {
        showToast('Une erreur est survenue. Veuillez réessayer ou nous contacter par WhatsApp.');
      }
    } catch (err) {
      showToast('Connexion impossible. Veuillez réessayer ou nous contacter directement par WhatsApp.');
    } finally {
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  });
}

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
function showToast(message) {
  let toast = $('#toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ============================================================
   INITIALISATION IMMÉDIATE (0ms delay)
   ============================================================ */
function initApp() {
  initScroll();
  initCursor();
  initNav();
  initMobileMenu();
  initHeroAnimations();
  initScrollReveal();
  initStitchLines();
  initFaq();
  initContactForm();

  const filterBtns = $$('.gallery-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterGallery(btn.dataset.filter, btn);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
