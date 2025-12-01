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

    
    // Add small delay to ensure all styles are loaded
    setTimeout(() => {
      initTitleLetterReveal();
      initScrollReveal();
      initImageScrollZoom();
      initDescriptionTitleReveal();
      initDescriptionTextReveal();
      initCurtainReveals();
      initMediumParallax();
      initFeatureListReveal();
      initFAQReveal();
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

  }

  /**
   * Initialize description paragraph VISIBLE scroll-synced reveals
   * DRAMATICALLY slower and more noticeable
   */
  function initDescriptionTextReveal() {
    // Check if GSAP is available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
     
      revealDescriptionTextFallback();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Get all description paragraphs
    const descriptionParagraphs = document.querySelectorAll('.div-block-131 p.h-5');
    
    if (descriptionParagraphs.length === 0) {
    
      return;
    }

   

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
      
     
    });
  }

  /**
   * Initialize medium parallax image and text reveal
   * Image moves slower than scroll (parallax)
   * Text reveals with slide-up and fade-in
   */
  function initMediumParallax() {
    const mediumImage = document.querySelector('.parallax-image-medium');
    const textSection = document.querySelector('.short-message-animated-scroll');

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ========================================================
    // CONFIGURACIÓN DE DISTANCIAS (en Píxeles)
    // Modifica estos valores para ajustar la distancia del movimiento
    // ========================================================
    const imageStartY = -250; // Imagen empieza 150px ARRIBA (y baja a 0)
    const textStartY = 350;   // Texto empieza 100px ABAJO (y sube a 0) -> SENTIDO CONTRARIO
    
    // 1. Image Parallax (Downward movement: -px -> 0)
    if (mediumImage) {
      gsap.fromTo(mediumImage, 
        { y: imageStartY }, // Usa píxeles en lugar de porcentaje
        {
          y: 0,
          ease: 'power2.in', // Easing suave
          scrollTrigger: {
            trigger: mediumImage,
            start: 'top bottom',
            end: 'bottom top ',
            scrub: 2, // Suavidad ajustada
            markers: false
          }
        }
      );
    }

    // 2. Text Reveal (Upward movement: +px -> 0)
    if (textSection) {
      // Set initial state
      gsap.set(textSection, { 
        y: textStartY, 
        opacity: 0 
      });

      gsap.to(textSection, {
        y: 0,
        opacity: 1,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: textSection,
          start: 'top bottom',
          end: 'bottom top',    
          scrub: 2.5,          
          markers: false
        }
      });
    }
  }

  /**
   * Initialize feature list staggered reveal (Apple Style)
   * Targets .div-block-40 (container) and .div-block-41 (items)
   */
  function initFeatureListReveal() {
    const featureLists = document.querySelectorAll('.div-block-40');

    if (featureLists.length === 0) return;

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Fallback: ensure visible if GSAP missing
      const items = document.querySelectorAll('.div-block-41');
      items.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    featureLists.forEach(list => {
      const items = list.querySelectorAll('.div-block-41');
      
      
      if (items.length === 0) return;

      // Set initial state
      gsap.set(items, { 
        opacity: 0, 
        y: 60, 
        scale: 0.95,
        filter: 'blur(10px)'
      });

      // Animate
      gsap.to(items, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.7,
        stagger: 0.2,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: list,
          start: 'top center',
          toggleActions: 'restart none none none' // Restart animation every time it enters viewport
        }
      });
    });
  }

  /**
   * Initialize FAQ staggered reveal (Apple Style)
   * Targets .div-block-136 (container) and .accordion-item-wrapper.v2 (items)
   */
  function initFAQReveal() {
    const faqContainers = document.querySelectorAll('.div-block-136');

    if (faqContainers.length === 0) return;

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Fallback: ensure visible if GSAP missing
      const items = document.querySelectorAll('.accordion-item-wrapper.v2');
      items.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    faqContainers.forEach(container => {
      const items = container.querySelectorAll('.accordion-item-wrapper.v2');
      
      if (items.length === 0) return;

      // Set initial state
      gsap.set(items, { 
        opacity: 0, 
        x: 50, 
        scale: 0.92,
        filter: 'blur(15px)'
      });

      // Animate
      gsap.to(items, {
        opacity: 1,
        x: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1,
        stagger: 0.25, // Slightly slower cascade for FAQs
        ease: 'power2.in',
        scrollTrigger: {
          trigger: container,
          start: 'top 10%',
          end: 'center center',
          markers: true,
          toggleActions: 'restart none none none' // Restart animation every time it enters viewport
        }
      });
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


    
    // Debug: Log which images were found


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
