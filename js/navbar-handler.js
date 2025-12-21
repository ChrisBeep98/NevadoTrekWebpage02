/**
 * Navbar Handler - Shared across all pages
 * Manages navbar scroll effects and mobile menu
 */

(function() {
  'use strict';
  
  // Initialize navbar on DOM ready
  function init() {
    setupScrollEffect();
    setupMobileMenu();
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
  
  /**
   * Setup mobile menu toggle
   */
  function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle-exclusion');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuClose = document.getElementById('mobile-menu-close');
    
    if (!menuToggle || !mobileMenu || !menuClose) return;
    
    // Open menu
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    
    // Close menu
    menuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
    
    // Close on outside click
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // Close on link click
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
