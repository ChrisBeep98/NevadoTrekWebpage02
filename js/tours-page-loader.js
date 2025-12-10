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
  console.log('🚀 Initializing Tours Page Loader...');

  // 1. Determine Initial Language
  const savedLang = localStorage.getItem('language') || 'es';
  console.log('Using language:', savedLang);

  // 2. Fetch Data
  try {
    [allTours, allDepartures] = await Promise.all([
      apiService.getTours(),
      apiService.getDepartures()
    ]);

    console.log(`✅ Loaded ${allTours.length} tours`);

    // 3. Initial Render
    renderToursGrid(allTours, savedLang);

    // 4. Initialize Filters
    initFilters();

    // 5. Listen for language changes
    window.addEventListener('languageChange', (e) => {
      const lang = e.detail.lang;
      applyLanguageToDynamicElements(lang);
    });

    // 6. Initialize animations
    initAnimations();

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
  
  const price = tour.pricingTiers && tour.pricingTiers.length > 0 
    ? apiService.formatPrice(tour.pricingTiers[0].priceCOP)
    : 'Consultar';

  const altitudeText = tour.altitude ? (tour.altitude[lang] || tour.altitude.es) : '';
  const daysText = lang === 'en' 
    ? (tour.totalDays === 1 ? `${tour.totalDays} Day` : `${tour.totalDays} Days`)
    : (tour.totalDays === 1 ? `${tour.totalDays} Día` : `${tour.totalDays} Días`);

  const mainImage = tour.images && tour.images.length > 0 ? tour.images[0] : '';

  // Alternate between two card types (like index.html)
  const isTypeA = index % 2 === 0;

  if (isTypeA) {
    // Type A: home-tour-card with side image (card-01 style)
    return `
      <div class="home-tour-card card-01" data-tour-id="${tour.tourId}">
        <div class="tour-card">
          <div class="div-block-55">
            <svg
              data-w-id="icon-${tour.tourId}"
              style="opacity: 0"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"
              ></path>
            </svg>
            <h1
              data-w-id="title-icon-${tour.tourId}"
              style="opacity: 0"
              class="h-5 italic"
            >
              ( Próximas Salidas)
            </h1>
          </div>
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
              <h1
                style="opacity: 0"
                class="h-5 medium italic tour-name-heading dynamic-i18n"
                data-i18n-es="${tour.name.es}"
                data-i18n-en="${tour.name.en}"
              >
                ${tour.name[lang] || tour.name.es}
              </h1>
              <div class="div-block-57">
                <h1
                  style="opacity: 0"
                  class="h-6 price-h"
                >
                  ${price}
                </h1>
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
      </div>
    `;
  } else {
    // Type B: home-card-tour-2 (card-02 style)
    return `
      <div class="home-card-tour-2 card-02" data-tour-id="${tour.tourId}">
        <div class="tour-card _02">
          <a
            href="TourPage.html?id=${tour.tourId}"
            class="div-block-17 info-container w-inline-block"
          >
            <div class="div-block-20 top">
              <div class="div-block-20 top"></div>
            </div>
            <div class="div-block-20">
              <div class="div-block-64">
                <div>
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
              <h1
                style="opacity: 0"
                class="h-5 medium italic tour-name-heading dynamic-i18n"
                data-i18n-es="${tour.name.es}"
                data-i18n-en="${tour.name.en}"
              >
                ${tour.name[lang] || tour.name.es}
              </h1>
              <div class="div-block-57">
                <h1
                  style="opacity: 0"
                  class="h-6 price-h"
                >
                  ${price}
                </h1>
                <p
                  style="opacity: 0"
                  class="body-medium f-grey italic dynamic-i18n"
                  data-i18n-es="${tour.shortDescription.es}"
                  data-i18n-en="${tour.shortDescription.en}"
                >
                  ${tour.shortDescription[lang] || tour.shortDescription.es}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
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
 * Apply current filters to tours list
 */
function applyFilters() {
  const lang = localStorage.getItem('language') || 'es';
  
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

  console.log(`Filtered: ${filteredTours.length} tours`);
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
  const elements = document.querySelectorAll('.dynamic-i18n');
  elements.forEach(el => {
    const text = el.getAttribute(`data-i18n-${lang}`);
    if (text) {
      el.textContent = text;
    }
  });

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
}

/**
 * Initialize GSAP animations matching index.html
 */
function initAnimations() {
  if (typeof gsap === 'undefined') return;

  // Fade in cards with stagger
  gsap.from('.home-tour-card, .home-card-tour-2', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    clearProps: 'all'
  });

  // Animate card text elements
  gsap.from('.tour-name-heading, .price-h, .body-medium', {
    opacity: 0,
    y: 15,
    duration: 0.6,
    stagger: 0.1,
    delay: 0.3,
    ease: 'power2.out'
  });

  // Animate icons
  gsap.from('[data-w-id^="icon-"]', {
    opacity: 0,
    scale: 0.8,
    duration: 0.5,
    stagger: 0.1,
    ease: 'back.out(1.7)'
  });
}

/**
 * Show empty state when no tours match filters
 */
function showEmptyState(grid) {
  const lang = localStorage.getItem('language') || 'es';
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

  const lang = localStorage.getItem('language') || 'es';
  const message = lang === 'en' 
    ? 'Error loading tours. Please try again later.'
    : 'Error al cargar los tours. Por favor intenta de nuevo más tarde.';
  
  grid.innerHTML = `
    <div class="empty-state">
      <p style="color: #d93644;">${message}</p>
    </div>
  `;
}

// Expose for debugging
window.toursPageLoader = {
  allTours,
  currentFilters,
  applyFilters,
  applyLanguageToDynamicElements
};
