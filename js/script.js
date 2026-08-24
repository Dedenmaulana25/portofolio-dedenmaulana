/* ============================================================
   PORTFOLIO — Deden Maulana Iskandar
   script.js
   ============================================================ */

'use strict';

/* ─── HELPERS ───────────────────────────────────────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ============================================================
   1. NAVBAR — scroll effect
   ============================================================ */
(function initNavbarScroll() {
  const navbar = qs('#navbar');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}());


/* ============================================================
   2. NAVBAR — mobile hamburger toggle
   ============================================================ */
(function initMobileMenu() {
  const toggle  = qs('#navToggle');
  const menu    = qs('#navMenu');
  const links   = qsa('.navbar__link');
  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  }

  toggle.addEventListener('click', toggleMenu);

  // Close on nav link click
  links.forEach(link => link.addEventListener('click', closeMenu));

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('open') &&
        !menu.contains(e.target) &&
        !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
      toggle.focus();
    }
  });
}());


/* ============================================================
   3. NAVBAR — active link scroll spy
   ============================================================ */
(function initScrollSpy() {
  const links    = qsa('.navbar__link');
  const sections = qsa('main section[id]');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((link) => {
          const active = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', active);
          link.setAttribute('aria-current', active ? 'page' : 'false');
        });
      });
    },
    { rootMargin: '-35% 0px -60% 0px' }
  );

  sections.forEach(s => observer.observe(s));
}());


/* ============================================================
   4. SMOOTH SCROLL — fallback for anchor links
   ============================================================ */
(function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href   = link.getAttribute('href');
    const target = qs(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}());


/* ============================================================
   5. SCROLL ANIMATIONS — IntersectionObserver fade-in
   ============================================================ */
(function initScrollAnimations() {
  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    qsa('[data-animate]').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12 }
  );

  qsa('[data-animate]').forEach(el => observer.observe(el));
}());


/* ============================================================
   6. BACK-TO-TOP button
   ============================================================ */
(function initBackToTop() {
  const btn = qs('#backToTop');
  if (!btn) return;

  // Remove the HTML `hidden` attribute so CSS transitions work
  btn.removeAttribute('hidden');

  function onScroll() {
    btn.classList.toggle('visible', window.scrollY > 400);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}());


/* ============================================================
   7. CONTACT FORM — validation & success feedback
   ============================================================ */
(function initContactForm() {
  const form        = qs('#contactForm');
  if (!form) return;

  const nameInput   = qs('#contactName');
  const emailInput  = qs('#contactEmail');
  const msgInput    = qs('#contactMessage');
  const submitBtn   = qs('#submitBtn');
  const successBox  = qs('#formSuccess');

  const nameErr     = qs('#nameError');
  const emailErr    = qs('#emailError');
  const msgErr      = qs('#messageError');

  /* ── Validation rules ─────────────────────────────────── */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateName(value) {
    if (!value.trim())        return 'Nama tidak boleh kosong.';
    if (value.trim().length < 2) return 'Nama minimal 2 karakter.';
    return '';
  }

  function validateEmail(value) {
    if (!value.trim())           return 'Email tidak boleh kosong.';
    if (!EMAIL_RE.test(value))   return 'Format email tidak valid.';
    return '';
  }

  function validateMessage(value) {
    if (!value.trim())           return 'Pesan tidak boleh kosong.';
    if (value.trim().length < 10) return 'Pesan minimal 10 karakter.';
    return '';
  }

  /* ── Show / clear field error ─────────────────────────── */
  function setError(input, errEl, message) {
    if (message) {
      input.classList.add('is-error');
      errEl.textContent = message;
    } else {
      input.classList.remove('is-error');
      errEl.textContent = '';
    }
  }

  /* ── Real-time validation on blur ─────────────────────── */
  nameInput.addEventListener('blur', () => {
    setError(nameInput, nameErr, validateName(nameInput.value));
  });

  emailInput.addEventListener('blur', () => {
    setError(emailInput, emailErr, validateEmail(emailInput.value));
  });

  msgInput.addEventListener('blur', () => {
    setError(msgInput, msgErr, validateMessage(msgInput.value));
  });

  // Clear error as user types after a field was invalid
  [nameInput, emailInput, msgInput].forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('is-error')) {
        input.classList.remove('is-error');
      }
    });
  });

  /* ── Submit handler ────────────────────────────────────── */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameMsg  = validateName(nameInput.value);
    const emailMsg = validateEmail(emailInput.value);
    const msgMsg   = validateMessage(msgInput.value);

    setError(nameInput,  nameErr,  nameMsg);
    setError(emailInput, emailErr, emailMsg);
    setError(msgInput,   msgErr,   msgMsg);

    const hasError = nameMsg || emailMsg || msgMsg;
    if (hasError) {
      // Focus first invalid field
      if (nameMsg)       nameInput.focus();
      else if (emailMsg) emailInput.focus();
      else               msgInput.focus();
      return;
    }

    /* ── Simulate send ─────────────────────────────────── */
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      // Reset form
      form.reset();
      [nameInput, emailInput, msgInput].forEach(inp => {
        inp.classList.remove('is-error');
      });
      [nameErr, emailErr, msgErr].forEach(el => { el.textContent = ''; });

      // Show success
      successBox.removeAttribute('hidden');
      successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
             viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             aria-hidden="true">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        Send Message`;

      // Auto-hide success message after 6 s
      setTimeout(() => {
        successBox.setAttribute('hidden', '');
      }, 6000);
    }, 900); // simulated network delay
  });
}());


/* ============================================================
   8. TYPING EFFECT — hero title cycle
   ============================================================ */
(function initTypingEffect() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const el = qs('.hero__title');
  if (!el) return;

  const phrases = [
    'Fresh Graduate &amp; <span class="accent">Tech Enthusiast</span>',
    'Web Developer &amp; <span class="accent">UI/UX Designer</span>',
    'IT Support &amp; <span class="accent">Problem Solver</span>',
  ];

  let current = 0;

  function cycle() {
    current = (current + 1) % phrases.length;
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    el.style.transition = 'opacity .3s ease, transform .3s ease';

    setTimeout(() => {
      el.innerHTML = phrases[current];
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 320);
  }

  // Start cycling every 3.5 s, after a 4 s initial delay
  setTimeout(() => {
    setInterval(cycle, 3500);
  }, 4000);
}());


/* ============================================================
   9. NAVBAR HEIGHT — CSS variable sync (for dynamic viewports)
   ============================================================ */
(function syncNavbarHeight() {
  const navbar = qs('#navbar');
  if (!navbar) return;

  function update() {
    document.documentElement.style.setProperty(
      '--navbar-h',
      `${navbar.offsetHeight}px`
    );
  }

  update();
  window.addEventListener('resize', update, { passive: true });
}());


/* ============================================================
   10. CERTIFICATE MODAL
   ============================================================ */
(function initCertModal() {
  const modal      = qs('#certModal');
  const overlay    = qs('#certModalOverlay');
  const closeBtn   = qs('#certModalClose');
  const modalImg   = qs('#certModalImg');
  const modalTitle = qs('#certModalTitle');
  const fullSizeBtn = qs('#certModalFullSize');
  if (!modal) return;

  // All "View Certificate" buttons
  const viewBtns = qsa('.cert-view-btn');

  /* ── Open ──────────────────────────────────────────────── */
  function openModal(src, title) {
    modalImg.src   = src;
    modalImg.alt   = title;
    modalTitle.textContent = title;
    fullSizeBtn.href = src;

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    // Focus the close button for accessibility
    requestAnimationFrame(() => closeBtn.focus());
  }

  /* ── Close ─────────────────────────────────────────────── */
  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    // Return focus to the button that opened the modal
    if (modal._opener) {
      modal._opener.focus();
      modal._opener = null;
    }
  }

  /* ── Bind open buttons ─────────────────────────────────── */
  viewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const src   = btn.dataset.certSrc;
      const title = btn.dataset.certTitle;
      modal._opener = btn;
      openModal(src, title);
    });
  });

  /* ── Close via X button ────────────────────────────────── */
  closeBtn.addEventListener('click', closeModal);

  /* ── Close via overlay click ───────────────────────────── */
  overlay.addEventListener('click', closeModal);

  /* ── Close via Escape key ──────────────────────────────── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });

  /* ── Trap focus inside modal ───────────────────────────── */
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    const focusable = [...modal.querySelectorAll(
      'button:not([disabled]), a:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter(el => !el.closest('[hidden]'));

    if (!focusable.length) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}());
