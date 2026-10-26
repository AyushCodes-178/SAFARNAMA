import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DashboardView from './views/DashboardView';
import PlanTripView from './views/PlanTripView';
import DiscoverView from './views/DiscoverView';
import ItineraryView from './views/ItineraryView';
import BudgetView from './views/BudgetView';
import LiveJourneyView from './views/LiveJourneyView';
import JournalView from './views/JournalView';

import BookingLinksModal from './components/BookingLinksModal';
import SettingsModal from './components/SettingsModal';
import TripManagementModal from './components/TripManagementModal';

import { storageService } from './services/storageService';
import { indexedDbService } from './services/indexedDbService';
import { generateItinerary, calculateTripBudget } from './services/itineraryGenerator';
import { DESTINATIONS_DATA, REGIONAL_CIRCUITS } from './data/destinationsData';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');

  // Initialize or restore active multi-destination trip
  const [activeTrip, setActiveTrip] = useState(() => {
    const saved = storageService.getActiveTrip();
    if (saved && saved.itineraryDays && saved.stops) return saved;

    // Default to the requested Kerala multi-destination journey: Munnar -> Varkala -> Thiruvananthapuram
    const munnar = DESTINATIONS_DATA.find((d) => d.id === 'munnar');
    const varkala = DESTINATIONS_DATA.find((d) => d.id === 'varkala');
    const tvm = DESTINATIONS_DATA.find((d) => d.id === 'trivandrum');

    const defaultStops = [
      { destination: munnar, daysCount: 2 },
      { destination: varkala, daysCount: 2 },
      { destination: tvm, daysCount: 1 }
    ].filter((s) => s.destination);

    const initialDays = generateItinerary({
      stops: defaultStops,
      startDate: '2026-10-26',
      durationDays: 5,
      pace: 'balanced',
      userInterests: ['nature', 'beaches', 'culture', 'heritage']
    });

    const initialBudget = calculateTripBudget({
      stops: defaultStops,
      itineraryDays: initialDays,
      travellers: 2,
      budgetPerPerson: 16000,
      startingCity: 'Bengaluru',
      durationDays: 5,
      pace: 'balanced'
    });

    const sampleTrip = {
      id: `trip-kerala-circuit-${Date.now()}`,
      title: "God's Own Kerala Circuit: Munnar ➔ Varkala ➔ Thiruvananthapuram",
      destination: munnar,
      stops: defaultStops,
      startingCity: 'Bengaluru',
      startDate: '2026-10-26',
      durationDays: 5,
      travellers: 2,
      budgetPerPerson: 16000,
      pace: 'balanced',
      interests: ['nature', 'beaches', 'culture', 'heritage'],
      itineraryDays: initialDays,
      budget: initialBudget,
      createdAt: new Date().toISOString()
    };

    storageService.saveActiveTrip(sampleTrip);
    return sampleTrip;
  });

  const [journalPhotos, setJournalPhotos] = useState([]);
  const [savedTrips, setSavedTrips] = useState(() => storageService.getSavedTrips());
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isTripManagerOpen, setIsTripManagerOpen] = useState(false);

  const loadPhotos = useCallback(async () => {
    try {
      const photos = await indexedDbService.getAllPhotos();
      setJournalPhotos(photos);
    } catch (err) {
      console.warn('Could not load photos from IndexedDB', err);
    }
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  useEffect(() => {
    if (!activeTrip) return;
    storageService.saveActiveTrip(activeTrip);
    storageService.saveTripToHistory(activeTrip);
    setSavedTrips(storageService.getSavedTrips());
  }, [activeTrip]);

  const persistManagedTrip = (trip) => {
    storageService.saveTripToHistory(trip);
    setSavedTrips(storageService.getSavedTrips());
    if (activeTrip?.id === trip.id) {
      setActiveTrip(trip);
      storageService.saveActiveTrip(trip);
    }
  };

  const handleActivateTrip = (trip) => {
    const openedTrip = trip.archived ? { ...trip, archived: false } : trip;
    if (openedTrip !== trip) persistManagedTrip(openedTrip);
    setActiveTrip(openedTrip);
    storageService.saveActiveTrip(openedTrip);
    setActiveView('itinerary');
  };

  const handleDuplicateTrip = (trip) => {
    const duplicate = structuredClone(trip);
    duplicate.id = `trip-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    duplicate.title = `${trip.title || 'My trip'} (Copy)`;
    duplicate.archived = false;
    duplicate.createdAt = new Date().toISOString();
    delete duplicate.updatedAt;
    storageService.saveTripToHistory(duplicate);
    storageService.saveActiveTrip(duplicate);
    setSavedTrips(storageService.getSavedTrips());
    setActiveTrip(duplicate);
    setActiveView('itinerary');
  };

  const handleArchiveTrip = (trip) => {
    const updated = { ...trip, archived: !trip.archived };
    storageService.saveTripToHistory(updated);
    const nextTrips = storageService.getSavedTrips();
    setSavedTrips(nextTrips);
    if (activeTrip?.id === trip.id) {
      if (updated.archived) {
        const nextTrip = nextTrips.find((item) => item.id !== trip.id && !item.archived) || null;
        setActiveTrip(nextTrip);
        if (nextTrip) storageService.saveActiveTrip(nextTrip);
        else storageService.clearActiveTrip();
      } else {
        setActiveTrip(updated);
        storageService.saveActiveTrip(updated);
      }
    }
  };

  const handleDeleteTrip = async (trip) => {
    storageService.deleteSavedTrip(trip.id);
    try {
      await indexedDbService.clearTripPhotos(trip.id);
      await loadPhotos();
    } catch (err) {
      console.warn('Could not clear trip photos from IndexedDB', err);
    }
    try { localStorage.removeItem(`tracker-${trip.id}`); } catch { /* Storage is optional */ }
    const nextTrips = storageService.getSavedTrips();
    setSavedTrips(nextTrips);
    if (activeTrip?.id === trip.id) {
      const nextTrip = nextTrips.find((item) => !item.archived) || null;
      setActiveTrip(nextTrip);
      if (nextTrip) storageService.saveActiveTrip(nextTrip);
      else storageService.clearActiveTrip();
    }
  };

  const handleUpdateManagedTrip = (trip) => {
    const startDate = trip.startDate || new Date().toISOString().slice(0, 10);
    const itineraryDays = (trip.itineraryDays || []).map((day) => {
      const date = new Date(`${startDate}T00:00:00`);
      date.setDate(date.getDate() + day.dayNumber - 1);
      return { ...day, dateString: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) };
    });
    const updated = { ...trip, startDate, itineraryDays };
    updated.budget = calculateTripBudget({
      stops: updated.stops,
      itineraryDays,
      travellers: updated.travellers,
      budgetPerPerson: updated.budgetPerPerson,
      startingCity: updated.startingCity,
      durationDays: updated.durationDays,
      pace: updated.pace
    });
    persistManagedTrip(updated);
  };

  // Create a brand new multi-stop trip
  const handleCreateMultiStopTrip = ({
    title,
    startingCity,
    stops,
    startDate,
    durationDays,
    travellers = 2,
    budgetPerPerson = 15000,
    pace = 'balanced'
  }) => {
    const days = generateItinerary({
      stops,
      startDate: startDate || '2026-10-26',
      durationDays,
      pace,
      userInterests: ['nature', 'beaches', 'culture', 'heritage', 'food']
    });

    const budget = calculateTripBudget({
      stops,
      itineraryDays: days,
      travellers,
      budgetPerPerson,
      startingCity,
      durationDays,
      pace
    });

    const newTrip = {
      id: `trip-${Date.now()}`,
      title: title || stops.map((s) => s.destination?.name).join(' ➔ '),
      destination: stops[0]?.destination,
      stops,
      startingCity: startingCity || 'Bengaluru',
      startDate: startDate || '2026-10-26',
      durationDays,
      travellers,
      budgetPerPerson,
      pace,
      interests: ['nature', 'beaches', 'culture', 'heritage', 'food'],
      itineraryDays: days,
      budget,
      createdAt: new Date().toISOString()
    };

    setActiveTrip(newTrip);
    storageService.saveActiveTrip(newTrip);
    storageService.saveTripToHistory(newTrip);
    setActiveView('itinerary');
  };

  // Launch a curated regional circuit
  const handleLaunchCircuit = (circuit) => {
    const stops = circuit.stops.map((s) => ({
      destination: DESTINATIONS_DATA.find((d) => d.id === s.destinationId),
      daysCount: s.daysCount
    })).filter((s) => s.destination);

    handleCreateMultiStopTrip({
      title: circuit.name,
      startingCity: activeTrip?.startingCity || 'Bengaluru',
      stops,
      startDate: activeTrip?.startDate || '2026-10-26',
      durationDays: circuit.totalDays,
      travellers: activeTrip?.travellers || 2,
      budgetPerPerson: circuit.avgBudget || 15000,
      pace: activeTrip?.pace || 'balanced'
    });
  };

  // Add a stop to the current active trip dynamically
  const handleAddStopToActiveTrip = (destination, daysCount = 2) => {
    if (!activeTrip) return;
    const currentStops = [...(activeTrip.stops || [])];
    currentStops.push({ destination, daysCount });

    const totalDays = currentStops.reduce((sum, s) => sum + (Number(s.daysCount) || 1), 0);

    const updatedDays = generateItinerary({
      stops: currentStops,
      startDate: activeTrip.startDate,
      durationDays: totalDays,
      pace: activeTrip.pace,
      userInterests: activeTrip.interests || []
    });

    const updatedBudget = calculateTripBudget({
      stops: currentStops,
      itineraryDays: updatedDays,
      travellers: activeTrip.travellers,
      budgetPerPerson: activeTrip.budgetPerPerson,
      startingCity: activeTrip.startingCity,
      durationDays: totalDays,
      pace: activeTrip.pace
    });

    const updatedTrip = {
      ...activeTrip,
      title: currentStops.map((s) => s.destination?.name).join(' ➔ '),
      stops: currentStops,
      durationDays: totalDays,
      itineraryDays: updatedDays,
      budget: updatedBudget
    };

    setActiveTrip(updatedTrip);
    storageService.saveActiveTrip(updatedTrip);
    setActiveView('itinerary');
  };

  // Remove a stop from the active trip
  const handleRemoveStop = (stopIndex) => {
    if (!activeTrip || !activeTrip.stops || activeTrip.stops.length <= 1) return;
    const currentStops = activeTrip.stops.filter((_, idx) => idx !== stopIndex);
    const totalDays = currentStops.reduce((sum, s) => sum + (Number(s.daysCount) || 1), 0);

    const updatedDays = generateItinerary({
      stops: currentStops,
      startDate: activeTrip.startDate,
      durationDays: totalDays,
      pace: activeTrip.pace,
      userInterests: activeTrip.interests || []
    });

    const updatedBudget = calculateTripBudget({
      stops: currentStops,
      itineraryDays: updatedDays,
      travellers: activeTrip.travellers,
      budgetPerPerson: activeTrip.budgetPerPerson,
      startingCity: activeTrip.startingCity,
      durationDays: totalDays,
      pace: activeTrip.pace
    });

    const updatedTrip = {
      ...activeTrip,
      title: currentStops.map((s) => s.destination?.name).join(' ➔ '),
      stops: currentStops,
      durationDays: totalDays,
      itineraryDays: updatedDays,
      budget: updatedBudget
    };

    setActiveTrip(updatedTrip);
    storageService.saveActiveTrip(updatedTrip);
  };

  // Reorder stops
  const handleMoveStop = (stopIndex, direction) => {
    if (!activeTrip || !activeTrip.stops) return;
    const currentStops = [...activeTrip.stops];
    const targetIdx = direction === 'left' ? stopIndex - 1 : stopIndex + 1;
    if (targetIdx < 0 || targetIdx >= currentStops.length) return;

    const temp = currentStops[stopIndex];
    currentStops[stopIndex] = currentStops[targetIdx];
    currentStops[targetIdx] = temp;

    const totalDays = currentStops.reduce((sum, s) => sum + (Number(s.daysCount) || 1), 0);

    const updatedDays = generateItinerary({
      stops: currentStops,
      startDate: activeTrip.startDate,
      durationDays: totalDays,
      pace: activeTrip.pace,
      userInterests: activeTrip.interests || []
    });

    const updatedBudget = calculateTripBudget({
      stops: currentStops,
      itineraryDays: updatedDays,
      travellers: activeTrip.travellers,
      budgetPerPerson: activeTrip.budgetPerPerson,
      startingCity: activeTrip.startingCity,
      durationDays: totalDays,
      pace: activeTrip.pace
    });

    const updatedTrip = {
      ...activeTrip,
      title: currentStops.map((s) => s.destination?.name).join(' ➔ '),
      stops: currentStops,
      durationDays: totalDays,
      itineraryDays: updatedDays,
      budget: updatedBudget
    };

    setActiveTrip(updatedTrip);
    storageService.saveActiveTrip(updatedTrip);
  };

  // Adjust days in a stop
  const handleUpdateStopDays = (stopIndex, newDays) => {
    if (!activeTrip || !activeTrip.stops) return;
    const currentStops = [...activeTrip.stops];
    currentStops[stopIndex].daysCount = Math.max(1, Math.min(7, newDays));

    const totalDays = currentStops.reduce((sum, s) => sum + (Number(s.daysCount) || 1), 0);

    const updatedDays = generateItinerary({
      stops: currentStops,
      startDate: activeTrip.startDate,
      durationDays: totalDays,
      pace: activeTrip.pace,
      userInterests: activeTrip.interests || []
    });

    const updatedBudget = calculateTripBudget({
      stops: currentStops,
      itineraryDays: updatedDays,
      travellers: activeTrip.travellers,
      budgetPerPerson: activeTrip.budgetPerPerson,
      startingCity: activeTrip.startingCity,
      durationDays: totalDays,
      pace: activeTrip.pace
    });

    const updatedTrip = {
      ...activeTrip,
      durationDays: totalDays,
      stops: currentStops,
      itineraryDays: updatedDays,
      budget: updatedBudget
    };

    setActiveTrip(updatedTrip);
    storageService.saveActiveTrip(updatedTrip);
  };

  const handleUpdateRouteStop = (stopIndex, destination) => {
    if (!activeTrip?.stops?.[stopIndex] || !destination) return;
    const currentStops = activeTrip.stops.map((stop, index) => index === stopIndex
      ? { ...stop, destination }
      : stop);
    const updatedDays = generateItinerary({
      stops: currentStops,
      startDate: activeTrip.startDate,
      durationDays: activeTrip.durationDays,
      pace: activeTrip.pace,
      userInterests: activeTrip.interests || []
    });
    const updatedBudget = calculateTripBudget({
      stops: currentStops,
      itineraryDays: updatedDays,
      travellers: activeTrip.travellers,
      budgetPerPerson: activeTrip.budgetPerPerson,
      startingCity: activeTrip.startingCity,
      durationDays: activeTrip.durationDays,
      pace: activeTrip.pace
    });
    const updatedTrip = {
      ...activeTrip,
      title: currentStops.map((stop) => stop.destination?.name).join(' ➔ '),
      destination: currentStops[0]?.destination,
      stops: currentStops,
      itineraryDays: updatedDays,
      budget: updatedBudget
    };
    setActiveTrip(updatedTrip);
    storageService.saveActiveTrip(updatedTrip);
  };

  const handleUpdateStartingCity = (startingCity) => {
    if (!activeTrip || !startingCity) return;
    const budget = calculateTripBudget({
      stops: activeTrip.stops,
      itineraryDays: activeTrip.itineraryDays,
      travellers: activeTrip.travellers,
      budgetPerPerson: activeTrip.budgetPerPerson,
      startingCity,
      durationDays: activeTrip.durationDays,
      pace: activeTrip.pace
    });
    const updatedTrip = { ...activeTrip, startingCity, budget };
    setActiveTrip(updatedTrip);
    storageService.saveActiveTrip(updatedTrip);
  };

  // Update itinerary activities (toggle complete, add, remove, move activity)
  const handleUpdateItinerary = (updatedDays) => {
    if (!activeTrip) return;

    const updatedBudget = calculateTripBudget({
      stops: activeTrip.stops,
      itineraryDays: updatedDays,
      travellers: activeTrip.travellers,
      budgetPerPerson: activeTrip.budgetPerPerson,
      startingCity: activeTrip.startingCity,
      durationDays: activeTrip.durationDays,
      pace: activeTrip.pace
    });

    const updatedTrip = {
      ...activeTrip,
      itineraryDays: updatedDays,
      budget: updatedBudget
    };

    setActiveTrip(updatedTrip);
    storageService.saveActiveTrip(updatedTrip);
  };

  // Change Travel Pace
  const handleChangePace = (newPace) => {
    if (!activeTrip) return;

    const regeneratedDays = generateItinerary({
      stops: activeTrip.stops,
      startDate: activeTrip.startDate,
      durationDays: activeTrip.durationDays,
      pace: newPace,
      userInterests: activeTrip.interests || []
    });

    const updatedBudget = calculateTripBudget({
      stops: activeTrip.stops,
      itineraryDays: regeneratedDays,
      travellers: activeTrip.travellers,
      budgetPerPerson: activeTrip.budgetPerPerson,
      startingCity: activeTrip.startingCity,
      durationDays: activeTrip.durationDays,
      pace: newPace
    });

    const updatedTrip = {
      ...activeTrip,
      pace: newPace,
      itineraryDays: regeneratedDays,
      budget: updatedBudget
    };

    setActiveTrip(updatedTrip);
    storageService.saveActiveTrip(updatedTrip);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        activeTrip={activeTrip}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenBookings={() => setIsBookingsModalOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeView === 'dashboard' && (
          <DashboardView
            activeTrip={activeTrip}
            setActiveView={setActiveView}
            onLaunchCircuit={handleLaunchCircuit}
            tripCount={savedTrips.length}
            onManageTrips={() => setIsTripManagerOpen(true)}
            onSelectDestinationForPlan={(dest) => {
              handleAddStopToActiveTrip(dest, 2);
            }}
          />
        )}

        {activeView === 'plan' && (
          <PlanTripView
            initialCriteria={{
              startingCity: activeTrip?.startingCity || 'Bengaluru',
              startDate: activeTrip?.startDate || '2026-10-26',
              travellers: activeTrip?.travellers || 2,
              budgetPerPerson: activeTrip?.budgetPerPerson || 15000,
              pace: activeTrip?.pace || 'balanced'
            }}
            onCreateMultiStopTrip={handleCreateMultiStopTrip}
          />
        )}

        {activeView === 'discover' && (
          <DiscoverView
            onSelectDestination={(dest) => {
              handleCreateMultiStopTrip({
                title: `Trip to ${dest.name}`,
                startingCity: activeTrip?.startingCity || 'Bengaluru',
                stops: [{ destination: dest, daysCount: dest.minDays || 2 }],
                startDate: activeTrip?.startDate || '2026-10-26',
                durationDays: dest.minDays || 2,
                travellers: activeTrip?.travellers || 2,
                budgetPerPerson: activeTrip?.budgetPerPerson || 15000,
                pace: 'balanced'
              });
            }}
            onLaunchCircuit={handleLaunchCircuit}
            onAddStopToActiveTrip={handleAddStopToActiveTrip}
          />
        )}

        {activeView === 'itinerary' && (
          <ItineraryView
            activeTrip={activeTrip}
            onUpdateItinerary={handleUpdateItinerary}
            onChangePace={handleChangePace}
            onAddStop={handleAddStopToActiveTrip}
            onRemoveStop={handleRemoveStop}
            onMoveStop={handleMoveStop}
            onUpdateStopDays={handleUpdateStopDays}
            onPhotoSaved={loadPhotos}
          />
        )}

        {activeView === 'budget' && (
          <BudgetView
            activeTrip={activeTrip}
            onOpenBookings={() => setIsBookingsModalOpen(true)}
          />
        )}

    {activeView === 'map' && (
      <LiveJourneyView
        activeTrip={activeTrip}
        onAddStop={(destination, daysCount) => {
          handleAddStopToActiveTrip(destination, daysCount);
          setActiveView('map');
        }}
        onRemoveStop={handleRemoveStop}
        onMoveStop={handleMoveStop}
        onUpdateStop={handleUpdateRouteStop}
        onUpdateStartingCity={handleUpdateStartingCity}
      />
    )}

        {activeView === 'journal' && (
          <JournalView
            activeTrip={activeTrip}
            onUpdateItinerary={handleUpdateItinerary}
            photos={journalPhotos}
            onPhotosUpdated={loadPhotos}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Booking Portals Modal */}
      <BookingLinksModal
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
        destinationName={activeTrip?.title || activeTrip?.destination?.name}
      />

      {/* Settings & Optional API Key Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <TripManagementModal
        isOpen={isTripManagerOpen}
        trips={savedTrips}
        activeTripId={activeTrip?.id}
        onClose={() => setIsTripManagerOpen(false)}
        onNewTrip={() => setActiveView('plan')}
        onActivateTrip={handleActivateTrip}
        onDuplicateTrip={handleDuplicateTrip}
        onArchiveTrip={handleArchiveTrip}
        onUpdateTrip={handleUpdateManagedTrip}
        onDeleteTrip={handleDeleteTrip}
      />
    </div>
  );
}
