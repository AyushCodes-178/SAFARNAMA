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

## 🚀 Getting Started

### 1. Install & Run Dev Server
```bash
npm install
npm run dev
```

### 2. Run Production Build & Preview
```bash
npm run build
npm run preview -- --port 4173
```
Open [http://localhost:4173](http://localhost:4173) in your browser.

## 🌐 Deploy

SafarNama is a static Vite app. The project ZIP contains both the source files and a ready-to-upload production build in `dist/`.

### Deploy from GitHub with GitHub Pages

1. Create a GitHub repository and upload the project files (including `.github/workflows/deploy.yml`). Do not upload `node_modules/`.
2. Push the files to the `main` branch.
3. In the repository, open **Settings → Pages** and set the build source to **GitHub Actions**.
4. Open the **Actions** tab and wait for **Deploy to GitHub Pages** to finish. The published URL appears in the workflow run and under **Settings → Pages**.

The workflow installs the locked dependencies, builds the site, and publishes `dist/`. Vite automatically sets the GitHub repository path during the Actions build, so the project works under the usual `https://<user>.github.io/<repository>/` URL. For a custom domain, change `base` in `vite.config.js` to `/` and rebuild.

### Deploy with a Git-connected host

Import this project into Vercel, Netlify, or another Vite-compatible static host and use:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node.js:** 20.19+ or 22.12+ (required by the current Vite release)

No server environment variables are required. The optional Gemini key is entered in app settings and stays in that browser's local storage.

### Upload the built files manually

Run `npm ci` and `npm run build`, then upload the **contents** of `dist/` to your static host's public directory (often named `public`, `www`, or `htdocs`). You can also upload the included `dist/` contents as-is for the current build. Rebuild after changing the source code.

### Important data note

Trips, settings, tracker progress, and journal photos are stored in the visitor's browser (`localStorage` and `IndexedDB`). They are not synced between devices or accounts. Clearing browser data removes them.

---

## 📋 Acceptance Test Walkthrough

1. **Open Dashboard**: Shows active trip summary and curated Indian destinations.
2. **Plan a Trip**:
   - Starting city: Choose **Bengaluru**.
   - Dates: Select 3–4 days duration.
   - Budget: e.g. ₹15,000 / person.
   - Traveller type: Friends, Couples, or Students.
   - Interests: Nature, Adventure, Food.
3. **Discover**:
   - Filter and review top matches (Coorg, Ooty, Hampi, Wayanad, Munnar, Goa, Pondicherry).
   - Review match score reasons (e.g. *"Fast direct transit from Bengaluru (~5.5 hrs via Bus / Cab)"*).
4. **Generate Itinerary**:
   - Click **Select & Create Itinerary** on Coorg or Hampi.
5. **Edit Itinerary & Budget**:
   - Add a custom activity or delete a sight -> Watch the budget recalculate in real-time.
   - Switch pace from *Balanced* to *Relaxed* or *Packed*.
6. **Map & Directions**:
   - Switch to **Travel Map** to view verified coordinates and click **Directions** to open Google Maps route.
7. **Official Bookings**:
   - Click **Bookings** in the header to access IRCTC, redBus, and KSRTC links.
8. **Checklist & Photo Journal**:
   - Mark sights as visited (celebratory confetti triggers).
   - Upload photos with captions.
   - Refresh the browser -> All saved trips, checklist states, and photos are restored from `localStorage` & `IndexedDB`!
