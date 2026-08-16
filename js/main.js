/* ============================================================
   JINYA RAMEN BAR — main.js
   GSAP 3 + ScrollTrigger animations & interactivity
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ---- Utility: Reduced-motion check ---- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   NAV — scroll-aware background
   ============================================================ */
const nav = document.getElementById('nav');
if (nav) {
  ScrollTrigger.create({
    start: 'top -60',
    onEnter: () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled'),
  });
}

/* Active nav link on scroll (in-page sections only) */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
if (sections.length) {
  const observerOptions = { rootMargin: '-40% 0px -55% 0px' };
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);
  sections.forEach(s => navObserver.observe(s));
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================================
   SMOOTH SCROLL (in-page anchors)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = 76;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   HERO ANIMATIONS
   ============================================================ */
if (document.querySelector('.hero')) {
  if (!prefersReducedMotion) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('.hero-tag', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.2)
      .fromTo('.hero-line-inner', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.12 }, 0.4)
      .fromTo('.hero-sub', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.75 }, 0.9)
      .fromTo('.hero-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 1.1)
      .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.6);

    gsap.to('.hero-bg', {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  } else {
    gsap.set(['.hero-tag', '.hero-line-inner', '.hero-sub', '.hero-actions', '.hero-scroll'],
      { opacity: 1, y: 0, yPercent: 0 });
  }
}

/* ============================================================
   SCROLL REVEALS (generic)
   ============================================================ */
document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach((el) => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: () => {
      if (prefersReducedMotion) { gsap.set(el, { opacity: 1 }); return; }
      const fromX = el.classList.contains('reveal-left') ? -40 : el.classList.contains('reveal-right') ? 40 : 0;
      const fromY = el.classList.contains('reveal-up') ? 36 : 0;
      gsap.fromTo(el,
        { opacity: 0, y: fromY, x: fromX },
        { opacity: 1, y: 0, x: 0, duration: 0.8, ease: 'power3.out' }
      );
    },
  });
});

/* ============================================================
   STAGGERED GRID REVEALS (cards)
   ============================================================ */
function staggerReveal(triggerSelector, itemSelector, opts = {}) {
  const trigger = document.querySelector(triggerSelector);
  if (!trigger) return;
  ScrollTrigger.create({
    trigger: triggerSelector,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      if (prefersReducedMotion) return;
      gsap.fromTo(itemSelector,
        { opacity: 0, y: opts.y ?? 40 },
        { opacity: 1, y: 0, duration: opts.duration ?? 0.75, stagger: opts.stagger ?? 0.1, ease: 'power3.out' }
      );
    },
  });
}
staggerReveal('.feature-grid', '.feature-card');
staggerReveal('.menu-grid', '.menu-card', { stagger: 0.06 });
staggerReveal('.menu-category.active', '.menu-card', { stagger: 0.06 });
staggerReveal('.locations-grid', '.location-card', { stagger: 0.06 });
staggerReveal('.values-grid', '.value-card');
staggerReveal('.press-grid', '.press-card');
staggerReveal('.brand-grid', '.brand-card');

/* ============================================================
   STAT COUNTERS
   ============================================================ */
document.querySelectorAll('.stat-number').forEach(el => {
  const target = parseInt(el.dataset.target, 10);
  if (Number.isNaN(target)) return;
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      if (prefersReducedMotion) { el.textContent = target; return; }
      gsap.fromTo({ val: 0 }, { val: 0 }, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].val).toLocaleString(); },
      });
    },
  });
});

/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
if (!prefersReducedMotion) {
  document.querySelectorAll('.btn-primary, .btn-outline, .btn-white').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.16, y: y * 0.16, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ============================================================
   MARQUEE STRIP — pause on hover
   ============================================================ */
const marquee = document.querySelector('.marquee-track');
if (marquee) {
  marquee.addEventListener('mouseenter', () => marquee.style.animationPlayState = 'paused');
  marquee.addEventListener('mouseleave', () => marquee.style.animationPlayState = 'running');
}

/* ============================================================
   MENU TABS (menu.html + homepage menu preview)
   ============================================================ */
const menuTabs = document.querySelectorAll('.menu-tab');
const menuCategories = document.querySelectorAll('.menu-category');
if (menuTabs.length && menuCategories.length) {
  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      menuCategories.forEach(section => {
        const match = section.dataset.cat === cat;
        section.classList.toggle('active', match);
        if (match && !prefersReducedMotion) {
          gsap.fromTo(section.querySelectorAll('.menu-card'),
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
          );
        }
      });
    });
  });
}

/* ============================================================
   LOCATIONS SEARCH + FILTER (locations.html)
   ============================================================ */
const locSearchInput = document.getElementById('location-search');
const locFilterBtns = document.querySelectorAll('.location-filter-btn');
const locCards = document.querySelectorAll('.location-card');

function applyLocationFilters() {
  if (!locCards.length) return;
  const query = (locSearchInput?.value || '').trim().toLowerCase();
  const activeFilter = document.querySelector('.location-filter-btn.active')?.dataset.region || 'all';
  locCards.forEach(card => {
    const matchesQuery = !query || card.textContent.toLowerCase().includes(query);
    const matchesRegion = activeFilter === 'all' || card.dataset.region === activeFilter;
    card.classList.toggle('hidden', !(matchesQuery && matchesRegion));
  });
}
if (locSearchInput) locSearchInput.addEventListener('input', applyLocationFilters);
locFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    locFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyLocationFilters();
  });
});

/* ============================================================
   GENERIC FORM HANDLER (contact / franchise inquiry)
   Client-side validation + shake feedback. No backend wired yet —
   forms show a success state locally until a real submission
   endpoint (e.g. EmailJS) is configured.
   ============================================================ */
function shakeField(el) {
  if (!el) return;
  if (prefersReducedMotion) { el.focus(); return; }
  gsap.fromTo(el, { x: 0 }, {
    x: 9, duration: 0.07, repeat: 5, yoyo: true, ease: 'power2.inOut',
    onComplete: () => { gsap.set(el, { x: 0 }); el.focus(); },
  });
  el.style.borderColor = '#cc0000';
}

function wireForm(formId, successId, requiredIds) {
  const form = document.getElementById(formId);
  const success = document.getElementById(successId);
  if (!form) return;
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let firstBad = null;
    requiredIds.forEach(id => {
      const el = document.getElementById(id);
      const errEl = document.getElementById(`${id}-error`);
      if (!el) return;
      const bad = !el.value.trim();
      el.toggleAttribute('aria-invalid', bad);
      if (errEl) errEl.textContent = bad ? 'This field is required.' : '';
      if (bad && !firstBad) firstBad = el;
      if (!bad) el.style.borderColor = '';
    });
    if (firstBad) { shakeField(firstBad); return; }

    if (submitBtn) {
      submitBtn.disabled = true;
      const btnText = submitBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = 'Sending…';
    }
    setTimeout(() => {
      form.style.display = 'none';
      if (success) {
        success.classList.remove('hidden');
        if (!prefersReducedMotion) {
          gsap.fromTo(success, { opacity: 0, y: 10, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' });
        }
      }
    }, 700);
  });

  requiredIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      el.style.borderColor = '';
      el.removeAttribute('aria-invalid');
      const errEl = document.getElementById(`${id}-error`);
      if (errEl) errEl.textContent = '';
    });
  });
}

wireForm('contact-form', 'form-success', ['name', 'email']);
wireForm('franchise-form', 'franchise-form-success', ['fr-name', 'fr-email', 'fr-phone']);
wireForm('careers-form', 'careers-form-success', ['cr-name', 'cr-email', 'cr-phone']);
wireForm('partner-form', 'partner-form-success', ['pt-name', 'pt-email']);


const ITEM_AVAILABILITY = {
  'hokkaido-crepe': { label: "Hokkaido Mille Cr\u00e9pe", type: 'region', text: "This Chef's Special is part of the current U.S. rotation and is available at JINYA locations across the United States." },
  'birria-ramen': { label: 'Birria Ramen', type: 'region', text: "This item is part of the current U.S. ramen lineup and is available at JINYA locations across the United States." },
  'potato-mochi': { label: 'Potato Mochi Balls', type: 'region', text: "This Chef's Special is part of the current Canada rotation and is available at JINYA locations across Canada." },
  'malibu-sunrise': { label: "Malibu Sunrise", type: 'list', locations: [
      "Alpharetta, GA",
      "Ameristar Black Hawk, CO",
      "Arlington, VA",
      "Athens, GA",
      "Baton Rouge, LA",
      "Buckhead (Atlanta), GA",
      "Buford, GA",
      "Carrollton, TX",
      "Central Phoenix, AZ",
      "Chandler, AZ",
      "Colorado Springs, CO",
      "Culebra (San Antonio), TX",
      "Cypress, TX",
      "Duluth, GA",
      "Edmonton, AB",
      "FM 1960 (Houston), TX",
      "Fishers, IN",
      "Foothills (Fort Collins), CO",
      "Georgetown (Washington), DC",
      "Hackensack, NJ",
      "Heights Waterworks (Houston), TX",
      "Hilton Head Island, SC",
      "Katy, TX",
      "Kennesaw, GA",
      "Lake Grove, NY",
      "Langley, BC",
      "Logan Circle (Washington), DC",
      "Macleod South (Calgary), AB",
      "Midtown (Houston), TX",
      "NASA Area (Webster/Houston), TX",
      "Nashville, TN",
      "Nichols Hills (Oklahoma City), OK",
      "North Bethesda, MD",
      "Omaha, NE",
      "Overland Park (Kansas City), KS",
      "Oviedo, FL",
      "Pearland, TX",
      "Preston Hollow (Dallas), TX",
      "Reston, VA",
      "Royal Oak, MI",
      "San Antonio, TX",
      "Sandy Springs, GA",
      "South Bend, IN",
      "Spring Branch (Houston), TX",
      "Sugar Land, TX",
      "Sugarhouse (Salt Lake City), UT",
      "The Wharf (Washington), DC",
      "The Woodlands (Spring), TX",
      "Thornton Park (Orlando), FL",
      "Topanga Westfield (Woodland Hills), CA",
      "Totowa, NJ",
      "TrailHead (Peoria), AZ",
      "Tulsa – Downtown, OK",
      "Union Market, DC",
      "Union Station (Denver), CO",
      "Vancouver Downtown, BC",
      "Victory Park (Dallas), TX"
  ] },
  'e-tomo': { label: "E Tomo E Tomo E Tomorrow", type: 'list', locations: [
      "2nd & PCH (Long Beach), CA",
      "Ally Charlotte Center, NC",
      "Alpharetta, GA",
      "Ameristar Black Hawk, CO",
      "Arlington, VA",
      "Athens, GA",
      "Baton Rouge, LA",
      "Buford, GA",
      "Central Phoenix, AZ",
      "Colorado Springs, CO",
      "Culebra (San Antonio), TX",
      "Cypress, TX",
      "Duluth, GA",
      "Edmonton, AB",
      "FM 1960 (Houston), TX",
      "Fishers, IN",
      "Foothills (Fort Collins), CO",
      "Georgetown (Washington), DC",
      "Hackensack, NJ",
      "Heights Waterworks (Houston), TX",
      "Hilton Head Island, SC",
      "Katy, TX",
      "Kennesaw, GA",
      "Lake Grove, NY",
      "Langley, BC",
      "Logan Circle (Washington), DC",
      "Macleod South (Calgary), AB",
      "Midtown (Houston), TX",
      "NASA Area (Webster/Houston), TX",
      "Nichols Hills (Oklahoma City), OK",
      "North Bethesda, MD",
      "Overland Park (Kansas City), KS",
      "Oviedo, FL",
      "Pearland, TX",
      "Reston, VA",
      "Royal Oak, MI",
      "San Antonio, TX",
      "Sandy Springs, GA",
      "South Bend, IN",
      "SouthPark (Charlotte), NC",
      "Spring Branch (Houston), TX",
      "Sugar Land, TX",
      "Sugarhouse (Salt Lake City), UT",
      "The Wharf (Washington), DC",
      "The Woodlands (Spring), TX",
      "Thornton Park (Orlando), FL",
      "Topanga Westfield (Woodland Hills), CA",
      "Totowa, NJ",
      "TrailHead (Peoria), AZ",
      "Tulsa – Downtown, OK",
      "Union Market, DC",
      "Union Station (Denver), CO",
      "Vancouver Downtown, BC",
      "Vancouver West, BC"
  ] },
  'flying-violette': { label: "Flying Violette", type: 'list', locations: [
      "Baton Rouge, LA",
      "Central Phoenix, AZ",
      "Colorado Springs, CO",
      "Edmonton, AB",
      "Fishers, IN",
      "Foothills (Fort Collins), CO",
      "Hackensack, NJ",
      "Hilton Head Island, SC",
      "Lake Grove, NY",
      "Langley, BC",
      "Macleod South (Calgary), AB",
      "Omaha, NE",
      "Totowa, NJ",
      "TrailHead (Peoria), AZ",
      "Union Market, DC",
      "Union Station (Denver), CO",
      "Vancouver Downtown, BC"
  ] },
  'smokey-wokashi': { label: "Smokey Wokashi OF", type: 'list', locations: [
      "2nd & PCH (Long Beach), CA",
      "Ally Charlotte Center, NC",
      "Alpharetta, GA",
      "Ameristar Black Hawk, CO",
      "Arlington, VA",
      "Athens, GA",
      "Baton Rouge, LA",
      "Buckhead (Atlanta), GA",
      "Buford, GA",
      "Carrollton, TX",
      "Central Phoenix, AZ",
      "Chandler, AZ",
      "Colorado Springs, CO",
      "Culebra (San Antonio), TX",
      "Cypress, TX",
      "Duluth, GA",
      "Edmonton, AB",
      "FM 1960 (Houston), TX",
      "Fishers, IN",
      "Foothills (Fort Collins), CO",
      "Georgetown (Washington), DC",
      "Hackensack, NJ",
      "Heights Waterworks (Houston), TX",
      "Hilton Head Island, SC",
      "Katy, TX",
      "Kennesaw, GA",
      "Lake Grove, NY",
      "Langley, BC",
      "Logan Circle (Washington), DC",
      "Macleod South (Calgary), AB",
      "Midtown (Houston), TX",
      "NASA Area (Webster/Houston), TX",
      "Nashville, TN",
      "Nichols Hills (Oklahoma City), OK",
      "North Bethesda, MD",
      "Omaha, NE",
      "Overland Park (Kansas City), KS",
      "Oviedo, FL",
      "Pearland, TX",
      "Preston Hollow (Dallas), TX",
      "Reston, VA",
      "San Antonio, TX",
      "Sandy Springs, GA",
      "South Bend, IN",
      "SouthPark (Charlotte), NC",
      "Spring Branch (Houston), TX",
      "Sugar Land, TX",
      "Sugarhouse (Salt Lake City), UT",
      "The Wharf (Washington), DC",
      "The Woodlands (Spring), TX",
      "Thornton Park (Orlando), FL",
      "Totowa, NJ",
      "TrailHead (Peoria), AZ",
      "Tulsa – Downtown, OK",
      "Union Market, DC",
      "Union Station (Denver), CO",
      "Vancouver Downtown, BC",
      "Vancouver West, BC",
      "Victory Park (Dallas), TX"
  ] },
  'lycheetini': { label: "Lycheetini", type: 'list', locations: [
      "2nd & PCH (Long Beach), CA",
      "Alpharetta, GA",
      "Ameristar Black Hawk, CO",
      "Arlington, VA",
      "Austin, TX",
      "Buckhead (Atlanta), GA",
      "Burbank, CA",
      "Calgary, AB",
      "Carrollton, TX",
      "Central Phoenix, AZ",
      "Chandler, AZ",
      "Colorado Springs, CO",
      "Culebra (San Antonio), TX",
      "Culver City, CA",
      "Cypress, TX",
      "Downtown LA, CA",
      "Duluth, GA",
      "Edmonton, AB",
      "FM 1960 (Houston), TX",
      "Fairfax, VA",
      "Fishers, IN",
      "Foothills (Fort Collins), CO",
      "Georgetown (Washington), DC",
      "Hackensack, NJ",
      "Heights Waterworks (Houston), TX",
      "Hilton Head Island, SC",
      "Katy, TX",
      "Kennesaw, GA",
      "Lake Grove, NY",
      "Langley, BC",
      "Logan Circle (Washington), DC",
      "Macleod South (Calgary), AB",
      "Midtown (Houston), TX",
      "NASA Area (Webster/Houston), TX",
      "Nashville, TN",
      "Nichols Hills (Oklahoma City), OK",
      "North Bethesda, MD",
      "Omaha, NE",
      "Overland Park (Kansas City), KS",
      "Pearland, TX",
      "Preston Hollow (Dallas), TX",
      "Rainbow (Las Vegas), NV",
      "Reston, VA",
      "Royal Oak, MI",
      "San Antonio, TX",
      "Sandy Springs, GA",
      "Santa Monica, CA",
      "South Bend, IN",
      "Spring Branch (Houston), TX",
      "Studio City, CA",
      "Sugar Land, TX",
      "Sugarhouse (Salt Lake City), UT",
      "The Wharf (Washington), DC",
      "The Woodlands (Spring), TX",
      "Topanga Westfield (Woodland Hills), CA",
      "Totowa, NJ",
      "TrailHead (Peoria), AZ",
      "Tulsa – Downtown, OK",
      "Union Market, DC",
      "Union Station (Denver), CO",
      "Vancouver Downtown, BC",
      "Victory Park (Dallas), TX"
  ] },
  'yuzu-margarita': { label: "Yuzu Margarita", type: 'list', locations: [
      "2nd & PCH (Long Beach), CA",
      "Ally Charlotte Center, NC",
      "Alpharetta, GA",
      "Ameristar Black Hawk, CO",
      "Arlington, VA",
      "Athens, GA",
      "Baton Rouge, LA",
      "Buckhead (Atlanta), GA",
      "Buford, GA",
      "Carrollton, TX",
      "Central Phoenix, AZ",
      "Chandler, AZ",
      "Colorado Springs, CO",
      "Culebra (San Antonio), TX",
      "Cypress, TX",
      "Duluth, GA",
      "Edmonton, AB",
      "FM 1960 (Houston), TX",
      "Fishers, IN",
      "Foothills (Fort Collins), CO",
      "Georgetown (Washington), DC",
      "Hackensack, NJ",
      "Heights Waterworks (Houston), TX",
      "Hilton Head Island, SC",
      "Katy, TX",
      "Kennesaw, GA",
      "Lake Grove, NY",
      "Langley, BC",
      "Logan Circle (Washington), DC",
      "Macleod South (Calgary), AB",
      "Midtown (Houston), TX",
      "NASA Area (Webster/Houston), TX",
      "Nashville, TN",
      "Nichols Hills (Oklahoma City), OK",
      "North Bethesda, MD",
      "Omaha, NE",
      "Overland Park (Kansas City), KS",
      "Oviedo, FL",
      "Pearland, TX",
      "Preston Hollow (Dallas), TX",
      "Reston, VA",
      "Royal Oak, MI",
      "San Antonio, TX",
      "Sandy Springs, GA",
      "South Bend, IN",
      "SouthPark (Charlotte), NC",
      "Spring Branch (Houston), TX",
      "Sugar Land, TX",
      "Sugarhouse (Salt Lake City), UT",
      "The Wharf (Washington), DC",
      "The Woodlands (Spring), TX",
      "Thornton Park (Orlando), FL",
      "Topanga Westfield (Woodland Hills), CA",
      "Totowa, NJ",
      "TrailHead (Peoria), AZ",
      "Tulsa – Downtown, OK",
      "Union Market, DC",
      "Union Station (Denver), CO",
      "Vancouver Downtown, BC",
      "Vancouver West, BC",
      "Victory Park (Dallas), TX"
  ] },
};

(function () {
  const overlay = document.getElementById('loc-modal-overlay');
  if (!overlay) return;
  const titleEl = document.getElementById('loc-modal-title');
  const bodyEl = document.getElementById('loc-modal-body');
  const closeBtn = document.getElementById('loc-modal-close');
  let lastTrigger = null;

  function onKeydown(e) {
    if (e.key === 'Escape') closeLocModal();
  }

  function openLocModal(item, trigger) {
    lastTrigger = trigger;
    titleEl.textContent = item.label;
    bodyEl.innerHTML = '';

    if (item.type === 'region') {
      const p = document.createElement('p');
      p.className = 'loc-modal-region';
      p.textContent = item.text;
      bodyEl.appendChild(p);
    } else {
      const sub = document.createElement('p');
      sub.className = 'loc-modal-sub';
      sub.textContent = `Confirmed on the menu at ${item.locations.length} JINYA locations:`;
      bodyEl.appendChild(sub);
      const list = document.createElement('div');
      list.className = 'loc-modal-list';
      item.locations.forEach(loc => {
        const d = document.createElement('div');
        d.className = 'loc-modal-list-item';
        d.textContent = loc;
        list.appendChild(d);
      });
      bodyEl.appendChild(list);
    }

    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.addEventListener('keydown', onKeydown);
    closeBtn.focus();
  }

  function closeLocModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKeydown);
    if (lastTrigger) lastTrigger.focus();
  }

  document.querySelectorAll('.menu-card-badge[data-item]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = ITEM_AVAILABILITY[btn.dataset.item];
      if (item) openLocModal(item, btn);
    });
  });

  closeBtn.addEventListener('click', closeLocModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLocModal();
  });
})();
