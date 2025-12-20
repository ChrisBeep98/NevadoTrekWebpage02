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
      // initOptimizedTextReveal('[data-i18n-key="services.lead.bottom"]', hasGSAP); // Disabled to prevent conflict
      initOptimizedTextReveal('.moving-gallery .last-heading', hasGSAP);

      // 3. Services CTA & Arrow Optimization (New)
      initServiceAnimations(hasGSAP);

      // 4. Tour Cards Optimization (New)
      initTourCardsAnimations(hasGSAP);

      // 5. About Section & Logos Optimization (New)
      initAboutLogosAnimations(hasGSAP);

      // 6. Moving Gallery Optimization (New)
      initMovingGalleryAnimations(hasGSAP);

      // 7. Navbar Logic
      initFloatingNavbar();
    }, 100);
  }

  /**
   * MOVING GALLERY ANIMATION
   * Smootly reveals the final gallery grid
   */
  function initMovingGalleryAnimations(hasGSAP) {
    const images = document.querySelectorAll('.moving-gallery-image');
    if (images.length === 0) return;

    if (hasGSAP) {
      gsap.fromTo(images, 
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.moving-gallery',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }

  /**
   * ABOUT SECTION LOGOS & CARDS
   * Batch animate partnership logos and cards for better performance
   */
  function initAboutLogosAnimations(hasGSAP) {
    const items = document.querySelectorAll('.about-card, .section-is--about .logo-container, .div-block-111 .logo-container');
    if (items.length === 0) return;

    if (hasGSAP) {
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#about', // Trigger when section hits viewport
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    } else {
      // Fallback
      items.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  }

  /**
   * TOUR CARDS ANIMATION
   * Animates upcoming tour cards smoothly using GSAP
   */
  function initTourCardsAnimations(hasGSAP) {
    const cards = document.querySelectorAll('.home-tour-card, .home-card-tour-2');
    if (cards.length === 0) return;

    if (hasGSAP) {
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1, // Premium delay between cards
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.tours-2', // Trigger when section is in view
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    } else {
      // Fallback
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
      });
    }
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
   * Effect: Fade In + Slight Slide Up
   */
  function initOptimizedTextReveal(selector, hasGSAP) {
    const element = document.querySelector(selector);
    if (!element) return;

    // Ensure initial state
    if (hasGSAP) {
      // Use will-change to hint the browser for optimization
      element.style.willChange = 'transform, opacity';

      gsap.fromTo(element, 
        { 
          opacity: 0, 
          y: 30, // Reduced from 50 for a smoother feel
        },
        {
          opacity: 1,
          y: 0,
          ease: 'power1.out', // Slightly smoother than 'none' even with scrub
          scrollTrigger: {
            trigger: element,
            start: 'top 92%', // Slightly later start
            end: 'top 60%', // Finishes earlier
            scrub: 1, // Increased scrub for more fluidity
            onLeave: () => {
              // Cleanup will-change to free up memory once animation is done
              element.style.willChange = 'auto';
            }
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

  /**
   * 3. OPTIMIZED SERVICES REVEAL (GSAP)
   * Replaces heavy Webflow interactions for CTA button + Arrows
   */
  function initServiceAnimations(hasGSAP) {
    const items = document.querySelectorAll('.service-animate-item');
    if (items.length === 0) return;

    if (hasGSAP) {
      gsap.fromTo(items, 
        { 
          opacity: 0, 
          y: 20 
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: items[0], 
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    } else {
      // Fallback
      items.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }
  }

})();
