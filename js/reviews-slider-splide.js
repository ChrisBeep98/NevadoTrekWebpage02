/**
 * Reviews Slider Initialization using Splide.js
 * handles the 3-column scrolling reviews section on desktop
 */

document.addEventListener("DOMContentLoaded", function () {
  const sliders = document.querySelectorAll(".tinyflow-slider");
  if (sliders.length === 0) return;

  sliders.forEach((slider, index) => {
    const isReversed = slider.getAttribute("data-direction") === "reversed" || slider.classList.contains("right");
    
    // Check if Splide AutoScroll extension is available
    // If not, we use a basic autoplay or GSAP fallback
    const hasAutoScroll = typeof Splide.Extensions !== 'undefined' && typeof Splide.Extensions.AutoScroll !== 'undefined';

    const splide = new Splide(slider, {
      type: "loop",
      drag: "free",
      focus: "center",
      direction: 'ttb', // Top to bottom
      height: '680px',  // Increased as requested (+60px)
      autoHeight: false, 
      fixedHeight: '280px', // MATCHES CSS for stable calculations
      gap: "20px",
      arrows: false,
      pagination: false,
      clones: 3,        // REDUCED from 20 to 3. Huge performance gain.
      autoScroll: {
        speed: isReversed ? 0.01 : -0.01, 
        pauseOnHover: true,
        pauseOnFocus: true,
      },
      breakpoints: {
        1200: {
          height: '600px', 
          fixedHeight: '240px', 
        },
      },
    });

    // mount with AutoScroll extension if available
    splide.mount(window.splide && window.splide.Extensions ? window.splide.Extensions : {});
    
    // Optimization: Pause slider when not in view
    const autoScroll = splide.Components.AutoScroll;
    if (autoScroll) {
      // Setup hardware acceleration on the list
      const list = slider.querySelector('.splide__list');
      if (list) list.style.willChange = 'transform';

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            autoScroll.play();
          } else {
            autoScroll.pause();
          }
        });
      }, { threshold: 0.1 });

      observer.observe(slider);

      slider.addEventListener('mouseenter', () => {
        autoScroll.pause();
      });
      slider.addEventListener('mouseleave', () => {
        if (splide.root.classList.contains('is-in-view')) { // Custom check if needed
             autoScroll.play();
        }
        // Fallback simple
        autoScroll.play();
      });
      
    } else {
      console.warn(`AutoScroll component NOT FOUND for slider ${index + 1}`);
    }
  });
});
