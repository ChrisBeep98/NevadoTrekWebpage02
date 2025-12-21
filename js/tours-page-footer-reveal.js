/**
 * Tours Page Footer Reveal & Component Init
 * Handles the "Curtain" effect for the footer and re-initializes animations
 */

(function() {
  // Listen for component load to initialize footer logic
  window.addEventListener('componentLoaded', function(e) {
    if (e.detail.id === 'footer-placeholder') {
      initFooterReveal();
      // Re-initialize index animations for footer if available
      if (typeof initFooterFinalTextReveal === 'function') {
        initFooterFinalTextReveal(); 
      } else if (window.initIndexAnimations && typeof window.initIndexAnimations.footer === 'function') {
        // Fallback if structured differently
        window.initIndexAnimations.footer();
      } else {
        // Manual check for the specific function from index-animations.js
        // It might be scoped, so we might need to rely on the file running again or 
        // just trust that the CSS handles the specific curtain effect and we handle the overlap here.
        
        // Actually index-animations.js is an IIFE so we can't easily call its internal functions 
        // unless they are exposed.
        // However, the Reveal Text relies on IntersectionObserver which should pick up the new elements
        // IF the script ran after they were added. Since it ran before, we might see issues.
        // We might need to reload index-animations.js or extract the relevant part.
        
        // For now, let's focus on the STRUCTURAL reveal (Curtain effect)
      }
    }
  });

  function initFooterReveal() {
    const mainContainer = document.getElementById('tours-page-container');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    
    if (!mainContainer || !footerPlaceholder) return;

    // Force styles just in case
    footerPlaceholder.style.position = 'fixed';
    footerPlaceholder.style.bottom = '0';
    footerPlaceholder.style.width = '100%';
    footerPlaceholder.style.zIndex = '0'; // Behind main content but positive
    
    mainContainer.style.position = 'relative';
    mainContainer.style.zIndex = '1';
    mainContainer.style.backgroundColor = '#fff'; // Ensure opaque
    mainContainer.style.width = '100%';

    // Function to update margin based on footer height
    let lastFooterHeight = 0;
    const updateMargin = () => {
      const footerHeight = footerPlaceholder.offsetHeight;
      // Debounce small changes (< 2px) to prevent layout thrashing
      if (Math.abs(footerHeight - lastFooterHeight) < 2) return;
      
      lastFooterHeight = footerHeight;
      if (footerHeight > 0) {
        mainContainer.style.marginBottom = footerHeight + 'px';
        // Force refresh to ensure GSAP knows about the new page height
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }
    };

    // Initial update with a bit more buffer for content rendering
    setTimeout(updateMargin, 200);

    // Update on resize (Throttled)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateMargin, 150);
    });
    
    // Use ResizeObserver for more robust height tracking (Debounced)
    if (typeof ResizeObserver !== 'undefined') {
      let roTimeout;
      const ro = new ResizeObserver(entries => {
        clearTimeout(roTimeout);
        roTimeout = setTimeout(updateMargin, 150);
      });
      ro.observe(footerPlaceholder);
    }
    
    // TOC & Mobile CTA Hiding Logic (Prevent overlap) - OPTIMIZED
    const tocElement = document.querySelector('.index') || document.querySelector('.div-block-142');
    const mobileCta = document.querySelector('.mobile-fixed-cta-container');
    
    if (tocElement || mobileCta) {
      let ticking = false;

      const onScroll = () => {
         const mainRect = mainContainer.getBoundingClientRect();
         const windowHeight = window.innerHeight;
         
         const footerVisibleHeight = windowHeight - mainRect.bottom;
         // Hide if more than 50px of footer is visible
         const shouldHide = footerVisibleHeight > 50; 
         
         if (tocElement) {
           tocElement.style.opacity = shouldHide ? '0' : '1';
           tocElement.style.pointerEvents = shouldHide ? 'none' : 'auto';
           tocElement.style.transition = 'opacity 0.3s ease';
         }

         if (mobileCta) {
           mobileCta.style.opacity = shouldHide ? '0' : '1';
           mobileCta.style.pointerEvents = shouldHide ? 'none' : 'auto';
           mobileCta.style.transform = shouldHide ? 'translateY(100%)' : 'translateY(0)';
           mobileCta.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
         }
         
         ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(onScroll);
          ticking = true;
        }
      }, { passive: true });
    }

    // Initialize Footer Content Animation
    initFooterContentAnimation();
  }

  function initFooterContentAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const footer = document.getElementById('footer-placeholder');
    if (!footer) return;

    const giantText = footer.querySelector('.footer_giant-text');
    if (!giantText) return;

    // 1. Split text into spans (Required for CSS gradient styling .parallax-char)
    if (!giantText.querySelector('.parallax-char')) {
      const text = giantText.textContent.trim();
      giantText.innerHTML = text.split('').map(char => 
        `<span class="parallax-char">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');
    }

    const topRowItems = footer.querySelectorAll('.footer_top-row > *');
    const bottomRowItems = footer.querySelectorAll('.footer_bottom-row > *');
    
    // Ensure children are visible so we can animate the parent
    // (Previously we hid them, causing the invisible footer issue)
    const allChars = giantText.querySelectorAll('.parallax-char');
    gsap.set(allChars, { opacity: 1, yPercent: 0, transform: 'none' });

    const mainContainer = document.getElementById('tours-page-container') || document.body;

    // 2. Initial state - Fade everything out slightly
    gsap.set([topRowItems, bottomRowItems], { opacity: 0, y: 30 });
    gsap.set(giantText, { opacity: 0, scale: 0.98 });

    // 3. MINIMALIST REVEAL: Single Trigger
    ScrollTrigger.create({
      trigger: mainContainer,
      start: "bottom 95%", 
      once: true,
      onEnter: () => {
        // Reveal rows
        gsap.to([topRowItems, bottomRowItems], { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            stagger: 0.1, 
            ease: "power2.out",
            overwrite: true
        });
        
        // Reveal Giant Text
        gsap.to(giantText, { 
          opacity: 1, 
          scale: 1,
          duration: 1, 
          ease: "power2.out",
          overwrite: true
        });
      }
    });
  }

  // --- Animation Logic for specific text (Legacy support) ---
  function initFooterFinalTextReveal() {
    // Keep this for consistency if needed by other components, 
    // but the main staggered logic above covers more ground.
  }
})();
