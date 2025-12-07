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
    // Check if data is already loaded using flag from tour-loader.js
    if (window.tourDataLoaded) {
      startAnimations();
    } else {
      // Wait for the custom event
      window.addEventListener('tourDataReady', startAnimations);
      
      // Fallback: if event never fires (e.g. static HTML or error), force start after delay
      setTimeout(() => {
        // Only run if not already started
        if (!document.body.classList.contains('animations-started')) {
          console.warn('⚠️ Tour data event timeout - forcing animations');
          startAnimations();
        }
      }, 3000);
    }
  }

  function startAnimations() {
    if (document.body.classList.contains('animations-started')) return;
    document.body.classList.add('animations-started');

    // Add small delay to ensure rendering is completely finished
    setTimeout(() => {
      initFloatingNavbar(); // Floating pill navbar effect
      initMobileMenu(); // Mobile menu toggle
      initTitleLetterReveal();
      initScrollReveal();
      initImageScrollZoom();
      initDescriptionTitleReveal();
      initDescriptionTextReveal();
      initCurtainReveals();
      initMediumParallax();
      initFeatureListReveal();
      initFAQReveal();
      initLanguageSwitcher(); // Language dropdown
    }, 50);
  }

  /**
   * MOBILE MENU TOGGLE
   * Opens/closes the mobile menu overlay when hamburger is clicked
   */
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle-exclusion');
    const menu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('mobile-menu-close');
    
    if (!toggle || !menu) {
      console.log('Mobile menu elements not found (normal on desktop)');
      return;
    }
    
    const links = menu.querySelectorAll('.mobile-nav-link');
    
    // Open menu on hamburger click
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      menu.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    });
    
    // Close menu function
    const closeMenu = () => {
      menu.classList.remove('active');
      document.body.style.overflow = ''; // Restore scroll
    };
    
    // Close on X button click
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }
    
    // Close on link click (for smooth navigation)
    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  /**
   * FLOATING PILL NAVBAR
   * Transforms the full-width navbar into a floating pill when scrolling down
   */
  function initFloatingNavbar() {
    const navbar = document.getElementById('navbar-exclusion');
    if (!navbar) {
      console.warn('Navbar element not found');
      return;
    }

    const SCROLL_THRESHOLD = 80; // Pixels to scroll before activating
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

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial check in case page loads already scrolled
    updateNavbar();
  }

  /**
   * LANGUAGE SWITCHER
   * Handles the language dropdown interaction
   */
  function initLanguageSwitcher() {
    const langBtn = document.getElementById('lang-btn');
    const langOptions = document.getElementById('lang-options');
    const currentLang = document.getElementById('current-lang');
    const currentFlag = document.getElementById('current-flag');
    
    if (!langBtn || !langOptions) return;
    
    const langDropdown = langBtn.closest('.lang-dropdown');
    
    // Toggle dropdown on button click
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('open');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      langDropdown.classList.remove('open');
    });
    
    // Handle language selection
    langOptions.querySelectorAll('.lang-option').forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const lang = option.dataset.lang;
        const flag = option.dataset.flag;
        
        currentLang.textContent = lang.toUpperCase();
        currentFlag.src = flag;
        
        // Store language preference
        localStorage.setItem('nevado_lang', lang);
        
        // Close dropdown
        langDropdown.classList.remove('open');
        
        // Trigger language change event (for i18n system)
        window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
      });
    });
    
    // Restore saved language on load
    const savedLang = localStorage.getItem('nevado_lang') || 'es';
    const savedOption = langOptions.querySelector(`[data-lang="${savedLang}"]`);
    if (savedOption) {
      currentLang.textContent = savedLang.toUpperCase();
      currentFlag.src = savedOption.dataset.flag;
    }
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
        start: 'top 85%',
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
          start: 'top 90%',      // Activates early
          toggleActions: 'play none none reverse', // Snap animation
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
        start: 'top 85%',
        end: 'top 20%', // Extended duration (slower)
        scrub: 1.2 // Smoother
      },
      'mini-curtain-2': {
        start: 'top 85%',
        end: 'top 30%', // Extended duration
        scrub: 1.2
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
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textSection,
          start: 'top 90%',
          toggleActions: 'play none none reverse', // Snappy pop effect
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
          start: 'top 90%',
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
          start: 'top 85%',
          end: 'center center',
          markers: false,
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
    
    // Reveal the parent element now that letters are about to be created
    titleElement.style.opacity = '1'; /* Critical: Make parent visible so children can be seen */
    
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

  /**
   * Mobile Menu Logic (Refactored)
   */
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle-exclusion');
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.mobile-nav-link');
    
    if (!toggle || !menu) return;

    let isOpen = false;

    // Toggle function
    function toggleMenu() {
      isOpen = !isOpen;
      
      if (isOpen) {
        menu.classList.add('active');
        // We allow body scroll if the user wants to see the rest of the page?
        // User said "slide in from top... 70% vh". usually you lock scroll.
        document.body.style.overflow = 'hidden'; 
      } else {
        menu.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close on link click
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (isOpen) toggleMenu();
      });
    });
    
    // Close on click outside
    document.addEventListener('click', (e) => {
      if (isOpen && !menu.contains(e.target) && !toggle.contains(e.target)) {
        toggleMenu(); 
      }
    });

    // Handle Close Button (X)
    const closeBtn = document.getElementById('mobile-menu-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      });
    }

    // Initialize Price in Fixed Footer
    updateMobileFixedPrice();
  }

  /**
   * Updates the fixed mobile footer with the minimum price found
   */
  function updateMobileFixedPrice() {
    const priceElement = document.getElementById('mobile-fixed-price');
    if (!priceElement) return;

    // Helper to format price
    const formatPrice = (amount) => {
      const currentLang = localStorage.getItem('nevado_lang') || 'es';
      const currency = currentLang === 'en' ? 'USD' : 'COP';
      
      // If USD, conversion logic might be needed if amount is in COP
      // But assuming amount is raw from pricingTiers (usually has both priceCOP and priceUSD)
      // To keep it simple based on current 'amount' variable usage (which was priceCOP):
      // We'll stick to COP for now if 'amount' is passed as priceCOP.
      // Ideally, we should fetch the correct currency value from the tier object.
      
      // Since the logic below passes targetTier.priceCOP, we should display COP.
      // Unless we want to support multi-currency fully. 
      // User request: "ponle cop o usd depende del lenguaje".
      // So I need to use the correct price field from the tier!
      
      return new Intl.NumberFormat(currentLang === 'en' ? 'en-US' : 'es-CO', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
      }).format(amount) + ` ${currency}`; // Explicitly append code if format doesn't
    };

    // Function to try setting the price
    const trySetPrice = () => {
        if (typeof window.tourData !== 'undefined' && window.tourData?.pricingTiers) {
            let targetTier = window.tourData.pricingTiers.find(t => t.minSize === 4 && t.maxSize === 8);
            
            if (!targetTier) {
                targetTier = window.tourData.pricingTiers.reduce((min, t) => 
                    t.priceCOP < min.priceCOP ? t : min
                , window.tourData.pricingTiers[0]);
            }

            if (targetTier) {
                // Determine value based on language
                const currentLang = localStorage.getItem('nevado_lang') || 'es';
                const value = currentLang === 'en' ? targetTier.priceUSD : targetTier.priceCOP;
                
                // Format
                const currency = currentLang === 'en' ? 'USD' : 'COP';
                const locale = currentLang === 'en' ? 'en-US' : 'es-CO';
                
                // Format manually to ensure "COP" or "USD" appends correctly if desired
                const formatted = new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: currency,
                    maximumFractionDigits: 0
                }).format(value);
                
                // User said "ponle cop o usd". Often symbols ($) are enough, but explicit code is requested.
                // Standard Intl with 'currencyDisplay: "code"' gives "COP 54.000"
                // Let's try to match: "$ 54.000 COP" style
                
                priceElement.textContent = `${formatted} ${currency}`;
                return true; 
            }
        }
        return false; 
    };

    // Attempt 1: Immediate
    if (trySetPrice()) return;

    // Attempt 2: Listen for event if not ready
    window.addEventListener('tourDataReady', () => {
        trySetPrice();
    });

    // Attempt 3: Polling fallback (robustness for network delays)
    // Poll every 500ms for 10 seconds
    const interval = setInterval(() => {
        if (trySetPrice()) {
            clearInterval(interval);
        }
    }, 500);

    setTimeout(() => clearInterval(interval), 10000);

    // Listen for language changes to update price dynamically
    window.addEventListener('languageChange', () => {
        trySetPrice();
    });
  }

  // Initialize Mobile Menu
  initMobileMenu();

})();
