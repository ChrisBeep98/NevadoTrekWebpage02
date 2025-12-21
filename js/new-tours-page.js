/**
 * Nueva Página de Tours - Script Principal
 * Maneja la carga de tours, filtros y interacciones
 */

// Tour Data (mock data - en producción vendría de una API)
const TOURS_DATA = [
  {
    id: 1,
    title: "Nevado del Tolima",
    description: "Ascenso a uno de los volcanes más emblemáticos de Colombia",
    price: "780.000",
    currency: "COP",
    difficulty: "difficult",
    duration: "4-5",
    image: "https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68cb41abea4f4a82c1e6f2a6_DJI_0058.jpg",
    link: "TourPage.html"
  },
  {
    id: 2,
    title: "Parque Cocora",
    description: "Descubre el valle de las palmas de cera más alto del mundo",
    price: "150.000",
    currency: "COP",
    difficulty: "easy",
    duration: "1",
    image: "https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68e190552a6862e84a46aafe_eit%2004.jpg",
    link: "TourPage.html"
  },
  {
    id: 3,
    title: "Laguna del Otún",
    description: "Caminata hasta una de las lagunas más hermosas del Nevado del Ruiz",
    price: "180.000",
    currency: "COP",
    difficulty: "moderate",
    duration: "1",
    image: "https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68e1dcd9d2184c53066eda3a_edit%2012.jpg",
    link: "TourPage.html"
  },
  {
    id: 4,
    title: "Nevado Santa Isabel",
    description: "Aventura glaciar en el corazón del Parque Nacional Los Nevados",
    price: "850.000",
    currency: "COP",
    difficulty: "difficult",
    duration: "2-3",
    image: "https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68e2b07758b60449ec3c71b2__DSC1845-Mejorado-NR%201.jpg",
    link: "TourPage.html"
  },
  {
    id: 5,
    title: "Cascadas de Salento",
    description: "Recorre las cascadas más impresionantes cerca de Salento",
    price: "120.000",
    currency: "COP",
    difficulty: "easy",
    duration: "1",
    image: "https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68e1962cdb928b053a0aac29_edit%2007%2007.jpg",
    link: "TourPage.html"
  },
  {
    id: 6,
    title: "Trek Los Nevados",
    description: "Travesía completa por el Parque Nacional Los Nevados",
    price: "1.200.000",
    currency: "COP",
    difficulty: "difficult",
    duration: "6+",
    image: "https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68cb41abea4f4a82c1e6f2a6_DJI_0058.jpg",
    link: "TourPage.html"
  }
];

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
function init() {
  renderTours();
  setupFilters();
  setupLanguageSwitcher();
  setupNavbar();
  setupMobileMenu();
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
  
  grid.innerHTML = filteredTours.map(tour => createTourCard(tour)).join('');
}

/**
 * Create tour card HTML
 */
function createTourCard(tour) {
  const difficultyLabel = DIFFICULTY_LABELS[tour.difficulty][currentLang];
  const durationLabel = DURATION_LABELS[tour.duration][currentLang];
  
  return `
    <article class="nt-tour-card">
      <a href="${tour.link}" style="text-decoration: none; color: inherit; display: contents;">
        <div class="nt-card-image-wrapper">
          <img 
            src="${tour.image}" 
            alt="${tour.title}"
            class="nt-card-image"
            loading="lazy"
          />
          
          <!-- Badge en esquina inferior izquierda -->
          <div class="nt-card-badges">
            <span class="nt-badge nt-badge--difficulty">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
              ${difficultyLabel}
            </span>
          </div>
          
          <!-- Flecha en esquina superior derecha -->
          <div class="nt-card-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </div>
        </div>
        
        <div class="nt-card-content">
          <div class="nt-card-header">
            <h3 class="nt-card-title">${tour.title}</h3>
            <span class="nt-card-price">$ ${tour.price}</span>
          </div>
          <p class="nt-card-description">${tour.description}</p>
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
    });
  });

  // Initialize language from localStorage
  const savedLang = localStorage.getItem('lang') || 'es';
  currentLang = savedLang;
  if (savedLang === 'en') {
    currentLangSpan.textContent = 'EN';
    currentFlagImg.src = 'https://flagcdn.com/w20/us.png';
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
