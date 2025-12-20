/**
 * Optimized Carousel Animation (Scroll-Driven)
 * Follows User Request: Scroll Scrub + Centered + xPercent Optimization
 */

document.addEventListener("DOMContentLoaded", () => {
    // Wait a tick for fonts/styles to load
    setTimeout(initOptimizedCarousels, 100);
});

function initOptimizedCarousels() {
    // Check for GSAP and ScrollTrigger
    const hasGSAP = typeof gsap !== 'undefined';
    const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';

    if (!hasGSAP || !hasScrollTrigger) {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const loops = document.querySelectorAll('.horizontal-loop');

    loops.forEach((loop) => {
        const track = loop.querySelector('.track');
        if (!track) return;

        // 1. DUPLICATE CONTENT
        // Duplicate content to ensure "centered" layout has enough buffer on sides
        // and to allow for significant movement without running out of text.
        // For scrubbing, we don't necessarily need a perfect "seamless loop" reset,
        // we just need enough content so it doesn't look empty when moved.
        // Duplicating twice (Total 3 copies) is safer for centered layouts.
        
        const originalChildren = Array.from(track.children);
        
        // Clone once
        originalChildren.forEach(child => {
            const clone = child.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });

        // Clone twice (Total 3 sets: [Clone] [Original] [Clone] effectively if centered? 
        // Or just [Orig][Clone][Clone]. With justify-content:center, the whole track is centered.
        // So we have plenty of text on left and right.
        originalChildren.forEach(child => {
            const clone = child.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });


        // 2. ANIMATE WITH SCROLLTRIGGER
        const direction = loop.getAttribute('dir') === 'rtl' ? 1 : -1;
        
        // Movement amount: 
        // If we move too much, valid text might go off screen.
        // xPercent: -20  moves the track 20% of its total width to the left.
        // Since we tripled the content, the track is very wide.
        // -10% or -20% gives a nice parallax feel without ending the text.
        
        const moveAmount = direction * 30; // Move 30% of width (left or right)

        gsap.to(track, {
            xPercent: moveAmount,
            ease: "none",
            scrollTrigger: {
                trigger: loop, // Trigger when the carousel itself is in view (or main section)
                start: "top bottom", // Start when top of loop hits bottom of viewport
                end: "bottom top", // End when bottom of loop hits top of viewport
                scrub: 1 // Smooth scrubbing as requested (0.3 - 1 is standard "slowness")
            }
        });
    });
}
