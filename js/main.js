/**
 * Main JavaScript Application Script
 * Clinic Website Core Utilities & Interactions
 */

// ============================================================================
// CENTRALIZED PLACEHOLDER CONFIGURATION
// Easily replace these values with real clinic and doctor information
// ============================================================================
window.CLINIC_CONFIG = {
  CLINIC_NAME: "[CLINIC_NAME]",
  DISPLAY_CLINIC_NAME: "Apex Hair Restoration Clinic",
  DOCTOR_NAME: "[DOCTOR_NAME]",
  DISPLAY_DOCTOR_NAME: "Dr. Alexander Thorne",
  DOCTOR_CREDENTIALS: "[DOCTOR_CREDENTIALS]",
  DISPLAY_DOCTOR_CREDENTIALS: "MD, Board-Certified Hair Restoration Specialist",
  PHONE: "[PHONE]",
  DISPLAY_PHONE: "+1 (800) 555-4247",
  PHONE_TEL: "+18005554247",
  WHATSAPP: "[WHATSAPP]",
  DISPLAY_WHATSAPP: "+1 (800) 555-4247",
  WHATSAPP_LINK: "https://wa.me/18005554247",
  EMAIL: "[EMAIL]",
  DISPLAY_EMAIL: "consult@apexclinic.example",
  ADDRESS: "[ADDRESS]",
  DISPLAY_ADDRESS: "742 Medical Center Blvd, Suite 400",
  CITY: "[CITY]",
  COUNTRY: "[COUNTRY]",
  DOMAIN: "https://www.example.com",
  MAP_URL: "https://maps.google.com/?q=[ADDRESS]"
};

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initConsultationModal();
  initFormValidation();
  initActiveNavLink();
});

/**
 * Sticky Header on Scroll
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
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

      // Simulate client-side static submission feedback
      setTimeout(() => {
        if (statusBox) {
          statusBox.textContent = 'Thank you. Your consultation request has been received. Our clinic patient coordinator will contact you shortly.';
          statusBox.className = 'form-status success';
        }
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }, 700);
    });
  });
}

/**
 * Highlight Current Active Navigation Link
 */
function initActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-link, .drawer-nav-link, .drawer-sublink');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (currentPath.endsWith(href) || (href === 'index.html' && (currentPath.endsWith('/') || currentPath === ''))) {
      link.classList.add('active');
    }
  });
}
