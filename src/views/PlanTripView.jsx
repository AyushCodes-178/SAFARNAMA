import React, { useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Calendar, MapPin, Plus, Route, Trash2, Users } from 'lucide-react';
import { DESTINATIONS_DATA, INDIAN_STARTING_CITIES } from '../data/destinationsData';

export default function PlanTripView({ initialCriteria, onCreateMultiStopTrip }) {
  const [startingCity, setStartingCity] = useState(initialCriteria?.startingCity || 'Bengaluru');
  const [stops, setStops] = useState([{ destinationId: 'munnar', daysCount: 2 }, { destinationId: 'varkala', daysCount: 2 }]);
  const [startDate, setStartDate] = useState(initialCriteria?.startDate || '2026-10-26');
  const [travellers, setTravellers] = useState(initialCriteria?.travellers || 2);
  const totalDays = stops.reduce((sum, stop) => sum + stop.daysCount, 0);
  const available = DESTINATIONS_DATA.filter((destination) => !stops.some((stop) => stop.destinationId === destination.id));

  const updateStop = (index, change) => setStops((current) => current.map((stop, i) => i === index ? { ...stop, ...change } : stop));
  const moveStop = (index, direction) => setStops((current) => {
    const next = [...current];
    const target = index + direction;
    if (target < 0 || target >= next.length) return current;
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  });

  const submit = (event) => {
    event.preventDefault();
    const journeyStops = stops.map((stop) => ({ destination: DESTINATIONS_DATA.find((destination) => destination.id === stop.destinationId), daysCount: stop.daysCount }));
    onCreateMultiStopTrip({
      title: journeyStops.map((stop) => stop.destination.name).join(' → '), startingCity,
      stops: journeyStops, startDate, durationDays: totalDays, travellers: Number(travellers) || 1,
      budgetPerPerson: initialCriteria?.budgetPerPerson || 15000, pace: initialCriteria?.pace || 'balanced'
    });
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-200">
      <form onSubmit={submit} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-wider"><Route className="w-4 h-4" /> One trip, every stop</div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Where would you like to go?</h2>
          <p className="mt-1 text-sm text-slate-600">Build a route across a whole region. You can change the stops and activities any time.</p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div><h3 className="text-sm font-bold text-slate-900">Your route</h3><p className="text-xs text-slate-500">Add places in the order you want to visit them.</p></div>
              <span className="shrink-0 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">{totalDays} days</span>
            </div>
            <div className="space-y-2">
              {stops.map((stop, index) => {
                const destination = DESTINATIONS_DATA.find((item) => item.id === stop.destinationId);
                return <div key={stop.destinationId} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-xs font-extrabold text-sky-700">{index + 1}</span>
                  <div className="min-w-0 flex-1"><div className="font-bold text-sm text-slate-900">{destination?.name}</div><div className="text-xs text-slate-500">{destination?.state}</div></div>
                  <label className="flex items-center gap-2 text-xs text-slate-600">Days
                    <input aria-label={`Days in ${destination?.name}`} type="number" min="1" max="7" value={stop.daysCount} onChange={(event) => updateStop(index, { daysCount: Math.max(1, Math.min(7, Number(event.target.value) || 1)) })} className="w-16 rounded-lg border border-slate-200 px-2 py-1.5 text-center font-bold text-slate-800" />
                  </label>
                  <div className="flex items-center">
                    <button type="button" aria-label="Move stop up" disabled={index === 0} onClick={() => moveStop(index, -1)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                    <button type="button" aria-label="Move stop down" disabled={index === stops.length - 1} onClick={() => moveStop(index, 1)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                    <button type="button" aria-label={`Remove ${destination?.name}`} disabled={stops.length <= 1} onClick={() => setStops((current) => current.filter((_, i) => i !== index))} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>;
              })}
            </div>
            {available.length > 0 && <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-sky-300 bg-sky-50/50 px-4 py-3 text-sm font-semibold text-sky-800 hover:bg-sky-50">
              <Plus className="h-4 w-4" /><span>Add a destination</span>
              <select aria-label="Add a destination" value="" onChange={(event) => { if (event.target.value) setStops((current) => [...current, { destinationId: event.target.value, daysCount: 2 }]); }} className="ml-auto max-w-[60%] bg-transparent text-xs font-semibold text-slate-700 outline-none">
                <option value="">Choose a place…</option>{available.map((destination) => <option key={destination.id} value={destination.id}>{destination.name}, {destination.state}</option>)}
              </select>
            </label>}
          </section>

          <section className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <label className="text-xs font-bold text-slate-700"><span className="mb-1.5 flex items-center gap-1.5"><MapPin className="h-4 w-4 text-sky-600" />Starting from</span>
              <select value={startingCity} onChange={(event) => setStartingCity(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold">{INDIAN_STARTING_CITIES.map((city) => <option key={city}>{city}</option>)}</select>
            </label>
            <label className="text-xs font-bold text-slate-700"><span className="mb-1.5 flex items-center gap-1.5"><Calendar className="h-4 w-4 text-sky-600" />Start date</span>
              <input type="date" required value={startDate} onChange={(event) => setStartDate(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold" />
            </label>
            <label className="text-xs font-bold text-slate-700 sm:col-span-2"><span className="mb-1.5 flex items-center gap-1.5"><Users className="h-4 w-4 text-sky-600" />Travelers</span>
              <input type="number" min="1" max="15" value={travellers} onChange={(event) => setTravellers(Math.max(1, Number(event.target.value) || 1))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold sm:max-w-40" />
            </label>
          </section>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/70 p-5 sm:px-8">
          <div className="text-xs text-slate-500">{stops.length} places <span className="mx-1">·</span> {totalDays} days</div>
          <button type="submit" disabled={!stops.length} className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50">Create my trip <ArrowRight className="h-4 w-4" /></button>
        </div>
      </form>
    </div>
  );
}
