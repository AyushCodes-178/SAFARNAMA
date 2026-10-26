// LocalStorage Manager for Safarnama
const STORAGE_KEYS = {
  ACTIVE_TRIP: 'safarnama_active_trip',
  SAVED_TRIPS: 'safarnama_saved_trips',
  SETTINGS: 'safarnama_settings'
};

export const storageService = {
  // Active Trip
  getActiveTrip() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_TRIP);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to get active trip from localStorage', e);
      return null;
    }
  },

  saveActiveTrip(trip) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TRIP, JSON.stringify(trip));
    } catch (e) {
      console.error('Failed to save active trip to localStorage', e);
    }
  },

  clearActiveTrip() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TRIP);
    } catch (e) {
      console.error('Failed to clear active trip', e);
    }
  },

  // Saved Trips History
  getSavedTrips() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_TRIPS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get saved trips', e);
      return [];
    }
  },

  saveTripToHistory(trip) {
    try {
      const trips = this.getSavedTrips();
      const existingIdx = trips.findIndex((t) => t.id === trip.id);
      if (existingIdx >= 0) {
        trips[existingIdx] = trip;
      } else {
        trips.unshift(trip);
      }
      localStorage.setItem(STORAGE_KEYS.SAVED_TRIPS, JSON.stringify(trips));
    } catch (e) {
      console.error('Failed to add trip to history', e);
    }
  },

  deleteSavedTrip(tripId) {
    try {
      const trips = this.getSavedTrips().filter((t) => t.id !== tripId);
      localStorage.setItem(STORAGE_KEYS.SAVED_TRIPS, JSON.stringify(trips));
    } catch (e) {
      console.error('Failed to delete saved trip', e);
    }
  },

  // Settings & API Configuration
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {
        geminiApiKey: '',
        aiProvider: 'gemini',
        model: 'gemini-1.5-flash',
        currencySymbol: '₹',
        theme: 'light'
      };
    } catch {
      return {
        geminiApiKey: '',
        aiProvider: 'gemini',
        model: 'gemini-1.5-flash',
        currencySymbol: '₹',
        theme: 'light'
      };
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }
};
