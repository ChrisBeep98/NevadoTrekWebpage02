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
    const updateFooterMargin = () => {
      if (ticking) return;
      ticking = true;

      // Use getBoundingClientRect for the most accurate visual height
      const rect = footer.getBoundingClientRect();
      const footerHeight = Math.ceil(rect.height);

      if (footerHeight > 0) {
        // Sync spacer height identically 
        spacer.style.height = footerHeight + 'px';
        spacer.style.display = 'block';
        spacer.style.margin = '0';
        spacer.style.padding = '0';
        
        // Safety: Ensure wrapper doesn't have extra bottom space
        wrapper.style.marginBottom = '0px';
        wrapper.style.paddingBottom = '0px';
        
        // Ensure footer is visible
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

    // Initial triggers
    updateFooterMargin();
    [500, 1000, 2000, 3000].forEach(delay => setTimeout(updateFooterMargin, delay));

    // 3. Robust Observers
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(requestUpdate);
      ro.observe(footer);
      // Removed body observer to avoid potential feedback loops with spacer
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
