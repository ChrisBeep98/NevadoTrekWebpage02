/**
 * Index Page Footer Reveal
 * Handles the "Curtain" effect where content slides over the footer.
 * Optimized with requestAnimationFrame and ResizeObserver.
 */

(function() {
  function initFooterReveal() {
    const wrapper = document.getElementById('main-content-wrapper');
    const footer = document.getElementById('nt-tours-footer-reveal');
    const spacer = document.getElementById('nt-footer-spacer');

    if (!wrapper || !footer || !spacer) {
      console.warn('Index Footer Reveal elements not found');
      return;
    }

    // 1. Initial State
    console.log('Index Footer Reveal: Initializing robustness v5 (Extreme)...');
    
    // Set a very safe initial height to ensure scrollability
    spacer.style.height = '1200px'; 
    spacer.style.display = 'block';

    wrapper.style.position = 'relative';
    wrapper.style.zIndex = '100';
    wrapper.style.backgroundColor = '#ffffff'; 
    
    footer.style.position = 'fixed';
    footer.style.bottom = '0';
    footer.style.left = '0';
    footer.style.width = '100%';
    footer.style.zIndex = '1';
    footer.style.visibility = 'visible'; 

    // 2. Height calculation logic
    let ticking = false;

    const updateFooterHeight = () => {
      if (ticking) return;
      ticking = true;

      const scrollH = footer.scrollHeight;
      const offsetH = footer.offsetHeight;
      const rectH = footer.getBoundingClientRect().height;
      
      // Use the absolute maximum height 
      let maxHeight = Math.max(scrollH, offsetH, rectH, 1200);
      
      // Sync spacer height
      spacer.style.height = maxHeight + 'px';
      spacer.style.display = 'block';

      // Clear wrapper padding just in case
      wrapper.style.paddingBottom = '0px';

      console.log('Index Footer Reveal: Height updated via spacer to', maxHeight, 'px');
      
      ticking = false;
    };

    const requestUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateFooterHeight);
        ticking = true;
      }
    };

    // 3. Observers
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(requestUpdate);
      ro.observe(footer);
    }
    
    if (window.MutationObserver) {
      const mo = new MutationObserver(requestUpdate);
      mo.observe(footer, { childList: true, subtree: true, attributes: true });
    }

    // 4. Repeated triggers
    updateFooterHeight();
    
    // Many retries because Webflow/GSAP might change layout later
    [100, 300, 500, 800, 1200, 2000, 3000, 5000].forEach(delay => {
      setTimeout(updateFooterHeight, delay);
    });

    window.addEventListener('resize', requestUpdate);
    window.addEventListener('load', updateFooterHeight);
    window.addEventListener('scroll', updateFooterHeight, { passive: true });

    // Handle i18n
    window.addEventListener('languageChange', () => {
      setTimeout(updateFooterHeight, 200);
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initFooterReveal();
  } else {
    document.addEventListener('DOMContentLoaded', initFooterReveal);
  }
})();
