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
    // Small delay to ensure Webflow/CSS has rendered inside footer
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
         
         // Calculate how much of the footer is visible
         const footerVisibleHeight = windowHeight - mainRect.bottom;
         
         // Start hiding when we reach the actual content end
         const shouldHide = footerVisibleHeight > 50; // Smaller threshold for cleaner transition
         
         if (tocElement) {
           tocElement.style.opacity = shouldHide ? '0' : '1';
           tocElement.style.pointerEvents = shouldHide ? 'none' : 'auto';
           tocElement.style.transition = 'opacity 0.3s ease';
         }

         if (mobileCta) {
           // On mobile we want to hide it completely as it overlaps with footer content
           mobileCta.style.opacity = shouldHide ? '0' : '1';
           mobileCta.style.pointerEvents = shouldHide ? 'none' : 'auto';
           mobileCta.style.transform = shouldHide ? 'translateY(100%)' : 'translateY(0)';
           mobileCta.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
         }
      });
    }


  }

  // --- Animation Logic (Copied/Adapted from index-animations.js) ---

  function initFooterFinalTextReveal() {
    const textEl = document.querySelector('.moving-gallery .last-heading');
    if (!textEl) {
      // Try finding it inside the footer placeholder just in case
      const placeholder = document.getElementById('footer-placeholder');
      const textElInPlaceholder = placeholder ? placeholder.querySelector('.last-heading') : null;
      if (!textElInPlaceholder) return;
      
      // Use GSAP ScrollTrigger if available, else Fallback to IntersectionObserver
      if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
        runGsapReveal(textElInPlaceholder);
      } else {
        applyLetterReveal(textElInPlaceholder, 15, 150);
      }
      return;
    }

    // Use GSAP ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
      runGsapReveal(textEl);
    } else {
      // Fallback to IntersectionObserver logic if GSAP missing
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              applyLetterReveal(textEl, 15, 150); 
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '0px 0px -10% 0px',
          threshold: 0.1,
        }
      );
      observer.observe(textEl);
    }
  }

  function runGsapReveal(element) {
    if (!element) return;
    
    // Prepare split text manually (GSAP SplitText is premium, assume we don't have it)
    const text = element.textContent;
    element.innerHTML = '';
    element.style.opacity = '1'; // Ensure container is visible

    const allLetters = [];

    const words = text.split(' ');
    words.forEach((word, wordIndex) => {
      const wordWrapper = document.createElement('span');
      wordWrapper.style.whiteSpace = 'nowrap';
      wordWrapper.style.display = 'inline-block';
      
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const letterSpan = document.createElement('span');
        letterSpan.textContent = char;
        letterSpan.style.display = 'inline-block';
        letterSpan.style.opacity = '0'; // Initial state
        letterSpan.style.transform = 'translateY(20px) scale(0.98)';
        letterSpan.style.filter = 'blur(8px)';
        
        allLetters.push(letterSpan);
        wordWrapper.appendChild(letterSpan);
      }
      
      element.appendChild(wordWrapper);
      
      if (wordIndex < words.length - 1) {
        const space = document.createTextNode(' ');
        element.appendChild(space);
      }
    });

    // Create GSAP ScrollTrigger
    gsap.to(allLetters, {
      scrollTrigger: {
        trigger: element,
        start: "top 90%", // Start when top of element hits 90% of viewport height
        toggleActions: "play none none none"
      },
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1.2,
      stagger: 0.02,
      ease: "power3.out", // Smooth easing as requested
      delay: 0.1
    });
  }

  function applyLetterReveal(element, staggerMs = 15, initialDelayMs = 0) {
    if (!element) return;

    const text = element.textContent;
    element.innerHTML = ''; 
    element.classList.add('animating');

    const words = text.split(' ');
    let letterIndex = 0;

    words.forEach((word, wordIndex) => {
      const wordWrapper = document.createElement('span');
      wordWrapper.className = 'word-letter-wrapper';
      wordWrapper.style.whiteSpace = 'nowrap';
      wordWrapper.style.display = 'inline-block';
      
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const letterSpan = document.createElement('span');
        letterSpan.className = 'letter'; // Requires index-animations.css if falling back
        letterSpan.textContent = char;
        
        const delay = initialDelayMs + letterIndex * staggerMs;
        letterSpan.style.animationDelay = `${delay}ms`;
        
        wordWrapper.appendChild(letterSpan);
        letterIndex++;
      }
      
      element.appendChild(wordWrapper);
      
      if (wordIndex < words.length - 1) {
        const space = document.createTextNode(' ');
        element.appendChild(space);
      }
    });
  }
})();
