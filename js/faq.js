/**
 * Accessible FAQ Accordion with Keyboard Navigation & Dynamic Height
 */

document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  const buttons = Array.from(document.querySelectorAll('.faq-question-btn'));

  faqItems.forEach((item, index) => {
    const btn = item.querySelector('.faq-question-btn');
    const pane = item.querySelector('.faq-answer-pane');

    if (!btn || !pane) return;

    // Toggle handler
    const toggleItem = () => {
      const isAlreadyActive = item.classList.contains('active');

      // Close other active items in the same list (accordion style)
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          const otherPane = otherItem.querySelector('.faq-answer-pane');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherPane) otherPane.style.maxHeight = '0px';
        }
      });

      // Toggle current item
      if (isAlreadyActive) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        pane.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        pane.style.maxHeight = pane.scrollHeight + 'px';
      }
    };

    btn.addEventListener('click', toggleItem);

    // Keyboard navigation across accordion headers
    btn.addEventListener('keydown', (e) => {
      let targetIndex = -1;
      if (e.key === 'ArrowDown') {
        targetIndex = (index + 1) % buttons.length;
      } else if (e.key === 'ArrowUp') {
        targetIndex = (index - 1 + buttons.length) % buttons.length;
      } else if (e.key === 'Home') {
        targetIndex = 0;
      } else if (e.key === 'End') {
        targetIndex = buttons.length - 1;
      }

      if (targetIndex !== -1) {
        e.preventDefault();
        buttons[targetIndex].focus();
      }
    });
  });

  // Open first FAQ by default if present
  const firstItem = document.querySelector('.faq-item');
  if (firstItem) {
    const firstBtn = firstItem.querySelector('.faq-question-btn');
    const firstPane = firstItem.querySelector('.faq-answer-pane');
    if (firstBtn && firstPane) {
      firstItem.classList.add('active');
      firstBtn.setAttribute('aria-expanded', 'true');
      firstPane.style.maxHeight = firstPane.scrollHeight + 'px';
    }
  }

  // Recalculate open heights on window resize to prevent text truncation
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.querySelectorAll('.faq-item.active .faq-answer-pane').forEach(pane => {
        pane.style.maxHeight = pane.scrollHeight + 'px';
      });
    }, 100);
  }, { passive: true });
});
