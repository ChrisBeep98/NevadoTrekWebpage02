import { apiService } from './services/api.js';

document.addEventListener('DOMContentLoaded', async () => {
  
  // 1. Determine Initial Language
  // Priority: visible switch FIRST > localStorage > default 'es'
  let currentLang = null;
  
  // FIRST: Check the visible language switch (this is what user sees)
  const visibleLang = document.getElementById('current-lang');
  if (visibleLang) {
    currentLang = visibleLang.textContent.trim().toLowerCase();
  }
  
  // SECOND: If switch not found, try localStorage
  if (!currentLang) {
    currentLang = localStorage.getItem('language');
  }
  
  // THIRD: Final fallback to Spanish
  if (!currentLang || (currentLang !== 'es' && currentLang !== 'en')) {
    currentLang = 'es';
  }
  
  // Sync localStorage with current choice
  localStorage.setItem('language', currentLang);
  


  // 2. Fetch Data
  const [tours, departures] = await Promise.all([
    apiService.getTours(),
    apiService.getDepartures()
  ]);

  if (!tours || tours.length === 0) {
    return;
  }

  // 3. Select Card Containers
  const toursSection = document.querySelector('.tours-2');
  if (!toursSection) return;

  const cardWrappers = Array.from(toursSection.children);
  
  // 4. Loop through wrappers and inject data
  cardWrappers.forEach((wrapper, index) => {
    const tour = tours[index % tours.length];
    if (!tour) return;

    updateCard(wrapper, tour, departures, currentLang);
  });
  
  // 5. Apply language to dynamic elements after all cards are updated
  // This ensures .dynamic-i18n elements show correct language
  setTimeout(() => {
    applyLanguageToDynamicElements(currentLang);
  }, 100);
});

function updateCard(wrapper, tour, allDepartures, lang = 'es') {
  // --- Common Elements ---
  
  // 1. Link
  const link = wrapper.querySelector('a.w-inline-block');
  if (link) {
    link.href = `Sections/TourPage.html?id=${tour.tourId}`;
  }

  // 2. Main Image
  const mainImg = wrapper.querySelector('.main-tour-img');
  if (mainImg && tour.images && tour.images.length > 0) {
    mainImg.src = tour.images[0];
    mainImg.srcset = `${tour.images[0]} 500w, ${tour.images[0]} 800w`;
  }

  // 3. Title
  const title = wrapper.querySelector('.tour-name-heading');
  if (title) {
    title.setAttribute('data-i18n-es', tour.name.es);
    title.setAttribute('data-i18n-en', tour.name.en);
    title.textContent = tour.name[lang] || tour.name.es; 
    title.classList.add('dynamic-i18n');
  }

  // 4. Price
  const priceEl = wrapper.querySelector('.price-h');
  if (priceEl && tour.pricingTiers && tour.pricingTiers.length > 0) {
    const price = apiService.formatPrice(tour.pricingTiers[0].priceCOP);
    priceEl.textContent = price;
  }

  // 5. Description (Short)
  const desc = wrapper.querySelector('.tour-card-container-text .body-medium');
  if (desc) {
    desc.setAttribute('data-i18n-es', tour.shortDescription.es);
    desc.setAttribute('data-i18n-en', tour.shortDescription.en);
    desc.textContent = tour.shortDescription[lang] || tour.shortDescription.es;
    desc.classList.add('dynamic-i18n');
  }

  // 6. Chips
  
  // Date
  const dateEl = wrapper.querySelector('.pink-chip .body-small');
  if (dateEl) {
    const nextDate = apiService.getNextDepartureDate(tour.tourId, allDepartures);
    const dateStr = nextDate ? nextDate.toLocaleDateString('es-CO') : 'Por definir';
    dateEl.textContent = dateStr;
  }

  // Altitude & Duration
  const infoChips = wrapper.querySelectorAll('.chip-tour-info-wrapper .body-small');
  if (infoChips.length >= 2) {
    // Chip 1: Altitude
    infoChips[0].textContent = tour.altitude[lang] || tour.altitude.es; 
    
    // Chip 2: Duration
    const days = tour.totalDays;
    infoChips[1].setAttribute('data-i18n-es', `${days} Días`);
    infoChips[1].setAttribute('data-i18n-en', `${days} Days`);
    infoChips[1].textContent = lang === 'en' ? `${days} Days` : `${days} Días`;
    infoChips[1].classList.add('dynamic-i18n');
  }


  // --- Type A Specifics (Side Block) ---
  const sideBlock = wrapper.querySelector('.div-block-54');
  if (sideBlock) {
    // Side Image
    const sideImg = sideBlock.querySelector('img');
    if (sideImg && tour.images && tour.images.length > 1) {
      sideImg.src = tour.images[1];
      sideImg.srcset = '';
    } else if (sideImg) {
       sideImg.src = tour.images[0];
    }

    // Side Text
    const sideText = sideBlock.querySelector('p');
    if (sideText) {
      sideText.setAttribute('data-i18n-es', tour.shortDescription.es);
      sideText.setAttribute('data-i18n-en', tour.shortDescription.en);
      sideText.textContent = tour.shortDescription[lang] || tour.shortDescription.es;
      sideText.classList.add('dynamic-i18n');
    }
  }
}

// Helper to handle language switching for our dynamic elements
function applyLanguageToDynamicElements(lang) {
  // 1. Handle .dynamic-i18n elements (Specific per-card translations)
  const elements = document.querySelectorAll('.dynamic-i18n');
  elements.forEach(el => {
    const text = el.getAttribute(`data-i18n-${lang}`);
    if (text) {
      el.textContent = text;
    }
  });

  // 2. Handle data-i18n-key elements (Global dictionary lookups)
  // This is required for the mobile menu and other static elements
  if (window.NT_I18N && window.NT_I18N.dict) {
    const dict = window.NT_I18N.dict[lang];
    if (dict) {
      document.querySelectorAll('[data-i18n-key]').forEach(el => {
        const key = el.getAttribute('data-i18n-key');
        if (dict[key]) {
          el.textContent = dict[key];
        }
      });
    }
  }
}

// Listen for global language change events
window.addEventListener('languageChange', (e) => {
  if (e.detail && e.detail.lang) {
    applyLanguageToDynamicElements(e.detail.lang);
  }
});

// Update initial static content on load (in case it wasn't caught)
document.addEventListener('DOMContentLoaded', () => {
   // Wait a tick for i18n dictionary to load
   setTimeout(() => {
     const savedLang = localStorage.getItem('language') || 'es';
     applyLanguageToDynamicElements(savedLang);
   }, 50);
});

// Expose for other scripts if needed
window.updateDynamicContent = applyLanguageToDynamicElements;
