/* ===================================
   INDEX PAGE ANIMATIONS SCRIPT
   Optimized Text Reveals using GSAP
   Replaces heavy letter-by-letter DOM manipulation
   =================================== */

(function () {
  'use strict';

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Determine if GSAP is available
    const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
    
    if (hasGSAP) {
      gsap.registerPlugin(ScrollTrigger);
    } else {
      console.warn('GSAP not found. Animations disabled.');
    }

    // Small delay to ensure styles/layout settled
    setTimeout(() => {
      // 1. Hero Title (Optimized)
      initHeroTitleReveal(hasGSAP);
      
      // 2. Body Text Reveals (Optimized Block Animation)
      initOptimizedTextReveal('[data-i18n-key="experiences.lead"]', hasGSAP);
      initOptimizedTextReveal('[data-i18n-key="services.lead"]', hasGSAP);
      initOptimizedTextReveal('[data-i18n-key="services.lead.bottom"]', hasGSAP);
      initOptimizedTextReveal('.moving-gallery .last-heading', hasGSAP);

      // 3. Navbar Logic
      initFloatingNavbar();
    }, 100);
  }

  /**
   * FLOATING PILL NAVBAR
   * Transforms the full-width navbar into a floating pill when scrolling down
   */
  function initFloatingNavbar() {
    const navbar = document.getElementById('navbar-exclusion');
    if (!navbar) return;

    const SCROLL_THRESHOLD = 80;
    let isScrolled = false;
    let ticking = false;

    function updateNavbar() {
      const scrollY = window.scrollY || window.pageYOffset;
      
      if (scrollY > SCROLL_THRESHOLD && !isScrolled) {
        navbar.classList.add('scrolled');
        isScrolled = true;
      } else if (scrollY <= SCROLL_THRESHOLD && isScrolled) {
        navbar.classList.remove('scrolled');
        isScrolled = false;
      }
      
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateNavbar();
  }

  /**
   * 1. Hero Title: "Un Paraíso En Salento"
   * REPLACED: Optimized Block Animation (Requested by User)
   * Auto-playing reveal without scrub, clean standard spacing.
   */
  function initHeroTitleReveal(hasGSAP) {
    const titleEl = document.querySelector('.main-heading .italic-text-4');
    if (!titleEl) return;

    // Optimized Block Animation for Hero (No Scrub, Auto-play)
    if (hasGSAP) {
      gsap.fromTo(titleEl, 
        { 
          opacity: 0, 
          y: 50, 
          filter: 'blur(10px)',
          clipPath: 'inset(0% 0% 100% 0%)' 
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.5,
          ease: 'power3.out',
          delay: 0.2 // Small start delay
        }
      );
    } else {
      // Fallback
      titleEl.style.opacity = 1;
    }
  }

  /**
   * 2. OPTIMIZED TEXT REVEAL (GSAP)
   * Animates the entire text block at once instead of hundreds of spans
   * Effect: Fade In + Slight Slide Up + Blur removal
   */
  function initOptimizedTextReveal(selector, hasGSAP) {
    const element = document.querySelector(selector);
    if (!element) return;

    // Ensure initial state (handled by CSS usually, but enforce here)
    if (hasGSAP) {
      // Animate with fromTo + Scrub + ClipPath
      // ClipPath creates a "reveal" effect like a curtain rising
      gsap.fromTo(element, 
        { 
          opacity: 0, 
          y: 50, // Increased movement for dramatic scrub effect
          filter: 'blur(10px)',
          clipPath: 'inset(0% 0% 100% 0%)' // Fully masked from bottom
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          clipPath: 'inset(0% 0% 0% 0%)', // Fully visible
          ease: 'none', // Scrub needs linear ease for direct control
          delay: 0.1, // 100ms delay restored
          scrollTrigger: {
            trigger: element,
            start: 'top 95%', // Starts when entering viewport
            end: 'top 50%', // Finishes exactly at middle of viewport
            scrub: 0.5,
          }
        }
      );
    } else {
      // Fallback if no GSAP
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.style.filter = 'none';
    }
    
    // Mark as handled to override any CSS hiding if necessary
    element.classList.add('animating');
  }

  /**
   * Performance: Pause animations when page is not visible
   */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.body.style.animationPlayState = 'paused';
    } else {
      document.body.style.animationPlayState = 'running';
    }
  });

})();
