# Tech Stack: Nevado Trek Web

## Core Technologies
- **Frontend:** HTML5, CSS3, JavaScript (ES6+).
- **Frameworks/Libraries:** 
  - **jQuery:** Dependencia principal para los componentes exportados de Webflow.
  - **Webflow JS:** Proporciona funcionalidades nativas del layout exportado.

## Animation & Interactivity
- **GSAP (GreenSock):** Motor principal para animaciones premium.
  - **Plugins:** ScrollTrigger, SplitText.
- **Splide.js:** Utilizado para los sliders de servicios y reseñas.

## Systems
- **i18n:** Sistema personalizado de internacionalización (ES/EN) con persistencia en `localStorage`.
- **Dynamic Content:** Carga de reseñas y tours mediante scripts personalizados (`home-loader.js`, `tour-loader.js`).

## Infrastructure
- **Architecture:** Static Multi-Page Application (MPA).
- **Assets:** Localized CSS and JS libraries for performance and independence.
