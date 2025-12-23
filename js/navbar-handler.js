/**
 * Navbar Handler - Shared across all pages
 * Manages navbar scroll effects and mobile menu
 */

(function() {
  'use strict';
  
  // Initialize navbar on DOM ready
  function init() {
    setupScrollEffect();
    // Mobile menu reset removed
  }
  
  /**
   * Setup navbar scroll effect
   */
  function setupScrollEffect() {
    const navbar = document.getElementById('navbar-exclusion');
    if (!navbar) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
          ticking = false;
        });
        
        ticking = true;
      }
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
