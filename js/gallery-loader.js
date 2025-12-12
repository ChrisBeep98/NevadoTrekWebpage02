/**
 * GALLERY PAGE LOADER
 * Handles premium header animations and mobile menu interactions.
 * Matches Tours Page logic exactly.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Gallery Page Loader...');
    
    // 1. Initialize Header Animations (Title Reveal + Subtitle Fade)
    initHeaderAnimations();
  
    // 2. Initialize Mobile Menu
    initMobileMenu();
    
    // 3. Listen for language changes (if needed for title dynamic updates)
    window.addEventListener('languageChange', (e) => {
        const lang = e.detail.lang;
        updateDynamicText(lang);
    });
});

/**
 * Initialize Header Animations
 * Premium letter reveal for title (CSS based) + ease up for subtitle (GSAP)
 * Matches index.html implementation exactly
 */
function initHeaderAnimations() {
    const title = document.querySelector('.page-title');
    const subtitle = document.querySelector('.page-subtitle');
  
    // Title Letter Reveal (CSS Animation)
    if (title) {
      const text = title.textContent.trim();
      if (text.length > 0) {
        title.textContent = ''; // Clear text
        title.style.opacity = '1'; // Make container visible
        
        // Clean up multiple spaces
        const cleanText = text.replace(/\s+/g, ' ').trim();
        const words = cleanText.split(' ');
        
        let globalLetterIndex = 0;
  
        words.forEach((word, index) => {
          // Wrapper for word to prevent breaking
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.style.whiteSpace = 'nowrap';
          // Add minimal margin except for last word
          if (index < words.length - 1) {
               wordSpan.style.marginRight = '0.25em'; 
          }
          
          const letters = word.split('');
          letters.forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'letter'; // Triggers CSS animation in index-animations.css
            
            // Stagger delay: 20ms per letter (Matched ToursPage)
            const delay = globalLetterIndex * 20; 
            span.style.animationDelay = `${delay}ms`;
            
            wordSpan.appendChild(span);
            globalLetterIndex++;
          });
          
          title.appendChild(wordSpan);
        });
      }
    }
  
    // Subtitle Fade Up (GSAP for simple smoothness)
    if (subtitle && typeof gsap !== 'undefined') {
      gsap.fromTo(subtitle, 
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.8, // Wait for title to finish mostly
          ease: 'power2.out'
        }
      );
    } else if (subtitle) {
      // Fallback if GSAP fails
      subtitle.style.transition = 'opacity 1s ease, transform 1s ease';
      subtitle.style.opacity = '1';
      subtitle.style.transform = 'translateY(0)';
    }
}

/**
 * Handle Language Updates for Header
 */
function updateDynamicText(lang) {
    const pageTitle = document.querySelector('[data-i18n-key="page.gallery.title"]');
    const pageSubtitle = document.querySelector('[data-i18n-key="page.gallery.subtitle"]');

    if (pageTitle) {
       pageTitle.textContent = lang === 'en' ? 'Gallery' : 'Galería';
    }
    
    if (pageSubtitle) {
       pageSubtitle.textContent = lang === 'en' 
         ? 'Unforgettable moments in the Colombian Andes' 
         : 'Momentos inolvidables en los Andes colombianos';
    }

    // Re-run animations specifically for new text
    // A small timeout allows the DOM to update text content before we split it again
    setTimeout(() => {
        initHeaderAnimations();
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
