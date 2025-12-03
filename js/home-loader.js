import { apiService } from './services/api.js';

document.addEventListener('DOMContentLoaded', async () => {
  
  // 1. Determine Initial Language
  // Check localStorage first, then the select element, then default to 'es'
  let currentLang = localStorage.getItem('language');
  const langSwitch = document.getElementById('lang-switch');
  
  if (!currentLang && langSwitch) {
    currentLang = langSwitch.value;
  }
  
  if (!currentLang) {
    currentLang = 'es';
  }

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

  // 5. Ensure UI sync
  if (langSwitch && currentLang) {
      langSwitch.value = currentLang;
  }
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
  const elements = document.querySelectorAll('.dynamic-i18n');
  elements.forEach(el => {
    const text = el.getAttribute(`data-i18n-${lang}`);
    if (text) {
      el.textContent = text;
    }
  });
}

// Direct integration with the specific language switcher in index.html
const langSwitch = document.getElementById('lang-switch');
if (langSwitch) {
  // 1. Listen for changes
  langSwitch.addEventListener('change', (e) => {
    const lang = e.target.value;
    localStorage.setItem('language', lang); // Ensure persistence if not handled elsewhere
    applyLanguageToDynamicElements(lang);
  });

  // 2. Sync on load
  // If there's a stored language, set the select value and update content
  const storedLang = localStorage.getItem('language');
  if (storedLang) {
    langSwitch.value = storedLang;
    applyLanguageToDynamicElements(storedLang);
  } else {
    // If no stored lang, use the current value of the select (default)
    applyLanguageToDynamicElements(langSwitch.value);
  }
} else {
  console.warn('Language switcher #lang-switch not found.');
  // Fallback: try to use stored language
  const storedLang = localStorage.getItem('language') || 'es';
  applyLanguageToDynamicElements(storedLang);
}

// Expose for other scripts if needed
window.updateDynamicContent = applyLanguageToDynamicElements;
