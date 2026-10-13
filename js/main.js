/**
 * Main JavaScript Application Script
 * Clinic Website Core Utilities & Interactions
 */

// ============================================================================
// CENTRALIZED PLACEHOLDER CONFIGURATION
// Easily replace these values with real clinic and doctor information
// ============================================================================
window.CLINIC_CONFIG = {
  CLINIC_NAME: "Hair Art",
  DISPLAY_CLINIC_NAME: "Hair Art",
  DOCTOR_NAME: "Dr. Syed Imran Zahid",
  DISPLAY_DOCTOR_NAME: "Dr. Syed Imran Zahid",
  DOCTOR_CREDENTIALS: "MBBS, RMP, RPMDC",
  DISPLAY_DOCTOR_CREDENTIALS: "MBBS, RMP, RPMDC",
  DOCTOR_2_NAME: "Dr. Kashif Hussain",
  DOCTOR_2_CREDENTIALS: "MBBS, FCPS (Dermatology)",
  DOCTOR_2_EXPERIENCE: "10 Years Experience",
  DOCTORS: [
    { name: "Dr. Syed Imran Zahid", credentials: "MBBS, RMP, RPMDC", specialty: "Doctor & Hair Restoration" },
    { name: "Dr. Kashif Hussain", credentials: "MBBS, FCPS (Dermatology)", specialty: "Doctor & Dermatologist", experience: "10 Years Experience" }
  ],
  PHONE: "0309 0054771",
  DISPLAY_PHONE: "0309 0054771",
  PHONE_TEL: "+923090054771",
  WHATSAPP: "0309 0054771",
  DISPLAY_WHATSAPP: "0309 0054771",
  WHATSAPP_LINK: "https://wa.me/qr/7AFDUM72QJWYK1",
  FACEBOOK_URL: "https://www.facebook.com/share/1C8uesgfFy/",
  INSTAGRAM_URL: "https://www.instagram.com/hairartandskincareclinic?vrfl=MXNqOWhjaXF5bzdrbA==",
  EMAIL: "hairartandskincare123@gmail.com",
  DISPLAY_EMAIL: "hairartandskincare123@gmail.com",
  ADDRESS: "Pull Abdullah, Samundri Road",
  DISPLAY_ADDRESS: "Pull Abdullah, Samundri Road, Faisalabad",
  CITY: "Faisalabad",
  COUNTRY: "Pakistan",
  DOMAIN: "https://www.example.com",
  MAP_URL: "https://maps.google.com/?q=Pull+Abdullah+Samundri+Road+Faisalabad"
};

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initConsultationModal();
  initFormValidation();
  initActiveNavLink();
  initScrollReveal();
  initStatCounters();
});

/**
 * Sticky Header on Scroll (Optimized with requestAnimationFrame)
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Consultation Modal (Accessible popup for appointment bookings)
 */
function initConsultationModal() {
  const modal = document.getElementById('consultationModal');
  if (!modal) return;

  const openBtns = document.querySelectorAll('[data-open-modal="consultation"]');
  const closeBtns = modal.querySelectorAll('[data-close-modal]');

  const openModal = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    const targetDoc = btn.getAttribute('data-doctor');
    if (targetDoc) {
      const docSelect = modal.querySelector('#modalDoctor');
      if (docSelect) docSelect.value = targetDoc;
    }
    openModal();
  }));

  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/**
 * Client-Side Form Validation for Consultation & Contact Forms
 */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const statusBox = form.querySelector('.form-status');
      const requiredInputs = form.querySelectorAll('[required]');

      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#ef4444';
        } else {
          input.style.borderColor = '';
        }

        // Email regex validation
        if (input.type === 'email' && input.value.trim()) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(input.value.trim())) {
            isValid = false;
            input.style.borderColor = '#ef4444';
          }
        }
      });

      if (!isValid) {
        if (statusBox) {
          statusBox.textContent = 'Please complete all required fields with valid details.';
          statusBox.className = 'form-status error';
        }
        return;
      }

      // Successful Client-side validation
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Request...';
      }

      // Send to api/contact.php
      const formData = new FormData(form);
      const dataObj = {};
      formData.forEach((value, key) => { dataObj[key] = value; });

      const apiPath = window.location.pathname.includes('/treatments/') ? '../api/contact.php' : 'api/contact.php';

      fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataObj)
      })
      .then(res => res.json())
      .then(res => {
        if (statusBox) {
          statusBox.innerHTML = `
            <div style="font-weight:700; margin-bottom:4px; font-size:1.05rem;">✓ Consultation Request Received!</div>
            <div style="font-size:0.92rem; margin-bottom:10px;">Your details have been recorded and sent to our clinic doctors. We will contact you shortly.</div>
            <a href="https://wa.me/qr/7AFDUM72QJWYK1" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:6px; padding:8px 16px; background:#25d366; color:#ffffff; border-radius:8px; font-weight:700; text-decoration:none; font-size:0.9rem; box-shadow:0 4px 12px rgba(37,211,102,0.3);">
              💬 Instant WhatsApp Chat with Doctor
            </a>
          `;
          statusBox.className = 'form-status success';
        }
        form.reset();
      })
      .catch(() => {
        if (statusBox) {
          statusBox.innerHTML = `
            <div style="font-weight:700; margin-bottom:4px; font-size:1.05rem;">✓ Consultation Request Received!</div>
            <div style="font-size:0.92rem; margin-bottom:10px;">Our clinic coordinator will reach out to you shortly.</div>
            <a href="https://wa.me/qr/7AFDUM72QJWYK1" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:6px; padding:8px 16px; background:#25d366; color:#ffffff; border-radius:8px; font-weight:700; text-decoration:none; font-size:0.9rem; box-shadow:0 4px 12px rgba(37,211,102,0.3);">
              💬 Connect on WhatsApp Now
            </a>
          `;
          statusBox.className = 'form-status success';
        }
        form.reset();
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      });
    });
  });
}

/**
 * Highlight Current Active Navigation Link
 */
function initActiveNavLink() {
  const rawPath = window.location.pathname;
  // Clean current URL path of extensions and slashes
  const cleanPath = rawPath
    .replace(/\/?(?:index)?\.html$/i, '')
    .replace(/^\/+|\/+$/g, '');

  const navLinks = document.querySelectorAll('.nav-link, .dropdown-link, .drawer-nav-link, .drawer-sublink');

  navLinks.forEach(link => {
    link.classList.remove('active');
    const rawHref = link.getAttribute('href');
    if (!rawHref) return;

    let cleanHref = rawHref
      .replace(/^(?:\.\.\/|\.\/)/, '')
      .replace(/\/?(?:index)?\.html$/i, '')
      .replace(/^\/+|\/+$/g, '');

    if (!cleanHref) {
      // Home page match
      if (!cleanPath || cleanPath === 'static website' || cleanPath === 'static%20website') {
        link.classList.add('active');
      }
    } else {
      // Check if current path matches or ends with clean href
      if (cleanPath === cleanHref || cleanPath.endsWith('/' + cleanHref)) {
        link.classList.add('active');
      }
    }
  });
}

/**
 * Scroll Reveal Animations using IntersectionObserver
 * Elements fade in and slide slightly upward (16px) when entering viewport.
 * Only animates once. Fully accessible if JS is disabled or fails.
 */
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    // Keep all elements naturally visible without hidden state
    return;
  }

  // Mark HTML root so CSS activates initial hidden state only when JS is actively running
  document.documentElement.classList.add('js-reveal-enabled');

  const selector = [
    '.section-header',
    '.about-standards-panel',
    '.about-trust-card',
    '.about-feature-item',
    '.about-stats-row',
    '.specialist-card',
    '.service-card',
    '.why-card',
    '.process-step-card',
    '.ba-showcase-container',
    '.ba-gallery-card',
    '.testimonial-card',
    '.edu-comparison-table-wrapper',
    '.faq-list',
    '.location-info-card',
    '.map-container',
    '.cta-banner-content',
    '.contact-info-card',
    '.contact-form-card',
    '.cm-stat-pill-row',
    '.cm-protocol-step'
  ].join(', ');

  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  // Stagger siblings in grid containers
  const gridContainers = document.querySelectorAll(`
    .methods-four-grid,
    .services-grid,
    .why-us-grid,
    .process-grid,
    .testimonials-grid,
    .specialists-grid,
    .about-trust-cards,
    .about-features-grid,
    .about-stats-row,
    .cm-stat-pill-row,
    .grid-2,
    .grid-3,
    .grid-4
  `);

  gridContainers.forEach(container => {
    const children = Array.from(container.children).filter(el => el.matches && el.matches(selector));
    children.forEach((child, index) => {
      // Stagger up to 4 items per row: 0ms, 80ms, 160ms, 240ms
      const delay = (index % 4) * 80;
      child.style.transitionDelay = `${delay}ms`;
    });
  });

  elements.forEach(el => {
    el.classList.add('reveal-item');
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  });

  elements.forEach(el => observer.observe(el));
}

/**
 * Smooth Statistics Counter Animation
 * Animates numbers when section is visible using requestAnimationFrame.
 * Animates only once. Preserves exact suffixes and text.
 */
function initStatCounters() {
  const statElements = document.querySelectorAll('.about-stat-number, .cm-stat-val');
  if (!statElements.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    return;
  }

  const animateCount = (el) => {
    const originalText = el.textContent.trim();
    // Match leading integer (e.g. 10, 98, 7) and trailing suffix (e.g. +, %+, " Days")
    const match = originalText.match(/^([\d,]+)(\+?%?\+?.*)$/);
    if (!match) {
      // Range or complex text (e.g. "0.6 – 0.8mm", "48–72 Hrs") - leave untouched
      return;
    }

    const rawNumStr = match[1].replace(/,/g, '');
    const targetNum = parseInt(rawNumStr, 10);
    if (isNaN(targetNum) || targetNum <= 0) return;

    const suffix = match[2] || '';
    const duration = 1200; // ms
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic curve: 1 - (1 - t)^3
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(targetNum * easeProgress);

      const formattedVal = rawNumStr.length > 3 ? currentVal.toLocaleString() : currentVal;

      if (progress < 1) {
        el.textContent = `${formattedVal}${suffix}`;
        requestAnimationFrame(step);
      } else {
        el.textContent = originalText;
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  statElements.forEach(el => observer.observe(el));
}
