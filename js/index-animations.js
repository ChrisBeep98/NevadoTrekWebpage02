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
   * KEPT: Letter-by-letter (It's the main hero, worth the cost)
   * This matches the specific premium request for the hero section.
   */
  function initHeroTitleReveal(hasGSAP) {
    const titleEl = document.querySelector('.main-heading .italic-text-4');
    if (!titleEl) return;

    // Use current logic for Hero
    const text = titleEl.textContent.trim();
    const cleanText = text.replace(/\s+/g, ' ').trim();
    const words = cleanText.split(' ').filter(w => w.length > 0);
    
    titleEl.innerHTML = ''; 
    let letterIndex = 0;
    
    words.forEach((word) => {
      const wordWrapper = document.createElement('span');
      wordWrapper.className = 'word-wrapper';
      wordWrapper.style.display = 'block';
      
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const letterSpan = document.createElement('span');
        letterSpan.className = 'letter';
        letterSpan.textContent = char;
        const delay = letterIndex * 70;
        letterSpan.style.animationDelay = `${delay}ms`;
        wordWrapper.appendChild(letterSpan);
        letterIndex++;
      }
      
      titleEl.appendChild(wordWrapper);
    });
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
      // Animate with fromTo for better control over reset
      gsap.fromTo(element, 
        { 
          opacity: 0, 
          y: 30, 
          filter: 'blur(10px)' 
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%', // Trigger slightly before it's fully in view
            toggleActions: 'play none none reverse' // Play on enter, reverse on leave back
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
