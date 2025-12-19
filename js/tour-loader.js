import { apiService } from './../js/services/api.js';
import { initBookingModal } from './booking-modal.js?v=2';

/**
 * TOUR PAGE LOADER
 * Fetches tour data from API and injects it into TourPage.html
 * Handles bilingual content (ES/EN)
 */

document.addEventListener('DOMContentLoaded', async () => {


  // 1. Get Tour ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const tourId = urlParams.get('id');

  if (!tourId) {
    console.error('No tour ID in URL');
    showError('No se encontró el tour. Por favor selecciona un tour desde la página principal.');
    return;
  }

  // 2. Fetch Data
  try {
    const [tours, departures] = await Promise.all([
      apiService.getTours(),
      apiService.getDepartures()
    ]);

    const tour = tours.find(t => t.tourId === tourId);

    if (!tour) {
      console.error(`Tour not found: ${tourId}`);
      showError('El tour solicitado no existe.');
      return;
    }



    // 3. Render Content
    renderTourPage(tour, departures);

    // 4. Initialize Booking Modal
    initBookingModal(tour, departures);

    // 5. Listen for language changes
    window.addEventListener('languageChange', (e) => {
      const lang = e.detail.lang;
      applyLanguageToDynamicElements(lang);
    });

    // 6. Apply current language
    const currentLang = localStorage.getItem('lang') || 'es';
    applyLanguageToDynamicElements(currentLang);

    // 7. Signal that content is ready
    window.tourData = tour; // Expose tour data globally for animations/other scripts
    window.tourDataLoaded = true;
    window.dispatchEvent(new CustomEvent('tourDataReady'));

  } catch (error) {
    console.error('Error loading tour:', error);
    showError('Error al cargar el tour.');
  }
});

/**
 * Main render function - injects all tour data into the page
 */
function renderTourPage(tour, allDepartures) {
  // --- TITLE ---
  const titleEl = document.querySelector('.h-1');
  if (titleEl) {
    setBilingualText(titleEl, tour.name);
  }

  // --- SUBTITLE ---
  const subtitleEl = document.querySelector('.tour-subtitle');
  if (subtitleEl) {
    const subtitle = tour.subtitle || tour.shortDescription;
    if (subtitle) {
      setBilingualText(subtitleEl, subtitle);
    }
  }

  // --- INFO CHIPS (in .div-block-42) ---
  renderInfoChips(tour);

  // --- HERO IMAGE ---
  const mainImages = document.querySelectorAll('.scroll-zoom-image');
  if (mainImages.length > 0 && tour.images && tour.images.length > 0) {
    mainImages.forEach((img, index) => {
      if (tour.images[index]) {
        img.src = tour.images[index];
        img.srcset = ''; // Clear hardcoded srcset
        img.alt = tour.name.es;
      }
    });
  }

  // --- DESCRIPTION ---
  renderDescription(tour);

  // --- SECONDARY IMAGES ---
  renderSecondaryImages(tour);

  // --- ITINERARY ---
  renderItinerary(tour);

  // --- INCLUSIONS ---
  renderInclusions(tour);

  // --- EXCLUSIONS ---
  renderExclusions(tour);

  // --- RECOMMENDATIONS ---
  renderRecommendations(tour);

  // --- FAQS ---
  renderFAQs(tour);

  // --- PRICING ---
  renderPricing(tour);

  // --- DEPARTURE DATES (Apple-style cards) ---
  renderDates(tour, allDepartures);

  // --- DYNAMIC TOC (no layout changes) ---
  initTOC();

  // --- PAGE TITLE (browser tab) ---
  document.title = `${tour.name.es} | Nevado Trek`;
}

/**
 * Render Apple-style departure date cards
 */
function renderDates(tour, departures) {
  if (!departures || departures.length === 0) return;

  // Filter: this tour + open status + future dates
  const now = new Date();
  const upcomingDates = departures.filter(d => 
    d.tourId === tour.tourId && 
    d.status === 'open' &&
    new Date(d.date._seconds * 1000) >= now
  );

  // Sort by date (soonest first)
  upcomingDates.sort((a, b) => a.date._seconds - b.date._seconds);

  // If no dates, hide section
  if (upcomingDates.length === 0) return;

  // Find insertion point (after FAQ section)
  const faqSection = document.querySelector('.div-block-136');
  if (!faqSection) {
    console.warn('⚠️ FAQ section not found for dates insertion');
    return;
  }

  const parentGrid = faqSection.closest('.a-grid');
  if (!parentGrid) return;

  // Create dates section
  const datesSection = document.createElement('section');
  datesSection.className = 'a-grid mt-20';
  datesSection.setAttribute('data-toc-section', 'fechas');

  // Build HTML
  const displayDates = upcomingDates.slice(0, 4); // Max 4 cards

  let html = `
    <div style="grid-column: 2 / 12;">
      <h1 class="h-5 italic" style="margin-bottom: 48px;">( Próximas Salidas )</h1>
    </div>
    <div style="
      grid-column: 2 / 12;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    ">
  `;

  displayDates.forEach((dateObj, index) => {
    const date = new Date(dateObj.date._seconds * 1000);
    
    // Format date parts
    const dayNumber = date.getDate();
    const month = new Intl.DateTimeFormat('es-CO', { month: 'long' }).format(date);
    const year = date.getFullYear();
    const weekday = new Intl.DateTimeFormat('es-CO', { weekday: 'long' }).format(date);

    // Calculate availability
    const total = dateObj.maxCapacity || 8;
    const booked = dateObj.bookedSlots || 0;
    const available = total - booked;

    // Get price
    const price = dateObj.price || tour.price || 0;
    const formattedPrice = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);

    // Status color
    let statusColor = available <= 3 ? '#f59e0b' : '#10b981';

    html += `
      <div style="
        border: 1px solid var(--stroke-light);
        border-radius: 12px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        transition: all 0.3s ease;
      " 
      onmouseover="
        this.style.borderColor='#042e4d';
        this.style.transform='translateY(-4px)';
        this.style.boxShadow='0 12px 24px rgba(0,0,0,0.08)';
      "
      onmouseout="
        this.style.borderColor='var(--stroke-light)';
        this.style.transform='translateY(0)';
        this.style.boxShadow='none';
      ">
        
        <!-- Date Header -->
        <div style="display: flex; align-items: baseline; justify-content: space-between;">
          <div style="display: flex; align-items: baseline; gap: 8px;">
            <span class="h-5" style="font-weight: 700;">${dayNumber}</span>
            <span class="body-medium" style="color: #6b7280; text-transform: capitalize;">${month}</span>
          </div>
          <span class="body-medium" style="color: #9ca3af;">${year}</span>
        </div>

        <!-- Weekday -->
        <p class="body-medium" style="color: #6b7280; text-transform: capitalize; margin: 0;">${weekday}</p>

        <!-- Price -->
        <p class="h-5" style="font-weight: 700; margin: 0;">${formattedPrice}</p>

        <!-- Availability -->
        <div style="
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: ${statusColor}15;
          border-radius: 6px;
        ">
          <div style="
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: ${statusColor};
          "></div>
          <span class="body-medium" style="color: ${statusColor}; font-weight: 500; margin: 0;">
            ${available} cupos disponibles
          </span>
        </div>

        <!-- Button -->
        <a href="https://wa.me/573001234567?text=${encodeURIComponent(`Hola! Me interesa reservar cupo para ${tour.name.es} el ${dayNumber} de ${month}`)}"
           target="_blank"
           class="body-medium"
           style="
             display: flex;
             align-items: center;
             justify-content: center;
             gap: 6px;
             padding: 12px 20px;
             background: #042e4d;
             color: white;
             border-radius: 8px;
             text-decoration: none;
             font-weight: 600;
             transition: background 0.2s ease;
           "
           onmouseover="this.style.background='#065a82'"
           onmouseout="this.style.background='#042e4d'">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Unirte
        </a>
      </div>
    `;
  });

  html += `</div>`;
  datesSection.innerHTML = html;

  // Insert after itinerary section
  parentGrid.parentNode.insertBefore(datesSection, parentGrid.nextSibling);

  // Add "Fechas" to TOC
  addFechasToTOC();
}

/**
 * Add "Fechas" item to TOC
 */
function addFechasToTOC() {
  const indexContainer = document.querySelector('.index');
  if (!indexContainer) return;

  // Check if already added
  if (document.querySelector('[data-toc-target="fechas"]')) return;

  // Get all TOC items
  const tocItems = Array.from(indexContainer.querySelectorAll('a.toc-link, div > p.body-medium')).map(el => 
    el.tagName === 'A' ? el : el.parentElement
  );

  if (tocItems.length === 0) return;

  // Create new "Fechas" link (at the END, after Preguntas)
  const fechasLink = document.createElement('a');
  fechasLink.href = '#fechas';
  fechasLink.className = 'toc-link w-inline-block';
  fechasLink.setAttribute('data-target', 'fechas');
  fechasLink.setAttribute('data-toc-target', 'fechas');
  fechasLink.style.cursor = 'pointer';
  
  const p = document.createElement('p');
  p.className = 'body-medium f-grey';
  p.textContent = 'Fechas';
  
  fechasLink.appendChild(p);

  // Insert at the END (append as last child)
  indexContainer.appendChild(fechasLink);
  
  // OLD CODE - would insert after itinerario
  /*const itinerarioItem = tocItems[1];
  if (itinerarioItem && itinerarioItem.parentNode) {
    itinerarioItem.parentNode.insertBefore(fechasLink, itinerarioItem.nextSibling);
  }*/

  // Re-initialize TOC to include new item
  initTOC();
}

/**
 * Initialize TOC - NO ID CHANGES, uses data attributes
 */
function initTOC() {
  // We won't change IDs. Instead, we'll find sections by their existing selectors
  // and attach data attributes for our use
  
  const sectionMappings = [
    { 
      selector: '.div-block-131', // Description section
      name: 'description',
      tocIndex: 0
    },
    { 
      selector: '.itinerary-containe', // Itinerary (note: typo in original class)
      name: 'itinerary',
      tocIndex: 1
    },
    { 
      selector: '.div-block-38', // Inclusions section (has "Lo que incluye")
      name: 'inclusions',
      tocIndex: 2
    },
    { 
      selector: '.div-block-136', // FAQ section
      name: 'faq',
      tocIndex: 3
    },
    {
      selector: '[data-toc-section="fechas"]', // Dates section (dynamic)
      name: 'fechas',
      tocIndex: 4
    }
  ];

  // Mark sections with data attributes (doesn't affect layout/CSS)
  sectionMappings.forEach(({ selector, name }) => {
    const element = document.querySelector(selector);
    if (element) {
      element.setAttribute('data-toc-section', name);
    }
  });

  // Get TOC items
  const indexContainer = document.querySelector('.index');
  if (!indexContainer) return;

  const tocDivs = Array.from(indexContainer.children).filter(child => {
    return child.tagName === 'DIV' && child.querySelector('p.body-medium');
  });

  const tocItems = tocDivs.map(div => div.querySelector('p.body-medium')).filter(p => p);
  const indicator = document.querySelector('.div-block-141');

  // Add click handlers
  tocItems.forEach((item, index) => {
    const mapping = sectionMappings[index];
    if (!mapping) return;

    item.parentElement.style.cursor = 'pointer';

    item.parentElement.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(`[data-toc-section="${mapping.name}"]`);
      if (target) {
        const offset = 120;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Scroll Spy
  const sections = sectionMappings
    .map(({ selector }) => document.querySelector(selector))
    .filter(el => el);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionName = entry.target.getAttribute('data-toc-section');
        const mapping = sectionMappings.find(m => m.name === sectionName);
        if (mapping) {
          updateActiveState(mapping.tocIndex);
        }
      }
    });
  }, {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));

  function updateActiveState(activeIndex) {
    tocItems.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.remove('f-grey');
        item.style.fontWeight = '600';
        item.style.color = '#042e4d';

        if (indicator) {
          // Get positions relative to the index container
          const indexContainer = document.querySelector('.index');
          const itemRect = item.getBoundingClientRect();
          const indexRect = indexContainer.getBoundingClientRect();
          
          // Calculate offset from top of index container
          // Add half the item height to center the indicator on the text
          const itemHeight = itemRect.height;
          const offset = (itemRect.top - indexRect.top) + (itemHeight / 2) - (indicator.offsetHeight / 2) - 32;
          
          indicator.style.transform = `translateY(${offset}px)`;
          indicator.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
      } else {
        if (!item.classList.contains('f-grey')) {
          item.classList.add('f-grey');
        }
        item.style.fontWeight = '400';
        item.style.color = '';
      }
    });
  }
}

/**
 * Render info chips (altitude, days, difficulty, etc.)
 */
function renderInfoChips(tour) {
  const chipContainer = document.querySelector('.div-block-42');
  if (!chipContainer) return;

  // Clear existing chips
  chipContainer.innerHTML = '';

  // Difficulty chip (pink)
  if (tour.difficulty) {
    const difficultyLabels = {
      'Easy': { es: 'Fácil', en: 'Easy' },
      'Moderate': { es: 'Moderado', en: 'Moderate' },
      'Moderate-Difficult': { es: 'Moderado-Difícil', en: 'Moderate-Difficult' },
      'Difficult': { es: 'Difícil', en: 'Difficult' },
      'Very Difficult': { es: 'Muy Difícil', en: 'Very Difficult' }
    };
    const label = difficultyLabels[tour.difficulty] || { es: tour.difficulty, en: tour.difficulty };
    chipContainer.appendChild(createChip(label, 'fire', true));
  }

  // Altitude chip
  if (tour.altitude) {
    chipContainer.appendChild(createChip(tour.altitude, 'mountain'));
  }

  // Duration chip
  if (tour.totalDays) {
    const daysLabel = {
      es: tour.totalDays === 1 ? `${tour.totalDays} Día` : `${tour.totalDays} Días`,
      en: tour.totalDays === 1 ? `${tour.totalDays} Day` : `${tour.totalDays} Days`
    };
    chipContainer.appendChild(createChip(daysLabel, 'calendar'));
  }

  // Distance chip (optional)
  if (tour.distance) {
    chipContainer.appendChild(createChip({ es: `${tour.distance} km`, en: `${tour.distance} km` }, 'route'));
  }
}

/**
 * Create a single info chip
 */
function createChip(labelObj, iconType, isPink = false) {
  const div = document.createElement('div');
  div.className = `chip-tour-info-wrapper chip-shadow${isPink ? ' pink-chip' : ''}`;
  div.style.opacity = '1'; // Override animation initial state

  // Icon SVGs
  const icons = {
    fire: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.48 12.35C17.91 8.27 12.32 8.05 13.67 2.12C13.77 1.68 13.3 1.34 12.92 1.57C9.29 3.71 6.68 8 8.87 13.62C9.05 14.08 8.51 14.51 8.12 14.21C6.31 12.84 6.12 10.87 6.28 9.46C6.34 8.94 5.66 8.69 5.37 9.12C4.69 10.16 4 11.84 4 14.37C4.38 19.97 9.11 21.69 10.81 21.91C13.24 22.22 15.87 21.77 17.76 20.04C19.84 18.11 20.6 15.03 19.48 12.35Z"/></svg>`,
    mountain: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8.70098,5.75 C9.27833,4.75 10.7217,4.75 11.2991,5.75 L14.7991,11.8122 L15.701,10.25 C16.2784,9.25 17.7217,9.25 18.2991,10.25 L22.6292,17.75 C23.2066,18.75 22.4849,20 21.3302,20 L3.07182,20 C1.91711,20 1.19543,18.75 1.77278,17.75 L8.70098,5.75 Z"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="18" height="18" viewBox="0 0 256 256"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM208,80H48V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24Z"/></svg>`,
    route: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4 15V8.5C4 6.57 5.57 5 7.5 5S11 6.57 11 8.5V15.5C11 16.33 11.67 17 12.5 17S14 16.33 14 15.5V8.5C14 5.46 11.54 3 8.5 3S3 5.46 3 8.5V15H4Z"/></svg>`
  };

  const p = document.createElement('p');
  p.className = 'body-small dynamic-i18n';
  p.setAttribute('data-i18n-es', labelObj.es);
  p.setAttribute('data-i18n-en', labelObj.en);
  p.textContent = labelObj.es;

  div.innerHTML = icons[iconType] || '';
  div.appendChild(p);

  return div;
}

/**
 * Render description section
 */
function renderDescription(tour) {
  // Short description (Handle ALL occurrences)
  const shortDescEls = document.querySelectorAll('.short-description');
  if (shortDescEls.length > 0 && tour.shortDescription) {
    shortDescEls.forEach(el => {
      setBilingualText(el, tour.shortDescription);
    });
  }

  // Long description
  const longDescEl = document.getElementById('tour-long-description');
  const targetEl = longDescEl || document.querySelector('.div-block-131 .h-5:not(.italic)');
  
  if (targetEl && tour.description) {
    setBilingualText(targetEl, tour.description);
  }
}

/**
 * Render secondary images
 */
function renderSecondaryImages(tour) {
  if (!tour.images || tour.images.length < 2) return;

  // Image in curtain 1
  const img1 = document.querySelector('#mini-curtain-1 .mini-image');
  if (img1 && tour.images[1]) {
    img1.src = tour.images[1];
    img1.srcset = '';
  }

  // Image in curtain 2
  const img2 = document.querySelector('#mini-curtain-2 .mini-image');
  if (img2 && tour.images[2]) {
    img2.src = tour.images[2];
    img2.srcset = '';
  }

  // Medium parallax image
  const medImg = document.querySelector('.parallax-image-medium');
  if (medImg && tour.images[3]) {
    medImg.src = tour.images[3];
    medImg.srcset = '';
  }
}

/**
 * Render itinerary accordion
 */
function renderItinerary(tour) {
  if (!tour.itinerary || !tour.itinerary.days) return;

  const container = document.querySelector('#Itinerary-container .grid-1-column');
  if (!container) {
    console.warn('Itinerary container not found');
    return;
  }

  // Clear existing items
  container.innerHTML = '';

  tour.itinerary.days.forEach((day, index) => {
    const item = createAccordionItem(day, index);
    container.appendChild(item);
  });
}

/**
 * Create accordion item for itinerary
 */
function createAccordionItem(day, index) {
  const wrapper = document.createElement('div');
  wrapper.className = 'accordion-item-wrapper v2';
  wrapper.setAttribute('data-w-id', `itinerary-day-${index + 1}`);

  const dayNum = String(day.dayNumber || index + 1).padStart(2, '0');

  wrapper.innerHTML = `
    <div class="accordion-content-wrapper v2">
      <div class="accordion-header">
        <h3 class="h-4 italic">Día</h3>
        <h3 class="h-4 italic">-</h3>
        <h3 class="h-4 italic f-blue-vivid">${dayNum}</h3>
      </div>
      <div class="acordion-body" style="height: 0px; opacity: 0;">
        <div class="accordion-spacer"></div>
        <div class="div-block-59">
          ${day.activities.map(act => `
            <p class="mg-bottom-0 body-large dynamic-i18n" data-i18n-es="${act.es}" data-i18n-en="${act.en}">${act.es}</p>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="accordion-side right-side">
      <div class="accordion-icon-wrapper">
        <div class="accordion-btn-line v2 vertical" style="transform: none;"></div>
        <div class="accordion-btn-line v2 horizontal"></div>
      </div>
    </div>
  `;

  // Add click handler for accordion
  wrapper.addEventListener('click', () => toggleAccordion(wrapper));

  return wrapper;
}

/**
 * Accordion toggle logic
 */
function toggleAccordion(wrapper) {
  const body = wrapper.querySelector('.acordion-body');
  const verticalLine = wrapper.querySelector('.accordion-btn-line.vertical');
  const isOpen = body.style.height !== '0px';

  if (isOpen) {
    body.style.height = '0px';
    body.style.opacity = '0';
    if (verticalLine) verticalLine.style.transform = 'none';
  } else {
    body.style.height = 'auto';
    body.style.opacity = '1';
    if (verticalLine) verticalLine.style.transform = 'rotate(90deg)';
  }
}

/**
 * Render inclusions list
 */
function renderInclusions(tour) {
  if (!tour.inclusions || tour.inclusions.length === 0) return;

  const container = document.getElementById('tour-inclusions');
  if (!container) return;

  // Clear and rebuild
  container.innerHTML = '';
  
  tour.inclusions.forEach(item => {
    container.appendChild(createListItem(item, 'check'));
  });
}

/**
 * Render exclusions list
 */
function renderExclusions(tour) {
  if (!tour.exclusions || tour.exclusions.length === 0) return;

  const container = document.getElementById('tour-exclusions');
  if (!container) return;

  // Clear and rebuild
  container.innerHTML = '';
  
  tour.exclusions.forEach(item => {
    container.appendChild(createListItem(item, 'cross'));
  });
}

/**
 * Render recommendations list
 */
function renderRecommendations(tour) {
  if (!tour.recommendations || tour.recommendations.length === 0) return;

  const container = document.getElementById('tour-recommendations');
  if (!container) return;

  container.innerHTML = '';
  
  tour.recommendations.forEach(item => {
    container.appendChild(createListItem(item, 'check'));
  });
}

/**
 * Create list item with checkmark or cross
 */
function createListItem(item, iconType = 'check') {
  const div = document.createElement('div');
  div.className = 'div-block-41 shadow-1';

  const p = document.createElement('p');
  p.className = 'body-medium dynamic-i18n';
  p.setAttribute('data-i18n-es', item.es);
  p.setAttribute('data-i18n-en', item.en);
  p.textContent = item.es;

  const iconDiv = document.createElement('div');
  iconDiv.className = 'div-block-92';

  if (iconType === 'check') {
    iconDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0303 7.96967C18.3232 8.26256 18.3232 8.73744 18.0303 9.03033L11.0303 16.0303C10.7374 16.3232 10.2626 16.3232 9.96967 16.0303L5.96967 12.0303C5.67678 11.7374 5.67678 11.2626 5.96967 10.9697C6.26256 10.6768 6.73744 10.6768 7.03033 10.9697L10.5 14.4393L16.9697 7.96967C17.2626 7.67678 17.7374 7.67678 18.0303 7.96967Z" fill="currentColor"></path>
      </svg>
    `;
  } else {
    // Cross icon for exclusions
    iconDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    iconDiv.style.color = '#ef4444'; // Red color for exclusions
  }

  div.appendChild(p);
  div.appendChild(iconDiv);

  return div;
}

/**
 * Render FAQs
 */
function renderFAQs(tour) {
  if (!tour.tour_faqs && !tour.faqs) return;
  const faqs = tour.tour_faqs || tour.faqs; // Handle potentially different property names

  if (faqs.length === 0) return;

  const container = document.getElementById('faq-container');
  if (!container) return;

  // Clear and rebuild
  container.innerHTML = '';

  faqs.forEach((faq, index) => {
    const item = createFAQItem(faq, index);
    container.appendChild(item);
  });
}

/**
 * Create FAQ accordion item
 */
function createFAQItem(faq, index) {
  const wrapper = document.createElement('div');
  wrapper.className = 'accordion-item-wrapper v2';
  
  // Format index with leading zero
  const num = String(index + 1).padStart(2, '0');

  wrapper.innerHTML = `
    <div class="accordion-content-wrapper v2">
      <div class="accordion-header">
        <h3 class="h-4 italic dynamic-i18n" data-i18n-es="${faq.question.es}" data-i18n-en="${faq.question.en}">${faq.question.es}</h3>
      </div>
      <div class="acordion-body" style="height: 0px; opacity: 0;">
        <div class="accordion-spacer"></div>
        <div class="div-block-59">
            <p class="mg-bottom-0 body-large dynamic-i18n" data-i18n-es="${faq.answer.es}" data-i18n-en="${faq.answer.en}">${faq.answer.es}</p>
        </div>
      </div>
    </div>
    <div class="accordion-side right-side">
      <div class="accordion-icon-wrapper">
        <div class="accordion-btn-line v2 vertical" style="transform: none;"></div>
        <div class="accordion-btn-line v2 horizontal"></div>
      </div>
    </div>
  `;

  wrapper.addEventListener('click', () => toggleAccordion(wrapper));

  return wrapper;
}

/**
 * Render pricing section
 */
function renderPricing(tour) {
  if (!tour.pricingTiers || tour.pricingTiers.length === 0) return;

  // Find price element (if exists in header area)
  const priceEl = document.querySelector('.price-h') || document.querySelector('.h-6.price-h');
  if (priceEl) {
    // Use the lowest price tier
    const lowestPrice = tour.pricingTiers.reduce((min, tier) => 
      tier.priceCOP < min.priceCOP ? tier : min
    , tour.pricingTiers[0]);

    const formattedPrice = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(lowestPrice.priceCOP);

    priceEl.textContent = `Desde ${formattedPrice}`;
  }

  // Update the "Reservar Tour" button link
  const bookBtn = document.getElementById('book-tour-btn');
  if (bookBtn) {
    bookBtn.href = `https://wa.me/573001234567?text=Hola! Me interesa el tour: ${encodeURIComponent(tour.name.es)}`;
  }
}

/**
 * Set bilingual text on element
 */
function setBilingualText(element, dataObj) {
  if (!element || !dataObj) return;
  
  element.setAttribute('data-i18n-es', dataObj.es || '');
  element.setAttribute('data-i18n-en', dataObj.en || '');
  element.textContent = dataObj.es || '';
  element.classList.add('dynamic-i18n');
}

/**
 * Apply language to all dynamic elements
 */
function applyLanguageToDynamicElements(lang) {
  if (window.NT_I18N && window.NT_I18N.apply) {
    window.NT_I18N.apply(lang);
  }
}

/**
 * Show error message
 */
function showError(message) {
  const titleEl = document.querySelector('.h-1');
  if (titleEl) {
    titleEl.textContent = 'Error';
  }
  
  const subtitleEl = document.querySelector('.tour-subtitle');
  if (subtitleEl) {
    subtitleEl.textContent = message;
  }
}
