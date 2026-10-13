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

  // Drag state control
  const startDrag = (clientX) => {
    isDragging = true;
    container.classList.add('is-dragging');
    updatePosition(clientX);
  };

  const stopDrag = () => {
    if (isDragging) {
      isDragging = false;
      container.classList.remove('is-dragging');
    }
  };

  // Mouse Events
  container.addEventListener('mousedown', (e) => {
    startDrag(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  });

  window.addEventListener('mouseup', stopDrag);

  // Touch Events (Mobile/Tablet friendly with vertical scroll safety)
  container.addEventListener('touchstart', (e) => {
    if (e.touches[0]) startDrag(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches[0]) return;
    updatePosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', stopDrag);
  window.addEventListener('touchcancel', stopDrag);

  // Keyboard accessibility (Full ARIA Slider spec)
  if (handle) {
    handle.setAttribute('tabindex', '0');
    handle.setAttribute('role', 'slider');
    handle.setAttribute('aria-label', 'Before and After Image Comparison');
    handle.setAttribute('aria-valuemin', '5');
    handle.setAttribute('aria-valuemax', '95');
    handle.setAttribute('aria-valuenow', '50');

    handle.addEventListener('keydown', (e) => {
      let currentVal = parseInt(handle.getAttribute('aria-valuenow') || '50', 10);
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          currentVal = Math.max(5, currentVal - 5);
          break;
        case 'ArrowRight':
        case 'ArrowUp':
          currentVal = Math.min(95, currentVal + 5);
          break;
        case 'PageDown':
          currentVal = Math.max(5, currentVal - 20);
          break;
        case 'PageUp':
          currentVal = Math.min(95, currentVal + 20);
          break;
        case 'Home':
          currentVal = 5;
          break;
        case 'End':
          currentVal = 95;
          break;
        default:
          return;
      }
      e.preventDefault();
      beforeWrapper.style.width = `${currentVal}%`;
      handle.style.left = `${currentVal}%`;
      handle.setAttribute('aria-valuenow', currentVal);
    });
  }

  // Case Switcher Data (Real Clinical Hair Art Cases)
  const casesData = {
    '1': {
      before: 'images/before-after/case-01-before.jpg',
      after: 'images/before-after/case-01-after.jpg',
      title: 'Case 1: Frontal Hairline & Crown Restoration (FUE Mega-Session)',
      meta: '3,500 Grafts • Norwood Scale 4 • 10 Months Mature Result • Dr. Syed Imran Zahid'
    },
    '2': {
      before: 'images/before-after/case-02-before.jpg',
      after: 'images/before-after/case-02-after.jpg',
      title: 'Case 2: Frontal Hairline Reconstruction & Temple Restoration (FUE Technique)',
      meta: '3,200 Grafts • Norwood Scale 3 • 6 Months Growth Milestone • Dr. Syed Imran Zahid'
    },
    '3': {
      before: 'images/before-after/case-03-before.jpg',
      after: 'images/before-after/case-03-after.jpg',
      title: 'Case 3: High-Density Frontal & Mid-Scalp Restoration (Chinese Method / DHI)',
      meta: '3,800 Grafts • Norwood Scale 3A • 12 Months Mature Result • Dr. Kashif Hussain'
    }
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const caseId = btn.getAttribute('data-case');
      const data = casesData[caseId];
      if (!data) return;

      // Smooth crossfade on image change
      const imgContainer = container.querySelector('.ba-image-container');
      if (imgContainer) {
        imgContainer.style.opacity = '0.6';
        imgContainer.style.transition = 'opacity 0.2s ease';
      }

      setTimeout(() => {
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

        if (imgContainer) {
          imgContainer.style.opacity = '1';
        }
      }, 100);
    });
  });
});
