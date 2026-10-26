import React, { useEffect, useState } from 'react';
import { Archive, CalendarDays, Copy, Edit3, MapPin, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import { INDIAN_STARTING_CITIES } from '../data/destinationsData';

export default function TripManagementModal({
  isOpen,
  trips = [],
  activeTripId,
  onClose,
  onNewTrip,
  onActivateTrip,
  onDuplicateTrip,
  onArchiveTrip,
  onUpdateTrip,
  onDeleteTrip
}) {
  const [showArchived, setShowArchived] = useState(false);
  const [editingTripId, setEditingTripId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setEditingTripId(null);
      setDeleteCandidate(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const visibleTrips = trips
    .filter((trip) => Boolean(trip.archived) === showArchived)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));

  const beginEdit = (trip) => {
    setEditingTripId(trip.id);
    setEditForm({
      title: trip.title || trip.stops?.map((stop) => stop.destination?.name).join(' → ') || 'My trip',
      startDate: trip.startDate || '',
      startingCity: trip.startingCity || 'Bengaluru',
      travellers: trip.travellers || 1
    });
  };

  const saveEdit = (event, trip) => {
    event.preventDefault();
    onUpdateTrip({ ...trip, ...editForm, travellers: Math.max(1, Number(editForm.travellers) || 1) });
    setEditingTripId(null);
  };

  const confirmDelete = () => {
    if (!deleteCandidate) return;
    onDeleteTrip(deleteCandidate);
    setDeleteCandidate(null);
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="trip-manager-title" className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <div><h2 id="trip-manager-title" className="text-lg font-extrabold text-slate-900">Your trips</h2><p className="text-xs text-slate-500">Open, edit, duplicate, or archive a trip.</p></div>
        <div className="flex items-center gap-2"><button type="button" onClick={() => { onClose(); onNewTrip(); }} className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-3 py-2 text-xs font-bold text-white hover:bg-sky-700"><Plus className="h-4 w-4" />New trip</button><button type="button" onClick={onClose} aria-label="Close trip manager" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
      </header>

      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 sm:px-6">
        <p className="text-xs font-semibold text-slate-600">{showArchived ? 'Archived trips' : 'Active trips'} <span className="ml-1 text-slate-400">{visibleTrips.length}</span></p>
        <button type="button" onClick={() => { setShowArchived((value) => !value); setEditingTripId(null); }} className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900">
          {showArchived ? <RotateCcw className="h-3.5 w-3.5" /> : <Archive className="h-3.5 w-3.5" />}{showArchived ? 'Active trips' : 'View archive'}
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto p-4 sm:p-6">
        {visibleTrips.length === 0 && <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">{showArchived ? 'No archived trips.' : 'No trips yet. Create your first one.'}</div>}
        {visibleTrips.map((trip) => {
          const route = (trip.stops || []).map((stop) => stop.destination?.name).filter(Boolean).join(' → ');
          const isEditing = editingTripId === trip.id;
          return <article key={trip.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-slate-900">{trip.title || route || 'Untitled trip'}</h3>{trip.id === activeTripId && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Current</span>}</div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5 text-sky-700" />{route || 'No destinations yet'}</p>
                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400"><CalendarDays className="h-3.5 w-3.5" />{trip.startDate || 'Date not set'} · {trip.durationDays || 0} days · {trip.travellers || 1} traveler{trip.travellers === 1 ? '' : 's'}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-1.5">
                <button type="button" onClick={() => { onActivateTrip(trip); onClose(); }} className="rounded-lg bg-sky-50 px-2.5 py-2 text-[11px] font-bold text-sky-800 hover:bg-sky-100">Open & edit route</button>
                <button type="button" onClick={() => isEditing ? setEditingTripId(null) : beginEdit(trip)} aria-label={`Edit details for ${trip.title || route}`} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-sky-700"><Edit3 className="h-4 w-4" /></button>
                <button type="button" onClick={() => { onDuplicateTrip(trip); onClose(); }} aria-label={`Duplicate ${trip.title || route}`} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-sky-700"><Copy className="h-4 w-4" /></button>
                <button type="button" onClick={() => onArchiveTrip(trip)} aria-label={trip.archived ? `Restore ${trip.title || route}` : `Archive ${trip.title || route}`} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-emerald-700">{trip.archived ? <RotateCcw className="h-4 w-4" /> : <Archive className="h-4 w-4" />}</button>
                <button type="button" onClick={() => setDeleteCandidate(trip)} aria-label={`Delete ${trip.title || route}`} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>

            {isEditing && <form onSubmit={(event) => saveEdit(event, trip)} className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-2">
              <label className="text-[11px] font-semibold text-slate-600">Trip name<input required value={editForm.title} onChange={(event) => setEditForm((form) => ({ ...form, title: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-800" /></label>
              <label className="text-[11px] font-semibold text-slate-600">Start date<input type="date" value={editForm.startDate} onChange={(event) => setEditForm((form) => ({ ...form, startDate: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-800" /></label>
              <label className="text-[11px] font-semibold text-slate-600">Starting city<select value={editForm.startingCity} onChange={(event) => setEditForm((form) => ({ ...form, startingCity: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-800">{INDIAN_STARTING_CITIES.map((city) => <option key={city}>{city}</option>)}</select></label>
              <label className="text-[11px] font-semibold text-slate-600">Travelers<input type="number" min="1" max="15" value={editForm.travellers} onChange={(event) => setEditForm((form) => ({ ...form, travellers: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-800" /></label>
              <div className="flex items-center justify-end gap-2 sm:col-span-2"><button type="button" onClick={() => setEditingTripId(null)} className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-white">Cancel</button><button type="submit" className="rounded-lg bg-sky-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-sky-700">Save details</button></div>
            </form>}
          </article>;
        })}
      </div>

      {deleteCandidate && <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
        <section role="alertdialog" aria-modal="true" aria-labelledby="delete-trip-title" className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
          <h3 id="delete-trip-title" className="font-bold text-slate-900">Delete trip?</h3>
          <p className="mt-2 text-sm text-slate-600">Are you sure you want to delete “{deleteCandidate.title || 'this trip'}”? Its itinerary, tracker data, and saved photos will also be removed.</p>
          <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setDeleteCandidate(null)} className="rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button type="button" onClick={confirmDelete} className="rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700">Delete trip</button></div>
        </section>
      </div>}
    </section>
  </div>;
}
