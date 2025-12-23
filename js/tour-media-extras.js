/**
 * Tour Page Media Extras
 * Handles hover classes and integrated lightbox viewer
 */

document.addEventListener('DOMContentLoaded', () => {
    // 0. GSAP Hover Effects (Compatible with ScrollTriggers)
    const initHoverEffects = () => {
        // Wait a bit for tour-loader to add classes
        setTimeout(() => {
            const hoverImages = document.querySelectorAll('.nt-hover-image');
            
            hoverImages.forEach(img => {
                img.addEventListener('mouseenter', () => {
                    if (window.gsap) {
                        // Subtle scale for large/medium images, slightly more for small ones
                        const isLargeOrMedium = img.id === 'main-tour-image' || 
                                               img.id === 'fullscreen-img2' || 
                                               img.id === 'big-image-03' || 
                                               img.classList.contains('parallax-image-medium');
                        
                        window.gsap.to(img, { 
                            scale: isLargeOrMedium ? 1.02 : 1.05, 
                            duration: 0.6, 
                            ease: "power2.out",
                            overwrite: 'auto' 
                        });
                    }
                });

                img.addEventListener('mouseleave', () => {
                    if (window.gsap) {
                        // Check if it's one of the zoom-scroll images to return to scale 1 (or whatever GSAP scroll-trigger set)
                        // Actually, just let GSAP return it. If scroll-trigger is active, it might take over again on next scroll.
                        window.gsap.to(img, { 
                            scale: 1, 
                            duration: 0.6, 
                            ease: "power2.out",
                            overwrite: 'auto'
                        });
                    }
                });
            });
        }, 1000); // Wait for tour-loader.js to finish rendering
    };

    initHoverEffects();

    // 1. Initial Styles Injection
    const ensureLightboxHTML = () => {
        if (document.getElementById('nt-lightbox')) return;

        const html = `
            <div class="nt-lightbox" id="nt-lightbox">
                <div class="nt-lightbox-main">
                    <button class="nt-lightbox-close" id="nt-lightbox-close" aria-label="Close">×</button>
                    <button class="nt-lightbox-prev" id="nt-lightbox-prev" aria-label="Previous">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <button class="nt-lightbox-next" id="nt-lightbox-next" aria-label="Next">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                    <img src="" alt="Viewer" class="nt-lightbox-img" id="nt-lightbox-img">
                </div>
                <div class="nt-lightbox-thumbs" id="nt-lightbox-thumbs"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    };

    ensureLightboxHTML();

    const lightbox = document.getElementById('nt-lightbox');
    const lightboxImg = document.getElementById('nt-lightbox-img');
    const thumbsContainer = document.getElementById('nt-lightbox-thumbs');
    const closeBtn = document.getElementById('nt-lightbox-close');
    const prevBtn = document.getElementById('nt-lightbox-prev');
    const nextBtn = document.getElementById('nt-lightbox-next');

    let currentImages = [];
    let currentIndex = 0;

    const openLightbox = (images, index) => {
        currentImages = images;
        currentIndex = index;
        renderThumbnails();
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    const renderThumbnails = () => {
        thumbsContainer.innerHTML = '';
        currentImages.forEach((src, idx) => {
            const thumb = document.createElement('img');
            thumb.src = src;
            thumb.className = 'nt-lightbox-thumb';
            thumb.onclick = (e) => {
                e.stopPropagation();
                currentIndex = idx;
                updateLightbox();
            };
            thumbsContainer.appendChild(thumb);
        });
    };

    const updateLightbox = () => {
        if (currentImages[currentIndex]) {
            lightboxImg.src = currentImages[currentIndex];
        }
        
        // Update Thumbnails Active Class
        const thumbs = thumbsContainer.querySelectorAll('.nt-lightbox-thumb');
        thumbs.forEach((thumb, idx) => {
            if (idx === currentIndex) {
                thumb.classList.add('active');
                // Scroll into view within the container
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                thumb.classList.remove('active');
            }
        });

        // Hide navigation if only one image
        const hasMultiple = currentImages.length > 1;
        prevBtn.style.display = hasMultiple ? 'flex' : 'none';
        nextBtn.style.display = hasMultiple ? 'flex' : 'none';
    };

    const next = () => {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightbox();
    };

    const prev = () => {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightbox();
    };

    // Events
    closeBtn.onclick = closeLightbox;
    prevBtn.onclick = (e) => { e.stopPropagation(); prev(); };
    nextBtn.onclick = (e) => { e.stopPropagation(); next(); };
    
    // Close on background click (Both main area and outer container)
    lightbox.onclick = (e) => { if (e.target === lightbox) closeLightbox(); };
    document.querySelector('.nt-lightbox-main').onclick = (e) => {
        if (e.target === document.querySelector('.nt-lightbox-main')) closeLightbox();
    };

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });

    // Expose globally for tour-loader.js
    window.NT_TourViewer = { open: openLightbox };
});
