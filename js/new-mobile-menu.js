/**
 * Refactored Mobile Menu Logic (Namespace: nm)
 * Uses GSAP for high-performance circular reveal animations.
 */
document.addEventListener('DOMContentLoaded', () => {
    initNewMobileMenu();
});

function initNewMobileMenu() {
    // Elements
    const toggleBtn = document.querySelector('.nm-menu-toggle');
    const overlay = document.querySelector('.nm-overlay');
    const closeBtn = document.querySelector('.nm-close-btn');
    const links = document.querySelectorAll('.nm-link-item');
    const separators = document.querySelectorAll('.nm-separator');
    const cta = document.querySelector('.nm-cta-container');
    const title = document.querySelector('.nm-title');
    
    if (!toggleBtn || !overlay) {
        console.warn('New Mobile Menu elements not found.');
        return;
    }

    // GSAP Timeline (Paused initially)
    let menuTimeline = gsap.timeline({ paused: true, reversed: true });

    // Setup Animation
    // 1. Circular Reveal
    menuTimeline.to(overlay, {
        duration: 0.8,
        clipPath: 'circle(150% at 100% 0%)',
        webkitClipPath: 'circle(150% at 100% 0%)', // Safari support
        ease: 'power4.inOut',
        autoAlpha: 1 // Handles visibility: hidden automatically
    })
    // 2. Staggered Content Entrance
    .to([title, closeBtn], {
        duration: 0.4,
        y: 0,
        scale: 1,
        opacity: 1,
        ease: 'power2.out',
        stagger: 0.1
    }, "-=0.4")
    .to([links, separators], {
        duration: 0.5,
        y: 0,
        scaleX: 1,
        opacity: 1,
        stagger: 0.05,
        ease: 'back.out(1.2)'
    }, "-=0.3")
    .to(cta, {
        duration: 0.4,
        y: 0,
        opacity: 1,
        ease: 'power2.out'
    }, "-=0.3");

    // Toggle Handler
    function toggleMenu() {
        // GPU optimization: Will-change hint during interaction
        overlay.style.willChange = 'clip-path';
        
        if (menuTimeline.reversed()) {
            menuTimeline.play();
            document.body.style.overflow = 'hidden'; // Lock scroll
        } else {
            menuTimeline.reverse();
            document.body.style.overflow = ''; // Unlock scroll
        }

        // Remove will-change after animation to save memory (approximate time)
        setTimeout(() => {
            overlay.style.willChange = 'auto';
        }, 1000);
    }

    // Event Listeners
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Close on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (!menuTimeline.reversed()) {
                toggleMenu();
            }
        });
    });
    
    // Close on CTA click
    const ctaLink = cta ? cta.querySelector('a') : null;
    if(ctaLink) {
        ctaLink.addEventListener('click', () => {
             if (!menuTimeline.reversed()) {
                toggleMenu();
            }
        });
    }
}
