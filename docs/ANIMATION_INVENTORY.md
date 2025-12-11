# Inventario de Animaciones y Reveals - Nevado Trek

Este documento detalla todas las animaciones implementadas actualmente en el proyecto, clasificadas por tipo, tecnología usada y comportamiento (Scroll vs. Load).

## 1. Animaciones de Texto (Typography)

| Nombre | Descripción | Trigger | Implementación | Archivos |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title Letter Reveal** | Reveal letra por letra con efecto blur y slide-up. | **Page Load** | Custom JS + CSS `@keyframes letterRevealSmooth` | `index-animations.js`, `tour-animations.js` |
| **Description Title Reveal** | Reveal letra por letra "vertical clip" (Apple style). | **Scroll (GSAP)** | GSAP Timeline + `clipPath` | `tour-animations.js` (`initDescriptionTitleReveal`) |
| **Paragraph Blur Reveal** | Párrafos aparecen con slide-up (80px → 0) y desenfoque (blur 10px → 0). | **Scroll (GSAP)** | GSAP `fromTo` (opacity, y, filter) | `tour-animations.js` (`initDescriptionTextReveal`) |
| **Section Headings** | Reveal simple de texto al entrar en viewport. | **Scroll (Observer)** | IntersectionObserver + CSS Class `.animating` | `index-animations.js` |

## 2. Animaciones de Scroll y Contenido (Reveals)

| Nombre | Descripción | Trigger | Implementación | Archivos |
| :--- | :--- | :--- | :--- | :--- |
| **Image Scroll Zoom** | Imágenes se expanden a ancho completo (`100vw`) al scrollear. | **Scroll (Scrub)** | GSAP ScrollTrigger (`width`) | `tour-animations.js` (`initImageScrollZoom`) |
| **Curtain Reveal** | Efecto "Telón": máscara sube mientras la imagen tiene parallax inverso. | **Scroll (Scrub)** | GSAP Timeline (Parallax complejo) | `tour-animations.js` (`initCurtainReveals`) |
| **Medium Parallax** | Imagen baja (-250px) mientras texto sube (+350px) al cruzar. | **Scroll (Scrub)** | GSAP `fromTo` (y axis) | `tour-animations.js` (`initMediumParallax`) |
| **Standard Scroll Reveal** | Elementos simples (`.tour-subtitle`, chips) aparecen suavemente. | **Scroll (Observer)** | IntersectionObserver + CSS `.reveal` | `tour-animations.js` (`initScrollReveal`) |
| **Feature List Stagger** | Lista de items (iconos) aparecen en cascada (staggered). | **Scroll (Trigger)** | GSAP `stagger: 0.2` | `tour-animations.js` (`initFeatureListReveal`) |
| **FAQ Stagger** | Items de acordeón aparecen en cascada. | **Scroll (Trigger)** | GSAP `stagger: 0.25` | `tour-animations.js` (`initFAQReveal`) |

## 3. Elementos UI e Interactivos

| Nombre | Descripción | Trigger | Implementación | Archivos |
| :--- | :--- | :--- | :--- | :--- |
| **Floating Pill Navbar** | Navbar pasa de ancho completo (Top) a "Pill" flotante (Scrolled). | **Scroll Position** | JS Listener (`window.scrollY`) + CSS Transitions | `index.html` (Styles), `index-animations.js` |
| **Exclusion Blend Mode** | Texto del navbar invierte color según fondo (Blanco/Negro). | **CSS Props** | CSS `mix-blend-mode: difference` | `index-animations.css`, `tour-navbar.css` |
| **Button Border Beam** | Efecto "Beam" (resplandor) alrededor del borde al hacer hover. | **Hover** | CSS Transitions | *Mencionado en Styleguide* |
| **Mobile Menu** | Overlay de menú hamburguesa. | **Click** | Custom JS Class Toggle | `tour-animations.js` |
| **Dropdown Banderas** | Selector de idioma con fade/slide. | **Click** | Custom JS | `tours-page-loader.js` |

## 4. Animaciones de Cards (Grid Tours)

| Nombre | Descripción | Trigger | Efecto | Implementación |
| :--- | :--- | :--- | :--- | :--- |
| **Card Entrance** | Cards aparecen escalonadas con slide-up. | **Scroll (Trigger)** | GSAP `from` (y, opacity) | `tours-page-loader.js` |
| **Card Content Stagger** | Elementos internos (Título, Precio, Desc) entran en secuencia. | **Scroll (Trigger)** | GSAP Sequence (Title → Price → Desc) | `tours-page-loader.js` |
| **Image Parallax (Card)** | Imagen dentro de la card se mueve ligeramente al scrollear. | **Scroll (Scrub)** | GSAP `y: 50` | `tours-page-loader.js` |

## 5. Resumen Técnico

*   **Librerías Principales:** GSAP (Core + ScrollTrigger), jQuery (Legacy).
*   **Estrategia de Renderizado:**
    *   **GSAP Scrub:** Para efectos continuos ligados al scroll (Zoom, Parallax).
    *   **GSAP Trigger:** Para entradas de una sola vez ("Pop-in", Staggers).
    *   **CSS Animations:** Para efectos de carga inicial (Hero Letters) y micro-interacciones (Hover).
    *   **IntersectionObserver:** Para reveals simples de texto donde GSAP es overkill.
