import { apiService } from './../js/services/api.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Initializing Tour Page Loader...');

  // 1. Get Tour ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const tourId = urlParams.get('id');

  if (!tourId) {
   
    // Optional: Redirect to home or show error
    // window.location.href = '/';
    return;
  }

  // 2. Show Loading State (Optional - if we had a spinner)
  // document.body.classList.add('loading');

  // 3. Fetch Data
  // We fetch all tours to find the specific one. 
  // Ideally, we'd have a getTourById endpoint, but getTours is cached and fast.
  const [tours, departures] = await Promise.all([
    apiService.getTours(),
    apiService.getDepartures()
  ]);

  const tour = tours.find(t => t.tourId === tourId);

  if (!tour) {
    
    // Handle 404
    return;
  }

  // 4. Render Content
  renderTourPage(tour, departures);

  // 5. Update Language
  if (window.updateDynamicContent) {
    window.updateDynamicContent(localStorage.getItem('language') || 'es');
  } else {
     // Fallback if global function isn't ready yet
     const currentLang = localStorage.getItem('language') || 'es';
     applyLanguageToDynamicElements(currentLang);
  }
});

function renderTourPage(tour, allDepartures) {
  // --- Header Section ---
  
  // Title
  const titleEl = document.querySelector('.h-1');
  if (titleEl) {
    setBilingualText(titleEl, tour.name);
  }

  // Subtitle
  const subtitleEl = document.querySelector('.tour-subtitle');
  if (subtitleEl) {
    // If tour has subtitle, use it. Otherwise fallback to shortDescription or empty
    const subtitle = tour.subtitle || tour.shortDescription;
    setBilingualText(subtitleEl, subtitle);
  }

  // Chips (Info Wrapper)
  // We need to be specific here. The HTML likely has placeholders.
  // We can clear and rebuild, or target specific children if they have classes.
  // Let's assume we rebuild the chips container for flexibility.
  const chipContainer = document.querySelector('.div-block-129'); // Based on typical structure or find by class
  // Or better, find the container that holds the chips.
  // Looking at previous analysis: .chip-tour-info-wrapper are inside a container.
  
  // Let's try to update existing ones if possible to preserve layout.
  // Chip 1: Location/Altitude?
  // Chip 2: Duration?
  // Chip 3: Difficulty?
  
  // For now, let's target generic classes if unique IDs aren't there.
  // We'll update the "Price" if it exists in the header.
  
  // --- Main Image ---
  const mainImage = document.querySelector('.scroll-zoom-image');
  if (mainImage && tour.images && tour.images.length > 0) {
    mainImage.src = tour.images[0];
    mainImage.srcset = ''; // Clear hardcoded srcset
  }

  // --- Description Section ---
  const descTitle = document.querySelector('.h-2.medium'); // "Descripción"
  // We keep the title static/translated.
  
  const descText = document.querySelector('.body-medium.f-grey.description-text'); // Hypothetical class
  // If we can't find a specific class, we might need to look for the paragraph in the description section.
  // Let's try a broad selector for the description paragraph.
  const descSection = document.querySelector('#description'); // If it exists
  // Or find the paragraph following the "Descripción" title.
  
  // --- Itinerary ---
  // This is complex. We need to generate the accordion items.
  const itineraryContainer = document.querySelector('.itinerary-container'); // Hypothetical
  if (itineraryContainer && tour.itinerary) {
    itineraryContainer.innerHTML = ''; // Clear existing
    tour.itinerary.forEach((day, index) => {
      const item = createItineraryItem(day, index);
      itineraryContainer.appendChild(item);
    });
  }

  // --- Inclusions/Exclusions ---
  // Similar logic...

  // --- Price & Booking ---
  // Update price in sticky header or booking section
}

function setBilingualText(element, dataObj) {
  if (!element || !dataObj) return;
  element.setAttribute('data-i18n-es', dataObj.es);
  element.setAttribute('data-i18n-en', dataObj.en);
  element.textContent = dataObj.es; // Default
  element.classList.add('dynamic-i18n');
}

function applyLanguageToDynamicElements(lang) {
  const elements = document.querySelectorAll('.dynamic-i18n');
  elements.forEach(el => {
    const text = el.getAttribute(`data-i18n-${lang}`);
    if (text) {
      el.textContent = text;
    }
  });
}

// Helper to create HTML for itinerary (simplified for now)
function createItineraryItem(day, index) {
  // This needs to match the exact HTML structure of the Webflow accordion
  // For now, we might skip this or do a simple version until we analyze TourPage.html deeper
  const div = document.createElement('div');
  div.className = 'accordion-item'; // Placeholder
  div.innerHTML = `
    <div class="accordion-header">
      <h3 class="dynamic-i18n" data-i18n-es="${day.title.es}" data-i18n-en="${day.title.en}">${day.title.es}</h3>
    </div>
    <div class="accordion-content">
      <p class="dynamic-i18n" data-i18n-es="${day.description.es}" data-i18n-en="${day.description.en}">${day.description.es}</p>
    </div>
  `;
  return div;
}
