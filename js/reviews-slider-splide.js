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
      perPage: 3,
      gap: "2rem",
      arrows: false,
      pagination: false,
      direction: 'ltr', // Standard ltr, we handle reverse via AutoScroll or JS
      autoScroll: {
        speed: isReversed ? -0.8 : 0.8,
        pauseOnHover: true,
        pauseOnFocus: false,
      },
      breakpoints: {
        1200: {
          perPage: 2,
        },
        991: {
          // This section is hidden on mobile anyway via CSS,
          // but we keep config clean
          perPage: 1,
        },
      },
    });

    // mount with AutoScroll extension if available
    splide.mount(window.splide && window.splide.Extensions ? window.splide.Extensions : {});
    
    console.log(`Reviews slider ${index + 1} mounted (Reversed: ${isReversed})`);
  });
});
