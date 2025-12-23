# Plan: Header Standardization & Mobile Menu Refactor

## Phase 1: Analysis & Baseline
- [ ] Task: Audit current header CSS and JS.
    -   Identify the CSS classes used for the header in `index.html`, `ToursPage.html`, `TourPage.html`, and `Gallery.html`.
    -   Document the current computed values (width, padding, margin, height) for both initial and "pill" states.
    -   Analyze `js/navbar-handler.js` (and any other relevant scripts) to understand the scroll trigger logic.
- [ ] Task: Audit mobile menu implementation.
    -   Identify why the hamburger button fails on certain pages.
    -   Check for JS errors in the console related to navigation.

## Phase 2: Desktop Header Standardization
- [ ] Task: Define standard CSS variables/classes.
    -   Create or update a central CSS definition (e.g., in `hero-common.css` or a new `header-standard.css`) for the header container, pill state, and inner spacing.
- [ ] Task: Refactor `index.html` header.
    -   Apply standard classes/styles.
    -   Verify pill transition.
- [ ] Task: Refactor `Sections/ToursPage.html` header.
    -   Apply standard classes/styles.
    -   Verify pill transition.
- [ ] Task: Refactor `Sections/Gallery.html` header.
    -   Apply standard classes/styles.
    -   Verify pill transition.
- [ ] Task: Refactor `Sections/TourPage.html` header.
    -   Apply standard classes/styles, ensuring the "Reserva" button is accommodated within the standard spacing.
    -   Verify pill transition.

## Phase 3: Mobile Menu Refactor
- [ ] Task: Standardize Mobile Menu HTML structure.
    -   Ensure all pages share the same HTML structure for the mobile menu container and trigger.
- [ ] Task: Implement GPU-optimized animation.
    -   Write a GSAP or CSS-based transition using `transform` for opening/closing the menu.
    -   Ensure `will-change` is used appropriately.
- [ ] Task: Fix Hamburger Button Logic.
    -   Update JS to handle the click event reliably across all pages.
    -   Ensure the close state is handled correctly.

## Phase 4: Final QA
- [ ] Task: Visual Verification (Desktop).
    -   Check all 4 pages for consistent header alignment and pill behavior.
- [ ] Task: Visual Verification (Mobile).
    -   Check menu opening/closing performance and layout on all 4 pages.
