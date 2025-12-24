/**
 * Navbar Handler - Shared across all pages
 * Manages navbar scroll effects and mobile menu
 */

(function() {
  'use strict';
  
  // Initialize navbar on DOM ready
  function init() {
    setupScrollEffect();
    setupMobileMenu();
    setupLanguageSwitcher();
  }

  /**
   * Setup language switcher dropdown with robust toggle logic
   */
  function setupLanguageSwitcher() {
    const langBtn = document.getElementById('lang-btn');
    const langOptions = document.getElementById('lang-options');
    const currentFlag = document.getElementById('current-flag');
    const currentLang = document.getElementById('current-lang');
    
    if (!langBtn || !langOptions) return;
    
    const dropdown = langBtn.closest('.lang-dropdown');
    
    // Toggle dropdown
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isShowing = dropdown.classList.contains('show') || langOptions.classList.contains('show');
      
      // Close all first to be clean
      document.querySelectorAll('.lang-dropdown, .lang-options').forEach(el => el.classList.remove('show', 'open'));
      
      if (!isShowing) {
        if (dropdown) dropdown.classList.add('show');
        langOptions.classList.add('show');
      }
    });
    
    // Close on outside click
    document.addEventListener('click', () => {
      if (dropdown) dropdown.classList.remove('show', 'open');
      langOptions.classList.remove('show', 'open');
    });
    
    // Handle language selection
    const options = langOptions.querySelectorAll('.lang-option');
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const lang = option.getAttribute('data-lang');
        const flag = option.getAttribute('data-flag');
        
        // Update UI
        if (currentLang) currentLang.textContent = lang.toUpperCase();
        if (currentFlag) currentFlag.src = flag;
        
        // Update storage and apply i18n
        if (window.NT_I18N && window.NT_I18N.setLanguage) {
          window.NT_I18N.setLanguage(lang);
        } else {
          localStorage.setItem('lang', lang);
          window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
        }
        
        // Close dropdown
        if (dropdown) dropdown.classList.remove('show', 'open');
        langOptions.classList.remove('show', 'open');
      });
    });

    // Initialize UI from localStorage
    const savedLang = localStorage.getItem('lang') || 'es';
    const activeOption = langOptions.querySelector(`.lang-option[data-lang="${savedLang}"]`);
    if (activeOption) {
      if (currentLang) currentLang.textContent = savedLang.toUpperCase();
      if (currentFlag) currentFlag.src = activeOption.getAttribute('data-flag');
    }
  }
  
  /**
   * Setup navbar scroll effect
   */
  function setupScrollEffect() {
    const navbar = document.getElementById('navbar-exclusion');
    if (!navbar) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
          ticking = false;
        });
        
        ticking = true;
      }
    });
  }
  
  /**
   * Setup mobile menu toggle
   */
  function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle-exclusion');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuClose = document.getElementById('mobile-menu-close');
    
    if (!menuToggle || !mobileMenu || !menuClose) return;
    
    // Open menu
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    
    // Close menu
    menuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
    
    // Close on outside click
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // Close on link click
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
