/* ─────────────────────────────────────────────────────────────────
   PARIT & JYOTI WEDDING WEBSITE — script.js
   ──────────────────────────────────────────────────────────────── */

'use strict';

// Wait until the full HTML document is loaded before querying elements.
document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR ───────────────────────────────────────────────── */
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // On scroll, add/remove a CSS class that changes navbar style.
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Open/close the mobile menu when the hamburger button is clicked.
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close nav on outside click
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !toggle.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ── 2. COUNTDOWN TIMER ──────────────────────────────────────── */
  const weddingDate = new Date('2027-01-28T10:00:00+03:00'); // EAT (UTC+3)

  // Helper: convert numbers like 5 -> "05" or 5 -> "005" for display.
  function pad(n, width = 2) {
    return String(n).padStart(width, '0');
  }

  // Calculate remaining time to the wedding and update countdown UI.
  function updateCountdown() {
    const now  = new Date();
    const diff = weddingDate - now;

    // If date has passed, keep the timer at zero.
    if (diff <= 0) {
      document.getElementById('days').textContent    = '000';
      document.getElementById('hours').textContent   = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent    = pad(days, 3);
    document.getElementById('hours').textContent   = pad(hours);
    document.getElementById('minutes').textContent = pad(minutes);
    document.getElementById('seconds').textContent = pad(seconds);
  }

  // Run once immediately, then update every second.
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ── 3. SCROLL REVEAL ────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  // IntersectionObserver watches elements entering the viewport.
  // When visible, we add "visible" class to trigger CSS reveal animation.
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger items that have --delay custom property
        const delay = getComputedStyle(entry.target).getPropertyValue('--delay').trim() || '0s';
        entry.target.style.transitionDelay = delay;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── 4. FLOATING PARTICLES ───────────────────────────────────── */
  const particleContainer = document.getElementById('particles');

  // Create one decorative particle with random size, position, and timing.
  function createParticle() {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 12 + 10}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: ${Math.random() * 0.6 + 0.2};
    `;
    particleContainer.appendChild(p);
    // Remove after animation to avoid DOM bloat
    p.addEventListener('animationend', () => p.remove(), { once: true });
  }

  // Create an initial batch then keep replenishing
  for (let i = 0; i < 20; i++) createParticle();
  setInterval(() => {
    if (particleContainer.children.length < 25) createParticle();
  }, 1200);

  /* ── 5. GALLERY LIGHTBOX ─────────────────────────────────────── */
  const galleryItems  = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');
  let currentIndex    = 0;

  // Open overlay and show the clicked gallery image.
  function openLightbox(index) {
    currentIndex = index;
    const img = galleryItems[index].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  // Close overlay and restore background page scroll.
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  // Move to the next image; modulo keeps index in range.
  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    const img = galleryItems[currentIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  // Move to the previous image; +length avoids negative index.
  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    const img = galleryItems[currentIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  // Make each gallery card clickable and keyboard accessible.
  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View photo ${i + 1}`);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', showNext);
  lightboxPrev.addEventListener('click', showPrev);

  // Click on dark backdrop area to close the lightbox.
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard controls while lightbox is open.
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowRight')  showNext();
    if (e.key === 'ArrowLeft')   showPrev();
  });

  /* ── 6. RSVP FORM ────────────────────────────────────────────── */
  const rsvpForm    = document.getElementById('rsvpForm');
  const rsvpSuccess = document.getElementById('rsvpSuccess');

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Validate inputs before sending RSVP.
  rsvpForm.addEventListener('submit', e => {
    e.preventDefault();

    const nameInput  = document.getElementById('rsvpName');
    const emailInput = document.getElementById('rsvpEmail');
    let valid = true;

    // Validate name
    nameInput.classList.remove('invalid');
    if (!nameInput.value.trim()) {
      nameInput.classList.add('invalid');
      nameInput.focus();
      valid = false;
    }

    // Validate email
    emailInput.classList.remove('invalid');
    if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
      emailInput.classList.add('invalid');
      if (valid) emailInput.focus();
      valid = false;
    }

    if (!valid) return;

    // Simulate submission (replace with actual backend / EmailJS / Formspree later)
    const submitBtn = rsvpForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      rsvpForm.hidden = true;
      rsvpSuccess.hidden = false;
    }, 1400);
  });

  // Clear invalid state on input
  ['rsvpName', 'rsvpEmail'].forEach(id => {
    document.getElementById(id).addEventListener('input', function () {
      this.classList.remove('invalid');
    });
  });

  /* ── 7. SMOOTH ACTIVE NAV LINK ───────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  // Highlight nav link for section currently most visible on screen.
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

});
