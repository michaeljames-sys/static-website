/**
 * Accessible FAQ Accordion
 */

document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const pane = item.querySelector('.faq-answer-pane');

    if (!btn || !pane) return;

    btn.addEventListener('click', () => {
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
});
