/* main.js — Khozna Landing Page
   Lightweight vanilla JS — no libraries, no build step */

'use strict';

/* ── Config ── */
const WAITLIST_COUNT = 1200;

// ⭐ Paste your Google Apps Script Web App URL here after deploying sheets-collector.gs
const SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyhAKH-8IQxdzTegL5_c8kNtG5cTdl5uffnQN1R8AdWp89A12NH0b0OBA9O15NGIcuC/exec';

/* ── DOM ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initWaitlistForms();
  initCounter();
  initHamburger();
  copyHeroVideoFallback();
  initLanguage();
});

/* ══ 1. Navbar: always white, active link highlight on scroll ══ */
function initNavbar() {
  // Highlight active nav link based on scroll position
  const sections = ['how-it-works', 'tour', 'verified', 'local', 'faq'];
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActive() {
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 100) current = id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
}

/* ══ 2. Waitlist forms ══ */
function initWaitlistForms() {
  const forms = [
    { formId: 'hero-form',   btnId: 'hero-btn',   emailId: 'hero-email',   nameId: 'hero-name',   phoneId: 'hero-phone'   },
    { formId: 'banner-form', btnId: 'banner-btn',  emailId: 'banner-email', nameId: 'banner-name', phoneId: 'banner-phone' },
    { formId: 'footer-form', btnId: 'footer-btn',  emailId: 'footer-email', nameId: 'footer-name', phoneId: 'footer-phone' },
  ];

  forms.forEach(({ formId, btnId, emailId, nameId, phoneId }) => {
    const form  = document.getElementById(formId);
    const btn   = document.getElementById(btnId);
    const input = document.getElementById(emailId);
    const nameInput  = document.getElementById(nameId);
    const phoneInput = document.getElementById(phoneId);
    if (!form || !btn || !input) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = input.value.trim();
      const name  = nameInput  ? nameInput.value.trim()  : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';

      if (!isValidEmail(email)) {
        shakeInput(input);
        return;
      }

      // Send to Google Sheets (fire and forget)
      const source = formId === 'hero-form' ? 'hero' : formId === 'banner-form' ? 'banner' : 'footer';
      sendToSheets(email, name, phone, source);

      // Success state
      btn.textContent = '✓ You\'re on the list!';
      btn.classList.add('success');
      [input, nameInput, phoneInput].forEach(el => {
        if (!el) return;
        el.value = '';
        el.disabled = true;
      });
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



/* ══ Google Sheets webhook ══ */
async function sendToSheets(email, name, phone, source) {
  if (!SHEETS_WEBHOOK_URL || SHEETS_WEBHOOK_URL.includes('YOUR_')) return;
  try {
    await fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name,
        phone,
        source,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (_) {
    // Silent fail — never block the user experience
  }
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


/* ══ 6. Bilingual translation system (EN / NP) ══ */
const TRANSLATIONS = {
  np: {
    // Navigation
    'nav-how': 'यो कसरी काम गर्छ',
    'nav-tour': 'भिडियो टुर',
    'nav-verified': 'भेरिफाइड',
    'nav-local': 'हाम्रो विशेषता',
    'nav-faq': 'सोधिएका प्रश्नहरू',
    'btn-waitlist': 'प्रतीक्षा सूचीमा जोडिनुहोस्',
    'btn-early': 'पहिलो पहुँच पाउनुहोस्',

    // Hero Section
    'hero-badge': '🇳🇵 काठमाडौंमा चाँडै आउँदैछ',
    'hero-title': 'दलाल बिना,<br /><span class="hero-highlight">आफ्नो अर्को घर खोज्नुहोस्।</span>',
    'hero-sub': 'भेरिफाइड कोठा, फ्ल्याट र घरहरू हेर्नुहोस्। सोझै घरबेटीसँग कुरा गर्नुहोस् र आफैं हेर्न जानुहोस्। दलाल शुल्क शून्य!',
    'hero-note': 'काठमाडौंमा खोल्ने बित्तिकै हामी तपाईंलाई इमेल वा सन्देश पठाउनेछौं।',

    // Placeholders
    'placeholder-name': 'तपाईंको नाम',
    'placeholder-phone': 'फोन नम्बर',
    'placeholder-email': 'इमेल ठेगाना',

    // Problem Section
    'prob-label': 'समस्या',
    'prob-title': 'काठमाडौंमा कोठा/घर खोज्ने झन्झट',
    'prob-sub': 'कोठा खोज्नेलाई मात्र थाहा हुन्छ यहाँको दुःख',
    'prob-c1-t': 'वास्तविक फोटो नहुनु',
    'prob-c1-d': 'धमिलो फोटो वा अरूको कुरा सुनेर निर्णय लिनुपर्छ। "उज्यालो कोठा, राम्रो ठाउँ" भनिएको कोठा पुग्दा बेग्लै हुन्छ।',
    'prob-c2-t': 'पैसा दलाललाई किन तिर्ने?',
    'prob-c2-d': 'दलालले ३,००० देखि १०,०००+ सम्म शुल्क लिन्छन्, आफैंले भेटेको ठाउँ देखाउँछन् र हराउँछन्। कुनै जिम्मेवारी हुँदैन।',
    'prob-c3-t': 'घरबेटी को हो, थाहा नहुने',
    'prob-c3-d': 'कुनै पहिचान वा प्रमाणिकरण हुँदैन। फेसबुक पोस्ट हेरेर पैसा पठाउनुपर्छ र पछि धोका पाउन सकिन्छ।',

    // How it works
    'how-label': 'हामी कसरी काम गर्छौं',
    'how-title': '३ चरण, बिना दलाल',
    'step1-t': '१. भेरिफाइड कोठाहरू हेर्नुहोस्',
    'step1-d': 'हरेक कोठाको वास्तविक फोटो, भिडियो र मूल्य स्पष्ट रूपमा राखिएको हुन्छ।',
    'step2-t': '२. घरबेटीसँग सिधा कुराकानी',
    'step2-d': 'कुनै बिचौलिया बिना सिधै घरबेटीसँग च्याट गर्नुहोस्, प्रश्न सोध्नुहोस् र समय मिलाएर हेर्न जानुहोस्।',
    'step3-t': '३. सम्झौता र बसाई सराई',
    'step3-d': 'घरबेटीसँग सिधै कुरा मिलाउनुहोस् र सर्नुहोस्। कुनै दलाल शुल्क तिर्नु पर्दैन।',
    'how-movein': '₨० दलाल शुल्क',

    // Tour Section
    'tour-label': 'भिडियो टुर',
    'tour-title': 'हेर्न जानु अघि नै भिडियो टुर',
    'tour-d1': 'घरबेटी आफैंले खिचेको वास्तविक भिडियो टुर। टिकटक वा रिल्स जस्तै हेर्नुहोस् र छान्नुहोस्।',
    'tour-d2': 'फोटो भन्दा फरक कोठा परेर हैरान हुनु पर्दैन। भिडियो टुरले तपाईंलाई कोठाको वास्तविक अवस्था देखाउँछ।',
    'tour-badge-t': 'भिडियो टुरहरू',
    'tour-badge-s': 'सच्चा घरबेटीद्वारा',

    // Verified Owner Section
    'ver-label': 'पहिचान प्रमाणित',
    'ver-title': 'भेरिफाइड हरियो ब्याजको महत्व',
    'ver-d1': 'खोल्नामा कोठा राख्नु अघि हरेक घरबेटीको परिचय पत्र र पहिचान जाँच गरिन्छ।',
    'ver-d2': 'तपाईंले भेरिफाइड घरबेटी देख्नुभएपछि बुझ्नुहोस् कि तपाईं सहि र आधिकारिक व्यक्तिसँग कुरा गर्दै हुनुहुन्छ।',
    'ver-p1': 'परिचय पत्र प्रमाणित',
    'ver-p2': 'सच्चा घरबेटी, सहि नाम',
    'ver-p3': 'गुनासो आएमा २४ घण्टाभित्र कारबाही',
    'ver-badge-t': '✓ भेरिफाइड घरबेटी',
    'ver-badge-s': 'खोल्नाद्वारा पहिचान प्रमाणित',

    // Built for Nepal
    'local-label': 'नेपालकै लागि बनेको',
    'local-title': 'नेपालमै बनेको, नेपालीकै लागि',
    'local-sub': 'खोल्ना नेपाली भाडा बजारको आवश्यकता बुझेर बनाइएको हो, कुनै नक्कल गरिएको एप होइन।',
    'local-c1-t': 'नेपाली रुपैयाँमा',
    'local-c1-d': 'सबै सूचीकृत कोठाको नेपाली मूल्य',
    'local-c2-t': 'नेपाली र अंग्रेजी',
    'local-c2-d': 'दुवै भाषामा चलाउन मिल्ने',
    'local-c3-t': 'प्रत्यक्ष घरबेटीहरू',
    'local-c3-d': 'कुनै एजेन्सी वा कम्पनी होइन',
    'local-c4-t': 'बिचौलिया रहित',
    'local-c4-d': 'स्वतन्त्र र नेपाली प्लेटफर्म',

    // Waitlist Banner
    'banner-counter': 'जना पर्खिरहेका छन्',
    'banner-title': 'खोल्ना सार्वजनिक हुँदा पहिलो हुनुहोस्',
    'banner-sub': 'तपाईंको नाम र नम्बर दर्ता गर्नुहोस्। कोठा उपलब्ध हुने बित्तिकै तपाईंलाई जानकारी गराइनेछ।',

    // FAQ Section
    'faq-label': 'जिज्ञासा',
    'faq-title': 'सोधिएका प्रश्नहरू',
    'faq-q1': 'खोल्ना कहिले सुरु हुन्छ?',
    'faq-a1': 'अहिले हामी भित्री परीक्षण गर्दैछौं। काठमाडौंमा छिट्टै सार्वजनिक गरिनेछ र प्रतीक्षा सूचीमा भएकाहरूले पहिलो प्राथमिकता पाउनेछन्।',
    'faq-q2': 'के यो नि:शुल्क हो?',
    'faq-a2': 'भाडामा बस्ने खोज्नेहरूका लागि यो सधैं नि:शुल्क रहनेछ। कोठा खोज्न, हेर्न वा घरबेटीसँग कुरा गर्न कुनै शुल्क लाग्दैन।',
    'faq-q3': 'कुन शहरबाट सुरु हुन्छ?',
    'faq-a3': 'पहिले काठमाडौं उपत्यका (काठमाडौं, ललितपुर, भक्तपुर) बाट सुरु हुनेछ। त्यसपछि क्रमशः पोखरा र अन्य शहरमा सेवा विस्तार गरिनेछ।',
    'faq-q4': 'म घरबेटी हुँ, मेरो कोठा कसरी राख्ने?',
    'faq-a4': 'हाम्रो प्रतीक्षा सूचीमा जोडिनुहोस्। सार्वजनिक हुनु अगावै हामी तपाईंको विवरण रुजु (KYC) गरेर सजिलै कोठाको भिडियो र फोटो राख्न मद्दत गर्नेछौं।',

    // Footer
    'foot-tagline': 'नेपालको कोठा/घर भाडाको सजिलो समाधान।',
    'foot-wl-label': 'दलाल बिना नै कोठा खोज्न तयार हुनुहुन्छ? जोडिनुहोस्।',
    'foot-copyright': '© २०२६ खोल्ना। नेपालमा बनेको 🇳🇵',
    'foot-privacy': 'गोपनीयता',
    'foot-terms': 'शर्तहरू',
    'foot-contact': 'सम्पर्क'
  },
  en: {
    // Navigation
    'nav-how': 'How it Works',
    'nav-tour': 'Tour',
    'nav-verified': 'Verified',
    'nav-local': 'Why Nepal',
    'nav-faq': 'FAQ',
    'btn-waitlist': 'Join the Waitlist',
    'btn-early': 'Get Early Access',

    // Hero Section
    'hero-badge': '🇳🇵 Coming to Kathmandu',
    'hero-title': 'Find Your Next Home.<br /><span class="hero-highlight">No Middleman.</span>',
    'hero-sub': 'Browse verified rooms, apartments, and houses. Talk directly to the owner. Request a visit. Move in — without paying a dalal a single rupee.',
    'hero-note': 'We\'ll email you the moment Khozna opens in Kathmandu.',

    // Placeholders
    'placeholder-name': 'Your name',
    'placeholder-phone': 'Phone number',
    'placeholder-email': 'Email address',

    // Problem Section
    'prob-label': 'The problem',
    'prob-title': 'Kathmandu\'s rental hunt is broken.',
    'prob-sub': 'Anyone who\'s looked for a room here knows the drill.',
    'prob-c1-t': 'No real photos',
    'prob-c1-d': 'You\'re making decisions based on a blurry picture and a neighbour\'s vague description. "Bright room, good location" — could be anything.',
    'prob-c2-t': 'Dalal fee for what, exactly?',
    'prob-c2-d': 'The broker takes Rs 3,000–10,000+, shows you three places you already found online, and disappears. Zero paperwork. Zero accountability.',
    'prob-c3-t': 'Who even is this owner?',
    'prob-c3-d': 'No ID check. No verification. You wire a deposit to a number from a Facebook post and hope for the best.',

    // How it Works
    'how-label': 'How Khozna works',
    'how-title': 'Three steps. Zero broker.',
    'step1-t': 'Browse verified listings',
    'step1-d': 'Every property has real photos, video tours, NPR pricing, and a verified owner badge — no guessing.',
    'step2-t': 'Message the owner directly',
    'step2-d': 'No middleman in the chat. Talk to the actual owner, ask real questions, and schedule a visit on your terms.',
    'step3-t': 'Move in. No broker fee.',
    'step3-d': 'Agree on terms directly. Visit the property. Move in. The only person you pay is your landlord.',
    'how-movein': '₨0 broker fee',

    // Tour Section
    'tour-label': 'Tour feature',
    'tour-title': 'See it before you visit.',
    'tour-d1': 'Real video walkthroughs posted by the owner. Scroll, watch, decide. Like Reels — but for your next home.',
    'tour-d2': 'No more showing up to a place that looks nothing like the photos. The Tour feed gives you a honest look at the space before you commit to a visit.',
    'tour-badge-t': 'Video Tours',
    'tour-badge-s': 'by the actual owner',

    // Verified Owner Section
    'ver-label': 'Verified, not just listed',
    'ver-title': 'That green badge means something.',
    'ver-d1': 'Every owner on Khozna goes through a KYC check. We verify their identity before their listing goes live.',
    'ver-d2': 'When you see the Verified Owner badge next to a name, you\'re talking to a real person who actually owns the place.',
    'ver-p1': 'Government ID verified',
    'ver-p2': 'Real name, real owner',
    'ver-p3': 'Reported listings reviewed within 24 hours',
    'ver-badge-t': '✓ Verified Owner',
    'ver-badge-s': 'ID checked by Khozna',

    // Built for Nepal
    'local-label': 'Built for Nepal',
    'local-title': 'Made in Nepal.<br />Built for Nepal.',
    'local-sub': 'Khozna is built for how Nepal actually rents — not a foreign app with a Nepali flag slapped on it.',
    'local-c1-t': 'NPR Pricing',
    'local-c1-d': 'All prices in Nepali rupees',
    'local-c2-t': 'Nepali + English',
    'local-c2-d': 'Full bilingual support',
    'local-c3-t': 'Real local owners',
    'local-c3-d': 'Not a property management firm',
    'local-c4-t': 'No franchise',
    'local-c4-d': 'Independent, Nepal-first',

    // Waitlist Banner
    'banner-counter': 'people already waiting',
    'banner-title': 'Be first in line when Khozna launches.',
    'banner-sub': 'Drop your email. We\'ll send you early access, updates, and a heads-up when listings go live in your area.',

    // FAQ Section
    'faq-label': 'Questions',
    'faq-title': 'FAQ',
    'faq-q1': 'When does Khozna launch?',
    'faq-a1': 'We\'re in private testing right now. The public launch in Kathmandu is coming soon — everyone on the waitlist gets an email the day it opens. No exact date yet, but it\'s close.',
    'faq-q2': 'Is it free to use?',
    'faq-a2': 'Free for renters, always. Browse listings, contact owners, schedule visits — no fees. We\'re still figuring out an optional listing plan for owners with lots of properties, but the core experience is free for everyone.',
    'faq-q3': 'Which city first?',
    'faq-a3': 'Kathmandu valley first — Kathmandu, Lalitpur, and Bhaktapur. Once that\'s solid, we\'ll expand to Pokhara and other cities. Building it right in one place before spreading thin.',
    'faq-q4': 'I\'m an owner — how do I list my property?',
    'faq-a4': 'Join the waitlist and mention you\'re a property owner — we\'ll flag your account for early owner onboarding. You\'ll go through a quick KYC check, then you can list your property with photos, a video tour, and NPR pricing. No broker cuts, ever.',

    // Footer
    'foot-tagline': 'Nepal\'s rental market, fixed.',
    'foot-wl-label': 'Ready to ditch the dalal? Join the list.',
    'foot-copyright': '© 2026 Khozna. Made in Nepal 🇳🇵',
    'foot-privacy': 'Privacy',
    'foot-terms': 'Terms',
    'foot-contact': 'Contact'
  }
};

function initLanguage() {
  const defaultLang = localStorage.getItem('khozna_lang') || 'en';
  setLanguage(defaultLang);

  // Hook up event listeners on all toggle buttons
  const toggleBtns = document.querySelectorAll('.lang-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.dataset.lang;
      setLanguage(selectedLang);
      localStorage.setItem('khozna_lang', selectedLang);
    });
  });
}

function setLanguage(lang) {
  // Update translation key texts
  const elements = document.querySelectorAll('[data-translate]');
  elements.forEach(el => {
    const key = el.dataset.translate;
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.innerHTML = TRANSLATIONS[lang][key];
    }
  });

  // Update inputs placeholder texts
  const placeholderElms = document.querySelectorAll('[data-translate-placeholder]');
  placeholderElms.forEach(el => {
    const key = el.dataset.translatePlaceholder;
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.placeholder = TRANSLATIONS[lang][key];
    }
  });

  // Toggle active button class states
  const allBtns = document.querySelectorAll('.lang-btn');
  allBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

