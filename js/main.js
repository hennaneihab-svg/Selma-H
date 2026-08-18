/* ============================================================
   SELMA H — Main JavaScript
   GSAP + Lenis + Animations + Interactions
   ============================================================ */

// CDN : GSAP, ScrollTrigger, Lenis chargés depuis index.html

/* ============================================================
   UTILS
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   LOADER
   ============================================================ */
function initLoader(onComplete) {
  const loader = $('#loader');
  if (!loader) { onComplete(); return; }

  const bar = loader.querySelector('.loader-bar');
  const label = loader.querySelector('.loader-label');
  let progress = 0;

  const interval = setInterval(() => {
    const increment = Math.random() * 15 + 5;
    progress = Math.min(progress + increment, 100);
    if (bar) bar.style.width = progress + '%';

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (prefersReducedMotion) {
          loader.style.display = 'none';
          onComplete();
          return;
        }
        gsap.to(loader, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => {
            loader.style.display = 'none';
            onComplete();
          }
        });
      }, 400);
    }
  }, 80);
}

/* ============================================================
   LENIS SMOOTH SCROLL
   ============================================================ */
let lenis;
function initLenis() {
  if (prefersReducedMotion || typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.3,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

/* ============================================================
   CURSEUR PERSONNALISÉ
   ============================================================ */
function initCursor() {
  const cursor = document.createElement('div');
  const follower = document.createElement('div');
  cursor.className = 'cursor';
  follower.className = 'cursor-follower';
  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  if (window.innerWidth <= 1024) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  $$('a, button, [role="button"]').forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => follower.classList.remove('cursor-hover'));
  });
}

/* ============================================================
   HEADER SCROLL
   ============================================================ */
function initNav() {
  const header = $('#header');
  if (!header) return;

  const isIndex = document.body.dataset.page === 'accueil';

  if (!isIndex) {
    header.classList.add('opaque');
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
      header.classList.remove('opaque');
    } else {
      header.classList.remove('scrolled');
      if (!isIndex) header.classList.add('opaque');
    }
  }, { passive: true });
}

/* ============================================================
   MENU MOBILE
   ============================================================ */
function initMobileMenu() {
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open.toString());
    document.body.style.overflow = open ? 'hidden' : '';
  });

  $$('.mobile-menu-nav a, .mobile-menu-rdv', mobileMenu).forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

function closeMobileMenu() {
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  if (!hamburger || !mobileMenu) return;
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ============================================================
   HERO ANIMATIONS
   ============================================================ */
function initHeroAnimations() {
  const hero = $('#hero');
  if (!hero || prefersReducedMotion) return;

  // Éléments hero
  const elements = [
    { el: '.hero-eyebrow', delay: 0 },
    { el: '.hero-title', delay: 0.15 },
    { el: '.hero-baseline', delay: 0.3 },
    { el: '.hero-desc', delay: 0.45 },
    { el: '.hero-ctas', delay: 0.6 },
  ];

  elements.forEach(({ el, delay }) => {
    const node = hero.querySelector(el);
    if (!node) return;
    gsap.to(node, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      delay,
      ease: 'power3.out'
    });
  });

  // Scroll indicator
  const scrollEl = $('.hero-scroll');
  if (scrollEl) {
    gsap.to(scrollEl, { opacity: 1, delay: 1.2, duration: 0.6 });
  }

  // Parallax hero bg
  const heroBg = $('.hero-bg');
  if (heroBg && typeof ScrollTrigger !== 'undefined') {
    gsap.to(heroBg, {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  }
}

/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
function initScrollReveal() {
  const revealEls = $$('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* ============================================================
   FIL DORÉ ANIMÉ (stitch lines)
   ============================================================ */
function initStitchLines() {
  const lines = $$('.stitch-line');
  if (!lines.length) return;

  if (prefersReducedMotion) {
    lines.forEach(l => l.classList.add('animated'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

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
      // Fermer tous
      items.forEach(i => i.classList.remove('open'));
      // Ouvrir si était fermé
      if (!isOpen) item.classList.add('open');
      btn.setAttribute('aria-expanded', (!isOpen).toString());
    });
  });
}

/* ============================================================
   FILTRES GALERIE
   ============================================================ */
function filterGallery(category, btn) {
  // Mettre à jour le bouton actif
  $$('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const items = $$('.gallery-item');
  items.forEach(item => {
    const cat = item.dataset.categorie;
    const shouldShow = category === 'tout' || cat === category;

    if (shouldShow) {
      item.classList.remove('hidden');
      if (!prefersReducedMotion) {
        gsap.fromTo(item, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
      }
    } else {
      item.classList.add('hidden');
    }
  });
}

/* ============================================================
   FORMULAIRE CONTACT — Web3Forms
   https://web3forms.com — remplacer YOUR_ACCESS_KEY dans contact.html
   ============================================================ */
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';

    // Feedback visuel pendant l'envoi
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
    toast.style.cssText = `
      position:fixed; bottom:30px; right:30px; z-index:9000;
      background:var(--black-soft); border:1px solid var(--gold-amber);
      color:var(--ivory); font-family:var(--font-body); font-size:0.9rem;
      padding:1em 1.5em; max-width:340px; line-height:1.5;
      transform:translateY(100px); opacity:0;
      transition:all 0.4s cubic-bezier(0.16,1,0.3,1);
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 10);
  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
  }, 4000);
}

/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
function initMagneticButtons() {
  if (prefersReducedMotion || window.innerWidth <= 768) return;
  $$('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      gsap.to(btn, { x: dx * 0.35, y: dy * 0.35, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ============================================================
   INIT PRINCIPAL
   ============================================================ */
function initAnimations() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  initLenis();
  initCursor();
  initNav();
  initMobileMenu();
  initHeroAnimations();
  initScrollReveal();
  initStitchLines();
  initFaq();
  initContactForm();
  initMagneticButtons();

  // Filtres galerie — init si on est sur galerie.html
  const filterBtns = $$('.gallery-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterGallery(btn.dataset.filter, btn);
    });
  });
}

// Démarrer après le loader
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const loader = $('#loader');
    if (loader) {
      initLoader(initAnimations);
    } else {
      initAnimations();
    }
  });
} else {
  const loader = $('#loader');
  if (loader) {
    initLoader(initAnimations);
  } else {
    initAnimations();
  }
}
