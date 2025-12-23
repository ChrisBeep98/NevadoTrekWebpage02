# Specification: Header Standardization & Mobile Menu Refactor

## Context
The project currently has inconsistent header implementations across its four main pages (`index.html`, `ToursPage.html`, `TourPage.html`, `Gallery.html`). The header features a "pill" transformation on scroll, but margins, paddings, and widths vary between pages. Additionally, the mobile menu functionality is broken, with inconsistent layouts and non-optimized animations.

## Goals
1.  **Standardize Desktop Header:** Ensure the header's initial state and scrolled "pill" state are visually consistent across all pages (same height, padding, margins, and width constraints).
2.  **Fix Mobile Menu:** Refactor the mobile menu to work reliably on all pages, ensuring the hamburger button functions correctly and the menu content is complete.
3.  **Optimize Animations:** Implement GPU-accelerated transitions (using CSS `transform` or GSAP) for the mobile menu open/close action to ensure 60fps performance.
4.  **Preserve Unique Elements:** Maintain the unique "Reserva" button on the `TourPage.html` header while aligning its structural container with the standard.

## Scope
-   **Files:**
    -   `index.html`
    -   `Sections/ToursPage.html`
    -   `Sections/TourPage.html`
    -   `Sections/Gallery.html`
    -   `css/*` (relevant header/nav styles)
    -   `js/*` (relevant navbar/mobile menu scripts)

## Detailed Requirements

### Desktop Header
-   **Initial State:** Transparent/integrated at the top.
-   **Scrolled State (Pill):**
    -   Background color: Consistent (e.g., White/Blur).
    -   Shadow: Consistent drop shadow.
    -   Width: Consistent max-width or percentage.
    -   Spacing: Equal padding inside the pill.
-   **TourPage Exception:** The CTA button ("Reserva") must remain, but the container holding it must match the standard spacing/height of other pages.

### Mobile Menu
-   **Trigger:** Hamburger button must toggle the menu reliably.
-   **Layout:** Menu must overlay correctly without breaking layout or being cut off.
-   **Animation:** Use `transform: translate(...)` or `opacity` instead of `width/height` or `top/left` properties to avoid layout thrashing.
-   **Content:** Ensure all navigation links are present and styled consistently.

## Non-Goals
-   Redesigning the desktop navigation links (just fixing container/layout).
-   Changing the "Reserva" button functionality.
