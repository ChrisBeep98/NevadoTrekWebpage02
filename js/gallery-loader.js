import { apiService } from './services/api.js';

/**
 * GALLERY PAGE LOADER
 * Handles premium header animations, mobile menu, and Dynamic Masonry Grid.
 * OPTIMIZATION V2: Infinite Scroll + Deferred Init + Micro-Batch Rendering via rAF
 */

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing Gallery Page Loader v2...');
    
    // 1. Initialize Header Animations (Title Reveal + Subtitle Fade)
    // Starts at 200ms
    initHeaderAnimations();
  
    // 2. Initialize Mobile Menu
    initMobileMenu();
    
    // 3. Initialize Gallery Grid - DEFERRED
    // Wait 1.5s to absolutely Ensure title animation is done and CPU is cool.
    setTimeout(() => {
        initGalleryGrid();
    }, 1500);
    
    // 4. Listen for language changes
    window.addEventListener('languageChange', (e) => {
        const lang = e.detail.lang;
        updateDynamicText(lang);
    });
});

// STATE for Infinite Scroll
let allImages = [];
let currentIndex = 0;
const BATCH_SIZE = 10; // Reduced from 20 to 10 for lighter frames
let isLoadingBatch = false;

/**
 * Initialize Masonry Gallery
 * Fetches tours, extracts images, shuffles them, and starts Infinite Scroll.
 */
async function initGalleryGrid() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    try {
        const tours = await apiService.getTours();
        if (!tours || tours.length === 0) {
            grid.innerHTML = '<p style="text-align:center; width:100%; color:#888;">No images found.</p>';
            return;
        }

        // 1. Flatten all images
        allImages = [];
        tours.forEach(tour => {
            if (tour.images && tour.images.length > 0) {
                allImages.push(...tour.images);
            }
        });

        // 2. Shuffle images (Fisher-Yates)
        for (let i = allImages.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allImages[i], allImages[j]] = [allImages[j], allImages[i]];
        }

        // 3. Clear Grid & Reset State
        grid.innerHTML = ''; 
        currentIndex = 0;

        // 4. Initial Batch Render
        renderNextBatch();

        // 5. Setup Infinite Scroll Observer
        setupInfiniteScroll();

    } catch (error) {
        console.error('Error loading gallery:', error);
        grid.innerHTML = '<p style="text-align:center; width:100%; color:#888;">Error loading gallery.</p>';
    }
}

/**
 * Render the next batch of images
 * Uses requestAnimationFrame to yield control to UI thread
 */
function renderNextBatch() {
    if (isLoadingBatch || currentIndex >= allImages.length) return;
    isLoadingBatch = true;
    
    // Use requestAnimationFrame to ensure we don't block the style calculation/paint
    requestAnimationFrame(() => {
        const grid = document.getElementById('gallery-grid');
        const end = Math.min(currentIndex + BATCH_SIZE, allImages.length);
        const batch = allImages.slice(currentIndex, end);
        
        const fragment = document.createDocumentFragment();

        batch.forEach((imgSrc, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            // Randomize Spans
            const rand = Math.random();
            if (rand < 0.1) {
                item.classList.add('big');
            } else if (rand < 0.3) {
                item.classList.add('wide');
            } else if (rand < 0.5) {
                item.classList.add('tall');
            }

            // Skeleton
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton';
            
            // Image - OPTIMIZED
            const img = document.createElement('img');
            img.className = 'gallery-img';
            img.alt = 'Nevado Trek Gallery';
            img.loading = 'lazy'; 
            img.decoding = 'async'; // Critical for non-blocking decode
            
            img.onload = () => {
                // Ensure paint happens
                requestAnimationFrame(() => {
                    item.classList.add('loaded');
                });
            };
            
            img.src = imgSrc;

            const overlay = document.createElement('div');
            overlay.className = 'gallery-overlay';

            item.appendChild(skeleton);
            item.appendChild(img);
            item.appendChild(overlay);
            
            fragment.appendChild(item);
            
            // Stagger Animation
            setTimeout(() => {
                 item.style.opacity = '1';
                 item.style.transform = 'translateY(0)';
            }, index * 80); // Slower stagger for smoothness
        });

        grid.appendChild(fragment);
        
        currentIndex += BATCH_SIZE;
        isLoadingBatch = false;

        if (currentIndex >= allImages.length) {
            removeSentinel();
        }
    });
}

/**
 * Setup Intersection Observer for Infinite Scroll
 */
function setupInfiniteScroll() {
    const gridSection = document.querySelector('.gallery-grid-section');
    
    const sentinel = document.createElement('div');
    sentinel.id = 'gallery-sentinel';
    sentinel.style.width = '100%';
    sentinel.style.height = '100px'; // Larger hit area
    sentinel.style.marginTop = '20px'; 
    gridSection.appendChild(sentinel);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isLoadingBatch) {
                // Determine if we need to load more
                // Small buffer delay to avoid rapid-firing
                setTimeout(() => {
                    renderNextBatch();
                }, 100);
            }
        });
    }, {
        root: null, 
        rootMargin: '600px', // Pre-load aggressively so user doesn't see blank space
        threshold: 0.01
    });

    observer.observe(sentinel);
    window.galleryObserver = observer; 
}

function removeSentinel() {
    const sentinel = document.getElementById('gallery-sentinel');
    if (sentinel) sentinel.remove();
    if (window.galleryObserver) window.galleryObserver.disconnect();
}

/**
 * Initialize Header Animations
 */
function initHeaderAnimations() {
    const title = document.querySelector('.page-title');
    const subtitle = document.querySelector('.page-subtitle');
  
    // Title Letter Reveal
    if (title) {
      const text = title.textContent.trim();
      if (text.length > 0) {
        title.textContent = ''; 
        title.style.opacity = '1'; 
        
        const cleanText = text.replace(/\s+/g, ' ').trim();
        const words = cleanText.split(' ');
        
        let globalLetterIndex = 0;
  
        words.forEach((word, index) => {
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.style.whiteSpace = 'nowrap';
          if (index < words.length - 1) {
               wordSpan.style.marginRight = '0.25em'; 
          }
          
          const letters = word.split('');
          letters.forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'letter'; 
            
            const delay = 200 + (globalLetterIndex * 20); 
            span.style.animationDelay = `${delay}ms`;
            
            wordSpan.appendChild(span);
            globalLetterIndex++;
          });
          
          title.appendChild(wordSpan);
        });
      }
    }
  
    // Subtitle Fade Up
    if (subtitle && typeof gsap !== 'undefined') {
      gsap.fromTo(subtitle, 
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.8, 
          ease: 'power2.out'
        }
      );
    } else if (subtitle) {
      subtitle.style.transition = 'opacity 1s ease, transform 1s ease';
      subtitle.style.opacity = '1';
      subtitle.style.transform = 'translateY(0)';
    }
}

/**
 * Handle Language Updates
 */
function updateDynamicText(lang) {
    const pageTitle = document.querySelector('[data-i18n-key="page.gallery.title"]');
    const pageSubtitle = document.querySelector('[data-i18n-key="page.gallery.subtitle"]');

    if (pageTitle) {
       pageTitle.textContent = lang === 'en' ? 'Gallery' : 'Galería';
    }
    
    if (pageSubtitle) {
       pageSubtitle.textContent = lang === 'en' 
         ? 'Unforgettable moments in the Colombian Andes' 
         : 'Momentos inolvidables en los Andes colombianos';
    }

    setTimeout(() => {
        initHeaderAnimations();
    }, 50);
}

/**
 * MOBILE MENU
 */
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle-exclusion');
    const menu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('mobile-menu-close');
    
    if (!toggle || !menu) return;
    
    const links = menu.querySelectorAll('.mobile-nav-link');
    
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      menu.classList.add('active');
      document.body.style.overflow = 'hidden'; 
    });
    
    const closeMenu = () => {
      menu.classList.remove('active');
      document.body.style.overflow = ''; 
    };
    
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }
    
    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        closeMenu();
      }
    });
}
