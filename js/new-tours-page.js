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
    altitude: "5220 msnm",
    nextDate: "25/12/2025",
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
    altitude: "2400 msnm",
    nextDate: "28/12/2025",
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
    altitude: "3950 msnm",
    nextDate: null, // Test "Por definir"
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
    altitude: "4950 msnm",
    nextDate: "15/01/2026",
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
    altitude: "1900 msnm",
    nextDate: "05/01/2026",
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
    altitude: "4800 msnm",
    nextDate: "10/02/2026",
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

  // Initialize animations for the text inside newly rendered cards
  initTourAnimations();
  
  // Refresh ScrollTrigger to ensure footer triggers are correct after height change
  ScrollTrigger.refresh();
}

/**
 * Initialize animations for the tour card texts
 */
function initTourAnimations() {
  const cardContents = document.querySelectorAll('.nt-card-content');
  if (cardContents.length === 0) return;

  // Clear existing triggers to avoid accumulation on re-renders
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger && (st.vars.trigger instanceof HTMLElement) && st.vars.trigger.classList.contains('nt-card-content')) {
      st.kill();
    }
  });

  cardContents.forEach((content) => {
    const title = content.querySelector('.nt-card-title');
    const price = content.querySelector('.nt-card-price');
    const desc = content.querySelector('.nt-card-description');
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: content,
        start: 'top 92%',
        toggleActions: 'play none none reverse'
      }
    });

    // Title entrance
    tl.from(title, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    })
    // Price entrance (slight delay)
    .from(price, {
      y: 20,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out'
    }, '-=0.6') // Overlap for smoothness
    // Description entrance (more noticeable delay)
    .from(desc, {
      y: 30,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out'
    }, '-=0.5');
  });
}

/**
 * Create tour card HTML
 */
/**
 * Create tour card HTML
 */
function createTourCard(tour) {
  // Translate chips data
  const durationLabel = DURATION_LABELS[tour.duration][currentLang];
  const dateLabel = tour.nextDate || (currentLang === 'es' ? 'Por definir' : 'TBD');
  
  return `
    <article class="nt-tour-card">
      <a href="${tour.link}" style="text-decoration: none; color: inherit; display: contents;">
        <div class="nt-card-image-shadow-box">
          <div class="nt-card-image-wrapper">
            <img 
              src="${tour.image}" 
              alt="${tour.title}"
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
                ${tour.altitude || 'N/A'}
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
  gsap.registerPlugin(ScrollTrigger);

  const footer = document.querySelector('.nt-footer-clean');
  if (!footer) return;

  // -- 1. Top Row (Logo, Tagline, Nav) --
  const footerTop = footer.querySelector('.nt-footer-top');
  if (footerTop) {
    gsap.from(footerTop.querySelectorAll('.nt-footer-logo-main, .nt-footer-tagline, .nt-footer-nav-col'), {
      scrollTrigger: {
        trigger: footerTop,
        start: 'top 85%', // Trigger when top of section hits 85% of viewport
        toggleActions: 'play none none reverse'
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      clearProps: 'all' // Cleanup for cleaner DOM after animation
    });
  }

  // -- 2. Giant Text Section --
  const footerGiant = footer.querySelector('.nt-footer-giant');
  if (footerGiant) {
    const tlGiant = gsap.timeline({
      scrollTrigger: {
        trigger: footerGiant,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });

    // Separators expand
    tlGiant.from(footerGiant.querySelectorAll('.nt-footer-separator'), {
      scaleX: 0,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.1
    })
    // Text rises matching the separators
    .from(footerGiant.querySelector('.nt-text-big'), {
      y: 60,
      opacity: 0,
      duration: 1.0,
      ease: 'power3.out'
    }, '<0.2'); // Start 0.2s after separators start
  }

  // -- 3. Bottom Row (Legal & Copyright) --
  const footerBottom = footer.querySelector('.nt-footer-bottom');
  if (footerBottom) {
    gsap.from(footerBottom.children, {
      scrollTrigger: {
        trigger: footerBottom,
        start: 'top 95%', // Trigger slightly earlier (lower on screen)
        toggleActions: 'play none none reverse'
      },
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1, // Stagger copyright vs legal links
      ease: 'power2.out',
      clearProps: 'all'
    });
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  renderTours();
  setupFilters();
  setupLanguageSwitcher();
  setupMobileMenu();
  initFooterAnimations();
});

