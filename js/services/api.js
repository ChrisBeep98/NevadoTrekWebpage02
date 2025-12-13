/**
 * Service to interact with the Nevado Trek Public API
 * Base URL: https://us-central1-nevadotrektest01.cloudfunctions.net/api
 */

const API_BASE_URL = 'https://us-central1-nevadotrektest01.cloudfunctions.net/api';
const CACHE_KEY_TOURS = 'nevado_tours_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const apiService = {
  /**
   * Fetch all active tours
   * Uses localStorage caching for performance
   */
  async getTours() {
    try {
      // Check cache
      const cached = localStorage.getItem(CACHE_KEY_TOURS);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {

          return data;
        }
      }

      // Fetch fresh data
      const response = await fetch(`${API_BASE_URL}/public/tours`);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const tours = await response.json();
      
      // Update cache
      localStorage.setItem(CACHE_KEY_TOURS, JSON.stringify({
        data: tours,
        timestamp: Date.now()
      }));

      return tours;
    } catch (error) {
      console.error('Failed to fetch tours:', error);
      return [];
    }
  },

  /**
   * Fetch upcoming departures
   * @param {boolean} forceRefresh - If true, bypasses CDN cache by adding timestamp
   */
  async getDepartures(forceRefresh = false) {
    try {
      let url = `${API_BASE_URL}/public/departures`;
      
      // Bypass cache if force refresh requested (after booking)
      if (forceRefresh) {
        url += `?t=${Date.now()}`;

      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch departures:', error);
      return [];
    }
  },

  /**
   * Helper to format price in COP
   */
  formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  },

  /**
   * Helper to format price in USD
   */
  formatPriceUSD(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  },

  /**
   * Helper to get the next available date from a list of departures for a specific tour
   */
  getNextDepartureDate(tourId, departures) {
    if (!departures || departures.length === 0) return null;
    
    // Filter departures for this tour, future dates, and open status
    const tourDepartures = departures.filter(d => 
      d.tourId === tourId && 
      d.status === 'open' &&
      new Date(d.date._seconds * 1000) >= new Date()
    );

    if (tourDepartures.length === 0) return null;

    // Sort by date ascending
    tourDepartures.sort((a, b) => a.date._seconds - b.date._seconds);

    // Return the first one
    return new Date(tourDepartures[0].date._seconds * 1000);
  }
};
