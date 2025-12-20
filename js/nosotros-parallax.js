/**
 * Nosotros Section - GPU-Optimized Parallax with GSAP
 * 
 * Replaces Webflow parallax animations with custom GSAP ScrollTrigger
 * for better performance and GPU acceleration.
 * 
 * Section: "Nosotros" (.section-6)
 * Elements: 1 fixed video + 3 parallax images
 */

(function() {
  'use strict';

  // Wait for DOM and GSAP
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Check GSAP availability
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('⚠️ GSAP or ScrollTrigger not found. Nosotros parallax disabled.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    
    // Small delay to ensure layout is settled
    setTimeout(() => {
      initNosotrosParallax();
    }, 100);
  }

  function initNosotrosParallax() {
    console.log('🎬 Initializing Nosotros parallax with GSAP...');

    const section = document.querySelector('.section-6');
    if (!section) {
      console.warn('⚠️ Section .section-6 not found');
      return;
    }

    // 1. Background Video Parallax (sutil counter-scroll)
    const videoWrapper = section.querySelector('.parallax-img-wrapper.story');
    if (videoWrapper) {
      const videoInner = videoWrapper.querySelector('.parallax-img-inner, video');
      if (videoInner) {
        gsap.to(videoInner, {
          yPercent: -15, // Sutil counter-scroll
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5, // Extra smooth para video
            // markers: true // Debug: descomentar para ver triggers
          }
        });
        console.log('  ✅ Video background parallax applied');
      }
    }

    // 2. Parallax Images (todas las imágenes de la sección)
    const parallaxImages = section.querySelectorAll('.parallax-img-wrapper.small-size .parallax-img-inner');
    
    if (parallaxImages.length === 0) {
      console.warn('⚠️ No parallax images found in section');
      return;
    }

    parallaxImages.forEach((img, index) => {
      const wrapper = img.closest('.parallax-img-wrapper');
      
      // Parallax effect: imagen se mueve más lento que el scroll
      gsap.to(img, {
        yPercent: 15, // Factor parallax reducido (más sutil)
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top bottom', // Empieza cuando entra en viewport
          end: 'bottom top',   // Termina cuando sale
          scrub: 1,            // Smooth scrub
          // markers: true     // Debug
        }
      });

      console.log(`  ✅ Parallax applied to image ${index + 1}/${parallaxImages.length}`);
    });

    console.log('✅ Nosotros parallax initialized successfully!');
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    ScrollTrigger.getAll().forEach(st => st.kill());
  });

})();
