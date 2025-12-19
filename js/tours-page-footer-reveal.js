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

    const giantText = footer.querySelector('.footer_giant-text');
    if (!giantText) return;

    // 1. Split text into spans for clean character control (Silence splitting)
    if (!giantText.querySelector('.parallax-char')) {
      const text = giantText.textContent.trim();
      giantText.innerHTML = text.split('').map(char => 
        `<span class="parallax-char">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');
    }

    const topRowItems = footer.querySelectorAll('.footer_top-row > *');
    const bottomRowItems = footer.querySelectorAll('.footer_bottom-row > *');
    const allChars = giantText.querySelectorAll('.parallax-char');

    const mainContainer = document.getElementById('tours-page-container') || document.body;

    // 2. Initial state - Using yPercent for displacement to avoid conflict with parallax pixels
    gsap.set([topRowItems, bottomRowItems], { yPercent: 40 });
    gsap.set(allChars, { yPercent: 50, opacity: 0 });

    // 3. MINIMALIST REVEAL: Smooth Slide & Fade
    ScrollTrigger.create({
      trigger: mainContainer,
      start: "bottom 98%",
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

    // 4. MINIMALIST ASCENT: Selective Parallax for "REK"
    if (allChars.length >= 3) {
      const isMobile = window.innerWidth < 768;
      const multiplier = isMobile ? 0.35 : 1; // Subtle multiplier

      const charsArray = Array.from(allChars);
      const charR = charsArray[charsArray.length - 3];
      const charE = charsArray[charsArray.length - 2];
      const charK = charsArray[charsArray.length - 1];
      const otherChars = charsArray.slice(0, -3);

      // Parallax strictly uses pixels (y) to avoid conflict with reveal yPercent
      gsap.to(otherChars, {
        y: -25 * multiplier,
        force3D: true,
        ease: "none",
        scrollTrigger: {
          trigger: mainContainer,
          start: "bottom bottom",
          end: "bottom top", 
          scrub: 1.2
        }
      });

      // 'E' goes highest
      gsap.to(charE, {
        y: -80 * multiplier,
        force3D: true,
        ease: "none",
        scrollTrigger: {
          trigger: mainContainer,
          start: "bottom bottom",
          end: "bottom top", 
          scrub: 1.2
        }
      });

      // 'R' and 'K' go to the same height
      gsap.to([charR, charK], {
        y: -40 * multiplier,
        force3D: true,
        ease: "none",
        scrollTrigger: {
          trigger: mainContainer,
          start: "bottom bottom",
          end: "bottom top", 
          scrub: 1.3
        }
      });

      gsap.to(charK, {
        y: -40 * multiplier,
        force3D: true,
        ease: "none",
        scrollTrigger: {
          trigger: mainContainer,
          start: "bottom bottom",
          end: "bottom top", 
          scrub: isMobile ? 1.4 : 1.7
        }
      });
    }
  }

  // --- Animation Logic for specific text (Legacy support) ---
  function initFooterFinalTextReveal() {
    // Keep this for consistency if needed by other components, 
    // but the main staggered logic above covers more ground.
  }
})();
