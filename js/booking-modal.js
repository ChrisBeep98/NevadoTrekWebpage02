/**
 * BOOKING MODAL
 * Handles tour reservations with both public date joining and private date requests
 * Supports bilingual content (ES/EN) and dynamic currency (COP/USD)
 */

import { apiService } from './services/api.js';

// ==================== I18N TRANSLATIONS ====================
const translations = {
  es: {
    title: 'RESERVAR TOUR',
    step1: 'Fecha',
    step2: 'Datos',
    step3: 'Resumen',
    chooseDate: 'Elige tu fecha',
    yourDetails: 'Tus datos',
    spotsAvailable: 'cupos disponibles',
    spotAvailable: 'cupo disponible',
    requestDifferentDate: 'Solicitar una fecha diferente',
    selectDate: 'Selecciona una fecha',
    noPublicDates: 'Actualmente no hay salidas grupales programadas. Solicita una fecha privada:',
    fullName: 'Nombre completo',
    email: 'Correo electrónico',
    phone: 'Teléfono (con código de país)',
    document: 'Documento de identidad',
    guests: 'Número de personas',
    notes: 'Notas adicionales (opcional)',
    continue: 'Continuar',
    submit: 'Confirmar reserva',
    submitting: 'Enviando...',
    back: 'Volver',
    successTitle: '¡Reserva Enviada!',
    successMessage: 'Hemos recibido tu solicitud. Te contactaremos en las próximas 24 horas para confirmar los detalles y el pago.',
    bookingId: 'Código de reserva',
    errorRequired: 'Campo requerido',
    errorEmail: 'Email inválido',
    errorPhone: 'Incluye código de país (+57...)',
    errorGeneric: 'Error al enviar. Intenta de nuevo.',
    errorRateLimit: 'Demasiados intentos. Espera 15 minutos.',
    or: 'o',
    perPerson: '/persona',
    pricingTitle: 'PRECIOS POR PERSONA',
    person: 'persona',
    persons: 'personas',
    whyBook: '¿POR QUÉ RESERVAR DIRECTO?',
    important: 'NOTA IMPORTANTE',
    summaryTitle: 'RESUMEN DE TU RESERVA',
    selectedDate: 'Fecha seleccionada',
    privateDate: 'Fecha privada',
    tourName: 'Tour',
    guestCount: 'Personas',
    pricePerPerson: 'Precio por persona',
    totalPrice: 'Total estimado',
    toastSuccess: '¡Reserva enviada correctamente!',
    closeModal: 'Cerrar',
    newBooking: 'Nueva reserva',
    yourSelectedDate: 'Tu fecha seleccionada',
    changeDate: 'Cambiar',
    availableSpots: 'Cupos disponibles',
    groupSize: 'Tamaño del grupo después de tu reserva',
    publicDatesExplain: 'Únete a un grupo existente:',
    privateDateExplain: 'O solicita una fecha privada exclusiva para tu grupo:',
    currency: 'COP',
    bookYourTour: 'RESERVA TU AVENTURA', /* Using "Aventura" sounds better/premium */
    bookAdventure: 'RESERVA TU AVENTURA',
    priceTablePax: 'Personas',
    priceTablePrice: 'Precio',
    priceTable4plus: '4 - 8',
  },
  en: {
    title: 'BOOK TOUR',
    step1: 'Date',
    step2: 'Details',
    step3: 'Summary',
    chooseDate: 'Choose your date',
    yourDetails: 'Your details',
    spotsAvailable: 'spots available',
    spotAvailable: 'spot available',
    requestDifferentDate: 'Request a different date',
    selectDate: 'Select a date',
    noPublicDates: 'No group departures currently scheduled. Request a private date:',
    fullName: 'Full name',
    email: 'Email address',
    phone: 'Phone (with country code)',
    document: 'ID document',
    guests: 'Number of guests',
    notes: 'Additional notes (optional)',
    continue: 'Continue',
    submit: 'Confirm booking',
    submitting: 'Submitting...',
    back: 'Back',
    successTitle: 'Booking Submitted!',
    successMessage: 'We have received your request. We will contact you within 24 hours to confirm the details and payment.',
    bookingId: 'Booking ID',
    errorRequired: 'Required field',
    errorEmail: 'Invalid email',
    errorPhone: 'Include country code (+1...)',
    errorGeneric: 'Error submitting. Try again.',
    errorRateLimit: 'Too many attempts. Wait 15 minutes.',
    or: 'or',
    perPerson: '/person',
    pricingTitle: 'PRICE PER PERSON',
    person: 'person',
    persons: 'persons',
    whyBook: 'WHY BOOK DIRECT?',
    important: 'IMPORTANT NOTE',
    summaryTitle: 'YOUR BOOKING SUMMARY',
    selectedDate: 'Selected date',
    privateDate: 'Private date',
    tourName: 'Tour',
    guestCount: 'Guests',
    pricePerPerson: 'Price per person',
    totalPrice: 'Estimated total',
    toastSuccess: 'Booking submitted successfully!',
    closeModal: 'Close',
    newBooking: 'New booking',
    yourSelectedDate: 'Your selected date',
    changeDate: 'Change',
    availableSpots: 'Available spots',
    groupSize: 'Group size after your booking',
    publicDatesExplain: 'Join an existing group:',
    privateDateExplain: 'Or request a private date exclusive for your group:',
    currency: 'USD',
    bookYourTour: 'BOOK YOUR ADVENTURE',
    bookAdventure: 'BOOK YOUR ADVENTURE',
    priceTablePax: 'Guests',
    priceTablePrice: 'Price',
    priceTable4plus: '4 - 8',
  }
};

// ==================== STATE ====================
let currentLang = localStorage.getItem('nevado_lang') || 'es';
let currentTour = null;
let currentDepartures = [];
let selectedDate = null;
let selectedDepartureId = null;
let isPrivateBooking = false;
let needsForceRefresh = false; // Flag to bypass cache after booking

// ==================== INITIALIZATION ====================
export function initBookingModal(tour, departures) {
  currentTour = tour;
  currentDepartures = departures.filter(d => 
    d.tourId === tour.tourId && 
    d.status === 'open' &&
    new Date(d.date._seconds * 1000) >= new Date()
  ).sort((a, b) => a.date._seconds - b.date._seconds);

  // Create modal if not exists
  if (!document.getElementById('booking-modal')) {
    createModalHTML();
  }

  // Bind events
  bindEvents();
  
  // Initialize custom date picker
  initCustomDatePicker();

  // Listen for language changes
  window.addEventListener('languageChange', (e) => {
    currentLang = e.detail.lang;
    updateModalLanguage();
  });


  // Initial render of pricing table
  renderPricingTable();
}

function renderPricingTable() {
  const tbody = document.getElementById('pricing-table-body');
  if (!tbody || !currentTour) return;

  const t = translations[currentLang];
  const rows = [
    { label: '1', pax: 1 },
    { label: '2', pax: 2 },
    { label: '3', pax: 3 },
    { label: t.priceTable4plus, pax: 4 } // Assumes tier for 4 covers 4-8
  ];

  tbody.innerHTML = rows.map(r => {
    const price = getFormattedPrice(currentTour.pricingTiers, r.pax);
    // Remove "COP" / "USD" suffix for cleaner table look, or keep it? 
    // User asked for "buen ux", keeping currency is clearer but removing it is cleaner if header says (COP).
    // Use the full string from getFormattedPrice for clarity.
    return `
      <tr>
        <td class="pax-col">${r.label}</td>
        <td class="price-col">${price}</td>
      </tr>
    `;
  }).join('');
}

// ==================== CREATE MODAL HTML ====================
function createModalHTML() {
  const t = translations[currentLang];
  
  const modalHTML = `
    <div class="booking-modal-overlay" id="booking-modal-overlay"></div>
    <div class="booking-modal" id="booking-modal">
      <div class="booking-modal-content">
        <!-- Close Button -->
        <button class="booking-modal-close" id="booking-modal-close" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- COMPACT HEADER -->
        <div class="booking-modal-header-new">
          <div class="booking-header-info-row">
            <p class="booking-header-subtitle" data-i18n="bookYourTour">${t.bookYourTour}</p>
            
          </div>
          <h2 class="booking-header-title" id="booking-hero-title">Nombre del Tour</h2>
        </div>

        <div class="booking-body-layout">
          <!-- LEFT PANEL: Pricing Sidebar -->
          <div class="booking-panel-left">
            <div class="pricing-table-container">
              <table class="pricing-table">
                <thead>
                  <tr>
                    <th data-i18n="priceTablePax">${t.priceTablePax}</th>
                    <th data-i18n="priceTablePrice">${t.priceTablePrice}</th>
                  </tr>
                </thead>
                <tbody id="pricing-table-body">
                  <!-- Injected via renderPricingTable() -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- MAIN PANEL: Form & Dates -->
          <div class="booking-panel-main">
            <div class="booking-modal-main">
              <!-- Steps Progress -->
              <div class="booking-modal-form">
                <!-- Error Message -->
                <div class="booking-error" id="booking-error">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <p></p>
                </div>

                <!-- Steps Indicator -->
                <div class="booking-steps">
                  <div class="booking-progress-fill" id="booking-progress-fill"></div>
                  <div class="booking-checkpoints">
                    <div class="checkpoint active" data-step="1"></div>
                    <div class="checkpoint" data-step="2"></div>
                    <div class="checkpoint" data-step="3"></div>
                  </div>
                </div>

                <!-- Step 1: Date Selection -->
                <div class="booking-step active" id="booking-step-1">
                  <div class="step-content-scroll">
                    <p class="step-explanation" id="public-dates-explanation" data-i18n="publicDatesExplain">${t.publicDatesExplain}</p>
                    
                    <div id="date-cards-container" class="date-cards-container">
                      <!-- Date cards injected here -->
                    </div>

                    <!-- SHARED: Private Date Dropdown Flow -->
                    <div class="private-date-flow">
                      <div class="booking-divider">
                        <span data-i18n="or">${t.or}</span>
                      </div>
                      <p class="step-explanation" data-i18n="privateDateExplain">${t.privateDateExplain}</p>
                      <div class="private-date-input" id="private-date-input">
                         <div class="custom-date-trigger" id="custom-date-trigger">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <span id="custom-date-text">dd/mm/aaaa</span>
                         </div>
                         <!-- Custom Calendar Popup Shared -->
                         <div class="custom-calendar-popup" id="custom-calendar-popup"></div>
                      </div>
                    </div>

                    <!-- Hidden native input shared -->
                    <input type="date" id="booking-private-date" min="${getMinDate()}" style="display:none">
                  </div>
                </div>

                <!-- Step 2: Customer Details -->
                <div class="booking-step" id="booking-step-2">
                  <button class="booking-back-btn" id="back-to-step-1" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    <span data-i18n="back">${t.back}</span>
                  </button>

                  <div class="form-group">
                    <label data-i18n="fullName">${t.fullName} *</label>
                    <input type="text" id="booking-name" placeholder="Juan Pérez" required>
                  </div>

                  <div class="form-group">
                    <label data-i18n="email">${t.email} *</label>
                    <input type="email" id="booking-email" placeholder="correo@ejemplo.com" required>
                  </div>

                  <div class="form-group">
                    <label data-i18n="phone">${t.phone} *</label>
                    <input type="tel" id="booking-phone" placeholder="+57 300 123 4567" required>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label data-i18n="document">${t.document} *</label>
                      <input type="text" id="booking-document" placeholder="1234567890" required>
                    </div>
                    <div class="form-group">
                      <label data-i18n="guests">${t.guests} *</label>
                      <select id="booking-pax" required>
                        ${[1,2,3,4,5,6,7,8].map(n => `<option value="${n}">${n}</option>`).join('')}
                      </select>
                    </div>
                  </div>

                  <div class="form-group">
                    <label data-i18n="notes">${t.notes}</label>
                    <textarea id="booking-notes" rows="2" placeholder="Dietas especiales, requisitos..."></textarea>
                  </div>

                  <button class="booking-btn primary" id="continue-to-summary" type="button">
                    <span data-i18n="continue">${t.continue}</span>
                  </button>
                </div>

                <!-- Step 3: Summary -->
                <div class="booking-step" id="booking-step-3">
                  <button class="booking-back-btn" id="back-to-step-2" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    <span data-i18n="back">${t.back}</span>
                  </button>

                  <div class="booking-summary" id="booking-summary">
                    <h4 data-i18n="summaryTitle">${t.summaryTitle}</h4>
                    
                    <div class="summary-row">
                      <div class="summary-label-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="summary-icon"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <span class="summary-label" data-i18n="tourName">${t.tourName}</span>
                      </div>
                      <span class="summary-value" id="summary-tour"></span>
                    </div>

                    <div class="summary-row">
                      <div class="summary-label-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="summary-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span class="summary-label" data-i18n="selectedDate">${t.selectedDate}</span>
                      </div>
                      <span class="summary-value" id="summary-date"></span>
                    </div>

                    <div class="summary-row">
                      <div class="summary-label-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="summary-icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        <span class="summary-label" data-i18n="guestCount">${t.guestCount}</span>
                      </div>
                      <span class="summary-value" id="summary-pax"></span>
                    </div>

                    <div class="summary-row">
                      <div class="summary-label-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="summary-icon"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        <span class="summary-label" data-i18n="pricePerPerson">${t.pricePerPerson}</span>
                      </div>
                      <span class="summary-value" id="summary-price-per"></span>
                    </div>

                    <div class="summary-row total">
                      <div class="summary-label-wrapper">
                        <span class="summary-label" data-i18n="totalPrice">${t.totalPrice}</span>
                      </div>
                      <span class="summary-value" id="summary-total"></span>
                    </div>
                  </div>

                  <button class="booking-submit-btn" id="booking-submit" type="button">
                    <span class="spinner"></span>
                    <span class="btn-text" data-i18n="submit">${t.submit}</span>
                  </button>
                </div>

                <!-- Step 4: Success State -->
                <div class="booking-step booking-success" id="booking-step-4">
                  <div class="booking-success-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3 data-i18n="successTitle">${t.successTitle}</h3>
                  <p data-i18n="successMessage">${t.successMessage}</p>
                  
                  <!-- Booking Summary in Success -->
                  <div class="success-booking-summary">
                    <div class="success-summary-row">
                      <span class="success-summary-label" data-i18n="selectedDate">${t.selectedDate}</span>
                      <span class="success-summary-value" id="success-date"></span>
                    </div>
                    <div class="success-summary-row">
                      <span class="success-summary-label" data-i18n="guestCount">${t.guestCount}</span>
                      <span class="success-summary-value" id="success-pax"></span>
                    </div>
                    <div class="success-summary-row total">
                      <span class="success-summary-label" data-i18n="totalPrice">${t.totalPrice}</span>
                      <span class="success-summary-value" id="success-total"></span>
                    </div>
                  </div>
                  
                  <p><span data-i18n="bookingId">${t.bookingId}</span>:</p>
                  <span class="booking-id" id="booking-ref-id"></span>
                  <div class="booking-success-actions">
                    <button class="booking-btn" id="close-modal-btn" type="button">
                      <span data-i18n="closeModal">${t.closeModal}</span>
                    </button>
                  </div>
                </div>
              </div> <!-- booking-modal-form -->
            </div> <!-- booking-modal-main -->
          </div> <!-- booking-panel-main -->
        </div> <!-- booking-body-layout -->

    </div> <!-- booking-modal-content -->
  </div> <!-- booking-modal -->

    <!-- Toast Notification -->
    <div class="booking-toast" id="booking-toast">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span data-i18n="toastSuccess">${t.toastSuccess}</span>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// ==================== BIND EVENTS ====================
function bindEvents() {
  // Open modal from header button (Targets both Desktop and Mobile buttons)
  const openBtns = document.querySelectorAll('.header-cta-primary, #mobile-fixed-btn');
  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Close modal
  const closeBtn = document.getElementById('booking-modal-close');
  const overlay = document.getElementById('booking-modal-overlay');
  const closeModalBtn = document.getElementById('close-modal-btn');
  
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Private date input change
  const privateDateInput = document.getElementById('booking-private-date');
  if (privateDateInput) {
    privateDateInput.addEventListener('change', handlePrivateDateSelect);
  }

  // Change date button in Step 2
  document.getElementById('change-date-btn')?.addEventListener('click', () => goToStep(1));

  // Back buttons
  document.getElementById('back-to-step-1')?.addEventListener('click', () => goToStep(1));
  document.getElementById('back-to-step-2')?.addEventListener('click', () => goToStep(2));

  // Continue to summary
  document.getElementById('continue-to-summary')?.addEventListener('click', continueToSummary);

  // Submit button
  const submitBtn = document.getElementById('booking-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', handleSubmit);
  }

  // Pax change - update summary
  document.getElementById('booking-pax')?.addEventListener('change', updateSummaryIfVisible);
}

// ==================== MODAL CONTROLS ====================
async function openModal() {
  const modal = document.getElementById('booking-modal');
  const overlay = document.getElementById('booking-modal-overlay');
  
  if (!modal || !currentTour) return;

  // Show modal immediately with loading state
  overlay.classList.add('active');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden'; // Lock html too

  // ==================== POPULATE HERO ====================
  // Set hero background image
  const heroImage = document.getElementById('booking-hero-image');
  if (heroImage && currentTour.images && currentTour.images.length > 0) {
    heroImage.style.backgroundImage = `url('${currentTour.images[0]}')`;
  }
  
  // Set hero title
  const heroTitle = document.getElementById('booking-hero-title');
  if (heroTitle) {
    heroTitle.textContent = currentTour.name[currentLang];
  }
  
  // Set duration chip
  const durationText = document.getElementById('booking-duration-text');
  if (durationText && currentTour.duration) {
    // Handle both string and object (bilingual) formats
    if (typeof currentTour.duration === 'object') {
      durationText.textContent = currentTour.duration[currentLang] || currentTour.duration.es || '';
    } else {
      durationText.textContent = currentTour.duration;
    }
  }
  
  // Set altitude chip
  const altitudeText = document.getElementById('booking-altitude-text');
  if (altitudeText && currentTour.altitude) {
    // Handle both string and number formats
    const alt = typeof currentTour.altitude === 'object' 
      ? (currentTour.altitude[currentLang] || currentTour.altitude.es)
      : currentTour.altitude;
    altitudeText.textContent = `${alt} msnm`;
  }
  
  // Set difficulty chip
  const difficultyText = document.getElementById('booking-difficulty-text');
  if (difficultyText && currentTour.difficulty) {
    const difficultyLabels = {
      'easy': { es: 'Fácil', en: 'Easy' },
      'moderate': { es: 'Moderado', en: 'Moderate' },
      'hard': { es: 'Difícil', en: 'Hard' },
      'expert': { es: 'Experto', en: 'Expert' }
    };
    const diffKey = currentTour.difficulty.toLowerCase();
    difficultyText.textContent = difficultyLabels[diffKey]?.[currentLang] || currentTour.difficulty;
  }

  // Render pricing tiers (doesn't need refresh)
  renderPricingTiers();

  // IMPORTANT: Refresh departures from API to get latest availability
  // Use forceRefresh to bypass CDN cache (especially after a booking)
  try {

    const freshDepartures = await apiService.getDepartures(true); // Always bypass cache when opening modal
    
    // Update currentDepartures with fresh data for this tour
    // Filter: matching tour, open status, future date, AND has available spots
    currentDepartures = freshDepartures.filter(d => {
      const available = (d.maxPax || 8) - (d.currentPax || 0);
      return d.tourId === currentTour.tourId && 
        d.status === 'open' &&
        new Date(d.date._seconds * 1000) >= new Date() &&
        available > 0; // Only show departures with available spots
    }).sort((a, b) => a.date._seconds - b.date._seconds);
    

    needsForceRefresh = false; // Reset flag
  } catch (error) {
    console.error('❌ Failed to refresh departures:', error);
  }

  // Render date cards with fresh data
  renderDateCards();

  // Reset to step 1
  goToStep(1);
  resetForm();


}

function closeModal() {
  const modal = document.getElementById('booking-modal');
  const overlay = document.getElementById('booking-modal-overlay');
  
  if (modal) modal.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}

// ==================== RENDER PRICING TIERS ====================
function renderPricingTiers() {
  const container = document.getElementById('pricing-tiers-list');
  if (!container || !currentTour.pricingTiers) return;

  const t = translations[currentLang];

  container.innerHTML = currentTour.pricingTiers.map(tier => {
    const paxText = tier.minPax === tier.maxPax 
      ? `${tier.minPax} ${tier.minPax === 1 ? t.person : t.persons}`
      : `${tier.minPax}-${tier.maxPax} ${t.persons}`;
    
    const price = currentLang === 'en'
      ? formatUSD(tier.priceUSD)
      : formatCOP(tier.priceCOP);

    return `
      <div class="pricing-tier">
        <span class="pricing-tier-pax">${paxText}</span>
        <span class="pricing-tier-price">${price} ${t.currency}</span>
      </div>
    `;
  }).join('');
}

// ==================== RENDER DATE CARDS ====================
function renderDateCards() {
  const container = document.getElementById('date-cards-container');
  if (!container) return;

  const t = translations[currentLang];

  // If no public departures
  if (currentDepartures.length === 0) {
    container.innerHTML = `<p class="no-dates-message" data-i18n="noPublicDates">${t.noPublicDates}</p>`;
    // Hide divider and explanation texts
    const dividerEl = document.querySelector('.booking-divider');
    const inputEl = document.getElementById('private-date-input');
    const publicExplainEl = document.getElementById('public-dates-explanation');
    const privateExplainEl = document.getElementById('private-dates-explanation');
    
    if (dividerEl) dividerEl.style.display = 'none';
    if (publicExplainEl) publicExplainEl.style.display = 'none';
    if (privateExplainEl) privateExplainEl.style.display = 'none';
    if (inputEl) {
      inputEl.style.display = 'block';
      inputEl.style.marginTop = '16px';
    }
    return;
  }
  
  // Show divider and explanation texts when there are departures
  const dividerEl = document.querySelector('.booking-divider');
  const inputEl = document.getElementById('private-date-input');
  const publicExplainEl = document.getElementById('public-dates-explanation');
  const privateExplainEl = document.getElementById('private-dates-explanation');
  
  if (dividerEl) dividerEl.style.display = 'flex';
  if (publicExplainEl) publicExplainEl.style.display = 'block';
  if (privateExplainEl) privateExplainEl.style.display = 'block';
  if (inputEl) {
    inputEl.style.display = 'block';
    inputEl.style.marginTop = '16px';
  }

  // Render up to 4 date cards
  const displayDates = currentDepartures.slice(0, 4);
  
  container.innerHTML = displayDates.map(dep => {
    const date = new Date(dep.date._seconds * 1000);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat(currentLang === 'en' ? 'en-US' : 'es-CO', { month: 'long' }).format(date);
    
    const maxPax = dep.maxPax || 8;
    const currentPax = dep.currentPax || 0;
    const available = maxPax - currentPax;
    const spotsText = available === 1 ? t.spotAvailable : t.spotsAvailable;
    const isLow = available <= 3;

    // Price is based on TOTAL people after user joins (currentPax + 1 minimum)
    const totalPeopleAfterBooking = currentPax + 1;
    const price = getFormattedPrice(dep.pricingSnapshot || currentTour.pricingTiers, totalPeopleAfterBooking);

    return `
      <div class="date-card" data-departure-id="${dep.departureId}">
        <div class="date-card-left">
          <div class="date-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div class="date-card-info">
            <span class="date-card-weekday">${new Intl.DateTimeFormat(currentLang === 'en' ? 'en-US' : 'es-CO', { weekday: 'short' }).format(date)}</span>
            <span class="date-card-day">${day}</span>
            <span class="date-card-month">${month}</span>
          </div>
        </div>
        <div class="date-card-center">
          <div class="date-card-slots ${isLow ? 'low' : ''}">
            <span class="dot"></span>
            <span>${available} ${spotsText}</span>
          </div>
          <p class="date-card-price">${price} ${t.currency}${t.perPerson}</p>
        </div>
        <div class="date-card-right">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      </div>
    `;
  }).join('');

  // Bind click events to cards
  container.querySelectorAll('.date-card').forEach(card => {
    card.addEventListener('click', () => selectDateCard(card));
  });
}

// ==================== DATE SELECTION ====================
function selectDateCard(card) {
  // Deselect all
  document.querySelectorAll('.date-card').forEach(c => c.classList.remove('selected'));
  
  // Select this one
  card.classList.add('selected');
  
  selectedDepartureId = card.dataset.departureId;
  isPrivateBooking = false;
  selectedDate = null;

  // Hide private date input
  document.getElementById('private-date-input')?.classList.remove('active');

  // Go to step 2
  setTimeout(() => goToStep(2), 300);
}

function togglePrivateDateInput(isActive) {
  const input = document.getElementById('private-date-input');
  const dateInput = document.getElementById('booking-private-date');
  
  if (isActive) {
    if (input) input.style.display = 'block';
    // Reset date picker value each time it's shown
    if (dateInput) {
      dateInput.value = '';
    }
    // Deselect date cards
    document.querySelectorAll('.date-card').forEach(c => c.classList.remove('selected'));
    selectedDepartureId = null;
    selectedDate = null;
    isPrivateBooking = false;
  } else {
    if (input) input.style.display = 'none';
  }
}

function handlePrivateDateSelect(e) {
  const dateValue = e.target.value;
  if (!dateValue) return;

  selectedDate = dateValue;
  isPrivateBooking = true;
  selectedDepartureId = null;

  // Go to step 2
  setTimeout(() => goToStep(2), 300);
}

// ==================== STEP NAVIGATION ====================
// ==================== NAVIGATION ====================
function goToStep(stepNumber) {
  const modalContent = document.querySelector('.booking-modal-content');
  const bodyLayout = document.querySelector('.booking-body-layout');
  
  // 1. Measure current height before changes
  const oldHeight = modalContent ? modalContent.offsetHeight : 0;

  // Hide all steps
  document.querySelectorAll('.booking-step').forEach(step => {
    step.classList.remove('active');
  });

  // Show target step
  const targetStep = document.getElementById(`booking-step-${stepNumber}`);
  if (targetStep) targetStep.classList.add('active');

  // Success state layout toggle
  const modal = document.getElementById('booking-modal');
  if (modal) {
    if (stepNumber === 4) {
      modal.classList.add('is-success');
    } else {
      modal.classList.remove('is-success');
    }
  }

  // 2. Measure new height after step change
  if (modalContent) {
    // Temporarily set height to auto to measure new content
    const originalHeightStyle = modalContent.style.height;
    modalContent.style.height = 'auto';
    const newHeight = modalContent.offsetHeight;
    
    // 3. Apply animation
    // Set back to old height first (no transition if we do it fast enough or disable it)
    modalContent.style.transition = 'none';
    modalContent.style.height = `${oldHeight}px`;
    
    // Force reflow
    modalContent.offsetHeight;
    
    // Restore transition and set to new height
    modalContent.style.transition = 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    modalContent.style.height = `${newHeight}px`;
    
    // 4. Clean up: reset to auto after animation to keep it responsive
    setTimeout(() => {
      if (modalContent.style.height === `${newHeight}px`) {
        modalContent.style.height = ''; // Back to CSS/auto
      }
    }, 600);
  }

  // Update progress bar width and checkpoints
  const progressFill = document.getElementById('booking-progress-fill');
  const checkpoints = document.querySelectorAll('.checkpoint');
  
  if (progressFill) {
    if (stepNumber === 1) progressFill.style.width = '0%';
    if (stepNumber === 2) progressFill.style.width = '50%';
    if (stepNumber === 3) progressFill.style.width = '100%';
    if (stepNumber === 4) progressFill.style.width = '100%';
  }

  checkpoints.forEach(cp => {
    const cpStep = parseInt(cp.dataset.step);
    if (cpStep <= stepNumber) {
      cp.classList.add('active');
    } else {
      cp.classList.remove('active');
    }
  });
}

// ==================== CUSTOM DATE PICKER LOGIC ====================
let calendarCurrentDate = new Date();

function initCustomDatePicker() {
  const trigger = document.getElementById('custom-date-trigger');
  const popup = document.getElementById('custom-calendar-popup');
  const dateInput = document.getElementById('booking-private-date');

  if (!trigger || !popup) return;

  // Toggle calendar popup
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = popup.classList.contains('active');
    
    // Close other popups if any
    document.querySelectorAll('.custom-calendar-popup.active').forEach(p => p.classList.remove('active'));
    
    if (!isActive) {
      popup.classList.add('active');
      renderCalendar(calendarCurrentDate);
    } else {
      popup.classList.remove('active');
    }
  });

  // Global close on outside click
  document.addEventListener('click', (e) => {
    if (popup && !popup.contains(e.target) && !trigger.contains(e.target)) {
      popup.classList.remove('active');
    }
  });
}

function renderCalendar(date) {
  const container = document.getElementById('custom-calendar-popup');
  if (!container) return;
  
  const year = date.getFullYear();
  const month = date.getMonth();
  const t = translations[currentLang];
  
  // Month names
  const monthNames = {
    es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };
  
  // Weekday initials
  const weekDays = {
    es: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
    en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  };

  const currentMonthName = monthNames[currentLang][month];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0,0,0,0);
  
  // Custom min date (tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  minDate.setHours(0,0,0,0);
  
  let html = `
    <div class="calendar-header">
      <button class="calendar-month-btn prev-month-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <span class="calendar-current-month">${currentMonthName} ${year}</span>
      <button class="calendar-month-btn next-month-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
    <div class="calendar-grid">
      ${weekDays[currentLang].map(d => `<div class="calendar-weekday">${d}</div>`).join('')}
  `;
  
  // Empty slots
  for (let i = 0; i < firstDay; i++) {
    html += `<div></div>`;
  }
  
  // Days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    
    // Check constraints
    const isPast = d < minDate;
    const isSelected = document.getElementById('booking-private-date').value === dateString;
    const isToday = d.getTime() === today.getTime();
    
    let classes = 'calendar-day';
    if (isPast) classes += ' disabled';
    if (isSelected) classes += ' selected';
    if (isToday) classes += ' today';
    
    html += `<div class="${classes}" data-date="${dateString}">${i}</div>`;
  }
  
  html += `</div>`;
  container.innerHTML = html;
  
  // Bind calendar events
  container.querySelector('.prev-month-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
    renderCalendar(calendarCurrentDate);
  });
  
  container.querySelector('.next-month-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
    renderCalendar(calendarCurrentDate);
  });
  
  container.querySelectorAll('.calendar-day:not(.disabled)').forEach(day => {
    day.addEventListener('click', (e) => {
      e.stopPropagation();
      const selectedDate = e.target.getAttribute('data-date');
      selectCustomDate(selectedDate);
    });
  });
}

function selectCustomDate(dateString) {
  const dateInput = document.getElementById('booking-private-date');
  const dateText = document.getElementById('custom-date-text');
  const popup = document.getElementById('custom-calendar-popup');
  
  if (!dateInput) return;

  // Update native input
  dateInput.value = dateString;
  
  // Dispatch change for global state handling
  dateInput.dispatchEvent(new Event('change', { bubbles: true }));
  
  // Update UI trigger text
  if (dateText) {
    const [y, m, d] = dateString.split('-');
    dateText.textContent = `${d}/${m}/${y}`;
    dateText.style.color = 'white';
  }
  
  // Close popup
  if (popup) {
    popup.classList.remove('active');
  }

  // Refresh calendar view to show selection
  renderCalendar(calendarCurrentDate);
}

function updateStep2DateDisplay() {
  const t = translations[currentLang];
  const displayEl = document.getElementById('step2-date-display');
  const summaryContainer = document.getElementById('selected-date-summary');
  if (!displayEl) return;

  let dateText = '';
  let spotsText = '';
  
  if (isPrivateBooking && selectedDate) {
    const date = new Date(selectedDate + 'T12:00:00');
    dateText = new Intl.DateTimeFormat(currentLang === 'en' ? 'en-US' : 'es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
    dateText += ` (${t.privateDate})`;
  } else if (selectedDepartureId) {
    const dep = currentDepartures.find(d => d.departureId === selectedDepartureId);
    if (dep) {
      const date = new Date(dep.date._seconds * 1000);
      dateText = new Intl.DateTimeFormat(currentLang === 'en' ? 'en-US' : 'es-CO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
      
      // Add available spots info
      const available = (dep.maxPax || 8) - (dep.currentPax || 0);
      spotsText = `${available} ${t.availableSpots.toLowerCase()}`;
    }
  }
  
  // Build display HTML
  let displayHTML = dateText || '-';
  if (spotsText) {
    displayHTML += `<br><span class="spots-info">${spotsText}</span>`;
  }
  displayEl.innerHTML = displayHTML;
  
  // Show/hide the summary container in left column
  if (summaryContainer) {
    if (dateText) {
      summaryContainer.style.display = 'block';
    } else {
      summaryContainer.style.display = 'none';
    }
  }
}

function continueToSummary() {
  // Clear previous errors
  hideError();
  document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

  // Validate form
  if (!validateForm()) return;

  // Update summary
  updateSummary();

  // Go to step 3
  goToStep(3);
}

function updateSummaryIfVisible() {
  const step3 = document.getElementById('booking-step-3');
  if (step3?.classList.contains('active')) {
    updateSummary();
  }
}

function updateSummary() {
  const t = translations[currentLang];
  const pax = parseInt(document.getElementById('booking-pax').value);

  // Tour name
  document.getElementById('summary-tour').textContent = currentTour.name[currentLang];

  // Date and spots info
  let dateText;
  let currentPaxInDeparture = 0;
  let availableSpots = 0;
  
  if (isPrivateBooking && selectedDate) {
    const date = new Date(selectedDate + 'T12:00:00');
    dateText = new Intl.DateTimeFormat(currentLang === 'en' ? 'en-US' : 'es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
    dateText += ` (${t.privateDate})`;
  } else if (selectedDepartureId) {
    const dep = currentDepartures.find(d => d.departureId === selectedDepartureId);
    if (dep) {
      const date = new Date(dep.date._seconds * 1000);
      dateText = new Intl.DateTimeFormat(currentLang === 'en' ? 'en-US' : 'es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
      currentPaxInDeparture = dep.currentPax || 0;
      availableSpots = (dep.maxPax || 8) - currentPaxInDeparture;
      
      // Add spots info to date
      dateText += ` (${availableSpots} ${t.availableSpots.toLowerCase()})`;
    }
  }
  document.getElementById('summary-date').textContent = dateText || '-';

  // Pax
  document.getElementById('summary-pax').textContent = `${pax} ${pax === 1 ? t.person : t.persons}`;

  // Price calculation - based on TOTAL group size (currentPax + new pax)
  const pricingTiers = currentTour.pricingTiers;
  let totalGroupSize;
  
  if (isPrivateBooking) {
    // Private booking: price based on user's pax only
    totalGroupSize = pax;
  } else {
    // Public departure: price based on existing pax + user's pax
    totalGroupSize = currentPaxInDeparture + pax;
  }
  
  const tier = pricingTiers.find(t => totalGroupSize >= t.minPax && totalGroupSize <= t.maxPax) 
    || pricingTiers[pricingTiers.length - 1];
  
  const pricePerPerson = currentLang === 'en' ? tier.priceUSD : tier.priceCOP;
  const total = pricePerPerson * pax;

  document.getElementById('summary-price-per').textContent = currentLang === 'en' 
    ? formatUSD(tier.priceUSD) 
    : formatCOP(tier.priceCOP);
  
  document.getElementById('summary-total').textContent = currentLang === 'en'
    ? formatUSD(total)
    : formatCOP(total);
}

// ==================== FORM HANDLING ====================
function resetForm() {
  document.getElementById('booking-name').value = '';
  document.getElementById('booking-email').value = '';
  document.getElementById('booking-phone').value = '';
  document.getElementById('booking-document').value = '';
  document.getElementById('booking-pax').value = '2';
  document.getElementById('booking-notes').value = '';
  
  hideError();
  
  document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
  document.querySelectorAll('.date-card').forEach(c => c.classList.remove('selected'));
  
  selectedDate = null;
  selectedDepartureId = null;
  isPrivateBooking = false;
}

function validateForm() {
  const t = translations[currentLang];
  let isValid = true;

  // Name
  const name = document.getElementById('booking-name').value.trim();
  if (!name || name.length < 3) {
    showFieldError('booking-name', t.errorRequired);
    isValid = false;
  }

  // Email
  const email = document.getElementById('booking-email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFieldError('booking-email', t.errorEmail);
    isValid = false;
  }

  // Phone
  const phone = document.getElementById('booking-phone').value.trim();
  if (!phone.startsWith('+') || phone.length < 10) {
    showFieldError('booking-phone', t.errorPhone);
    isValid = false;
  }

  // Document
  const doc = document.getElementById('booking-document').value.trim();
  if (!doc || doc.length < 5) {
    showFieldError('booking-document', t.errorRequired);
    isValid = false;
  }

  return isValid;
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  const group = field.closest('.form-group');
  group?.classList.add('error');
}

function showError(message) {
  const errorEl = document.getElementById('booking-error');
  if (errorEl) {
    errorEl.querySelector('p').textContent = message;
    errorEl.classList.add('active');
  }
}

function hideError() {
  document.getElementById('booking-error')?.classList.remove('active');
}

// ==================== SUBMIT BOOKING ====================
async function handleSubmit() {
  const t = translations[currentLang];
  
  // Clear previous errors
  hideError();

  // Check date selection
  if (!selectedDepartureId && !selectedDate) {
    showError(t.errorRequired);
    goToStep(1);
    return;
  }

  const submitBtn = document.getElementById('booking-submit');
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  const customerData = {
    name: document.getElementById('booking-name').value.trim(),
    email: document.getElementById('booking-email').value.trim(),
    phone: document.getElementById('booking-phone').value.trim(),
    document: document.getElementById('booking-document').value.trim(),
    note: document.getElementById('booking-notes').value.trim()
  };

  const pax = parseInt(document.getElementById('booking-pax').value);

  try {
    let result;

    if (isPrivateBooking) {
      // Private booking
      result = await createPrivateBooking(currentTour.tourId, selectedDate, customerData, pax);
    } else {
      // Join public departure
      result = await joinPublicDeparture(selectedDepartureId, customerData, pax);
    }

    // Show toast
    showToast();

    // Show success
    showSuccess(result.bookingId);


  } catch (error) {
    console.error('❌ Booking error:', error);
    
    if (error.message.includes('Demasiados') || error.message.includes('Too many')) {
      showError(t.errorRateLimit);
    } else {
      showError(error.message || t.errorGeneric);
    }
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
}

function showToast() {
  const toast = document.getElementById('booking-toast');
  if (toast) {
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 4000);
  }
}

function showSuccess(bookingId) {
  const t = translations[currentLang];
  const pax = parseInt(document.getElementById('booking-pax').value);
  
  // Use standard navigation for success
  goToStep(4);
  
  // Set booking ID
  document.getElementById('booking-ref-id').textContent = bookingId;
  
  // Populate success summary - DATE
  let dateText = '';
  let currentPaxInDeparture = 0;
  
  if (isPrivateBooking && selectedDate) {
    const date = new Date(selectedDate + 'T12:00:00');
    dateText = new Intl.DateTimeFormat(currentLang === 'en' ? 'en-US' : 'es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
    dateText += ` (${t.privateDate})`;
  } else if (selectedDepartureId) {
    const dep = currentDepartures.find(d => d.departureId === selectedDepartureId);
    if (dep) {
      const date = new Date(dep.date._seconds * 1000);
      dateText = new Intl.DateTimeFormat(currentLang === 'en' ? 'en-US' : 'es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
      currentPaxInDeparture = dep.currentPax || 0;
    }
  }
  document.getElementById('success-date').textContent = dateText || '-';
  
  // Populate success summary - PAX
  document.getElementById('success-pax').textContent = `${pax} ${pax === 1 ? t.person : t.persons}`;
  
  // Populate success summary - TOTAL PRICE
  const pricingTiers = currentTour.pricingTiers;
  const totalGroupSize = isPrivateBooking ? pax : (currentPaxInDeparture + pax);
  const tier = pricingTiers.find(t => totalGroupSize >= t.minPax && totalGroupSize <= t.maxPax) 
    || pricingTiers[pricingTiers.length - 1];
  
  const pricePerPerson = currentLang === 'en' ? tier.priceUSD : tier.priceCOP;
  const total = pricePerPerson * pax;
  const formattedTotal = currentLang === 'en' ? formatUSD(total) : formatCOP(total);
  document.getElementById('success-total').textContent = `${formattedTotal} ${t.currency}`;
}

// ==================== API CALLS ====================
const API_BASE = 'https://us-central1-nevadotrektest01.cloudfunctions.net/api';

async function joinPublicDeparture(departureId, customer, pax) {
  const response = await fetch(`${API_BASE}/public/bookings/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ departureId, customer, pax })
  });

  if (response.status === 429) {
    throw new Error('Demasiados intentos. Espera 15 minutos.');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Error ${response.status}`);
  }

  return response.json();
}

async function createPrivateBooking(tourId, date, customer, pax) {
  const response = await fetch(`${API_BASE}/public/bookings/private`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tourId, date, customer, pax })
  });

  if (response.status === 429) {
    throw new Error('Demasiados intentos. Espera 15 minutos.');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Error ${response.status}`);
  }

  return response.json();
}

// ==================== HELPERS ====================
function getMinDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

function formatCOP(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0);
}

function formatUSD(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0);
}

function getFormattedPrice(pricingTiers, currentPax = 1) {
  if (!pricingTiers || pricingTiers.length === 0) return '';

  // Find appropriate tier
  const tier = pricingTiers.find(t => currentPax >= t.minPax && currentPax <= t.maxPax) 
    || pricingTiers[pricingTiers.length - 1];

  return currentLang === 'en' ? formatUSD(tier.priceUSD) : formatCOP(tier.priceCOP);
}

function updateModalLanguage() {
  const t = translations[currentLang];
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) {
      el.textContent = t[key];
    }
  });

  // Update elements with data-i18n-key using translations lookup
  const i18nKeyTranslations = {
    'booking.benefit1': currentLang === 'en' ? 'Best price guaranteed' : 'Mejor precio garantizado',
    'booking.benefit2': currentLang === 'en' ? 'Personalized attention' : 'Atención personalizada',
    'booking.benefit3': currentLang === 'en' ? 'Flexibility in changes' : 'Flexibilidad en cambios',
    'booking.benefit4': currentLang === 'en' ? '24/7 Support' : 'Soporte 24/7',
    'booking.note1': currentLang === 'en' ? 'Confirmation in 24 hours' : 'Confirmación en 24 horas',
    'booking.note2': currentLang === 'en' ? 'Pay upon confirmation' : 'Pago al confirmar'
  };
  
  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.dataset.i18nKey;
    if (i18nKeyTranslations[key]) {
      el.textContent = i18nKeyTranslations[key];
    }
  });

  // Update tour name
  if (currentTour) {
    const tourNameEl = document.getElementById('booking-tour-name');
    if (tourNameEl) {
      tourNameEl.textContent = currentTour.name[currentLang];
    }
  }

  // Re-render pricing tiers
  renderPricingTiers();

  // Re-render simplified pricing table
  renderPricingTable();

  // Re-render date cards with new language/currency
  renderDateCards();

  // Update date summary display (left column)
  updateStep2DateDisplay();

  // Update summary if visible
  updateSummaryIfVisible();
}

// ==================== EXPOSE GLOBALLY ====================
window.openBookingModal = openModal;
window.closeBookingModal = closeModal;
