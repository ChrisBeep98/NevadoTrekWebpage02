/**
 * Nueva Página de Tours - Script Principal
 * Maneja la carga de tours, filtros y interacciones
 */

// Tour Data (will be populated from API)
let TOURS_DATA = [];

// Difficulty labels translation
const DIFFICULTY_LABELS = {
  easy: { es: "Fácil", en: "Easy" },
  moderate: { es: "Moderado", en: "Moderate" },
  difficult: { es: "Difícil", en: "Difficult" }
};

// Duration labels
const DURATION_LABELS = {
  1: { es: "1 día", en: "1 day" },
  "2-3": { es: "2-3 días", en: "2-3 days" },
  "4-5": { es: "4-5 días", en: "4-5 days" },
  "6+": { es: "6+ días", en: "6+ days" }
};

// Current language
let currentLang = localStorage.getItem('lang') || 'es';

// Active filters
let activeFilters = {
  difficulty: 'all',
  duration: 'all'
};

/**
 * Initialize the page
 */
async function init() {
  await loadToursFromAPI();
  renderTours();
  setupFilters();
  setupLanguageSwitcher();
  setupNavbar();
  setupMobileMenu();
}

/**
 * Load tours from API
 * Optimized: Only 2 API calls + smaller JSON payload
 */
async function loadToursFromAPI() {
  const grid = document.getElementById('tours-grid');
  if (!grid) {
    console.error('❌ Error: El contenedor #tours-grid no existe en el DOM.');
    return;
  }
  
  try {
    // 1. Fetch tours (Optimized Listing)
    const apiTours = await window.nevadoAPI.fetchTours();
    
    // 2. Fetch departures
    const allDepartures = await window.nevadoAPI.fetchDepartures();
    
    if (!Array.isArray(apiTours)) {
      throw new Error('apiTours no es un array');
    }
    
    // 3. Map departures in memory
    const now = Date.now() / 1000;
    const departureMap = {};
    if (Array.isArray(allDepartures)) {
      allDepartures
        .filter(d => d.status === 'open' && d.type === 'public' && d.date && d.date._seconds >= now)
        .forEach(d => {
          if (!departureMap[d.tourId] || d.date._seconds < departureMap[d.tourId]._seconds) {
            departureMap[d.tourId] = d.date;
          }
        });
    }
    
    // 4. Transform data
    TOURS_DATA = apiTours.map(t => {
      const nextDateTimestamp = departureMap[t.tourId];
      const nextDateStr = window.nevadoAPI.formatDate(nextDateTimestamp);
      
      return {
        id: t.tourId,
        title: {
          es: t.name?.es || '',
          en: t.name?.en || ''
        },
        description: {
          es: t.shortDescription?.es || '',
          en: t.shortDescription?.en || ''
        },
        altitude: {
          es: t.altitude?.es || 'N/A',
          en: t.altitude?.en || 'N/A'
        },
        pricing: {
          priceCOP: t.pricingTiers?.length > 0 ? t.pricingTiers[t.pricingTiers.length - 1].priceCOP : 0,
          priceUSD: t.pricingTiers?.length > 0 ? t.pricingTiers[t.pricingTiers.length - 1].priceUSD : 0
        },
        difficulty: (function(d) {
          const lower = (d || '').toLowerCase();
          if (['easy', 'facil', 'baja'].includes(lower)) return 'easy';
          if (['moderate', 'medium', 'media', 'moderado'].includes(lower)) return 'moderate';
          if (['difficult', 'hard', 'dificil', 'challenging', 'extreme', 'alta'].includes(lower)) return 'difficult';
          return 'moderate'; // Default fallback
        })(t.difficulty || t.difficultyLevel),
        duration: window.nevadoAPI.mapTotalDaysToDuration(t.totalDays),
        nextDate: nextDateStr,
        image: window.nevadoAPI.optimizeImage(
          (t.images && t.images.length > 0) ? t.images[0] : "https://via.placeholder.com/400x300"
        ),
        link: `TourPage.html?id=${t.tourId}`
      };
    });
    
    console.log(`✅ TOURS_DATA procesado (${TOURS_DATA.length} tours)`);
    updateAvailableFilters();
    
  } catch (error) {
    console.error('❌ Error fatal en loadToursFromAPI:', error);
    grid.innerHTML = '<div class="nt-loading"><p style="color: #ef4444;">Error al cargar tours. Revisa la consola para más detalles.</p></div>';
  }
}

/**
 * Render tour cards
 */
function renderTours() {
  const grid = document.getElementById('tours-grid');
  const filteredTours = filterTours();
  
  if (filteredTours.length === 0) {
    grid.innerHTML = `
      <div class="nt-loading">
        <p>No se encontraron tours con los filtros seleccionados.</p>
      </div>
    `;
    return;
  }
  
  // Clear grid for fresh render
  grid.innerHTML = '';
  
  // Start Batch Rendering
  // Render first 6 immediately, then the rest in background
  renderInBatches(filteredTours, grid, 0, 6);
}

/**
 * Render tours in small batches to prevent Main Thread blocking (Lag)
 */
function renderInBatches(tours, container, startIndex, batchSize) {
  const endIndex = Math.min(startIndex + batchSize, tours.length);
  const batch = tours.slice(startIndex, endIndex);
  
  // Generate HTML for current batch
  const batchHTML = batch.map(tour => createTourCard(tour)).join('');
  
  // Efficient DOM insertion
  container.insertAdjacentHTML('beforeend', batchHTML);
  
  // Check if there are more tours to render
  if (endIndex < tours.length) {
    // Schedule next batch with a small delay to yield to Main Thread
    // This allows the browser to paint the previous batch and handle user input
    requestAnimationFrame(() => {
      setTimeout(() => {
        renderInBatches(tours, container, endIndex, batchSize);
      }, 50); // 50ms breather
    });
  } else {
    // Finished rendering all batches
    console.log('✅ All tour batches rendered');
    
    // Refresh ScrollTrigger to account for new page height
    if (window.ScrollTrigger) ScrollTrigger.refresh();

    const loader = document.getElementById('initial-loader');
    if (loader && !loader.classList.contains('hidden')) {
      // First load: hide loader then entrance sequence
      hideLoader();
    } else {
      // Subsequent filtering/updates: animate cards immediately
      initTourAnimations();
    }
  }
}

/**
 * Hide the initial preloader
 */
function hideLoader() {
  const loader = document.getElementById('initial-loader');
  if (loader) {
    // Small delay to ensure paint is done
    setTimeout(() => {
      loader.classList.add('hidden');
      
      // Trigger Header Animations
      initHeaderEntranceAnimations();

      // Remove from DOM after transition
      setTimeout(() => {
        loader.remove();
      }, 500);
    }, 200);
  }
}

/**
 * Modern Entrance Sequence using GSAP for Header and Filters
 * Optimized for GPU and Performance
 */
function initHeaderEntranceAnimations() {
  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out",
      duration: 1.2,
      force3D: true
    }
  });

  // 1. Hero Title (Blur + Rise)
  tl.fromTo('.nt-hero-title', 
    { opacity: 0, y: 30, filter: "blur(20px)" },
    { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.6 },
    0.3
  );

  // 2. Hero Subtitle
  tl.fromTo('.nt-hero-subtitle',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0 },
    "-=1.1"
  );

  // 3. Filters Stagger
  tl.fromTo('.nt-filter-chip, .nt-select-wrapper',
    { opacity: 0, y: 15 },
    { 
      opacity: 1, 
      y: 0, 
      stagger: 0.08,
      duration: 1,
      ease: "power2.out"
    },
    "-=0.8"
  );

  // 4. Initial Tour Card Entrance (The ones in view)
  initTourAnimations();
}

/**
 * Initialize staggered entrance animations for the tour cards
 * Uses ScrollTrigger for reveal-on-scroll functionality
 */
function initTourAnimations() {
  const cards = document.querySelectorAll('.nt-tour-card');
  if (cards.length === 0 || !window.gsap) return;

  gsap.killTweensOf(cards);

  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    
    cards.forEach((card) => {
      // Check if card is already "in view" or close to it
      const rect = card.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight;

      gsap.from(card, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
        // Add a slight delay if it's in the first row to wait for the loader/header
        delay: isInViewport ? 0.6 : 0, 
        scrollTrigger: {
          trigger: card,
          start: "top 92%",
          toggleActions: "play none none none",
          once: true
        },
        onComplete: () => gsap.set(card, { clearProps: "transform" })
      });
    });
  } else {
    gsap.from(cards, { 
      opacity: 0, 
      y: 20, 
      stagger: 0.05, 
      duration: 0.6, 
      ease: "power2.out",
      onComplete: () => gsap.set(cards, { clearProps: "transform" })
    });
  }
}

/**
 * Create tour card HTML
 */
function createTourCard(tour) {
  // Extract bilingual content based on current language
  const title = typeof tour.title === 'object' 
    ? (tour.title[currentLang] || tour.title.es || tour.title)
    : tour.title;
  const description = typeof tour.description === 'object' 
    ? (tour.description[currentLang] || tour.description.es || tour.description)
    : tour.description;
  const altitude = typeof tour.altitude === 'object'
    ? (tour.altitude[currentLang] || tour.altitude.es || tour.altitude)
    : tour.altitude;
  
  // Translate chips data
  const durationLabel = DURATION_LABELS[tour.duration][currentLang];
  const dateLabel = tour.nextDate || (currentLang === 'es' ? 'Pronto' : 'Soon');
  
  return `
    <article class="nt-tour-card">
      <a href="${tour.link}" style="text-decoration: none; color: inherit; display: contents;">
        <div class="nt-card-image-shadow-box">
          <div class="nt-card-image-wrapper">
            <img 
              src="${tour.image}" 
              alt="${title}"
              class="nt-card-image"
              loading="lazy"
            />
            
            <!-- Badges Container -->
            <div class="nt-card-badges">
              
              <!-- 1. Next Date (Red) -->
              <span class="nt-badge nt-badge--date">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                ${dateLabel}
              </span>

              <!-- 2. Altitude (Glass) -->
              <span class="nt-badge nt-badge--info">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/>
                </svg>
                ${altitude}
              </span>

              <!-- 3. Duration (Glass) -->
              <span class="nt-badge nt-badge--info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                ${durationLabel}
              </span>

            </div>
            
            <!-- Flecha en esquina superior derecha -->
            <div class="nt-card-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="nt-card-content">
          <div class="nt-card-header">
            <h3 class="nt-card-title">${title}</h3>
            <span class="nt-card-price">${window.nevadoAPI.formatPriceByLang(tour.pricing, currentLang)}</span>
          </div>
          <p class="nt-card-description">${description}</p>
        </div>
      </a>
    </article>
  `;
}

/**
 * Filter tours based on active filters
 */
function filterTours() {
  return TOURS_DATA.filter(tour => {
    const difficultyMatch = activeFilters.difficulty === 'all' || tour.difficulty === activeFilters.difficulty;
    const durationMatch = activeFilters.duration === 'all' || tour.duration === activeFilters.duration;
    return difficultyMatch && durationMatch;
  });
}

/**
 * Setup filter handlers
 */
function setupFilters() {
  // Difficulty filters
  const difficultyChips = document.querySelectorAll('.nt-filter-chip[data-filter]');
  difficultyChips.forEach(chip => {
    chip.addEventListener('click', () => {
      // Update active state
      difficultyChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      
      // Update filter
      activeFilters.difficulty = chip.dataset.filter;
      renderTours();
    });
  });
  
  // Duration filter
  const durationFilter = document.getElementById('duration-filter');
  if (durationFilter) {
    durationFilter.addEventListener('change', (e) => {
      activeFilters.duration = e.target.value;
      renderTours();
    });
  }

  // Clear Filters Button
  const clearBtn = document.getElementById('clear-filters-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      // 1. Reset State
      activeFilters = { difficulty: 'all', duration: 'all' };

      // 2. Reset Difficulty Chips
      document.querySelectorAll('.nt-filter-chip').forEach(c => {
        c.classList.remove('active');
        if (c.dataset.filter === 'all') c.classList.add('active');
      });

      // 3. Reset Duration Select
      if (durationFilter) durationFilter.value = 'all';

      // 4. Re-render
      renderTours();
    });
  }
}

/**
 * Update available filters based on existing tours
 * Hides options that have no matching tours
 */
function updateAvailableFilters() {
  // 1. Get unique values from data
  const existingDifficulties = new Set(TOURS_DATA.map(t => t.difficulty));
  const existingDurations = new Set(TOURS_DATA.map(t => t.duration));
  
  console.log('🔍 Smart Filters Debug:');
  console.log('Unique Difficulties found:', Array.from(existingDifficulties));
  console.log('Unique Durations found:', Array.from(existingDurations));

  // 2. Update Difficulty Chips
  const difficultyChips = document.querySelectorAll('.nt-filter-chip[data-filter]');
  difficultyChips.forEach(chip => {
    const filterValue = chip.dataset.filter;
    if (filterValue === 'all') return; // Always show 'All'

    if (existingDifficulties.has(filterValue)) {
      chip.style.display = '';
    } else {
      chip.style.display = 'none';
      chip.classList.remove('active'); // Ensure hidden chips aren't active
    }
  });

  // 3. Update Duration Select
  const durationSelect = document.getElementById('duration-filter');
  if (durationSelect) {
    let currentSelectionValid = false;
    
    Array.from(durationSelect.options).forEach(option => {
      const filterValue = option.value;
      if (filterValue === 'all') {
        currentSelectionValid = true; // Always valid
        return;
      }

      if (existingDurations.has(filterValue)) {
        option.style.display = '';
        option.disabled = false;
        if (durationSelect.value === filterValue) currentSelectionValid = true;
      } else {
        option.style.display = 'none';
        option.disabled = true;
      }
    });

    // Reset if current selection is no longer valid
    if (!currentSelectionValid && durationSelect.value !== 'all') {
      durationSelect.value = 'all';
      activeFilters.duration = 'all';
    }
  }
}

/**
 * Setup language switcher
 */
function setupLanguageSwitcher() {
  const langBtn = document.getElementById('lang-btn');
  const langOptions = document.getElementById('lang-options');
  const currentLangSpan = document.getElementById('current-lang');
  const currentFlagImg = document.getElementById('current-flag');

  if (!langBtn || !langOptions) return;

  // Toggle dropdown
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langOptions.classList.toggle('show');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    langOptions.classList.remove('show');
  });

  // Handle language selection
  document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const lang = option.dataset.lang;
      const flag = option.dataset.flag;

      currentLangSpan.textContent = lang.toUpperCase();
      currentFlagImg.src = flag;

      localStorage.setItem('lang', lang);
      currentLang = lang;
      langOptions.classList.remove('show');
      
      // Re-render tours with new language
      renderTours();
      
      // Update static elements via global i18n
      if (window.NT_I18N && window.NT_I18N.apply) {
        window.NT_I18N.apply(lang);
      }
    });
  });

  // Initialize language from localStorage
  const savedLang = localStorage.getItem('lang') || 'es';
  currentLang = savedLang;
  if (savedLang === 'en') {
    currentLangSpan.textContent = 'EN';
    currentFlagImg.src = 'https://flagcdn.com/w20/us.png';
  }
  
  // Initial translation for static elements (footer, filters, etc.)
  if (window.NT_I18N && window.NT_I18N.apply) {
    window.NT_I18N.apply(savedLang);
  }
}

/**
 * Setup navbar scroll effect
 */
function setupNavbar() {
  const navbar = document.getElementById('navbar-exclusion');
  if (!navbar) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/**
 * Setup mobile menu
 */
function setupMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle-exclusion');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuClose = document.getElementById('mobile-menu-close');
  
  if (!menuToggle || !mobileMenu || !menuClose) return;
  
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  menuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // Close on outside click
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Initialize Footer Animations
 * Staggered entrance based on viewport entry for maximum performance
 */
function initFooterAnimations() {
  // Footer animations disabled for "Nuclear" performance mode
  return;
}

// Initialize on load
// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  init(); // Async init that handles loading and setup
  initFooterAnimations();
});

