/* main.js — Khozna Landing Page
   Lightweight vanilla JS — no libraries, no build step */

'use strict';

/* ── Config ── */
const WAITLIST_COUNT = 1200;

/* ── DOM ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initWaitlistForms();
  initCounter();
  initHamburger();
  copyHeroVideoFallback();
});

/* ══ 1. Navbar: transparent → solid on scroll ══ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      navbar.classList.toggle('scrolled', !entry.isIntersecting);
    },
    { threshold: 0.05 }
  );

  const hero = document.getElementById('hero');
  if (hero) observer.observe(hero);
}

/* ══ 2. Waitlist forms ══ */
function initWaitlistForms() {
  const forms = [
    { formId: 'hero-form',   btnId: 'hero-btn',   emailId: 'hero-email' },
    { formId: 'banner-form', btnId: 'banner-btn',  emailId: 'banner-email', dark: true },
    { formId: 'footer-form', btnId: 'footer-btn',  emailId: 'footer-email', footer: true },
  ];

  forms.forEach(({ formId, btnId, emailId, dark, footer }) => {
    const form  = document.getElementById(formId);
    const btn   = document.getElementById(btnId);
    const input = document.getElementById(emailId);
    if (!form || !btn || !input) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = input.value.trim();
      if (!isValidEmail(email)) {
        shakeInput(input);
        return;
      }
      // Success state
      btn.textContent = '✓ You\'re on the list!';
      btn.classList.add('success');
      input.value = '';
      input.disabled = true;
      input.placeholder = 'See you when we launch 🎉';

      // Increment counter display
      const counter = document.getElementById('counter-display');
      if (counter) {
        const current = parseInt(counter.dataset.count || WAITLIST_COUNT, 10);
        const next = current + 1;
        counter.dataset.count = next;
        counter.textContent = formatCount(next) + '+';
      }
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeInput(input) {
  input.classList.remove('shake');
  void input.offsetWidth; // reflow
  input.classList.add('shake');
  setTimeout(() => input.classList.remove('shake'), 500);
}

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + ',000';
  return n.toLocaleString();
}

/* ══ 3. Counter init ══ */
function initCounter() {
  const counter = document.getElementById('counter-display');
  if (!counter) return;
  counter.dataset.count = WAITLIST_COUNT;
  counter.textContent = formatCount(WAITLIST_COUNT) + '+';
}

/* ══ 4. Mobile hamburger + drawer ══ */
function initHamburger() {
  const btn    = document.getElementById('hamburger');
  const drawer = document.getElementById('nav-drawer');
  const drawerCta = document.getElementById('drawer-cta-btn');
  const navCtaBtn = document.getElementById('nav-cta-btn');
  if (!btn || !drawer) return;

  function openDrawer() {
    btn.classList.add('open');
    drawer.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    btn.classList.remove('open');
    drawer.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  }

  btn.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });

  // Close drawer when any drawer link is clicked
  drawer.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Drawer CTA scrolls to hero form
  if (drawerCta) {
    drawerCta.addEventListener('click', () => {
      closeDrawer();
      setTimeout(() => {
        const el = document.getElementById('hero-email');
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
      }, 200);
    });
  }

  // Desktop nav CTA also scrolls to hero form
  if (navCtaBtn) {
    navCtaBtn.addEventListener('click', () => {
      const el = document.getElementById('hero-email');
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
    });
  }
}

/* ══ 5. Hero video fallback poster ══ */
function copyHeroVideoFallback() {
  const video = document.querySelector('.hero-video');
  if (!video) return;
  // If video can't load (slow connection), the poster attr handles it
  video.addEventListener('error', () => {
    const bg = document.querySelector('.hero-bg-wrap');
    if (bg) {
      bg.style.background = 'url("/public/ktm_hero_bg.jpg") center/cover no-repeat';
    }
  });
}

/* ══ CSS injection for shake animation ══ */
(function injectShakeStyle() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%  { transform: translateX(0); }
      20%,60%  { transform: translateX(-6px); }
      40%,80%  { transform: translateX(6px); }
    }
    .shake { animation: shake 0.45s ease; border-color: #ef4444 !important; }
  `;
  document.head.appendChild(style);
})();
