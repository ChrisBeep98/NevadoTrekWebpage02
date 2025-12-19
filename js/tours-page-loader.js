import { apiService } from './services/api.js';

/**
 * TOURS PAGE LOADER
 * Fetches all tours and renders them in a filterable grid
 * Matches card design from index.html
 */

let allTours = [];
let allDepartures = [];
let currentFilters = {
  difficulty: 'all',
  duration: 'all'
};

document.addEventListener('DOMContentLoaded', async () => {


  // 1. Determine Initial Language
  const savedLang = localStorage.getItem('lang') || 'es';


  // 2. Fetch Data
  try {
    [allTours, allDepartures] = await Promise.all([
      apiService.getTours(),
      apiService.getDepartures()
    ]);



    // 3. Initial Render
    renderToursGrid(allTours, savedLang);
    
    // Apply translations to static elements (filters, titles)
    applyLanguageToDynamicElements(savedLang);

    // 4. Initialize Filters (Smart - hide unused properties)
    initSmartFilters();
    initFilters();

    // 5. Listen for language changes
    window.addEventListener('languageChange', (e) => {
      const lang = e.detail.lang;
      applyLanguageToDynamicElements(lang);
      // Re-render grid to update card content
      renderToursGrid(allTours, lang);
    });

    // 6. Initialize animations
    initAnimations();
    // Filter animations specifically
    initFilterAnimations();
    
    // 7. Initialize Mobile Menu
    initMobileMenu();

  } catch (error) {
    console.error('Error loading tours:', error);
    showError();
  }
});

/**
 * Render all tour cards in the grid
 */
function renderToursGrid(tours, lang = 'es') {
  const grid = document.getElementById('tours-grid');
  if (!grid) return;

  // Clear loading state
  grid.innerHTML = '';

  if (!tours || tours.length === 0) {
    showEmptyState(grid);
    return;
  }

  // Create cards
  tours.forEach((tour, index) => {
    const cardHTML = createTourCardHTML(tour, allDepartures, lang, index);
    grid.insertAdjacentHTML('beforeend', cardHTML);
  });

  // Apply language to dynamic elements
  setTimeout(() => {
    applyLanguageToDynamicElements(lang);
  }, 50);
}

/**
 * Create HTML for a single tour card
 * MATCHES structure from index.html (lines 459-665)
 */
function createTourCardHTML(tour, departures, lang = 'es', index = 0) {
  const nextDate = apiService.getNextDepartureDate(tour.tourId, departures);
  const dateStr = nextDate ? nextDate.toLocaleDateString('es-CO') : 'Por definir';
  
  // Price Logic: Calculate CHEAPEST price in both currencies
  let priceCOP = 'Consultar';
  let priceUSD = 'Contact us';
  
  if (tour.pricingTiers && tour.pricingTiers.length > 0) {
    // Find absolute minimum prices
    const minCOP = Math.min(...tour.pricingTiers.map(t => t.priceCOP || Infinity));
    // Assume priceUSD exists as per user, otherwise fallback or calculate
    const minUSD = Math.min(...tour.pricingTiers.map(t => t.priceUSD || Infinity));

    if (minCOP !== Infinity) {
      priceCOP = `${apiService.formatPrice(minCOP)} COP`;
    }
    
    if (minUSD !== Infinity) {
      priceUSD = `${apiService.formatPriceUSD(minUSD)} USD`;
    } else {
      // Fallback if no USD price found (safe default)
      priceUSD = 'Contact us';
    }
  }

  // Set initial text based on current lang
  let currentPrice = lang === 'en' ? priceUSD : priceCOP;

  const altitudeText = tour.altitude ? (tour.altitude[lang] || tour.altitude.es) : '';
  const daysText = lang === 'en' 
    ? (tour.totalDays === 1 ? `${tour.totalDays} Day` : `${tour.totalDays} Days`)
    : (tour.totalDays === 1 ? `${tour.totalDays} Día` : `${tour.totalDays} Días`);

  const mainImage = tour.images && tour.images.length > 0 ? tour.images[0] : '';

  // Single card type matching index.html structure
  return `
    <div class="home-tour-card card-01" data-tour-id="${tour.tourId}">
      <div class="tour-card">
        <a
          href="TourPage.html?id=${tour.tourId}"
          class="div-block-17 info-container w-inline-block"
        >
          <div class="div-block-20 top">
            <div class="div-block-20 top"></div>
          </div>
          <div class="div-block-20">
            <div class="div-block-64">
              <div class="div-block-86">
                <div class="pink-chip">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path
                      d="M7 1V3H3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H10.7546C9.65672 19.6304 9 17.8919 9 16C9 11.5817 12.5817 8 17 8C18.8919 8 20.6304 8.65672 22 9.75463V4C22 3.44772 21.5523 3 21 3H17V1H15V3H9V1H7ZM23 16C23 19.3137 20.3137 22 17 22C13.6863 22 11 19.3137 11 16C11 12.6863 13.6863 10 17 10C20.3137 10 23 12.6863 23 16ZM16 12V16.4142L18.2929 18.7071L19.7071 17.2929L18 15.5858V12H16Z"
                    ></path>
                  </svg>
                  <p class="body-small">${dateStr}</p>
                </div>
              </div>
              <div class="chip-tour-info-wrapper mobile-hide">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <g fill="none" fill-rule="evenodd">
                    <path
                      fill="currentColor"
                      d="M8.70098,5.75 C9.27833,4.75 10.7217,4.75 11.2991,5.75 L14.7991,11.8122 L15.701,10.25 C16.2784,9.25 17.7217,9.25 18.2991,10.25 L22.6292,17.75 C23.2066,18.75 22.4849,20 21.3302,20 L17.0001,20 L17.0001,19.9984 C16.9763,19.9995 16.9524,20 16.9282,20 L3.07182,20 C1.91711,20 1.19543,18.75 1.77278,17.75 L8.70098,5.75 Z M7.79128,11.3256 L8.50004,11.7981 L9.44534,11.1679 C9.78124,10.944 10.2188,10.944 10.5547,11.1679 L11.5,11.7981 L12.2088,11.3257 L10,7.5 L7.79128,11.3256 Z"
                    ></path>
                  </g>
                </svg>
                <p class="body-small dynamic-i18n" data-i18n-es="${altitudeText}" data-i18n-en="${altitudeText}">${altitudeText}</p>
              </div>
              <div class="chip-tour-info-wrapper mobile-hide">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <g fill="none" fill-rule="evenodd">
                    <path
                      fill="currentColor"
                      d="M8.70098,5.75 C9.27833,4.75 10.7217,4.75 11.2991,5.75 L14.7991,11.8122 L15.701,10.25 C16.2784,9.25 17.7217,9.25 18.2991,10.25 L22.6292,17.75 C23.2066,18.75 22.4849,20 21.3302,20 L17.0001,20 L17.0001,19.9984 C16.9763,19.9995 16.9524,20 16.9282,20 L3.07182,20 C1.91711,20 1.19543,18.75 1.77278,17.75 L8.70098,5.75 Z M7.79128,11.3256 L8.50004,11.7981 L9.44534,11.1679 C9.78124,10.944 10.2188,10.944 10.5547,11.1679 L11.5,11.7981 L12.2088,11.3257 L10,7.5 L7.79128,11.3256 Z"
                    ></path>
                  </g>
                </svg>
                <p class="body-small dynamic-i18n" data-i18n-es="${daysText}" data-i18n-en="${daysText}">${daysText}</p>
              </div>
            </div>
            <div class="div-block-56">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M13.4697 8.53033C13.1768 8.23744 13.1768 7.76256 13.4697 7.46967C13.7626 7.17678 14.2374 7.17678 14.5303 7.46967L18.5303 11.4697C18.8232 11.7626 18.8232 12.2374 18.5303 12.5303L14.5303 16.5303C14.2374 16.8232 13.7626 16.8232 13.4697 16.5303C13.1768 16.2374 13.1768 15.7626 13.4697 15.4697L16.1893 12.75H6.5C6.08579 12.75 5.75 12.4142 5.75 12C5.75 11.5858 6.08579 11.25 6.5 11.25H16.1893L13.4697 8.53033Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </div>
          <img
            src="${mainImage}"
            loading="lazy"
            alt="${tour.name.es}"
            class="image-8 main-tour-img"
          />
        </a>
        <div class="tour-card-container-text">
          <div class="div-block-24">
            <div class="div-block-57">
              <h1
                style="opacity: 0"
                class="h-5 medium italic tour-name-heading dynamic-i18n"
                data-i18n-es="${tour.name.es}"
                data-i18n-en="${tour.name.en}"
              >
                ${tour.name[lang] || tour.name.es}
              </h1>
              <h1
                class="h-6 price-h dynamic-i18n"
                data-i18n-es="${priceCOP}"
                data-i18n-en="${priceUSD}"
              >
                ${currentPrice}
              </h1>
            </div>
            <p
              style="opacity: 0"
              class="body-medium f-grey italic descriptin-responsiveness dynamic-i18n"
              data-i18n-es="${tour.shortDescription.es}"
              data-i18n-en="${tour.shortDescription.en}"
            >
              ${tour.shortDescription[lang] || tour.shortDescription.es}
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initialize filter event listeners
 */
function initFilters() {
  // Difficulty filters
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      // Update active state
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      // Update filter
      currentFilters.difficulty = chip.dataset.difficulty;
      applyFilters();
    });
  });

  // Duration filter
  const durationFilter = document.getElementById('duration-filter');
  if (durationFilter) {
    durationFilter.addEventListener('change', (e) => {
      currentFilters.duration = e.target.value;
      applyFilters();
    });
  }
}

/**
 * Smart Filters: Hide difficulty options that don't exist in the data
 */
function initSmartFilters() {
  if (!allTours || allTours.length === 0) return;

  // Map API values to Chip values
  // API uses "Medium", Chips use "Moderate", etc.
  const difficultyMapping = {
    'easy': 'easy',
    'medium': 'moderate',
    'moderate': 'moderate',
    'hard': 'difficult',
    'difficult': 'difficult',
    // Add others if needed
  };

  const foundDifficulties = new Set();
  
  allTours.forEach(tour => {
    if (tour.difficulty) {
      const apiValue = tour.difficulty.toLowerCase();
      // Add direct value
      foundDifficulties.add(apiValue);
      // Add mapped value
      if (difficultyMapping[apiValue]) {
        foundDifficulties.add(difficultyMapping[apiValue]);
      }
    }
  });



  const chips = document.querySelectorAll('.filter-chip');
  let hasVisibleChips = false;

  chips.forEach(chip => {
    const chipVal = (chip.dataset.difficulty || '').toLowerCase();
    
    // Always show 'all'
    if (chipVal === 'all') {
      chip.style.display = 'inline-block';
      return;
    }
    
    if (foundDifficulties.has(chipVal)) {
        chip.style.display = 'inline-block';
        hasVisibleChips = true;
    } else {
        chip.style.display = 'none';
        chip.classList.remove('active'); // Deselect if hidden
    }
  });

  // Fallback: If no specific chips are visible (only 'All'), 
  // show them all to avoid empty UI bug in case of data mismatch
  if (!hasVisibleChips) {
    console.warn('Smart filters hid all options. Reverting to show all.');
    chips.forEach(c => c.style.display = 'inline-block');
  }
}

/**
 * Animate Filters Entrance
 */
function initFilterAnimations() {
  // Ensure elements are visible if GSAP is missing
  if (typeof gsap === 'undefined') {
    document.querySelector('.filters-section').style.opacity = '1';
    return;
  }

  // Kill any previous tweens to prevent conflicts
  gsap.killTweensOf('.filter-chip');
  gsap.killTweensOf('.filter-label');
  gsap.killTweensOf('.duration-filter');

  const tl = gsap.timeline({ delay: 0.2 });

  // Animate labels
  tl.fromTo('.filter-label', 
    { y: 10, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
  );

  // Animate Visible Chips
  // Select only chips that are NOT display: none
  const visibleChips = Array.from(document.querySelectorAll('.filter-chip'))
    .filter(c => getComputedStyle(c).display !== 'none');
  
  if (visibleChips.length > 0) {
    tl.fromTo(visibleChips,
      { y: 15, opacity: 0 },
      {
        y: 0, 
        opacity: 1, 
        duration: 0.5, 
        stagger: 0.05, 
        ease: 'back.out(1.2)'
      }, 
      "-=0.3"
    );
  }

  // Animate Duration Dropdown
  tl.fromTo('.duration-filter',
    { y: 15, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    "-=0.4"
  );
}

/**
 * Apply current filters to tours list
 */
function applyFilters() {
  const lang = localStorage.getItem('lang') || 'es';
  
  let filteredTours = allTours;

  // Filter by difficulty
  if (currentFilters.difficulty !== 'all') {
    filteredTours = filteredTours.filter(tour => 
      tour.difficulty === currentFilters.difficulty
    );
  }

  // Filter by duration
  if (currentFilters.duration !== 'all') {
    filteredTours = filteredTours.filter(tour => {
      const days = tour.totalDays;
      switch (currentFilters.duration) {
        case '1':
          return days === 1;
        case '2-3':
          return days >= 2 && days <= 3;
        case '4-5':
          return days >= 4 && days <= 5;
        case '6+':
          return days >= 6;
        default:
          return true;
      }
    });
  }


  renderToursGrid(filteredTours, lang);
  
  // Re-initialize animations
  setTimeout(() => {
    initAnimations();
  }, 100);
}

/**
 * Apply language to all dynamic elements
 */
function applyLanguageToDynamicElements(lang) {
  if (window.NT_I18N && window.NT_I18N.apply) {
    window.NT_I18N.apply(lang);
  }

  // Update page title and subtitle
  const pageTitle = document.querySelector('[data-i18n-key="page.tours.title"]');
  const pageSubtitle = document.querySelector('[data-i18n-key="page.tours.subtitle"]');
  
    if (pageTitle) {
    pageTitle.textContent = lang === 'en' ? 'Our Tours' : 'Nuestros Tours';
  }
  if (pageSubtitle) {
    pageSubtitle.textContent = lang === 'en' 
      ? 'Discover unforgettable adventures in the Colombian Andes' 
      : 'Descubre aventuras inolvidables en los Andes colombianos';
  }

  // Re-run header animations after text update
  // Check if we are not already animating to avoid loops, 
  // but simpler to just clear and re-run since textContent wiped it anyway.
  initHeaderAnimations();
}

/**
 * Initialize GSAP animations matching index.html
 */
function initAnimations() {
  // Fallback: ensure text is visible even if GSAP is not loaded
  setTimeout(() => {
    document.querySelectorAll('.tour-name-heading, .price-h, .body-medium').forEach(el => {
      if (el.style.opacity === '0') {
        el.style.opacity = '1';
      }
    });
  }, 1000);

  if (typeof gsap === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Image Parallax Effect - Optimized
  const tourCards = document.querySelectorAll('.home-tour-card');
  
  tourCards.forEach(card => {
    const img = card.querySelector('.main-tour-img');
    if (!img) return;
    
    img.style.willChange = 'transform';
    
    gsap.to(img, {
      y: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
  });

  // PER-CARD ANIMATIONS LOOP
  // Iterate through each card to set up individual animations
  tourCards.forEach((card, index) => {
    const title = card.querySelector('.tour-name-heading');
    const price = card.querySelector('.price-h');
    const description = card.querySelector('.body-medium');
    
    // Animate Card Entrance
    gsap.from(card, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%', // Trigger when top of card hits 85% of viewport height
        toggleActions: 'play none none none'
      }
    });

    // Animate Title
    if (title) {
      gsap.from(title, {
        opacity: 0,
        y: 15,
        duration: 0.8, // Increased duration
        delay: 0.5, // Increased delay (was 0.2)
        ease: 'power2.out',
        clearProps: 'opacity,transform',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    // Animate Price
    if (price) {
      gsap.from(price, {
        opacity: 0,
        y: 15,
        duration: 0.8,
        delay: 0.7, // Increased delay (was 0.3)
        ease: 'power2.out',
        clearProps: 'opacity,transform',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    // Animate Description
    if (description) {
      gsap.from(description, {
        opacity: 0,
        y: 15,
        duration: 0.8,
        delay: 0.9, // Increased delay (was 0.4)
        ease: 'power2.out',
        clearProps: 'opacity,transform',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    // Animate Chips (optional but recommended for consistency)
    const chips = card.querySelectorAll('.chip-tour-info-wrapper, .pink-chip, .div-block-56');
    if (chips.length > 0) {
      gsap.from(chips, {
        opacity: 0,
        y: 10,
        duration: 0.6,
        stagger: 0.1,
        delay: 1.1, // Increased delay (was 0.5)
        ease: 'back.out(1.2)',
        clearProps: 'opacity,transform',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }
  });
}

/**
 * Show empty state when no tours match filters
 */
function showEmptyState(grid) {
  const lang = localStorage.getItem('lang') || 'es';
  const message = lang === 'en' 
    ? 'No tours match your filters. Try adjusting your search.'
    : 'No hay tours que coincidan con tus filtros. Prueba ajustar tu búsqueda.';
  
  grid.innerHTML = `
    <div class="empty-state">
      <p>${message}</p>
    </div>
  `;
}

/**
 * Show error state when API fails
 */
function showError() {
  const grid = document.getElementById('tours-grid');
  if (!grid) return;

  const lang = localStorage.getItem('lang') || 'es';
  const message = lang === 'en' 
    ? 'Error loading tours. Please try again later.'
    : 'Error al cargar los tours. Por favor intenta de nuevo más tarde.';
  
  grid.innerHTML = `
    <div class="empty-state">
      <p style="color: #d93644;">${message}</p>
    </div>
  `;
}


/**
 * Initialize Header Animations
 * Premium letter reveal for title + ease up for subtitle
 * Uses word-safe splitting and Apple-style easing
 */
/**
 * Initialize Header Animations
 * Premium letter reveal for title (CSS based) + ease up for subtitle (GSAP)
 * Matches index.html implementation exactly
 */
function initHeaderAnimations() {
  const title = document.querySelector('.page-title');
  const subtitle = document.querySelector('.page-subtitle');

  // Title Letter Reveal (CSS Animation)
  if (title) {
    const text = title.textContent.trim();
    if (text.length > 0) {
      title.textContent = ''; // Clear text
      title.style.opacity = '1'; // Make container visible
      
      // Clean up multiple spaces
      const cleanText = text.replace(/\s+/g, ' ').trim();
      const words = cleanText.split(' ');
      
      let globalLetterIndex = 0;

      words.forEach((word, index) => {
        // Wrapper for word to prevent breaking
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';
        // Add minimal margin except for last word
        if (index < words.length - 1) {
             wordSpan.style.marginRight = '0.25em'; 
        }
        
        const letters = word.split('');
        letters.forEach(char => {
          const span = document.createElement('span');
          span.textContent = char;
          span.className = 'letter'; // Triggers CSS animation in index-animations.css
          
          // Stagger delay: 40ms per letter
          const delay = globalLetterIndex * 20; // 70ms match index.html
          span.style.animationDelay = `${delay}ms`;
          
          wordSpan.appendChild(span);
          globalLetterIndex++;
        });
        
        title.appendChild(wordSpan);
      });
    }
  }

  // Subtitle Fade Up (GSAP for simple smoothness)
  if (subtitle && typeof gsap !== 'undefined') {
    gsap.fromTo(subtitle, 
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.8, // Wait for title to finish mostly
        ease: 'power2.out'
      }
    );
  } else if (subtitle) {
    // Fallback if GSAP fails
    subtitle.style.transition = 'opacity 1s ease, transform 1s ease';
    subtitle.style.opacity = '1';
    subtitle.style.transform = 'translateY(0)';
  }
}

// Expose for debugging
window.toursPageLoader = {
  allTours,
  currentFilters,
  applyFilters,
  applyLanguageToDynamicElements
};

/**
 * MOBILE MENU TOGGLE
 * Opens/closes the mobile menu overlay when hamburger is clicked
 */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle-exclusion');
  const menu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');
  
  if (!toggle || !menu) {

    return;
  }
  
  const links = menu.querySelectorAll('.mobile-nav-link');
  
  // Open menu on hamburger click
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    menu.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  });
  
  // Close menu function
  const closeMenu = () => {
    menu.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
  };
  
  // Close on X button click
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }
  
  // Close on link click (for smooth navigation)
  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      closeMenu();
    }
  });
}
