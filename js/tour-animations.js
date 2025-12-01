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
      initDescriptionTitleReveal();
      initDescriptionTextReveal();
      initDescriptionImageReveal();
    }, 100);
  }

  /**
   * Initialize description title letter-by-letter reveal - VISIBLE AND SLOW
   * DRAMATICALLY increased timing and effects for visibility
   */
  function initDescriptionTitleReveal() {
    const descriptionTitle = document.querySelector('.div-block-131 h1.h-5');
    
    if (!descriptionTitle) {
      console.warn('Description title not found');
      return;
    }

    const titleText = descriptionTitle.textContent.trim();
    
    if (!titleText || titleText.length === 0) {
      console.warn('Description title is empty');
      return;
    }
    
    console.log(`🎨 Splitting description title: "${titleText}"`);
    
    // Clear the element
    descriptionTitle.innerHTML = '';
    
    // Split text into letters and wrap each in a span
    const letters = titleText.split('');
    
    letters.forEach((letter, index) => {
      const span = document.createElement('span');
      span.className = 'letter';
      
      // Preserve spaces and special characters
      if (letter === ' ') {
        span.innerHTML = '&nbsp;';
        span.style.marginRight = '0.3em';
      } else {
        span.textContent = letter;
      }
      
      descriptionTitle.appendChild(span);
    });

    // Check if GSAP is available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('⚠️ GSAP not loaded, showing title immediately');
      const letterSpans = descriptionTitle.querySelectorAll('.letter');
      letterSpans.forEach(span => {
        span.style.opacity = '1';
        span.style.clipPath = 'inset(0 0 0% 0)';
        span.style.transform = 'translateY(0) scale(1)';
        span.style.filter = 'blur(0)';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Get all letter spans
    const letterSpans = descriptionTitle.querySelectorAll('.letter');

    console.log(`✅ Creating SLOW letter-by-letter animation for ${letterSpans.length} letters`);

    // Create staggered scroll-synced animation for each letter
    // MUCH SLOWER and MORE VISIBLE
    letterSpans.forEach((letter, index) => {
      gsap.to(letter, {
        opacity: 1,
        clipPath: 'inset(0 0 0% 0)',
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        delay: 0.05, // Added 50ms latency
        scrollTrigger: {
          trigger: descriptionTitle,
          start: `top 65%-=${index * 5}px`,  // Start when well visible
          end: 'top 35%',
          scrub: 2.5,
          markers: false,
          onUpdate: (self) => {
            if (index === 0) {
              console.log(`📊 Title reveal progress: ${(self.progress * 100).toFixed(0)}%`);
            }
          }
        }
      });
    });

    console.log(`🎭 Title animation ready - SLOW reveal with ${(letterSpans.length * 5)}px wave`);
  }

  /**
   * Initialize description paragraph VISIBLE scroll-synced reveals
   * DRAMATICALLY slower and more noticeable
   */
  function initDescriptionTextReveal() {
    // Check if GSAP is available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP not loaded for paragraph reveals');
      revealDescriptionTextFallback();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Get all description paragraphs
    const descriptionParagraphs = document.querySelectorAll('.div-block-131 p.h-5');
    
    if (descriptionParagraphs.length === 0) {
      console.warn('No description paragraphs found');
      return;
    }

    console.log(`📝 Setting up SLOW reveal for ${descriptionParagraphs.length} paragraphs`);

    // Animate each paragraph with SLOW scroll-sync
    descriptionParagraphs.forEach((paragraph, index) => {
      gsap.to(paragraph, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        ease: 'power2.out',
        delay: 0.05, // Added 50ms latency
        scrollTrigger: {
          trigger: paragraph,
          start: 'top 65%',              // Start when well visible  
          end: 'top 40%',
          scrub: 3,
          markers: false,
          onEnter: () => console.log(`📄 Revealing paragraph ${index + 1}`),
          onLeave: () => console.log(`📄 Paragraph ${index + 1} fully visible`),
        }
      });
    });

    console.log(`✅ Paragraphs configured with SLOW 5s scrub`);
  }

  /**
   * Fallback for description text reveal
   */
  function revealDescriptionTextFallback() {
    const paragraphs = document.querySelectorAll('.div-block-131 p.h-5');
    
    paragraphs.forEach((paragraph, index) => {
      setTimeout(() => {
        paragraph.style.opacity = '1';
        paragraph.style.transform = 'translateY(0)';
        paragraph.style.filter = 'blur(0)';
      }, index * 200);
    });
  }

  /**
   * Initialize description image curtain reveal - OVERLAY rises up
   * Curtain overlay with subtle color that rises revealing the image
   */
  function initDescriptionImageReveal() {
    const curtainOverlay = document.querySelector('.image-curtain-overlay');
    
    if (!curtainOverlay) {
      console.warn('Curtain overlay (.image-curtain-overlay) not found');
      return;
    }

    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded for curtain reveal');
      // Fallback - just hide the curtain
      curtainOverlay.style.transform = 'translateY(-100%)';
      return;
    }

    console.log('🎬 Initializing image curtain reveal (rises up from bottom)');

    gsap.registerPlugin(ScrollTrigger);

    // Animate curtain rising up to reveal image
    gsap.to(curtainOverlay, {
      y: '-100%',  // Rise up completely off the image
      ease: 'power2.inOut',
      delay: 0.05, // Added 50ms latency
      scrollTrigger: {
        trigger: curtainOverlay,
        start: 'top 70%',          // Start when element is well visible
        end: 'center 40%',         // Complete when centered
        scrub: 2.5,                // Smooth balanced speed
        markers: false,
        onEnter: () => console.log('🎭 Curtain starting to rise'),
        onUpdate: (self) => {
          if (self.progress > 0.1 && self.progress < 0.9) {
            console.log(`📊 Curtain reveal: ${(self.progress * 100).toFixed(0)}%`);
          }
        },
        onComplete: () => console.log('✅ Image fully revealed')
      }
    });

    console.log('✅ Curtain reveal configured');

    // Add Parallax Effect to the WRAPPER (moves image + curtain together)
    const parallaxWrapper = document.querySelector('.parallax-wrapper');
    if (parallaxWrapper) {
      // Ensure initial state matches CSS
      gsap.set(parallaxWrapper, { yPercent: -10 });
      
      gsap.to(parallaxWrapper, {
        yPercent: 10,    // Move down to +10%
        ease: 'none',
        scrollTrigger: {
          trigger: curtainOverlay.parentElement.parentElement, // Use the mask container
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
      console.log('✅ Parallax wrapper configured (yPercent: -10 to 10)');
    }
  }

  /**
   * Initialize image scroll zoom animation using GSAP ScrollTrigger
   */
  function initImageScrollZoom() {
    const zoomImages = document.querySelectorAll('.scroll-zoom-image');
    
    if (zoomImages.length === 0) {
      console.warn('No scroll-zoom-image elements found');
      return;
    }

    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded');
      return;
    }

    console.log(`Initializing scroll zoom for ${zoomImages.length} images`);

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Apply scroll zoom effect to each image
    zoomImages.forEach((image, index) => {
      gsap.to(image, {
        width: '100vw',
        ease: 'none',
        scrollTrigger: {
          trigger: image,
          start: 'top bottom',      // Start when image enters viewport
          end: 'bottom center',      // End when image center reaches viewport center
          scrub: 1,                  // Smooth scrubbing (1 second lag)
          markers: false             // Set to true for debugging
        }
      });
      console.log(`✅ Scroll zoom configured for image ${index + 1}`);
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
