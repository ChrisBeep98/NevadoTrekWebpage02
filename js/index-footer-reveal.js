/**
 * Index Page Footer Reveal
 * Handles the "Curtain" effect for the footer on the index page
 * The main content scrolls OVER the fixed footer, revealing it at the end
 */

(function() {
  // Run immediately on DOMContentLoaded since footer is now inlined
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterReveal);
  } else {
    // DOM already loaded, run now
    initFooterReveal();
  }

  function initFooterReveal() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    
    if (!footerPlaceholder) {
      console.warn('Footer placeholder not found');
      return;
    }

    // The main content wrapper - everything except the footer
    const mainContainer = document.getElementById('main-content-wrapper');
    
    if (!mainContainer) {
      console.warn('Main content wrapper not found for curtain reveal');
      return;
    }

    // CRITICAL: Style the main content container
    // It must have a background color and be ABOVE the footer
    mainContainer.style.position = 'relative';
    mainContainer.style.zIndex = '10'; // Above the footer
    mainContainer.style.backgroundColor = '#ffffff'; // Must be opaque

    // Style the footer: fixed at bottom, BEHIND main content
    footerPlaceholder.style.position = 'fixed';
    footerPlaceholder.style.bottom = '0';
    footerPlaceholder.style.left = '0';
    footerPlaceholder.style.width = '100%';
    footerPlaceholder.style.zIndex = '1'; // Behind main content

    // Function to update margin-bottom based on footer height
    // This creates space for the footer to be revealed
    const updateMargin = () => {
      const footerHeight = footerPlaceholder.offsetHeight;
      mainContainer.style.marginBottom = footerHeight + 'px';
    };

    // Initial update with small delay to ensure render
    setTimeout(updateMargin, 100);
    setTimeout(updateMargin, 500); // Double-check after longer delay

    // Update on resize
    window.addEventListener('resize', updateMargin);
    
    // Use ResizeObserver for more robust height tracking
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        updateMargin();
      });
      ro.observe(footerPlaceholder);
    }
    
    console.log('Footer curtain reveal initialized');
  }
})();
