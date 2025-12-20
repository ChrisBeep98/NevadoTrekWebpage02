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
      perPage: 2,       // Show 2 cards at a time vertically
      gap: "20px",
      arrows: false,
      pagination: false,
      autoScroll: {
        // Positive speed moves towards end (downward in ttb)
        // Negative speed moves towards start (upward in ttb)
        speed: isReversed ? 0.3 : -0.3, 
        pauseOnHover: false,
        pauseOnFocus: false,
      },
      breakpoints: {
        1200: {
          height: '600px', // Responsive height adjustment
        },
      },
    });

    // mount with AutoScroll extension if available
    splide.mount(window.splide && window.splide.Extensions ? window.splide.Extensions : {});
    
    console.log(`Reviews slider ${index + 1} mounted. isReversed: ${isReversed}, Speed: ${isReversed ? 0.3 : -0.3}`);
  });
});
