import React, { useState } from 'react';
import { MapPin, Plus, Trash2, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { DESTINATIONS_DATA } from '../data/destinationsData';

export default function JourneyStopsBar({
  stops = [],
  startingCity = 'Bengaluru',
  onAddStop,
  onRemoveStop,
  onMoveStop,
  onUpdateStopDays
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedDestId, setSelectedDestId] = useState('');
  const [newDaysCount, setNewDaysCount] = useState(2);

  const availableDestinations = DESTINATIONS_DATA.filter(
    (d) => !stops.some((s) => s.destination?.id === d.id)
  );

  const handleConfirmAdd = () => {
    if (!selectedDestId) return;
    const dest = DESTINATIONS_DATA.find((d) => d.id === selectedDestId);
    if (dest) {
      onAddStop(dest, Number(newDaysCount) || 2);
      setSelectedDestId('');
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-sky-600" />
            <span>Multi-Destination Route Sequence</span>
          </h3>
          <p className="text-xs text-slate-500">
            Customize your journey stops, change days per city, or reorder the circuit.
          </p>
        </div>

        {!isAdding && availableDestinations.length > 0 && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-3.5 py-1.5 rounded-xl border border-dashed border-sky-500 bg-sky-50/70 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Next Destination Stop</span>
          </button>
        )}
      </div>

      {/* Adding Stop Selector Dropdown */}
      {isAdding && (
        <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-xl flex flex-wrap items-center gap-3 animate-in fade-in duration-150">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[11px] font-bold text-sky-900 mb-1">
              Select City / Stop to Add:
            </label>
            <select
              value={selectedDestId}
              onChange={(e) => setSelectedDestId(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-sky-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">-- Choose Indian Destination --</option>
              {availableDestinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
          </div>

          <div className="w-28">
            <label className="block text-[11px] font-bold text-sky-900 mb-1">
              Days in Stop:
            </label>
            <input
              type="number"
              min="1"
              max="7"
              value={newDaysCount}
              onChange={(e) => setNewDaysCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-1.5 bg-white border border-sky-300 rounded-lg text-xs font-bold text-center text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 pt-4">
            <button
              onClick={handleConfirmAdd}
              disabled={!selectedDestId}
              className="px-4 py-1.5 bg-sky-600 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold hover:bg-sky-700 transition-colors"
            >
              Add to Circuit
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setSelectedDestId('');
              }}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Visual Chain of Stops */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
        {/* Origin Starting City */}
        <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 shrink-0 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Start</div>
            <div className="text-xs font-extrabold text-slate-900">{startingCity}</div>
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

        {/* Destination Stops Chain */}
        {stops.map((stop, idx) => {
          const dest = stop.destination;
          const daysCount = Number(stop.daysCount) || 1;

          return (
            <React.Fragment key={dest?.id || idx}>
              <div className="p-3 rounded-xl bg-white border border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-xs shrink-0 flex items-center gap-3 transition-all">
                {/* Image & Index */}
                <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                  <img
                    src={dest?.image}
                    alt={dest?.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-0 left-0 bg-slate-900/80 text-white font-bold text-[9px] px-1 rounded-br">
                    #{idx + 1}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-slate-900">{dest?.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium">({dest?.state})</span>
                  </div>

                  {/* Day Adjustment Pills */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/60">
                      {daysCount} Day{daysCount > 1 ? 's' : ''}
                    </span>
                    <button
                      type="button"
                      disabled={daysCount <= 1}
                      onClick={() => onUpdateStopDays(idx, daysCount - 1)}
                      className="w-5 h-5 rounded bg-slate-100 disabled:opacity-30 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                      title="Decrease days in this stop"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      disabled={daysCount >= 7}
                      onClick={() => onUpdateStopDays(idx, daysCount + 1)}
                      className="w-5 h-5 rounded bg-slate-100 disabled:opacity-30 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                      title="Increase days in this stop"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Reorder and Delete controls */}
                <div className="flex items-center gap-1 pl-2 border-l border-slate-100">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => onMoveStop(idx, 'left')}
                      className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
                      title="Move stop earlier"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {idx < stops.length - 1 && (
                    <button
                      type="button"
                      onClick={() => onMoveStop(idx, 'right')}
                      className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
                      title="Move stop later"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {stops.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveStop(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                      title="Remove this destination from journey"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {idx < stops.length - 1 && (
                <ArrowRight className="w-4 h-4 text-sky-400 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
