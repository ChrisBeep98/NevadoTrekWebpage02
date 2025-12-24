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
    const title = overlay.querySelector('.ntm-menu-title');
    const links = overlay.querySelectorAll('.ntm-nav-link');
    const separators = overlay.querySelectorAll('.ntm-separator');
    const cta = overlay.querySelector('.ntm-cta');

    if (!menuToggle || !overlay || !closeBtn) return;

    // Reset initial state
    gsap.set(overlay, { 
      clipPath: "circle(0% at 100% 0%)", 
      webkitClipPath: "circle(0% at 100% 0%)",
      visibility: "hidden" 
    });

    // OPEN TIMELINE: The Kinetic Reveal
    const openTl = gsap.timeline({ paused: true });
    
    // 1. Smooth Cinematic Expansion
    openTl.to(overlay, {
      duration: 1.2,
      clipPath: "circle(150% at 100% 0%)",
      ease: "expo.inOut",
      onStart: () => {
        overlay.style.visibility = "visible";
        overlay.classList.add('active');
        document.body.classList.add('ntm-open');
      }
    });

    // 2. Hierarchy Part A: Header Title drifting in
    openTl.to(title, {
      duration: 0.8,
      opacity: 0.5,
      y: 0,
      ease: "power3.out"
    }, "-=0.8");

    // 3. Hierarchy Part B: Navigation Links
    openTl.to(links, {
      duration: 0.8,
      opacity: 1,
      y: 0,
      stagger: 0.1,
      ease: "power4.out"
    }, "-=0.6");

    // 4. Hierarchy Part C: Separators drawing in from center
    openTl.to(separators, {
      duration: 0.8,
      opacity: 1,
      width: "calc(100% - 32px)",
      stagger: 0.1,
      ease: "expo.out"
    }, "-=0.7");

    // 5. Hierarchy Part D: Final CTA Pulse
    openTl.to(cta, {
      duration: 1.1,
      opacity: 1,
      scale: 1,
      y: 0,
      ease: "elastic.out(1, 0.7)"
    }, "-=0.6");

    // CLOSE TIMELINE (Reverse Hierarchy)
    const closeTl = gsap.timeline({ paused: true });
    
    closeTl.to([cta, ...Array.from(links).reverse(), ...Array.from(separators).reverse(), title], {
      duration: 0.4,
      opacity: 0,
      y: 10,
      scale: 0.95,
      stagger: 0.02,
      ease: "power2.in"
    });

    closeTl.to(overlay, {
      duration: 0.8,
      clipPath: "circle(0% at 100% 0%)",
      ease: "expo.inOut",
      onComplete: () => {
        overlay.classList.remove('active');
        overlay.style.visibility = "hidden";
        document.body.classList.remove('ntm-open');
      }
    }, "-=0.2");

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
