import { apiService } from './services/api.js';

/**
 * OPTIMIZED TOURS PAGE LOADER
 * Performance-first approach with template cloning and smart filtering
 */

// State management
let allTours = [];
let allDepartures = [];
let currentFilters = {
  difficulty: 'all',
  duration: 'all'
};

// DOM elements cache
const elements = {};

/**
 * Initialize app
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Cache DOM elements
  cacheElements();
  
  // Determine initial language
  const savedLang = localStorage.getItem('lang') || 'es';
  
  try {
    // Fetch data in parallel
    [allTours, allDepartures] = await Promise.all([
      apiService.getTours(),
      apiService.getDepartures()
    ]);
    
    // Initial render
    renderToursGrid(allTours, savedLang);
    applyLanguageToDynamicElements(savedLang);
    
    // Initialize features
    initSmartFilters();
    initFilters();
    initFilterAnimations();
    initHeaderAnimations();
    initMobileMenu();
    
    // Language change listener
    window.addEventListener('languageChange', (e) => {
      const lang = e.detail.lang;
      applyLanguageToDynamicElements(lang);
      updateCardsLanguage(lang);
    });
    
    // Initialize scroll animations
    initScrollAnimations();
    
  } catch (error) {
    console.error('Error loading tours:', error);
    showError();
  }
});

/**
 * Cache DOM elements for better performance
 */
function cacheElements() {
  elements.grid = document.getElementById('tours-grid');
  elements.template = document.getElementById('tour-card-template');
  elements.filters = {
    difficulty: document.querySelectorAll('.filter-chip'),
    duration: document.getElementById('duration-filter'),
    clear: document.getElementById('clear-filters-btn')
  };
}

/**
 * Render tours grid using template cloning (much faster than innerHTML)
 */
function renderToursGrid(tours, lang = 'es') {
  if (!elements.grid || !elements.template) return;
  
  // Clear grid
  elements.grid.innerHTML = '';
  
  if (!tours || tours.length === 0) {
    showEmptyState(elements.grid, lang);
    return;
  }
  
  // Create document fragment for batch DOM insertion
  const fragment = document.createDocumentFragment();
  
  tours.forEach(tour => {
    const card = createTourCard(tour, lang);
    if (card) fragment.appendChild(card);
  });
  
  // Single DOM update
  elements.grid.appendChild(fragment);
  
  // Apply language to newly created elements
  setTimeout(() => applyLanguageToDynamicElements(lang), 50);
}

/**
 * Create tour card using template cloning (performance optimization)
 */
function createTourCard(tour, lang = 'es') {
  if (!elements.template) return null;
  
  // Clone template
  const clone = elements.template.content.cloneNode(true);
  const card = clone.querySelector('.tour-card');
  
  // Set data attributes for filtering
  card.dataset.tourId = tour.tourId;
  card.dataset.difficulty = tour.difficulty?.toLowerCase() || '';
  card.dataset.days = tour.totalDays || 0;
  
  // Update link href
  const link = clone.querySelector('.tour-card__link');
  if (link) link.href = `TourPage.html?id=${tour.tourId}`;
  
  // Update image
  const img = clone.querySelector('.tour-card__image');
  if (img && tour.images && tour.images[0]) {
    img.src = tour.images[0];
    img.alt = tour.name[lang] || tour.name.es;
  }
  
  // Update badges
  updateBadges(clone, tour, lang);
  
  // Update content
  updateCardContent(clone, tour, lang);
  
  return clone;
}

/**
 * Update card badges
 */
function updateBadges(clone, tour, lang) {
  // Date badge
  const nextDate = apiService.getNextDepartureDate(tour.tourId, allDepartures);
  const dateText = nextDate ? nextDate.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-CO') : (lang === 'en' ? 'TBD' : 'Por definir');
  const dateBadge = clone.querySelector('.badge--date .badge__text');
  if (dateBadge) dateBadge.textContent = dateText;
  
  // Altitude badge
  const altitudeText = tour.altitude ? (tour.altitude[lang] || tour.altitude.es) : '';
  const altitudeBadge = clone.querySelector('.badge--altitude .badge__text');
  if (altitudeBadge) {
    altitudeBadge.textContent = altitudeText;
    altitudeBadge.dataset.i18nEs = altitudeText;
    altitudeBadge.dataset.i18nEn = altitudeText;
    altitudeBadge.classList.add('dynamic-i18n');
  }
  
  // Duration badge
  const daysText = lang === 'en' 
    ? (tour.totalDays === 1 ? `${tour.totalDays} Day` : `${tour.totalDays} Days`)
    : (tour.totalDays === 1 ? `${tour.totalDays} Día` : `${tour.totalDays} Días`);
  const durationBadge = clone.querySelector('.badge--duration .badge__text');
  if (durationBadge) {
    durationBadge.textContent = daysText;
    durationBadge.dataset.i18nEs = daysText;
    durationBadge.dataset.i18nEn = daysText;
    durationBadge.classList.add('dynamic-i18n');
  }
}

/**
 * Update card content (title, price, description)
 */
function updateCardContent(clone, tour, lang) {
  // Title
  const title = clone.querySelector('.tour-card__title');
  if (title) {
    title.textContent = tour.name[lang] || tour.name.es;
    title.dataset.i18nEs = tour.name.es;
    title.dataset.i18nEn = tour.name.en;
    title.classList.add('dynamic-i18n');
  }
  
  // Price
  const price = clone.querySelector('.tour-card__price');
  if (price) {
    const priceCOP = calculateCheapestPrice(tour, 'COP');
    const priceUSD = calculateCheapestPrice(tour, 'USD');
    const currentPrice = lang === 'en' ? priceUSD : priceCOP;
    
    price.textContent = currentPrice;
    price.dataset.i18nEs = priceCOP;
    price.dataset.i18nEn = priceUSD;
    price.classList.add('dynamic-i18n');
  }
  
  // Description
  const description = clone.querySelector('.tour-card__description');
  if (description) {
    description.textContent = tour.shortDescription[lang] || tour.shortDescription.es;
    description.dataset.i18nEs = tour.shortDescription.es;
    description.dataset.i18nEn = tour.shortDescription.en;
    description.classList.add('dynamic-i18n');
  }
}

/**
 * Calculate cheapest price for tour
 */
function calculateCheapestPrice(tour, currency) {
  if (!tour.pricingTiers || tour.pricingTiers.length === 0) {
    return currency === 'USD' ? 'Contact us' : 'Consultar';
  }
  
  const priceKey = currency === 'USD' ? 'priceUSD' : 'priceCOP';
  const minPrice = Math.min(...tour.pricingTiers.map(t => t[priceKey] || Infinity));
  
  if (minPrice === Infinity) {
    return currency === 'USD' ? 'Contact us' : 'Consultar';
  }
  
  if (currency === 'USD') {
    return `${apiService.formatPriceUSD(minPrice)} USD`;
  } else {
    return `${apiService.formatPrice(minPrice)} COP`;
  }
}

/**
 * Initialize filters
 */
function initFilters() {
  // Difficulty filters
  elements.filters.difficulty.forEach(chip => {
    chip.addEventListener('click', () => {
      elements.filters.difficulty.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilters.difficulty = chip.dataset.difficulty;
      applyFilters();
    });
  });
  
  // Duration filter
  if (elements.filters.duration) {
    elements.filters.duration.addEventListener('change', (e) => {
      currentFilters.duration = e.target.value;
      applyFilters();
    });
  }
  
  // Clear button
  if (elements.filters.clear) {
    elements.filters.clear.addEventListener('click', () => {
      currentFilters.difficulty = 'all';
      currentFilters.duration = 'all';
      
      elements.filters.difficulty.forEach(c => {
        c.classList.remove('active');
        if (c.dataset.difficulty === 'all') c.classList.add('active');
      });
      
      if (elements.filters.duration) {
        elements.filters.duration.value = 'all';
      }
      
      applyFilters();
    });
  }
}

/**
 * Apply filters using CSS toggle (no re-render needed)
 */
function applyFilters() {
  const cards = document.querySelectorAll('.tour-card');
  let visibleCount = 0;
  
  cards.forEach(card => {
    const matchesDifficulty = filterByDifficulty(card);
    const matchesDuration = filterByDuration(card);
    const shouldShow = matchesDifficulty && matchesDuration;
    
    card.classList.toggle('hidden', !shouldShow);
    if (shouldShow) visibleCount++;
  });
  
  // Show empty state if no results
  if (visibleCount === 0) {
    const lang = localStorage.getItem('lang') || 'es';
    showEmptyState(elements.grid, lang);
  }
}

/**
 * Filter card by difficulty
 */
function filterByDifficulty(card) {
  if (currentFilters.difficulty === 'all') return true;
  
  const cardDifficulty = card.dataset.difficulty;
  const chipToApiMapping = {
    'easy': ['easy'],
    'moderate': ['moderate', 'medium'],
    'moderate-difficult': ['moderate-difficult', 'medium-hard'],
    'difficult': ['difficult', 'hard']
  };
  
  const validValues = chipToApiMapping[currentFilters.difficulty] || [currentFilters.difficulty];
  return validValues.includes(cardDifficulty);
}

/**
 * Filter card by duration
 */
function filterByDuration(card) {
  if (currentFilters.duration === 'all') return true;
  
  const days = parseInt(card.dataset.days);
  
  switch (currentFilters.duration) {
    case '1': return days === 1;
    case '2-3': return days >= 2 && days <= 3;
    case '4-5': return days >= 4 && days <= 5;
    case '6+': return days >= 6;
    default: return true;
  }
}

/**
 * Smart filters: hide unused difficulty options
 */
function initSmartFilters() {
  if (!allTours || allTours.length === 0) return;
  
  const foundDifficulties = new Set();
  const difficultyMapping = {
    'easy': 'easy',
    'medium': 'moderate',
    'moderate': 'moderate',
    'hard': 'difficult',
    'difficult': 'difficult',
  };
  
  allTours.forEach(tour => {
    if (tour.difficulty) {
      const apiValue = tour.difficulty.toLowerCase();
      foundDifficulties.add(apiValue);
      if (difficultyMapping[apiValue]) {
        foundDifficulties.add(difficultyMapping[apiValue]);
      }
    }
  });
  
  let hasVisibleChips = false;
  elements.filters.difficulty.forEach(chip => {
    const chipVal = (chip.dataset.difficulty || '').toLowerCase();
    
    if (chipVal === 'all') {
      chip.style.display = 'inline-block';
      return;
    }
    
    if (foundDifficulties.has(chipVal)) {
      chip.style.display = 'inline-block';
      hasVisibleChips = true;
    } else {
      chip.style.display = 'none';
      chip.classList.remove('active');
    }
  });
  
  if (!hasVisibleChips) {
    elements.filters.difficulty.forEach(c => c.style.display = 'inline-block');
  }
}

/**
 * Update cards language without re-rendering
 */
function updateCardsLanguage(lang) {
  document.querySelectorAll('.dynamic-i18n').forEach(el => {
    const text = lang === 'en' ? el.dataset.i18nEn : el.dataset.i18nEs;
    if (text) el.textContent = text;
  });
}

/**
 * Apply language to static elements
 */
function applyLanguageToDynamicElements(lang) {
  if (window.NT_I18N && window.NT_I18N.apply) {
    window.NT_I18N.apply(lang);
  }
  
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
  
  initHeaderAnimations();
}

/**
 * Initialize filter animations
 */
function initFilterAnimations() {
  if (typeof gsap === 'undefined') {
    document.querySelector('.filters-section').style.opacity = '1';
    return;
  }
  
  gsap.killTweensOf(['.filter-chip', '.duration-filter', '.clear-filters-btn']);
  
  const tl = gsap.timeline({ delay: 0.2 });
  
  tl.fromTo(['.clear-filters-btn', '.duration-filter'],
    { y: 15, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.2)' }
  );
  
  const visibleChips = Array.from(elements.filters.difficulty)
    .filter(c => getComputedStyle(c).display !== 'none');
  
  if (visibleChips.length > 0) {
    tl.fromTo(visibleChips,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(1.2)' },
      "-=0.3"
    );
  }
}

/**
 * Initialize header animations
 */
function initHeaderAnimations() {
  const title = document.querySelector('.page-title');
  const subtitle = document.querySelector('.page-subtitle');
  
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
          span.style.animationDelay = `${globalLetterIndex * 20}ms`;
          wordSpan.appendChild(span);
          globalLetterIndex++;
        });
        
        title.appendChild(wordSpan);
      });
    }
  }
  
  if (subtitle && typeof gsap !== 'undefined') {
    gsap.fromTo(subtitle,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: 'power2.out' }
    );
  } else if (subtitle) {
    subtitle.style.transition = 'opacity 1s ease, transform 1s ease';
    subtitle.style.opacity = '1';
    subtitle.style.transform = 'translateY(0)';
  }
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('.tour-card').forEach(el => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
    return;
  }
  
  gsap.registerPlugin(ScrollTrigger);
  
  const tourCards = document.querySelectorAll('.tour-card');
  if (tourCards.length === 0) return;
  
  gsap.set(tourCards, { opacity: 0, y: 30, visibility: 'visible' });
  
  ScrollTrigger.batch(tourCards, {
    onEnter: batch => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'expo.out',
        overwrite: true
      });
    },
    start: 'top 95%',
    once: true
  });
  
  setTimeout(() => ScrollTrigger.refresh(), 300);
}

/**
 * Initialize mobile menu
 */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle-exclusion');
  const menu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');
  
  if (!toggle || !menu) return;
  
  const closeMenu = () => {
    menu.classList.remove('active');
    document.body.style.overflow = '';
  };
  
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    menu.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  
  menu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      closeMenu();
    }
  });
}

/**
 * Show empty state
 */
function showEmptyState(grid, lang = 'es') {
  const message = lang === 'en' 
    ? 'No tours match your filters. Try adjusting your search.'
    : 'No hay tours que coincidan con tus filtros. Prueba ajustar tu búsqueda.';
  
  grid.innerHTML = `<div class="empty-state"><p>${message}</p></div>`;
}

/**
 * Show error state
 */
function showError() {
  if (!elements.grid) return;
  
  const lang = localStorage.getItem('lang') || 'es';
  const message = lang === 'en' 
    ? 'Error loading tours. Please try again later.'
    : 'Error al cargar los tours. Por favor intenta de nuevo más tarde.';
  
  elements.grid.innerHTML = `<div class="empty-state"><p style="color: #d93644;">${message}</p></div>`;
}

// Expose for debugging
window.toursPageLoader = {
  allTours,
  currentFilters,
  applyFilters,
  applyLanguageToDynamicElements
};
