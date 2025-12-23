/**
 * NT Footer Reveal (Unified)
 * Professional "Curtain" effect for Nevado Trek.
 * Handles different wrapper IDs and ensures a perfect, snap-to-bottom reveal.
 */

(function() {
  function initNTFooterReveal() {
    // 1. Element Detection (Support multiple IDs for global compatibility)
    const wrapper = document.getElementById('main-content-wrapper') || 
                    document.getElementById('nt-tours-reveal-wrapper') ||
                    document.querySelector('main');
                    
    const footer = document.getElementById('nt-tours-footer-reveal');
    const spacer = document.getElementById('nt-footer-spacer');

    if (!wrapper || !footer || !spacer) {
      console.warn('NT Footer Reveal: Necessary elements not found. Check wrapper/footer/spacer IDs.');
      return;
    }

    console.log('NT Footer Reveal: Initializing unified component logic...');

    // 2. Initial Structural Setup
    wrapper.style.position = 'relative';
    wrapper.style.zIndex = '100';
    // Ensure wrapper is opaque to hide footer
    if (window.getComputedStyle(wrapper).backgroundColor === 'rgba(0, 0, 0, 0)' || 
        window.getComputedStyle(wrapper).backgroundColor === 'transparent') {
      wrapper.style.backgroundColor = '#ffffff';
    }

    footer.style.position = 'fixed';
    footer.style.bottom = '0';
    footer.style.left = '0';
    footer.style.width = '100%';
    footer.style.zIndex = '1';
    footer.style.visibility = 'visible';

    spacer.style.display = 'block';
    spacer.style.width = '100%';
    spacer.style.pointerEvents = 'none';

    // 3. Perfected Height Calculation
    let ticking = false;

    const updateFooterHeight = () => {
      if (ticking) return;
      ticking = true;

      // Measure the footer via Bounding Box (most accurate for CSS transforms)
      const rect = footer.getBoundingClientRect();
      const scrollH = footer.scrollHeight;
      const offsetH = footer.offsetHeight;
      
      // Use the absolute visual maximum
      const footerHeight = Math.ceil(Math.max(rect.height, scrollH, offsetH));

      if (footerHeight > 0) {
        // Apply to spacer
        spacer.style.height = footerHeight + 'px';
        
        // Defensive resets: Clear any rogue margins/paddings that cause "extra scroll"
        wrapper.style.marginBottom = '0px';
        wrapper.style.paddingBottom = '0px';
        spacer.style.margin = '0';
        spacer.style.padding = '0';
      }

      ticking = false;
    };

    const requestUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateFooterHeight);
        ticking = true;
      }
    };

    // 4. Robust Observation (Resize, Mutation, Window)
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(requestUpdate);
      ro.observe(footer);
    }

    if (window.MutationObserver) {
      const mo = new MutationObserver(requestUpdate);
      mo.observe(footer, { childList: true, subtree: true, attributes: true });
    }

    // 5. Initial Lifecycle & Retries (Webflow/GSAP compatibility)
    updateFooterHeight();
    [100, 300, 500, 800, 1200, 2000, 3000, 5000].forEach(delay => {
      setTimeout(updateFooterHeight, delay);
    });

    // 6. Global Event Listeners
    window.addEventListener('resize', requestUpdate);
    window.addEventListener('load', updateFooterHeight);
    window.addEventListener('scroll', updateFooterHeight, { passive: true });

    // Handle i18n changes (which change text height)
    window.addEventListener('languageChange', () => {
      setTimeout(updateFooterHeight, 200);
    });
  }

  // Self-init
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initNTFooterReveal();
  } else {
    document.addEventListener('DOMContentLoaded', initNTFooterReveal);
  }
})();
