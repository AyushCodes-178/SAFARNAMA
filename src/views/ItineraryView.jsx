import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Navigation,
  IndianRupee,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Circle,
  ExternalLink,
  Camera,
  Sliders,
  Bus,
  MapPin,
  Pencil
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AddActivityModal from '../components/AddActivityModal';
import PhotoUploadModal from '../components/PhotoUploadModal';
import JourneyStopsBar from '../components/JourneyStopsBar';
import { TRAVEL_PACES } from '../data/destinationsData';

const CATEGORY_STYLES = {
  nature: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  adventure: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  beaches: 'bg-sky-50 text-sky-700 border-sky-200',
  heritage: 'bg-sky-50 text-sky-800 border-sky-200',
  food: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  culture: 'bg-sky-50 text-sky-700 border-sky-200',
  shopping: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'religious tourism': 'bg-sky-100 text-sky-900 border-sky-300'
};

export default function ItineraryView({
  activeTrip,
  onUpdateItinerary,
  onChangePace,
  onAddStop,
  onRemoveStop,
  onMoveStop,
  onUpdateStopDays,
  onPhotoSaved
}) {
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', or 'dest-xxx', or 'day-x'
  const [addModalDay, setAddModalDay] = useState(null);
  const [photoModalAttraction, setPhotoModalAttraction] = useState(null);
  const [photoModalDayNum, setPhotoModalDayNum] = useState(1);
  const [editingActivity, setEditingActivity] = useState(null);

  if (!activeTrip || !activeTrip.itineraryDays || activeTrip.itineraryDays.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-xl mx-auto space-y-4">
        <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-xl font-bold text-slate-800">No Active Journey</h3>
        <p className="text-xs text-slate-500">
          Create a trip from the "Plan a Trip" or "Circuits" tab to generate a complete multi-destination itinerary.
        </p>
      </div>
    );
  }

  const { itineraryDays, pace, travellers, budget, stops, startingCity, title } = activeTrip;

  const handleToggleComplete = (dayNumber, activityId) => {
    const updatedDays = itineraryDays.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      return {
        ...day,
        activities: day.activities.map((act) => {
          if (act.id !== activityId) return act;
          const nextCompleted = !act.completed;
          if (nextCompleted) {
            try {
              confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
            } catch {}
          }
          return { ...act, completed: nextCompleted };
        })
      };
    });
    onUpdateItinerary(updatedDays);
  };

  const handleRemoveActivity = (dayNumber, activityId) => {
    const updatedDays = itineraryDays.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      return {
        ...day,
        activities: day.activities.filter((act) => act.id !== activityId)
      };
    });
    onUpdateItinerary(updatedDays);
  };

  const handleMoveActivity = (dayNumber, index, direction) => {
    const updatedDays = itineraryDays.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      const activities = [...day.activities];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= activities.length) return day;

      const temp = activities[index];
      activities[index] = activities[targetIndex];
      activities[targetIndex] = temp;

      return { ...day, activities };
    });
    onUpdateItinerary(updatedDays);
  };

  const handleAddCustomActivity = (dayNumber, newActivity) => {
    const updatedDays = itineraryDays.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      return {
        ...day,
        activities: [...day.activities, newActivity]
      };
    });
    onUpdateItinerary(updatedDays);
  };

  const handleEditActivity = (dayNumber, updatedActivity) => {
    const updatedDays = itineraryDays.map((day) => day.dayNumber !== dayNumber ? day : {
      ...day,
      activities: day.activities.map((activity) => activity.id === updatedActivity.id ? updatedActivity : activity)
    });
    onUpdateItinerary(updatedDays);
    setEditingActivity(null);
  };

  // Filter days by selection
  const displayedDays = itineraryDays.filter((d) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter.startsWith('dest-')) {
      const destId = selectedFilter.replace('dest-', '');
      return d.destinationId === destId;
    }
    if (selectedFilter.startsWith('day-')) {
      const dayNum = Number(selectedFilter.replace('day-', ''));
      return d.dayNumber === dayNum;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Multi-Destination Journey Itinerary</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title || 'Your Indian Journey'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {itineraryDays.length} Days total • {stops?.length || 1} Destination Stop(s) • Est. Cost: ₹
            {(budget?.costPerPerson || 0).toLocaleString('en-IN')}/person
          </p>
        </div>

        {/* Pace Switcher Controls */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
          <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1">
            <Sliders className="w-3 h-3" /> Pace:
          </span>
          {TRAVEL_PACES.map((p) => (
            <button
              key={p.id}
              onClick={() => onChangePace(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pace === p.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Multi-Destination Stops Ribbon */}
      <JourneyStopsBar
        stops={stops || []}
        startingCity={startingCity || 'Bengaluru'}
        onAddStop={onAddStop}
        onRemoveStop={onRemoveStop}
        onMoveStop={onMoveStop}
        onUpdateStopDays={onUpdateStopDays}
      />

      {/* Filter Navigation Pills: All, by Destination Stop, or by Day */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
            selectedFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All {itineraryDays.length} Days
        </button>

        {/* Filter by destination stop */}
        {(stops || []).map((s) => (
          <button
            key={s.destination?.id}
            onClick={() => setSelectedFilter(`dest-${s.destination?.id}`)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
              selectedFilter === `dest-${s.destination?.id}`
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>{s.destination?.name} ({s.daysCount}D)</span>
          </button>
        ))}
      </div>

      {/* Days List */}
      <div className="space-y-6">
        {displayedDays.map((day) => (
          <div
            key={day.dayNumber}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs"
          >
            {/* Day Header */}
            <div className="p-5 sm:px-6 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-sky-600 text-white font-extrabold text-xs flex items-center justify-center">
                    D{day.dayNumber}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base">{day.title}</h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    {day.destinationName}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 ml-9">
                  {day.dateString} • {day.activities.length} planned activities
                </p>
              </div>

              <button
                onClick={() => setAddModalDay(day.dayNumber)}
                className="px-3.5 py-1.5 rounded-xl border border-dashed border-sky-400 bg-sky-50/60 hover:bg-sky-100 text-sky-700 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" /> Add Activity
              </button>
            </div>

            {/* Activities in Day */}
            <div className="p-5 sm:p-6 space-y-4">
              {day.activities.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No activities scheduled for Day {day.dayNumber}. Click "Add Activity" above.
                </div>
              ) : (
                day.activities.map((act, index) => {
                  // Special Card for Intercity Transitions
                  if (act.isIntercityTransit) {
                    return (
                      <div
                        key={act.id}
                        className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-amber-500/10 to-transparent border border-sky-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                            <Bus className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 uppercase tracking-wider">
                              Intercity Transition
                            </span>
                            <h4 className="font-extrabold text-slate-900 text-sm mt-1">{act.name}</h4>
                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{act.description}</p>
                            <div className="flex flex-wrap gap-3 text-xs text-slate-500 font-medium mt-1.5">
                              <span>⏱ {act.timeSlot}</span>
                              <span>🛣 {act.travelTime}</span>
                              <span>₹ ~{act.cost} / person est. fare</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 self-start sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleRemoveActivity(day.dayNumber, act.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            title="Remove transit card"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  const googleMapsUrl = act.coordinates
                    ? `https://www.google.com/maps/dir/?api=1&destination=${act.coordinates.lat},${act.coordinates.lng}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        act.name + ' ' + (day.destinationName || '')
                      )}`;

                  return (
                    <div
                      key={act.id}
                      className={`relative p-4 rounded-2xl border transition-all ${
                        act.completed
                          ? 'bg-emerald-50/40 border-emerald-200 opacity-90'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleComplete(day.dayNumber, act.id)}
                            className="mt-1 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                            title={act.completed ? 'Mark as pending' : 'Mark as visited'}
                          >
                            {act.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>

                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                                  CATEGORY_STYLES[act.category] ||
                                  'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                {act.category || 'Sight'}
                              </span>

                              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {act.timeSlot}
                              </span>

                              <span className="text-xs text-slate-500 font-medium">
                                ({act.durationMinutes} min visit)
                              </span>
                            </div>

                            <h4
                              className={`text-base font-bold text-slate-900 ${
                                act.completed ? 'line-through text-slate-500' : ''
                              }`}
                            >
                              {act.name}
                            </h4>

                            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                              {act.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                              <span className="flex items-center gap-1 font-medium text-slate-700">
                                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                                {act.cost > 0 ? `₹${act.cost} / person entry` : 'Free entry'}
                              </span>

                              <span className="flex items-center gap-1 text-slate-500">
                                <Navigation className="w-3.5 h-3.5 text-sky-600" />
                                {act.travelTime}
                              </span>
                            </div>

                            {act.tips && (
                              <p className="text-[11px] text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200/60 inline-block mt-1">
                                💡 <strong>Tip:</strong> {act.tips}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 sm:self-start shrink-0 pt-2 sm:pt-0">
                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Get Directions on Google Maps"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingActivity({ dayNumber: day.dayNumber, activity: act });
                              setAddModalDay(day.dayNumber);
                            }}
                            className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
                            title="Edit activity"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setPhotoModalAttraction(act);
                              setPhotoModalDayNum(day.dayNumber);
                            }}
                            className="p-1.5 text-sky-600 hover:text-sky-700 rounded-lg hover:bg-sky-50 transition-colors"
                            title="Add Photo / Memory"
                          >
                            <Camera className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveActivity(day.dayNumber, index, 'up')}
                            className="p-1.5 text-slate-400 disabled:text-slate-200 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                            title="Move up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            disabled={index === day.activities.length - 1}
                            onClick={() => handleMoveActivity(day.dayNumber, index, 'down')}
                            className="p-1.5 text-slate-400 disabled:text-slate-200 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                            title="Move down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveActivity(day.dayNumber, act.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Remove from itinerary"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      <AddActivityModal
        isOpen={addModalDay !== null}
        onClose={() => { setAddModalDay(null); setEditingActivity(null); }}
        dayNumber={addModalDay}
        destinationCoordinates={activeTrip.stops?.find((stop) => stop.destination?.id === itineraryDays.find((day) => day.dayNumber === addModalDay)?.destinationId)?.destination?.coordinates}
        initialActivity={editingActivity?.activity || null}
        onAddActivity={editingActivity ? handleEditActivity : handleAddCustomActivity}
      />

      <PhotoUploadModal
        isOpen={photoModalAttraction !== null}
        onClose={() => setPhotoModalAttraction(null)}
        tripId={activeTrip.id}
        attraction={photoModalAttraction}
        dayNumber={photoModalDayNum}
        onPhotoSaved={onPhotoSaved}
      />
    </div>
  );
}
