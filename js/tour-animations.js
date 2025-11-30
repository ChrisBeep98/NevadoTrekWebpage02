/* ===================================
   TOUR PAGE HERO ANIMATIONS SCRIPT
   Letter reveal with arch mask + On-scroll reveals
   =================================== */

(function () {
  'use strict';

  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('Tour animations initializing...');
    
    // Add small delay to ensure all styles are loaded
    setTimeout(() => {
      initTitleLetterReveal();
      initScrollReveal();
      initImageScrollZoom();
    }, 100);
  }

  /**
   * Initialize image scroll zoom animation using GSAP ScrollTrigger
   */
  function initImageScrollZoom() {
    const mainImage = document.querySelector('#main-tour-image');
    
    if (!mainImage) {
      console.warn('Main tour image not found');
      return;
    }

    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded');
      return;
    }

    console.log('Initializing image scroll zoom');

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Create smooth scroll animation from 70vw to 100vw
    gsap.to(mainImage, {
      width: '100vw',
      ease: 'none',
     scrollTrigger: {
        trigger: mainImage,
        start: 'top bottom',      // Start when image enters viewport
        end: 'center center',      // End when image center reaches viewport center
        scrub: 1,                  // Smooth scrubbing (1 second lag)
        markers: false             // Set to true for debugging
      }
    });
  }

  /**
   * Split title into individual letters and wrap each in a span
   */
  function initTitleLetterReveal() {
    const titleElement = document.querySelector('.h-1');
    
    if (!titleElement) {
      console.warn('Title element .h-1 not found');
      return;
    }

    const titleText = titleElement.textContent.trim();
    
    if (!titleText || titleText.length === 0) {
      console.warn('Title element is empty');
      return;
    }
    
    console.log(`Splitting title: "${titleText}" into letters`);
    
    // Clear the element
    titleElement.innerHTML = '';
    
    // Split text into letters and wrap each in a span
    const letters = titleText.split('');
    
    letters.forEach((letter, index) => {
      const span = document.createElement('span');
      span.className = 'letter';
      
      // Preserve spaces
      if (letter === ' ') {
        span.innerHTML = '&nbsp;';
        span.style.marginRight = '0.3em';
      } else {
        span.textContent = letter;
      }
      
      // Stagger animation delay (35ms per letter for smooth premium wave effect)
      // Longer delay works better with the 1s animation duration
      span.style.animationDelay = `${index * 35}ms`;
      
      titleElement.appendChild(span);
    });
  }

  /**
   * Initialize Intersection Observer for scroll-triggered reveals
   */
  function initScrollReveal() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported, revealing all elements immediately');
      revealAllElements();
      return;
    }

    // Observer options
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px 0px -10% 0px', // Trigger slightly before element is fully in view
      threshold: 0.15 // Trigger when 15% of element is visible
    };

    // Create observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add reveal class with slight delay to ensure smooth animation
          setTimeout(() => {
            entry.target.classList.add('reveal');
          }, 50);
          
          // Stop observing this element
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Elements to observe
    const elementsToReveal = [
      ...document.querySelectorAll('.tour-subtitle'),
      ...document.querySelectorAll('.chip-tour-info-wrapper')
    ];

    // Start observing
    elementsToReveal.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * Fallback: Reveal all elements immediately if IntersectionObserver not supported
   */
  function revealAllElements() {
    const elements = [
      ...document.querySelectorAll('.tour-subtitle'),
      ...document.querySelectorAll('.chip-tour-info-wrapper')
    ];

    elements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 100);
    });
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
