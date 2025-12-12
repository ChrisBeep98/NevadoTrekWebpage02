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
    
    console.log('Footer Reveal Initialized');
  }

  // --- Animation Logic (Copied/Adapted from index-animations.js) ---

  function initFooterFinalTextReveal() {
    const textEl = document.querySelector('.moving-gallery .last-heading');
    if (!textEl) {
      // Try finding it inside the footer placeholder just in case
      const placeholder = document.getElementById('footer-placeholder');
      const textElInPlaceholder = placeholder ? placeholder.querySelector('.last-heading') : null;
      if (!textElInPlaceholder) return;
      applyLetterReveal(textElInPlaceholder, 15, 150);
      return;
    }

    // Use Intersection Observer for scroll trigger
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
        rootMargin: '0px 0px -10% 0px', // Slightly earlier trigger
        threshold: 0.1,
      }
    );

    observer.observe(textEl);
  }

  function applyLetterReveal(element, staggerMs = 15, initialDelayMs = 0) {
    if (!element) return;

    const text = element.textContent;
    element.innerHTML = ''; // Clear original text
    
    // Add 'animating' class to make container visible
    element.classList.add('animating');

    // Split by words first
    const words = text.split(' ');
    let letterIndex = 0;

    words.forEach((word, wordIndex) => {
      // Create wrapper for each word
      const wordWrapper = document.createElement('span');
      wordWrapper.className = 'word-letter-wrapper';
      wordWrapper.style.whiteSpace = 'nowrap';
      wordWrapper.style.display = 'inline-block';
      
      // Split word into letters
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const letterSpan = document.createElement('span');
        letterSpan.className = 'letter'; // Requires index-animations.css
        letterSpan.textContent = char;
        
        // Calculate delay
        const delay = initialDelayMs + letterIndex * staggerMs;
        letterSpan.style.animationDelay = `${delay}ms`;
        
        wordWrapper.appendChild(letterSpan);
        letterIndex++;
      }
      
      element.appendChild(wordWrapper);
      
      // Add space between words
      if (wordIndex < words.length - 1) {
        const space = document.createTextNode(' ');
        element.appendChild(space);
      }
    });
  }
})();
