# SafarNama — India-Focused Smart Trip Planner

**SafarNama** is a modern, responsive, full-stack travel planning application tailored specifically for exploring Incredible India. It calculates realistic day-wise itineraries, estimates accurate INR budgets, clusters attractions based on verified GPS coordinates, connects to official Indian booking portals, and lets users document their journeys in an offline-capable browser photo journal.

---

## 🌟 Key Features

1. **7 Core Views**:
   - **Dashboard**: Quick journey status, trip progress bar, featured Indian destination highlights, and quick action shortcuts.
   - **Plan a Trip**: Form collecting starting city (e.g. Bengaluru), dates, duration, budget per person in INR, traveller types, multi-select interests, and travel pace.
   - **Discover Destinations**: Recommends top Indian destinations with match scores and clear reasoning (transit connectivity, budget tier, duration, interest match) with rule-based fallback and optional Gemini AI insights.
   - **My Itinerary**: Interactive day-by-day sightseeing planner. Rearrange order (▲ / ▼), delete sights, add custom activities, switch pace (`relaxed`, `balanced`, `packed`), and mark attractions as completed.
   - **Budget & Analytics**: Recharts visualizations (Category Pie Chart, Daily Spending Bar Chart, Budget Utilization meter), over-budget alerts, itemized cost assumptions, and practical Indian money-saving recommendations.
   - **Travel Map**: OpenStreetMap Leaflet map with verified GPS coordinates, numbered pin sequence matching itinerary order, route polylines, and direct Google Maps navigation links.
   - **Travel Journal**: Attraction checklist with visited toggles, photo uploads with captions, thumbnail previews, lightbox view, and secure IndexedDB persistence.

2. **Verified Indian Booking Portals**:
   - IRCTC (Indian Railways)
   - redBus (Bus tickets across 3500+ operators)
   - MakeMyTrip (Flights, hotels & holiday packages)
   - Booking.com (Verified stays, heritage havelis & homestays)
   - State RTCs & Official Tourism Boards (KSRTC, Rajasthan Tourism, HRTC, Kerala Tourism, Goa GTDC, SETC)

3. **Browser Persistence**:
   - `localStorage` for trips, active itineraries, settings, and checklist states.
   - `IndexedDB` for photos and captions (handles high-resolution images without storage overflow).
   - Zero external secret leaks — optional Gemini API key is kept strictly local in the user's browser.

---

