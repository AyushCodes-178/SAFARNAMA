import React from 'react';
import {
  Calendar,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Camera,
  MapPin,
  Route,
  ChevronRight
} from 'lucide-react';
import { REGIONAL_CIRCUITS, DESTINATIONS_DATA } from '../data/destinationsData';

export default function DashboardView({
  activeTrip,
  setActiveView,
  onLaunchCircuit,
  onManageTrips,
  tripCount = 0
}) {
  const featuredCircuits = REGIONAL_CIRCUITS;

  const completedActivitiesCount = activeTrip
    ? (activeTrip.itineraryDays || []).reduce(
        (sum, day) => sum + (day.activities || []).filter((a) => a.completed && !a.isIntercityTransit).length,
        0
      )
    : 0;

  const totalActivitiesCount = activeTrip
    ? (activeTrip.itineraryDays || []).reduce(
        (sum, day) => sum + (day.activities || []).filter((a) => !a.isIntercityTransit).length,
        0
      )
    : 0;

  const progressPct =
    totalActivitiesCount > 0 ? Math.round((completedActivitiesCount / totalActivitiesCount) * 100) : 0;

  const circuitStopsStr = activeTrip?.stops
    ? activeTrip.stops.map((s) => `${s.destination?.name} (${s.daysCount}D)`).join(' ➔ ')
    : activeTrip?.destination?.name;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-800 text-white min-h-[340px] flex flex-col justify-end p-6 sm:p-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80")'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Multi-Destination Indian Journey Planner</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Plan Complete Indian Circuits in One Itinerary.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Effortlessly plan across multiple cities—like Munnar, Varkala & Thiruvananthapuram—with auto-clustered sights, realistic intercity travel times, and an interactive route map.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveView('plan')}
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-sky-600/30 transition-all hover:scale-102"
            >
              <Route className="w-4 h-4" /> Build Custom Route
            </button>
            <button
              onClick={() => setActiveView('discover')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all"
            >
              Explore Regional Circuits
            </button>
            <button
              onClick={onManageTrips}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all"
            >
              Your Trips{tripCount ? ` (${tripCount})` : ''}
            </button>
          </div>
        </div>
      </div>

      {/* Active Trip Highlights Card */}
      {activeTrip ? (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sky-200/80 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-sky-100 to-transparent rounded-bl-full pointer-events-none -z-0" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-800">
                  Active Circuit Journey
                </span>
                <span className="text-xs text-slate-500">
                  From {activeTrip.startingCity || 'Bengaluru'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {activeTrip.title || circuitStopsStr}
              </h2>

              {/* Stop Sequence Pill Ribbon */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="text-slate-400 text-[11px] uppercase tracking-wider font-bold">Route:</span>
                <span className="text-sky-700">{circuitStopsStr}</span>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <span>{activeTrip.durationDays} Days Total</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>
                    Est. ₹{activeTrip.budget?.costPerPerson?.toLocaleString('en-IN') || '—'} / person
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>
                    {completedActivitiesCount} of {totalActivitiesCount} Attractions Visited
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="pt-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Journey Progress</span>
                  <span>{progressPct}% Completed</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-sky-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 shrink-0">
              <button
                onClick={() => setActiveView('itinerary')}
                className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center transition-all flex flex-col items-center justify-center gap-1"
              >
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>View & Edit Route</span>
              </button>
              <button
                onClick={() => setActiveView('map')}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold text-center transition-all flex flex-col items-center justify-center gap-1"
              >
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Circuit Map</span>
              </button>
              <button
                onClick={() => setActiveView('budget')}
                className="p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold text-center transition-all flex flex-col items-center justify-center gap-1"
              >
                <TrendingUp className="w-4 h-4 text-sky-600" />
                <span>Trip Budget</span>
              </button>
              <button
                onClick={() => setActiveView('journal')}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold text-center transition-all flex flex-col items-center justify-center gap-1"
              >
                <Camera className="w-4 h-4 text-amber-500" />
                <span>Photo Journal</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Popular Curated Regional Circuits */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Popular Regional Circuits</h3>
            <p className="text-xs text-slate-500">Effortlessly plan across connected Indian cities and regions in a single click</p>
          </div>
          <button
            onClick={() => setActiveView('discover')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            Explore all <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredCircuits.map((circ) => {
            const stopNames = circ.stops
              .map((s) => {
                const d = DESTINATIONS_DATA.find((x) => x.id === s.destinationId);
                return `${d?.name || s.destinationId} (${s.daysCount}D)`;
              })
              .join(' ➔ ');

            return (
              <div
                key={circ.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <img
                    src={circ.image}
                    alt={circ.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-800">
                    {circ.region} • {circ.totalDays} Days
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-extrabold text-base leading-snug drop-shadow-sm">{circ.name}</h4>
                    <p className="text-[11px] text-slate-200 truncate">{circ.tagline}</p>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100 text-xs font-semibold text-sky-950">
                      <span className="text-[10px] text-sky-600 uppercase font-bold tracking-wider block">Route Sequence:</span>
                      {stopNames}
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {circ.highlights.map((h, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onLaunchCircuit(circ)}
                    className="w-full py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Launch This Circuit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
