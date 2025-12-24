/**
 * New Mobile Menu (NTM) Logic (v3 - White Theme)
 * Stable GSAP circle expansion from top-right.
 */

(function() {
  'use strict';

  function initNTM() {
    const menuToggle = document.querySelector('.menu-toggle-exclusion');
    const overlay = document.getElementById('ntm-menu');
    const closeBtn = document.getElementById('ntm-close');
    const links = overlay.querySelectorAll('.ntm-nav-link, .ntm-separator, .ntm-cta');

    if (!menuToggle || !overlay || !closeBtn) return;

    // Reset initial state
    gsap.set(overlay, { 
      clipPath: "circle(0% at 100% 0%)", 
      webkitClipPath: "circle(0% at 100% 0%)",
      visibility: "hidden" 
    });
    gsap.set(links, { opacity: 0, y: 30 });

    const openTl = gsap.timeline({ paused: true });
    
    openTl.to(overlay, {
      duration: 0.85,
      clipPath: "circle(150% at 100% 0%)",
      ease: "power4.inOut",
      onStart: () => {
        overlay.style.visibility = "visible";
        overlay.classList.add('active');
        document.body.classList.add('ntm-open');
      }
    });

    openTl.to(links, {
      duration: 0.5,
      opacity: 1,
      y: 0,
      stagger: 0.08,
      ease: "power2.out"
    }, "-=0.45");

    const closeTl = gsap.timeline({ paused: true });
    
    closeTl.to(links, {
      duration: 0.3,
      opacity: 0,
      y: 15,
      stagger: 0.04,
      ease: "power2.in"
    });

    closeTl.to(overlay, {
      duration: 0.65,
      clipPath: "circle(0% at 100% 0%)",
      ease: "power4.inOut",
      onComplete: () => {
        overlay.classList.remove('active');
        overlay.style.visibility = "hidden";
        document.body.classList.remove('ntm-open');
      }
    }, "-=0.1");

    // Click handlers
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      openTl.restart();
    });

    closeBtn.addEventListener('click', () => closeTl.restart());

    // Close on link click
    overlay.querySelectorAll('.ntm-nav-link, .ntm-cta').forEach(link => {
      link.addEventListener('click', () => closeTl.restart());
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeTl.restart();
    });

    // Mark as initialized
    menuToggle.dataset.ntmInitialized = "true";
  }

  // Expose to window for component loader
  window.initMobileMenu = initNTM;

  // Init on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNTM);
  } else {
    initNTM();
  }
})();
