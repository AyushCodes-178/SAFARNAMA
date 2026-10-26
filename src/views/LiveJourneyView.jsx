import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Bus, Car, Check, Circle, Clock3, ExternalLink, Hotel, MapPin, Navigation, Plane, Plus, Search, Train, Trash2 } from 'lucide-react';
import TravelMapLeaflet from '../components/TravelMapLeaflet';
import { DESTINATIONS_DATA, INDIAN_STARTING_CITIES } from '../data/destinationsData';

const CITY_COORDINATES = {
  Bengaluru: { lat: 12.9716, lng: 77.5946 }, Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.6139, lng: 77.209 }, Hyderabad: { lat: 17.385, lng: 78.4867 },
  Chennai: { lat: 13.0827, lng: 80.2707 }, Kolkata: { lat: 22.5726, lng: 88.3639 },
  Pune: { lat: 18.5204, lng: 73.8567 }, Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Kochi: { lat: 9.9312, lng: 76.2673 }, Jaipur: { lat: 26.9124, lng: 75.7873 },
  Chandigarh: { lat: 30.7333, lng: 76.7794 }, Goa: { lat: 15.2993, lng: 74.124 }, Lucknow: { lat: 26.8467, lng: 80.9462 }
};
const MODES = [
  { id: 'bus', label: 'Bus', Icon: Bus, speed: 40 },
  { id: 'train', label: 'Train', Icon: Train, speed: 55 },
  { id: 'taxi', label: 'Taxi', Icon: Car, speed: 45 },
  { id: 'flight', label: 'Flight', Icon: Plane, speed: 500 }
];
const STAY_TYPES = ['Villa stay', 'Hostel stay', 'Hotel stay', 'Transit/stopover only'];

const distanceKm = (a, b) => {
  if (!a || !b) return 100;
  const rad = (n) => n * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value)));
};
const formatTime = (date) => new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(date);
const formatDate = (date) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(date);
const inputDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const inputTime = (date) => `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
const savedObject = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
};

export default function LiveJourneyView({ activeTrip, onAddStop, onRemoveStop, onMoveStop, onUpdateStop, onUpdateStartingCity }) {
  const stops = activeTrip?.stops || [];
  const [trackerData, setTrackerData] = useState(() => savedObject(`tracker-${activeTrip?.id}`));
  const [mapSearch, setMapSearch] = useState('');
  const [pinDraft, setPinDraft] = useState(null);
  const completed = trackerData.completed || [];
  const stayTypes = trackerData.stayTypes || {};
  const travelModes = trackerData.travelModes || {};
  const schedules = trackerData.schedules || {};
  const stayDetails = trackerData.stayDetails || {};

  useEffect(() => {
    const saved = savedObject(`tracker-${activeTrip?.id}`);
    setTrackerData(saved);
    setPinDraft(null);
    setMapSearch('');
  }, [activeTrip?.id]);

  const origin = activeTrip?.startingCity || 'Starting point';
  const route = useMemo(() => {
    let cursor = new Date(`${activeTrip?.startDate || new Date().toISOString().slice(0, 10)}T08:30:00`);
    const points = [{ name: origin, coordinates: CITY_COORDINATES[origin], isOrigin: true, arrival: new Date(cursor) }];
    let previous = points[0];
    stops.forEach((stop, index) => {
      const destination = stop.destination;
      if (!destination) return;
      const mode = travelModes[index] || 'bus';
      const speed = MODES.find((item) => item.id === mode)?.speed || 40;
      const km = distanceKm(previous.coordinates || destination.coordinates, destination.coordinates);
      const durationHours = Math.max(0.5, km / speed * (mode === 'flight' ? 1.5 : 1.25));
      const savedSchedule = schedules[destination.id] || {};
      const date = savedSchedule.date || inputDate(cursor);
      const time = savedSchedule.time || inputTime(cursor);
      const departure = new Date(`${date}T${time}:00`);
      if (Number.isNaN(departure.getTime())) departure.setTime(cursor.getTime());
      cursor = new Date(cursor.getTime() + durationHours * 3600000);
      points.push({
        name: destination.name, destination, daysCount: Number(stop.daysCount) || 1, index,
        mode, km, durationHours, departure, arrival: new Date(cursor),
        stayType: stayTypes[destination.id] || (destination.isCustom ? 'Transit/stopover only' : 'Hotel stay'),
        stayDetail: stayDetails[destination.id] || ''
      });
      if ((stayTypes[destination.id] || 'Hotel stay') !== 'Transit/stopover only') {
        cursor = new Date(cursor.getTime() + (Number(stop.daysCount) || 1) * 24 * 3600000);
      }
      previous = { coordinates: destination.coordinates };
    });
    return points;
  }, [activeTrip?.startDate, origin, stops, stayTypes, stayDetails, schedules, travelModes]);

  const persist = (next) => {
    const state = { ...trackerData, ...next };
    setTrackerData(state);
    try { localStorage.setItem(`tracker-${activeTrip?.id}`, JSON.stringify(state)); } catch { /* progress is best-effort */ }
  };
  const toggleComplete = (name) => {
    const next = completed.includes(name) ? completed.filter((item) => item !== name) : [...completed, name];
    persist({ completed: next });
  };
  const changeStay = (destinationId, value) => {
    const next = { ...stayTypes, [destinationId]: value };
    persist({ stayTypes: next });
  };
  const changeMode = (index, value) => {
    const next = { ...travelModes, [index]: value };
    persist({ travelModes: next });
  };

  const changeSchedule = (destinationId, key, value) => {
    const next = { ...schedules, [destinationId]: { ...schedules[destinationId], [key]: value } };
    persist({ schedules: next });
  };
  const changeStayDetail = (destinationId, value) => persist({ stayDetails: { ...stayDetails, [destinationId]: value } });
  const routePins = useMemo(() => [
    { id: 'route-origin', name: origin, destinationName: 'Starting point', description: 'Journey origin', coordinates: CITY_COORDINATES[origin], category: 'completed', cost: 0 },
    ...stops.map((stop, index) => ({
      id: `route-${stop.destination.id}`, name: stop.destination.name, destinationName: stop.destination.state || 'Custom stop',
      description: `Stop ${index + 1} · ${stop.daysCount} day${stop.daysCount > 1 ? 's' : ''}`, coordinates: stop.destination.coordinates,
      category: completed.includes(stop.destination.name) ? 'completed' : 'nature', cost: 0, stopIndex: index
    }))
  ].filter((pin) => pin.coordinates?.lat && pin.coordinates?.lng), [completed, origin, stops]);
  const foundDestinations = mapSearch.trim()
    ? DESTINATIONS_DATA.filter((destination) => `${destination.name} ${destination.state}`.toLowerCase().includes(mapSearch.trim().toLowerCase())
      && !stops.some((stop) => stop.destination.id === destination.id)).slice(0, 6)
    : [];
  const addCustomPlace = () => {
    if (!pinDraft?.name?.trim() || !pinDraft.coordinates || !onAddStop) return;
    const name = pinDraft.name.trim();
    const id = `custom-${Date.now()}`;
    const destination = {
      id, name, state: 'Custom place', isCustom: true, coordinates: pinDraft.coordinates,
      avgDailyBudget: 0, baseCosts: { stay: 1400, food: 600, transit: 200, misc: 100 },
      attractions: [{
        id: `${id}-activity`, name: `Explore ${name}`, description: 'Custom place added to your journey.',
        category: 'nature', cost: 0, durationMinutes: 60, preferredTime: 'morning', coordinates: pinDraft.coordinates,
        tips: 'Add your own notes in the itinerary.'
      }]
    };
    onAddStop(destination, 1);
    setPinDraft(null);
  };
  const savePinEdit = () => {
    if (!pinDraft?.name?.trim() || pinDraft.stopIndex === undefined || !onUpdateStop) return;
    const current = stops[pinDraft.stopIndex]?.destination;
    if (!current) return;
    const destination = {
      ...current,
      name: pinDraft.name.trim(),
      coordinates: pinDraft.coordinates,
      attractions: current.isCustom
        ? current.attractions.map((activity) => ({ ...activity, name: `Explore ${pinDraft.name.trim()}`, coordinates: pinDraft.coordinates }))
        : current.attractions
    };
    onUpdateStop(pinDraft.stopIndex, destination);
    setPinDraft(null);
  };
  const mapCenter = routePins.find((pin) => pin.id === 'route-origin')?.coordinates || routePins[1]?.coordinates || { lat: 20.5937, lng: 78.9629 };

  if (!stops.length) return <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600">Create a trip to start tracking your journey.</div>;

  const percent = Math.round(completed.length / Math.max(stops.length, 1) * 100);
  const openStays = (platform, city) => platform === 'Airbnb'
    ? `https://www.airbnb.com/s/${encodeURIComponent(city)}/homes`
    : `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}`;

  return <div className="mx-auto max-w-6xl space-y-6 animate-in fade-in duration-200">
    <header className="flex flex-col justify-between gap-4 rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6 sm:flex-row sm:items-center sm:p-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700"><Navigation className="h-4 w-4" />Travel map</div>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{activeTrip.title || 'Your journey'}</h2>
        <p className="mt-1 text-sm text-slate-600">Your route at a glance</p>
      </div>
      <div className="min-w-44 rounded-2xl border border-white bg-white/90 p-4 shadow-sm">
        <div className="flex justify-between text-xs font-semibold text-slate-600"><span>Journey progress</span><span className="text-emerald-700">{percent}%</span></div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${percent}%` }} /></div>
        <p className="mt-2 text-[11px] text-slate-500">{completed.length} of {stops.length} destinations complete</p>
      </div>
    </header>

    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">
        <div><h3 className="font-bold text-slate-900">Interactive location map</h3><p className="text-xs text-slate-500">Search a destination or click the map to add a custom stop.</p></div>
        <div className="relative w-full sm:max-w-sm">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
            <Search className="h-4 w-4 shrink-0 text-sky-700" />
            <input type="search" value={mapSearch} onChange={(event) => setMapSearch(event.target.value)} placeholder="Search destinations" className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400" />
          </label>
          {foundDestinations.length > 0 && <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            {foundDestinations.map((destination) => <button key={destination.id} type="button" onClick={() => { onAddStop?.(destination, 2); setMapSearch(''); }} className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-sky-50">
              <span><span className="block text-sm font-semibold text-slate-800">{destination.name}</span><span className="text-xs text-slate-500">{destination.state}</span></span><Plus className="h-4 w-4 text-sky-700" />
            </button>)}
          </div>}
          {mapSearch.trim() && !foundDestinations.length && <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-500 shadow-lg">No match. Click the map to add a custom place.</div>}
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <TravelMapLeaflet
          attractions={routePins}
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={routePins.length > 2 ? 6 : 8}
          legendTitle="Journey locations"
          legendDescription="Pins mark your start and selected stops. Click to edit a stop or click the map to add one."
          onMapClick={(coordinates) => setPinDraft((current) => current?.stopIndex !== undefined
            ? { ...current, coordinates }
            : { name: '', coordinates, stopIndex: null })}
          onMarkerClick={(pin) => {
            if (Number.isInteger(pin.stopIndex)) setPinDraft({ name: pin.name, coordinates: pin.coordinates, stopIndex: pin.stopIndex });
          }}
        />
      </div>
      {pinDraft && <div className="mx-4 mb-4 flex flex-col gap-3 rounded-2xl border border-sky-100 bg-sky-50/70 p-4 sm:flex-row sm:items-end">
        <label className="flex-1 text-xs font-semibold text-slate-700">{pinDraft.stopIndex === null ? 'Name this custom place' : 'Edit this location'}
          <input autoFocus value={pinDraft.name} onChange={(event) => setPinDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Place or stop name" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
        </label>
        <span className="text-[11px] text-slate-500">{pinDraft.coordinates.lat.toFixed(4)}, {pinDraft.coordinates.lng.toFixed(4)} · click map to adjust pin</span>
        <div className="flex gap-2"><button type="button" onClick={() => setPinDraft(null)} className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-white">Cancel</button><button type="button" disabled={!pinDraft.name.trim()} onClick={pinDraft.stopIndex === null ? addCustomPlace : savePinEdit} className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700 disabled:opacity-40">{pinDraft.stopIndex === null ? 'Add to journey' : 'Save location'}</button></div>
      </div>}
    </section>

    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3"><div><h3 className="font-bold text-slate-900">Journey route</h3><p className="text-xs text-slate-500">Edit stops, travel mode, dates, and stays.</p></div><span className="shrink-0 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">{stops.length} stops</span></div>
      <div className="flex flex-col gap-2 pb-2 lg:flex-row lg:items-stretch lg:gap-3 lg:overflow-x-auto">
        {route.map((point, index) => {
          const isOrigin = point.isOrigin;
          const done = isOrigin || completed.includes(point.name);
          const staysLinkCity = point.destination?.name;
          return <React.Fragment key={`${point.name}-${index}`}>
            {index > 0 && <div className="flex w-full items-center justify-between gap-3 py-2 lg:min-w-44 lg:flex-1 lg:flex-col lg:justify-center lg:gap-2 lg:self-center">
              <div className="h-8 w-0.5 shrink-0 bg-sky-300 lg:h-0.5 lg:w-full" />
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-800"><span>{MODES.find((item) => item.id === point.mode)?.label} from {route[index - 1]?.name} to {point.name}</span><ArrowRight className="h-4 w-4 shrink-0 rotate-90 lg:rotate-0" /></div>
              <label className="flex items-center gap-1.5 text-[11px] text-slate-500"><span>Mode</span><select aria-label={`Travel mode to ${point.name}`} value={point.mode} onChange={(event) => changeMode(point.index, event.target.value)} className="rounded-md border border-slate-200 bg-white px-1.5 py-1 text-xs text-slate-700">{MODES.map((mode) => <option key={mode.id} value={mode.id}>{mode.label}</option>)}</select></label>
              <div className="flex items-center gap-2 text-[10px] text-slate-500"><label className="flex items-center gap-1">Date<input aria-label={`Departure date to ${point.name}`} type="date" value={schedules[point.destination.id]?.date || inputDate(point.departure)} onChange={(event) => changeSchedule(point.destination.id, 'date', event.target.value)} className="w-[7.5rem] rounded-md border border-slate-200 bg-white px-1 py-1 text-[10px]" /></label><label className="flex items-center gap-1">Time<input aria-label={`Departure time to ${point.name}`} type="time" value={schedules[point.destination.id]?.time || inputTime(point.departure)} onChange={(event) => changeSchedule(point.destination.id, 'time', event.target.value)} className="w-[5.5rem] rounded-md border border-slate-200 bg-white px-1 py-1 text-[10px]" /></label></div>
              <span className="text-[10px] text-slate-400">~{point.durationHours.toFixed(1)} hr</span>
            </div>}
            <article className={`w-full rounded-2xl border p-4 lg:w-56 lg:shrink-0 ${done ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${done ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'}`}>{done ? <Check className="h-4 w-4" /> : isOrigin ? <MapPin className="h-4 w-4" /> : <Circle className="h-4 w-4" />}</div>
                {!isOrigin && <button onClick={() => toggleComplete(point.name)} className="text-[10px] font-bold text-emerald-800 hover:underline">{done ? 'Completed' : 'Mark complete'}</button>}
              </div>
              <h4 className="mt-3 font-bold text-slate-900">{point.name}</h4>
              {isOrigin ? <label className="mt-2 block text-[11px] font-medium text-slate-600">Starting point
                <select aria-label="Starting location" value={origin} onChange={(event) => onUpdateStartingCity?.(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700">{INDIAN_STARTING_CITIES.map((city) => <option key={city}>{city}</option>)}</select>
              </label> : <>
                <div className="mt-2 flex items-center gap-1.5">
                  <select aria-label={`Edit destination ${point.name}`} value={point.destination.id} onChange={(event) => {
                    const nextDestination = DESTINATIONS_DATA.find((destination) => destination.id === event.target.value);
                    if (nextDestination) onUpdateStop?.(point.index, nextDestination);
                  }} className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700">
                    {!DESTINATIONS_DATA.some((destination) => destination.id === point.destination.id) && <option value={point.destination.id}>{point.destination.name} (custom)</option>}
                    {DESTINATIONS_DATA.filter((destination) => destination.id === point.destination.id || !stops.some((stop, stopIndex) => stopIndex !== point.index && stop.destination.id === destination.id)).map((destination) => <option key={destination.id} value={destination.id}>{destination.name}</option>)}
                  </select>
                  <button type="button" disabled={point.index === 0} aria-label={`Move ${point.name} earlier`} onClick={() => onMoveStop?.(point.index, 'left')} className="rounded-lg p-1.5 text-slate-400 hover:bg-sky-50 hover:text-sky-700 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                  <button type="button" disabled={point.index === stops.length - 1} aria-label={`Move ${point.name} later`} onClick={() => onMoveStop?.(point.index, 'right')} className="rounded-lg p-1.5 text-slate-400 hover:bg-sky-50 hover:text-sky-700 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                  <button type="button" disabled={stops.length <= 1} aria-label={`Remove ${point.name}`} onClick={() => onRemoveStop?.(point.index)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30"><Trash2 className="h-4 w-4" /></button>
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5" />Arrive ~{formatTime(point.arrival)} · {formatDate(point.arrival)}</p>
                <label className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-600"><Hotel className="h-3.5 w-3.5 text-emerald-700" /><select value={point.stayType} onChange={(event) => changeStay(point.destination.id, event.target.value)} className="min-w-0 flex-1 rounded-lg border border-emerald-100 bg-emerald-50 px-2 py-1.5 text-[11px] font-semibold text-emerald-900">{STAY_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
                {point.stayType !== 'Transit/stopover only' && <div className="mt-2 flex gap-2"><a href={openStays('Airbnb', staysLinkCity)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1.5 text-[10px] font-bold text-emerald-900 hover:bg-emerald-200">Airbnb <ExternalLink className="h-3 w-3" /></a><a href={openStays('Booking.com', staysLinkCity)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1.5 text-[10px] font-bold text-emerald-900 hover:bg-emerald-200">Hotels <ExternalLink className="h-3 w-3" /></a></div>}
                {point.stayType !== 'Transit/stopover only' && <input aria-label={`Accommodation details for ${point.name}`} value={point.stayDetail} onChange={(event) => changeStayDetail(point.destination.id, event.target.value)} placeholder="Stay name or notes" className="mt-2 w-full rounded-lg border border-emerald-100 bg-white px-2 py-1.5 text-[11px] text-slate-700 placeholder:text-slate-400" />}
                {point.destination?.attractions?.[0] && <p className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-600"><span className="font-semibold text-slate-700">Nearby:</span> {point.destination.attractions[0].name}</p>}
              </>}
            </article>
          </React.Fragment>;
        })}
      </div>
      <p className="mt-3 text-[11px] text-slate-500">Arrival times are estimates based on straight-line distance and selected travel mode. Confirm service schedules and actual halts with your operator.</p>
    </section>

    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
      <span className="text-xs font-bold text-slate-700">Need tickets or a stay?</span>
      <a href="https://www.irctc.co.in/" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-sky-800 shadow-sm hover:bg-sky-100">IRCTC rail</a>
      <a href="https://www.redbus.in/" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-sky-800 shadow-sm hover:bg-sky-100">redBus</a>
      <a href="https://www.makemytrip.com/" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-sky-800 shadow-sm hover:bg-sky-100">MakeMyTrip</a>
    </div>
  </div>;
}
