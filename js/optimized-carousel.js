/**
 * Hyper-Optimized Horizontal Scroll Loops
 * Uses a single ScrollTrigger for the entire section to maximize performance.
 */

(function() {
    'use strict';

    // Immediate attempt to initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Wait for GSAP and ScrollTrigger
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            requestAnimationFrame(init);
            return;
        }

        gsap.registerPlugin(ScrollTrigger);
        
        // 1. Prepare DOM (Synchronous to prevent flicker)
        const introSection = document.getElementById('intro');
        if (!introSection) return;

        const loops = introSection.querySelectorAll('.horizontal-loop');
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: introSection,
                start: "top bottom",
                end: "bottom top",
                scrub: 1, // Premium smooth scrub
                invalidateOnRefresh: true,
                // markers: false // Set to true for debugging
            }
        });

        loops.forEach((loop) => {
            const track = loop.querySelector('.track');
            if (!track) return;

            // 1. Duplication for continuity
            // We use a lighter duplication approach: only 1 clone if width allows
            const originalChildren = Array.from(track.children);
            originalChildren.forEach(child => {
                const clone = child.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                track.appendChild(clone);
            });
            
            // Second set for safety in wide screens
            originalChildren.forEach(child => {
                const clone = child.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                track.appendChild(clone);
            });

            // 2. Variables
            const direction = loop.getAttribute('dir') === 'rtl' ? 1 : -1;
            const moveAmount = direction * 20;

            // 3. Add to shared timeline
            // Using xPercent on the track for transform-based GPU acceleration
            timeline.to(track, {
                xPercent: moveAmount,
                ease: "none",
                force3D: true // Ensure GPU layer promotion
            }, 0); // Start all at the same time (offset 0)

            // Reveal track immediately now that it's prepared
            track.style.opacity = '1';
        });

        // 4. Force a calculation refresh
        ScrollTrigger.refresh();
    }

    // Global Refresh Bridge: Allows other scripts (like home-loader) to trigger refresh
    window.refreshScrollLoops = () => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    };
})();
