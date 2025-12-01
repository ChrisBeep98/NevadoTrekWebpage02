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
      initCurtainReveals();
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

    console.log(`✅ Creating OPTIMIZED letter-by-letter animation for ${letterSpans.length} letters`);

    // ⚡ OPTIMIZACIÓN: Un solo ScrollTrigger para todas las letras
    // En lugar de crear un ScrollTrigger por letra (muy costoso)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: descriptionTitle,
        start: 'top 70%',
        end: 'top 30%',
        scrub: 1.5,  // Reducido para mejor performance
        markers: false
      }
    });

    // Anima todas las letras en un solo timeline con stagger
    tl.to(letterSpans, {
      opacity: 1,
      clipPath: 'inset(0 0 0% 0)',
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      ease: 'power2.out',
      stagger: 0.02,  // Delay entre letras (más eficiente que ScrollTriggers individuales)
      duration: 0.6
    });

    console.log(`🚀 Optimized title animation - 1 ScrollTrigger for ${letterSpans.length} letters`);
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

    console.log(`📝 Setting up optimized reveal for ${descriptionParagraphs.length} paragraphs`);

    // Animate each paragraph - OPTIMIZADO con blur + slide desde abajo
    descriptionParagraphs.forEach((paragraph, index) => {
      gsap.to(paragraph, {
        opacity: 1,
        y: 0,                    // Desde translateY(80px) → 0
        filter: 'blur(0px)',     // Desde blur(10px) → 0
        ease: 'power2.in',
        duration: .8,           // Duración para que sea más visible
        scrollTrigger: {
          trigger: paragraph,
          start: 'top center',      // Empieza un poco antes para mejor visibilidad
          end: 'bottom center',        // Termina más arriba
          scrub: 1,
          markers: false
        }
      });
    });

    console.log(`✅ Paragraphs optimized with blur + Y slide animation`);
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
   * Initialize curtain reveal for ALL images with the curtain structure
   * Iterates through all .image-parallax-mask containers to apply effects
   */
  function initCurtainReveals() {
    const masks = document.querySelectorAll('.image-parallax-mask');
    
    if (masks.length === 0) {
      console.warn('No curtain reveal masks found');
      return;
    }

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Fallback: hide all curtains
      masks.forEach(mask => {
        const curtain = mask.querySelector('.image-curtain-overlay');
        if (curtain) curtain.style.transform = 'translateY(-100%)';
      });
      return;
    }

    console.log(`🎬 Initializing curtain reveal for ${masks.length} images`);
    gsap.registerPlugin(ScrollTrigger);

    // Configuration for each curtain based on ID
    const curtainConfigs = {
      'mini-curtain-1': {
        start: 'top 75%',
        end: 'center 45%',
        scrub: 2.5
      },
      'mini-curtain-2': {
        start: 'top center',
        end: 'bottom top',
        scrub: 3.5
      }
    };

    masks.forEach((mask, index) => {
      const curtain = mask.querySelector('.image-curtain-overlay');
      const wrapper = mask.querySelector('.parallax-wrapper');
      
      if (!curtain || !wrapper) return;

      // Get config for this mask or use default
      const config = curtainConfigs[mask.id] || {
        start: 'top 75%',
        end: 'center 45%',
        scrub: 2.5
      };

      // 1. Animate Curtain (Rise up)
      gsap.to(curtain, {
        y: '-100%',
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: mask, // Trigger based on the container
          start: config.start,
          end: config.end,
          scrub: config.scrub,
          markers: false
        }
      });

      // 2. Animate Parallax (Move image)
      // Ensure initial state
      gsap.set(wrapper, { yPercent: -10 });
      
      gsap.to(wrapper, {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: mask,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
      
      console.log(`  ✅ Curtain #${index + 1} (${mask.id || 'unknown'}) configured: ${config.start} -> ${config.end}`);
    });
  }

  /**
   * Initialize image scroll zoom animation using GSAP ScrollTrigger
   * Configurations separated for easy editing
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
    
    // Debug: Log which images were found
    zoomImages.forEach((img, i) => {
      console.log(`  Image ${i + 1}: id="${img.id}", classes="${img.className}"`);
    });

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // ====================================
    // CONFIGURACIÓN PARA CADA IMAGEN
    // Edita estos valores para controlar el zoom
    // ====================================
    const imageConfigs = {
      'main-tour-image': {
        start: 'top bottom',      // Cuándo empieza
        end: 'center center',     // Cuándo termina
        scrub: 0.5                // Suavidad (menor = más responsive)
      },
      'fullscreen-img2': {
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 0.5
      },
      'big-image-03': {
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 0.5
      }
    };

    // Apply scroll zoom effect to each image
    zoomImages.forEach((image, index) => {
      // Get configuration for this image (or use default)
      const config = imageConfigs[image.id] || {
        start: 'top bottom',
        end: 'center center',
        scrub: 0.5
      };
      
      gsap.to(image, {
        width: '100vw',
        ease: 'none',
        scrollTrigger: {
          trigger: image,
          start: config.start,
          end: config.end,
          scrub: config.scrub,
          markers: false  // Cambia a true para debugging
        }
      });
      
      console.log(`✅ Zoom configured for #${image.id}: ${config.start} → ${config.end} (scrub: ${config.scrub})`);
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
