/**
 * Interactive Before & After Comparison Slider
 * Touch-enabled, accessible, multi-case support
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.ba-comparison-wrapper');
  if (!container) return;

  const handle = container.querySelector('.ba-handle');
  const beforeWrapper = container.querySelector('.ba-img-before-wrapper');
  const beforeImg = container.querySelector('.ba-img-before');
  const afterImg = container.querySelector('.ba-img-after');
  const caseTitle = document.querySelector('.ba-case-title');
  const caseMeta = document.querySelector('.ba-case-meta');
  const tabBtns = document.querySelectorAll('.ba-tab-btn');

  let isDragging = false;

  // Set initial width of inner before image to match container width
  const syncImageDimensions = () => {
    if (beforeImg) {
      beforeImg.style.width = container.offsetWidth + 'px';
    }
  };

  syncImageDimensions();
  window.addEventListener('resize', syncImageDimensions);

  // Position update function
  const updatePosition = (clientX) => {
    const rect = container.getBoundingClientRect();
    let posX = clientX - rect.left;

    // Clamp between 5% and 95%
    const minX = rect.width * 0.05;
    const maxX = rect.width * 0.95;

    if (posX < minX) posX = minX;
    if (posX > maxX) posX = maxX;

    const percentage = (posX / rect.width) * 100;

    if (beforeWrapper) beforeWrapper.style.width = `${percentage}%`;
    if (handle) {
      handle.style.left = `${percentage}%`;
      handle.setAttribute('aria-valuenow', Math.round(percentage));
    }
  };

  // Mouse Events
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updatePosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Events (Mobile/Tablet friendly)
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) updatePosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches[0]) return;
    updatePosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Keyboard accessibility
  if (handle) {
    handle.setAttribute('tabindex', '0');
    handle.setAttribute('role', 'slider');
    handle.setAttribute('aria-label', 'Before and After Image Comparison');
    handle.setAttribute('aria-valuemin', '5');
    handle.setAttribute('aria-valuemax', '95');
    handle.setAttribute('aria-valuenow', '50');

    handle.addEventListener('keydown', (e) => {
      let currentVal = parseInt(handle.getAttribute('aria-valuenow') || '50', 10);
      if (e.key === 'ArrowLeft') {
        currentVal = Math.max(5, currentVal - 5);
      } else if (e.key === 'ArrowRight') {
        currentVal = Math.min(95, currentVal + 5);
      } else {
        return;
      }
      e.preventDefault();
      beforeWrapper.style.width = `${currentVal}%`;
      handle.style.left = `${currentVal}%`;
      handle.setAttribute('aria-valuenow', currentVal);
    });
  }

  // Case Cases Switcher Data
  const casesData = {
    '1': {
      before: 'images/before-after/case-01-before.svg',
      after: 'images/before-after/case-01-after.svg',
      title: 'Case 1: Frontal Hairline Restoration (FUE Technique)',
      meta: '2,850 Grafts • Norwood Scale 3 • 12 Months Post-Procedure Result'
    },
    '2': {
      before: 'images/before-after/case-02-before.svg',
      after: 'images/before-after/case-02-after.svg',
      title: 'Case 2: Crown / Vertex Thinning Reconstruction',
      meta: '2,400 Grafts • Natural Whorl Spiral Re-creation • 10 Months Result'
    },
    '3': {
      before: 'images/before-after/case-03-before.svg',
      after: 'images/before-after/case-03-after.svg',
      title: 'Case 3: Frontal Recess & Mid-Scalp Density (DHI)',
      meta: '3,100 Direct Implantation Grafts • High-Density Coverage • 9 Months Result'
    }
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const caseId = btn.getAttribute('data-case');
      const data = casesData[caseId];
      if (!data) return;

      // Update images
      if (beforeImg) beforeImg.src = data.before;
      if (afterImg) afterImg.src = data.after;
      if (caseTitle) caseTitle.textContent = data.title;
      if (caseMeta) caseMeta.textContent = data.meta;

      // Reset slider to 50%
      if (beforeWrapper) beforeWrapper.style.width = '50%';
      if (handle) {
        handle.style.left = '50%';
        handle.setAttribute('aria-valuenow', '50');
      }
      syncImageDimensions();
    });
  });
});
