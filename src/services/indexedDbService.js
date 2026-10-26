// IndexedDB Service for storing photos and journal media reliably across browser refreshes
const DB_NAME = 'SafarnamaTravelDB';
const DB_VERSION = 1;
const STORE_NAME = 'travel_photos';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('tripId', 'tripId', { unique: false });
        store.createIndex('attractionId', 'attractionId', { unique: false });
        store.createIndex('dayNumber', 'dayNumber', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', event.target.error);
      reject(event.target.error);
    };
  });
}

export const indexedDbService = {
  // Save photo entry
  async savePhoto(photoEntry) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(photoEntry);

      request.onsuccess = () => resolve(photoEntry);
      request.onerror = (e) => reject(e.target.error);
    });
  },

  // Get all photos for a trip
  async getPhotosByTrip(tripId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('tripId');
      const request = index.getAll(tripId);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
  },

  // Get all photos in store
  async getAllPhotos() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
  },

  // Delete single photo
  async deletePhoto(photoId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(photoId);

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  },

  // Clear photos for a trip
  async clearTripPhotos(tripId) {
    const db = await openDB();
    const photos = await this.getPhotosByTrip(tripId);
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      let count = 0;
      if (photos.length === 0) return resolve(0);
      photos.forEach((p) => {
        store.delete(p.id);
        count++;
      });
      tx.oncomplete = () => resolve(count);
      tx.onerror = (e) => reject(e.target.error);
    });
  }
};
