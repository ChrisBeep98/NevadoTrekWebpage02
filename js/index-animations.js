/* ===================================
   INDEX PAGE ANIMATIONS SCRIPT
   Letter-by-letter reveal for hero and key texts
   Performance-optimized (no GSAP scrub)
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
    // Small delay to ensure styles are loaded
    setTimeout(() => {
      initHeroTitleReveal();
      initExperiencesTextReveal();
      initServicesTextReveal();
      initServicesBottomTextReveal(); // NEW: Second services text
      initFooterFinalTextReveal(); // NEW: Footer final text
    }, 100);
  }

  /**
   * 1. Hero Title: "Un Paraíso En Salento"
   * Target: .italic-text-4 inside the hero section
   * Special: Each WORD on its own line, each LETTER gets blur animation
   */
  function initHeroTitleReveal() {
    const titleEl = document.querySelector('.main-heading .italic-text-4');
    if (!titleEl) {
      console.warn('Hero title element not found');
      return;
    }

    // Get text - important: textContent gets ALL text including from br-separated lines
    const text = titleEl.textContent.trim();
    
    // Clean up multiple spaces and newlines
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    console.log('Hero title text:', cleanText); // Debug
    
    const words = cleanText.split(' ').filter(w => w.length > 0); // Remove empty strings
    
    console.log('Words found:', words); // Debug
    
    titleEl.innerHTML = ''; // Clear original text

    let letterIndex = 0;
    
    words.forEach((word, wordIndex) => {
      // Create a wrapper for each word (will be displayed as block)
      const wordWrapper = document.createElement('span');
      wordWrapper.className = 'word-wrapper';
      wordWrapper.style.display = 'block'; // Each word on its own line
      
      // Split word into letters and add them to the wrapper
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const letterSpan = document.createElement('span');
        letterSpan.className = 'letter'; // This class has the blur animation
        letterSpan.textContent = char;
        
        // Calculate delay: 70ms per letter across ALL words (slower for hero)
        const delay = letterIndex * 70;
        letterSpan.style.animationDelay = `${delay}ms`;
        
        wordWrapper.appendChild(letterSpan);
        letterIndex++;
      }
      
      titleEl.appendChild(wordWrapper);
    });
  }

  /**
   * 2. Experiences Text: "No importa la ruta que elijas..."
   * Target: [data-i18n-key="experiences.lead"]
   */
  function initExperiencesTextReveal() {
    const textEl = document.querySelector('[data-i18n-key="experiences.lead"]');
    if (!textEl) {
      console.warn('Experiences text element not found');
      return;
    }

    // Use Intersection Observer for scroll trigger
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            applyLetterReveal(textEl, 20, 0);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -20% 0px',
        threshold: 0.1,
      }
    );

    observer.observe(textEl);
  }

  /**
   * 3. Services Text (Top): "Traemos nuevas emociones..."
   * Target: [data-i18n-key="services.lead"]
   */
  function initServicesTextReveal() {
    const textEl = document.querySelector('[data-i18n-key="services.lead"]');
    if (!textEl) {
      console.warn('Services text element not found');
      return;
    }

    // Use Intersection Observer for scroll trigger
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            applyLetterReveal(textEl, 15, 200); // 300ms initial delay
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -20% 0px',
        threshold: 0.1,
      }
    );

    observer.observe(textEl);
  }

  /**
   * 4. Services Text (Bottom): "Traemos nuevas emociones..." (after tours)
   * Target: [data-i18n-key="services.lead.bottom"]
   */
  function initServicesBottomTextReveal() {
    const textEl = document.querySelector('[data-i18n-key="services.lead.bottom"]');
    if (!textEl) {
      console.warn('Services bottom text element not found');
      return;
    }

    // Use Intersection Observer for scroll trigger
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            applyLetterReveal(textEl, 15, 200); // 200ms initial delay, 25ms between letters
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -20% 0px',
        threshold: 0.1,
      }
    );

    observer.observe(textEl);
  }

  /**
   * 5. Footer Final Text: "Where the frailejón keeps silence..."
   * Target: .moving-gallery .last-heading (injected by i18n)
   */
  function initFooterFinalTextReveal() {
    const textEl = document.querySelector('.moving-gallery .last-heading');
    if (!textEl) {
      console.warn('Footer final text element not found');
      return;
    }

    // Use Intersection Observer for scroll trigger
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            applyLetterReveal(textEl, 15, 150); // 150ms initial delay, 30ms between letters
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -20% 0px',
        threshold: 0.1,
      }
    );

    observer.observe(textEl);
  }

  /**
   * Core function: Split text into letters and apply staggered animation
   * Groups letters by WORD to prevent splitting
   * @param {HTMLElement} element - Element to animate
   * @param {number} staggerMs - Delay between each letter in milliseconds
   * @param {number} initialDelayMs - Initial delay before starting animation
   */
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
      // Create wrapper for each word (prevents breaking)
      const wordWrapper = document.createElement('span');
      wordWrapper.className = 'word-letter-wrapper';
      wordWrapper.style.whiteSpace = 'nowrap'; // Keep word together
      wordWrapper.style.display = 'inline-block'; // Allow wrapping between words
      
      // Split word into letters
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const letterSpan = document.createElement('span');
        letterSpan.className = 'letter';
        letterSpan.textContent = char;
        
        // Calculate delay
        const delay = initialDelayMs + letterIndex * staggerMs;
        letterSpan.style.animationDelay = `${delay}ms`;
        
        wordWrapper.appendChild(letterSpan);
        letterIndex++;
      }
      
      element.appendChild(wordWrapper);
      
      // Add space between words (except last word)
      if (wordIndex < words.length - 1) {
        const space = document.createTextNode(' ');
        element.appendChild(space);
      }
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
