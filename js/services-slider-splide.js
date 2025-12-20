document.addEventListener('DOMContentLoaded', () => {
    // Wait for Splide to be available
    if (typeof Splide === 'undefined') {
        console.error('Splide is not loaded!');
        return;
    }

    const splide = new Splide('.services-splide', {
        type   : 'loop',
        perPage: 1,
        focus  : 0,
        fixedWidth: '92svw', // Matches original card width
        gap    : '2.6em',
        padding: { right: '4vw' }, // The "peek" effect
        speed  : 500,
        drag   : true,
        arrows : false,
        pagination: false,
        breakpoints: {
            991: {
                fixedWidth: '93%',
                gap: '2.8em',
                padding: { right: '3%' },
            },
            767: {
                fixedWidth: '90%',
                gap: '16px',
                padding: { right: '5%' },
            }
        }
    });

    splide.mount();

    // Link custom arrows
    const prevBtn = document.querySelector('.services-splide-arrow.prev');
    const nextBtn = document.querySelector('.services-splide-arrow.next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => splide.go('<'));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => splide.go('>'));
    }
});
