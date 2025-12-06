# Decision Record: Routing Strategy

**Date:** 2025-12-02
**Status:** Accepted

## Context
The project requires connecting the Home page (`index.html`) to a dynamic Tour Detail page (`TourPage.html`). The project utilizes complex, high-performance animations using **GSAP ScrollTrigger**.

## Decision
We have decided to use a **Multi-Page Application (MPA)** architecture with **Client-Side Rendering (CSR)** for content.

### Architecture
1.  **Navigation**: Standard browser navigation (full page reload) is used when moving between `index.html` and `TourPage.html`.
2.  **Routing**: URL Query Parameters (e.g., `TourPage.html?id=tour-id`) are used to identify the requested resource.
3.  **Rendering**: The `TourPage.html` acts as a shell/template. JavaScript fetches data from the API and populates the DOM after the initial load.

## Rationale
1.  **Animation Stability**: GSAP ScrollTrigger calculations are sensitive to DOM changes and memory states. Simulating a Single Page Application (SPA) navigation (without a robust framework) often leads to broken animations, memory leaks, and scroll position issues. A full reload ensures a clean state for the animation engine.
2.  **Simplicity**: Avoids the complexity of implementing a client-side router and state management system in vanilla JavaScript.
3.  **Layout Preservation**: Maintains the existing Webflow-generated layout structure without modification.

## Trade-offs
1.  **Performance**: Navigation is not "instant" as it requires re-downloading the HTML shell (mitigated by browser caching of assets).
2.  **SEO**: Relies on search engines executing JavaScript (standard practice for modern Google bots).
3.  **Social Sharing**: Shared links will display generic metadata unless server-side rendering or dynamic meta tags are implemented in the future.
