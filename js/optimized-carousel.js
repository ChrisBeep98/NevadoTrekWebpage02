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
        
        const moveAmount = direction * 20; // Reduced from 30 to 20 for better paint performance

        // Optimization: Prepare GPU
        track.style.willChange = 'transform';

        gsap.to(track, {
            xPercent: moveAmount,
            ease: "none",
            scrollTrigger: {
                trigger: loop, 
                start: "top bottom", 
                end: "bottom top", 
                scrub: 1,
                onToggle: self => {
                    // Only enable will-change while the element is active in viewport
                    track.style.willChange = self.isActive ? 'transform' : 'auto';
                }
            }
        });
    });
}
