# Dynamic Content & Routing System

## Overview
The site uses a "Multi-Page Application" (MPA) architecture with Client-Side Rendering (CSR) for tour content. This hybrid approach preserves the complex GSAP animations of the Webflow template while allowing dynamic data loading from the API.

## Architecture

### 1. API Service (`js/services/api.js`)
- **Purpose**: Centralized communication with the Nevado Trek API.
- **Features**:
  - Fetches Tours (`/public/tours`) and Departures (`/public/departures`).
  - **Caching**: Implements `localStorage` caching (5 minutes TTL) to reduce API calls and improve load speed.
  - **Helpers**: `formatPrice` (COP formatting) and `getNextDepartureDate` (logic to find the nearest future date).

### 2. Home Page Loader (`js/home-loader.js`)
- **Target**: `index.html`
- **Logic**:
  1.  **Language Detection**: Checks `localStorage` or `#lang-switch` *before* rendering to prevent language flash.
  2.  **Data Fetching**: Gets tours and departures via `apiService`.
  3.  **Injection**: Iterates through the *existing* 5 static tour cards in the DOM.
      - Replaces text, images, and prices with API data.
      - Maintains the specific layout differences between "Type A" (side image) and "Type B" cards.
      - Adds `data-i18n-es` and `data-i18n-en` attributes for i18n.
  4.  **Routing**: Updates card links to `Sections/TourPage.html?id=[tourId]`.

### 3. Tour Page Loader (`js/tour-loader.js`)
- **Target**: `Sections/TourPage.html`
- **Logic**:
  1.  **URL Parsing**: Extracts `tourId` from the query string.
  2.  **Data Fetching**: Retrieves specific tour details.
  3.  **Rendering**: Populates the Hero section (Title, Subtitle, Image).
  4.  **i18n**: Applies the same dynamic language logic as the home page.

## Routing Strategy
- **Mechanism**: Standard HTML links with query parameters.
- **Format**: `/Sections/TourPage.html?id=Au3wVFDw6Y2YlEtSlLoS`
- **Rationale**: Keeps the page reload necessary to reset and re-trigger Webflow's and GSAP's complex scroll-based animations, which are difficult to re-initialize in a pure SPA environment.

## Internationalization (i18n)
- **Static Content**: Handled by the existing inline script in `index.html`.
- **Dynamic Content**: Handled by `applyLanguageToDynamicElements` in the loader scripts.
- **Sync**: Both systems share the `localStorage['language']` key and the `#lang-switch` control.
