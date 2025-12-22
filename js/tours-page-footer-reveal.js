/**
 * Tours Page Footer Reveal
 * Handles the "Curtain" effect where content slides over the footer.
 * Optimized with requestAnimationFrame and ResizeObserver for 60fps performance.
 */

(function() {
  function initFooterReveal() {
    const wrapper = document.getElementById('nt-tours-reveal-wrapper');
    const footer = document.getElementById('nt-tours-footer-reveal');
    const spacer = document.getElementById('nt-footer-spacer');

    if (!wrapper || !footer || !spacer) {
      console.warn('Footer Reveal elements not found');
      return;
    }

    // 1. Setup Stacking Context
    wrapper.style.position = 'relative';
    wrapper.style.zIndex = '10';
    wrapper.style.backgroundColor = 'var(--color-bg, #ffffff)'; 
    
    footer.style.position = 'fixed';
    footer.style.bottom = '0';
    footer.style.left = '0';
    footer.style.width = '100%';
    footer.style.zIndex = '1';

    // 2. Optimized Height Handling
    let ticking = false;

    const updateFooterMargin = () => {
      const footerHeight = footer.offsetHeight;
      if (footerHeight > 0) {
        // Use spacer height for better cross-browser reliability
        spacer.style.height = footerHeight + 'px';
        // Ensure footer is visible now that we have space
        footer.style.visibility = 'visible';
      }
      ticking = false;
    };

    const requestUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateFooterMargin);
        ticking = true;
      }
    };

    // Initial trigger
    updateFooterMargin();
    // Second trigger after a delay to account for potential image/font loads
    setTimeout(updateFooterMargin, 500);
    setTimeout(updateFooterMargin, 2000);

    // 3. Robust Observers
    // ResizeObserver tracks height changes (e.g., dynamic content or mobile resize)
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => {
        requestUpdate();
      });
      ro.observe(footer);
      ro.observe(document.body); // Also watch body for general layout shifts
    }

    window.addEventListener('resize', requestUpdate);
    
    // Optional: Parallax effect for the footer reveal
    // If we want it to "rise" slightly as it's revealed
    window.addEventListener('scroll', () => {
      const scrollPos = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const bodyHeight = document.body.offsetHeight;
      const footerHeight = footer.offsetHeight;
      const revealTrigger = bodyHeight - footerHeight - windowHeight;

      if (scrollPos > revealTrigger) {
        const revealProgress = (scrollPos - revealTrigger) / footerHeight;
        // Subtle move or fade if desired
        // footer.style.transform = `translateY(${(1 - revealProgress) * 20}px)`;
      }
    }, { passive: true });
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterReveal);
  } else {
    initFooterReveal();
  }
})();
