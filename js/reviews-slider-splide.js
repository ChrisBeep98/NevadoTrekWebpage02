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
      clones: 20,        // Extra clones to prevent boundary gaps
      autoScroll: {
        // Positive speed moves towards end (downward in ttb)
        // Negative speed moves towards start (upward in ttb)
        speed: isReversed ? 0.01 : -0.01, 
        pauseOnHover: true,
        pauseOnFocus: true,
      },
      breakpoints: {
        1200: {
          height: '600px', 
          fixedHeight: '240px', // Adjusted for smaller screens
        },
      },
    });

    // mount with AutoScroll extension if available
    splide.mount(window.splide && window.splide.Extensions ? window.splide.Extensions : {});
    
    // Explicitly handle pause on hover if the extension setting is failing
    const autoScroll = splide.Components.AutoScroll;
    if (autoScroll) {
      slider.addEventListener('mouseenter', () => {
        autoScroll.pause();
        console.log(`Slider ${index + 1} paused on hover`);
      });
      slider.addEventListener('mouseleave', () => {
        autoScroll.play();
        console.log(`Slider ${index + 1} resumed on leave`);
      });
      
      console.log(`Reviews slider ${index + 1} mounted. Reversed: ${isReversed}, Actual Speed: ${autoScroll.options.speed}`);
    } else {
      console.warn(`AutoScroll component NOT FOUND for slider ${index + 1}`);
    }
  });
});
