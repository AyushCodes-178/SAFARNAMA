import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ArrowRight,
  Route,
  MapPin
} from 'lucide-react';
import { DESTINATIONS_DATA, REGIONAL_CIRCUITS, INTEREST_CATEGORIES } from '../data/destinationsData';

export default function DiscoverView({
  onSelectDestination,
  onLaunchCircuit,
  onAddStopToActiveTrip
}) {
  const [activeTab, setActiveTab] = useState('circuits'); // 'circuits' or 'destinations'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterestFilter, setSelectedInterestFilter] = useState('all');

  const filteredCircuits = REGIONAL_CIRCUITS.filter((circ) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      circ.name.toLowerCase().includes(term) ||
      circ.region.toLowerCase().includes(term) ||
      circ.description.toLowerCase().includes(term)
    );
  });

  const filteredDestinations = DESTINATIONS_DATA.filter((dest) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!dest.name.toLowerCase().includes(term) && !dest.state.toLowerCase().includes(term)) {
        return false;
      }
    }
    if (selectedInterestFilter !== 'all') {
      if (!dest.interests?.includes(selectedInterestFilter)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Discover & Regional Circuits</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Incredible Bharat
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Choose full regional circuits (like Kerala or Rajasthan) or browse individual destinations to add to your journey.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl self-start md:self-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('circuits')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'circuits'
                ? 'bg-white text-sky-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            <span>Regional Circuits ({filteredCircuits.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('destinations')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'destinations'
                ? 'bg-white text-sky-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>All Destinations ({filteredDestinations.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeTab === 'circuits'
                ? 'Search circuits by state, name or route (e.g. Kerala, Rajasthan)...'
                : 'Search destinations by city or state (e.g. Munnar, Varkala, Coorg)...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {activeTab === 'destinations' && (
          <select
            value={selectedInterestFilter}
            onChange={(e) => setSelectedInterestFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Travel Themes</option>
            {INTEREST_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Tab 1: Regional Circuits */}
      {activeTab === 'circuits' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCircuits.map((circ) => {
            const stopNames = circ.stops
              .map((s) => {
                const d = DESTINATIONS_DATA.find((x) => x.id === s.destinationId);
                return `${d?.name || s.destinationId} (${s.daysCount}D)`;
              })
              .join(' ➔ ');

            return (
              <div
                key={circ.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={circ.image}
                    alt={circ.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-800">
                    {circ.region} • {circ.totalDays} Days
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-black text-lg leading-snug drop-shadow-sm">{circ.name}</h3>
                    <p className="text-xs text-slate-200 truncate">{circ.tagline}</p>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs text-sky-950">
                      <span className="text-[10px] text-sky-600 uppercase font-bold tracking-wider block mb-0.5">
                        Circuit Sequence:
                      </span>
                      <span className="font-extrabold">{stopNames}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {circ.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {circ.highlights.map((h, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onLaunchCircuit(circ)}
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-101"
                  >
                    <span>Launch This Circuit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Individual Destinations Catalog */}
      {activeTab === 'destinations' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/70 backdrop-blur-xs text-[11px] font-semibold text-white">
                  {dest.state}
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-black text-xl leading-snug drop-shadow-sm">{dest.name}</h3>
                  <p className="text-xs text-slate-200 truncate">{dest.tagline}</p>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900">~₹{dest.avgDailyBudget}/day est.</span>
                    <span>Ideal: {dest.minDays}–{dest.maxDays} Days</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {(dest.highlights || []).slice(0, 3).map((h, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectDestination(dest)}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition-colors"
                  >
                    Start Trip
                  </button>
                  <button
                    onClick={() => onAddStopToActiveTrip(dest)}
                    className="py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-bold text-xs text-center transition-colors"
                  >
                    + Add to Route
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
