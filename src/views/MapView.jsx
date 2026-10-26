import React, { useState } from 'react';
import {
  MapPin,
  ExternalLink,
  Info
} from 'lucide-react';
import TravelMapLeaflet from '../components/TravelMapLeaflet';
import { DESTINATIONS_DATA } from '../data/destinationsData';

export default function MapView({ activeTrip }) {
  const [selectedFilter, setSelectedFilter] = useState('all');

  let attractions = [];
  let centerCoordinates = [10.0889, 77.0595]; // default Kerala center
  let circuitTitle = 'Regional Circuit Map';

  if (activeTrip && activeTrip.itineraryDays) {
    circuitTitle = activeTrip.title || 'Multi-Destination Route';
    const firstStopDest = activeTrip.stops?.[0]?.destination || activeTrip.destination;
    centerCoordinates = [
      firstStopDest?.coordinates?.lat || 10.0889,
      firstStopDest?.coordinates?.lng || 77.0595
    ];

    activeTrip.itineraryDays.forEach((day) => {
      (day.activities || []).forEach((act) => {
        if (!act.isIntercityTransit && act.coordinates) {
          attractions.push({
            ...act,
            dayNumber: day.dayNumber,
            destinationId: day.destinationId,
            destinationName: day.destinationName
          });
        }
      });
    });

    // Apply filter
    if (selectedFilter !== 'all') {
      if (selectedFilter.startsWith('dest-')) {
        const destId = selectedFilter.replace('dest-', '');
        attractions = attractions.filter((a) => a.destinationId === destId);
      } else if (selectedFilter.startsWith('day-')) {
        const dayNum = Number(selectedFilter.replace('day-', ''));
        attractions = attractions.filter((a) => a.dayNumber === dayNum);
      }
    }
  } else {
    const fallbackDest = DESTINATIONS_DATA[0];
    centerCoordinates = [fallbackDest.coordinates.lat, fallbackDest.coordinates.lng];
    attractions = fallbackDest.attractions.map((act, i) => ({
      ...act,
      dayNumber: Math.floor(i / 3) + 1,
      timeSlot: '10:00 AM – 12:00 PM',
      destinationName: fallbackDest.name
    }));
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">
            <MapPin className="w-4 h-4" />
            <span>Interactive Circuit Route</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {circuitTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            GPS-verified attractions and highway routes connecting your multi-city itinerary
          </p>
        </div>

        {/* Filters if active trip exists */}
        {activeTrip?.stops && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 self-start md:self-auto scrollbar-none">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Stops Route
            </button>
            {activeTrip.stops.map((s) => (
              <button
                key={s.destination?.id}
                onClick={() => setSelectedFilter(`dest-${s.destination?.id}`)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedFilter === `dest-${s.destination?.id}`
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {s.destination?.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Leaflet Component */}
      <div className="space-y-3">
        <TravelMapLeaflet
          attractions={attractions}
          selectedDay={selectedFilter}
          center={centerCoordinates}
          zoom={9}
        />

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Full Circuit Navigation:</strong> Pin numbers correspond to the sequential itinerary order across your destinations. Tap any marker to view place details and open turn-by-turn driving or walking directions on Google Maps.
          </p>
        </div>
      </div>

      {/* Sightseeing Locations Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Sights in Route ({attractions.length})
          </h3>
          <span className="text-xs text-slate-500">Click any card to open external directions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {attractions.map((act, index) => {
            const lat = act.coordinates?.lat;
            const lng = act.coordinates?.lng;
            const googleMapsUrl =
              lat && lng
                ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    act.name + ' ' + (act.destinationName || '')
                  )}`;

            return (
              <div
                key={act.id || index}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 uppercase tracking-wider">
                      {act.destinationName} • #{index + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      ₹{act.cost || 0} entry
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{act.name}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {act.description}
                  </p>

                  {lat && lng && (
                    <div className="text-[11px] font-mono text-slate-400">
                      GPS: {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
                    </div>
                  )}

                  {act.tips && (
                    <p className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                      <strong>Tip:</strong> {act.tips}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {act.travelTime || 'Sightseeing stop'}
                  </span>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-sky-600 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
