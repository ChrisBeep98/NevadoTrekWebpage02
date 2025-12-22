/**
 * Nevado Trek API Client (Optimized)
 */

window.nevadoAPI = {
  // Use the new optimized endpoint URL
  baseURL: 'https://api-wgfhwjbpva-uc.a.run.app',
  
  // Cache for 5 minutes
  cache: {
    tours: null,
    departures: null,
    timestamp: 0
  },
  
  async fetchTours() {
    const now = Date.now();
    if (this.cache.tours && (now - this.cache.timestamp) < 300000) {
      return this.cache.tours;
    }
    
    // NEW: Use the optimized /listing endpoint
    const response = await fetch(`${this.baseURL}/public/tours/listing`);
    if (!response.ok) throw new Error(`Failed to fetch tours listing: ${response.statusText}`);
    
    this.cache.tours = await response.json();
    this.cache.timestamp = now;
    return this.cache.tours;
  },
  
  async fetchDepartures() {
    const now = Date.now();
    if (this.cache.departures && (now - this.cache.timestamp) < 300000) {
      return this.cache.departures;
    }
    
    // We still need the departures to map dates
    const response = await fetch(`${this.baseURL}/public/departures`);
    if (!response.ok) throw new Error(`Failed to fetch departures: ${response.statusText}`);
    
    this.cache.departures = await response.json();
    return this.cache.departures;
  },
  
  formatDate(firestoreTimestamp) {
    if (!firestoreTimestamp || !firestoreTimestamp._seconds) return null;
    const date = new Date(firestoreTimestamp._seconds * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  },
  
  mapTotalDaysToDuration(totalDays) {
    if (totalDays === 1) return "1";
    if (totalDays <= 3) return "2-3";
    if (totalDays <= 5) return "4-5";
    return "6+";
  },

  /**
   * Optimize Cloudinary image URLs
   */
  optimizeImage(url) {
    if (!url || !url.includes('cloudinary.com')) return url;
    
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;
    
    const pathAfterUpload = parts[1];
    const versionMatch = pathAfterUpload.match(/v\d+\//);
    if (!versionMatch) return url;
    
    const pathAfterVersion = pathAfterUpload.substring(pathAfterUpload.indexOf(versionMatch[0]));
    
    // Optimized: 600px width, auto format, good quality
    const optimized = 'w_600,h_450,c_fill,f_auto,q_auto:good,dpr_auto';
    
    return `${parts[0]}/upload/${optimized}/${pathAfterVersion}`;
  }
};
