/**
 * Index Page Footer Reveal & Component Init
 * Handles the "Curtain" effect for the footer on the index page
 * Adapted from tours-page-footer-reveal.js to work without #tours-page-container
 */

(function() {
  // Listen for component load to initialize footer logic
  window.addEventListener('componentLoaded', function(e) {
    if (e.detail.id === 'footer-placeholder') {
      initFooterReveal();
    }
  });

  function initFooterReveal() {
    // For index.html, we use .body as the main container wrapper
    // Look for the main content wrapper - could be .body, .main, or just use the body
    const mainContainer = document.querySelector('.body') || 
                          document.querySelector('main') || 
                          document.querySelector('#main-content-wrapper') ||
                          document.body;
                          
    const footerPlaceholder = document.getElementById('footer-placeholder');
    
    if (!footerPlaceholder) {
      console.warn('Footer placeholder not found');
      return;
    }

    // Force styles for fixed footer
    footerPlaceholder.style.position = 'fixed';
    footerPlaceholder.style.bottom = '0';
    footerPlaceholder.style.left = '0';
    footerPlaceholder.style.width = '100%';
    footerPlaceholder.style.zIndex = '0'; // Behind main content but positive
    
    // Create a spacer element if we're using body as container
    // This ensures the page scrolls enough to reveal the footer
    let spacer = document.getElementById('footer-spacer');
    if (!spacer) {
      spacer = document.createElement('div');
      spacer.id = 'footer-spacer';
      spacer.style.height = '0';
      spacer.style.pointerEvents = 'none';
      document.body.appendChild(spacer);
    }

    // Function to update spacer height based on footer height
    const updateSpacer = () => {
      const footerHeight = footerPlaceholder.offsetHeight;
      spacer.style.height = footerHeight + 'px';
    };

    // Initial update
    setTimeout(updateSpacer, 100);

    // Update on resize
    window.addEventListener('resize', updateSpacer);
    
    // Use ResizeObserver for more robust height tracking
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(entries => {
        updateSpacer();
      });
      ro.observe(footerPlaceholder);
    }
    
    // TOC & Mobile CTA Hiding Logic (Prevent overlap)
    const tocElement = document.querySelector('.index') || document.querySelector('.div-block-142');
    const mobileCta = document.querySelector('.mobile-fixed-cta-container');
    
    if (tocElement || mobileCta) {
      window.addEventListener('scroll', () => {
         const spacerRect = spacer.getBoundingClientRect();
         const windowHeight = window.innerHeight;
         
         // Footer becomes visible when spacer enters view from bottom
         const footerVisibleHeight = windowHeight - spacerRect.top;
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
    initFooterContentAnimation(spacer);
  }

  function initFooterContentAnimation(triggerElement) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Fallback: Just show everything if GSAP isn't available
      const footer = document.getElementById('footer-placeholder');
      if (footer) {
        footer.querySelectorAll('[style*="opacity: 0"]').forEach(el => {
          el.style.opacity = '1';
        });
        const giantText = footer.querySelector('.footer_giant-text');
        if (giantText) giantText.style.opacity = '1';
      }
      return;
    }

    const footer = document.getElementById('footer-placeholder');
    if (!footer) return;

    const giantText = footer.querySelector('.footer_giant-text');
    if (!giantText) return;

    // 1. Split text into spans for clean character control
    if (!giantText.querySelector('.parallax-char')) {
      const text = giantText.textContent.trim();
      giantText.innerHTML = text.split('').map(char => 
        `<span class="parallax-char">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');
    }

    const topRowItems = footer.querySelectorAll('.footer_top-row > *');
    const bottomRowItems = footer.querySelectorAll('.footer_bottom-row > *');
    const allChars = giantText.querySelectorAll('.parallax-char');

    // 2. Initial state - Using yPercent for displacement
    gsap.set([topRowItems, bottomRowItems], { yPercent: 40 });
    gsap.set(allChars, { yPercent: 50, opacity: 0 });

    // 3. Reveal Animation when trigger enters viewport
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 95%",
      once: true,
      onEnter: () => {
        // Reveal rows (using yPercent)
        gsap.to(topRowItems, { opacity: 1, yPercent: 0, duration: 1, stagger: 0.1, ease: "power2.out" });
        gsap.to(bottomRowItems, { opacity: 1, yPercent: 0, duration: 1, stagger: 0.1, ease: "power2.out", delay: 0.4 });
        
        // Character Reveal (using yPercent)
        gsap.set(giantText, { opacity: 1 });
        gsap.to(allChars, { 
          opacity: 1, 
          yPercent: 0, 
          duration: 1.2, 
          stagger: 0.02,
          ease: "expo.out"
        });
      }
    });

    // 4. Parallax for "REK" letters
    if (allChars.length >= 3) {
      const isMobile = window.innerWidth < 768;
      const multiplier = isMobile ? 0.35 : 1;

      const charsArray = Array.from(allChars);
      const charR = charsArray[charsArray.length - 3];
      const charE = charsArray[charsArray.length - 2];
      const charK = charsArray[charsArray.length - 1];
      const otherChars = charsArray.slice(0, -3);

      gsap.to(otherChars, {
        y: -25 * multiplier,
        force3D: true,
        ease: "none",
        scrollTrigger: {
          trigger: triggerElement,
          start: "top bottom",
          end: "bottom top", 
          scrub: 1.2
        }
      });

      gsap.to(charE, {
        y: -80 * multiplier,
        force3D: true,
        ease: "none",
        scrollTrigger: {
          trigger: triggerElement,
          start: "top bottom",
          end: "bottom top", 
          scrub: 1.2
        }
      });

      gsap.to([charR, charK], {
        y: -40 * multiplier,
        force3D: true,
        ease: "none",
        scrollTrigger: {
          trigger: triggerElement,
          start: "top bottom",
          end: "bottom top", 
          scrub: 1.3
        }
      });
    }
  }
})();
