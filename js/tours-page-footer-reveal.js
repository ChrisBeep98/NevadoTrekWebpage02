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
    footerPlaceholder.style.zIndex = '-1'; // Behind main content
    
    mainContainer.style.position = 'relative';
    mainContainer.style.zIndex = '10';
    mainContainer.style.backgroundColor = '#fff'; // Ensure opaque
    mainContainer.style.width = '100%';

    // Function to update margin based on footer height
    const updateMargin = () => {
      const footerHeight = footerPlaceholder.offsetHeight;
      mainContainer.style.marginBottom = footerHeight + 'px';
    };

    // Initial update
    setTimeout(updateMargin, 100);

    // Update on resize
    window.addEventListener('resize', updateMargin);
    
    // Use ResizeObserver for more robust height tracking
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(entries => {
        updateMargin();
      });
      ro.observe(footerPlaceholder);
    }
    
    // TOC & Mobile CTA Hiding Logic (Prevent overlap)
    const tocElement = document.querySelector('.index') || document.querySelector('.div-block-142');
    const mobileCta = document.querySelector('.mobile-fixed-cta-container');
    
    if (tocElement || mobileCta) {
      window.addEventListener('scroll', () => {
         const mainRect = mainContainer.getBoundingClientRect();
         const windowHeight = window.innerHeight;
         
         const footerVisibleHeight = windowHeight - mainRect.bottom;
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
      });
    }

    // Initialize Footer Content Animation
    initFooterContentAnimation();
  }

  function initFooterContentAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const footer = document.getElementById('footer-placeholder');
    if (!footer) return;

    // Define hierarchies based on new Antigravity structure
    const topRowItems = footer.querySelectorAll('.footer_top-row > *');
    const giantText = footer.querySelector('.footer_giant-text');
    const bottomRowItems = footer.querySelectorAll('.footer_bottom-row > *');

    // Initial state
    gsap.set([topRowItems, giantText, bottomRowItems], { 
      opacity: 0, 
      y: 50,
      scale: 0.98,
      filter: 'blur(10px)'
    });

    const mainContainer = document.getElementById('tours-page-container') || document.body;

    ScrollTrigger.create({
      trigger: mainContainer,
      start: "bottom 95%", 
      onEnter: () => {
        const tl = gsap.timeline({
          defaults: {
            duration: 1.2,
            ease: "power4.out",
            overwrite: true
          }
        });

        tl.to(topRowItems, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', stagger: 0.1 }, 0)
          .to(giantText, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }, 0.2)
          .to(bottomRowItems, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', stagger: 0.1 }, 0.4);
      },
      onLeaveBack: () => {
        gsap.to([topRowItems, giantText, bottomRowItems], {
          opacity: 0,
          y: 50,
          scale: 0.98,
          filter: 'blur(10px)',
          duration: 0.8,
          ease: "power2.inOut",
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
