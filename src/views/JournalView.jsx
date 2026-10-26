import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Circle,
  Trash2,
  Image as ImageIcon,
  ShieldCheck,
  Eye,
  X,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import PhotoUploadModal from '../components/PhotoUploadModal';
import { indexedDbService } from '../services/indexedDbService';

export default function JournalView({
  activeTrip,
  onUpdateItinerary,
  photos = [],
  onPhotosUpdated
}) {
  const [selectedDestFilter, setSelectedDestFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // all, visited, pending
  const [activeTab, setActiveTab] = useState('checklist'); // checklist, gallery
  const [uploadModalAttraction, setUploadModalAttraction] = useState(null);
  const [uploadModalDay, setUploadModalDay] = useState(1);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  if (!activeTrip || !activeTrip.itineraryDays) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-xl mx-auto space-y-3">
        <Camera className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-xl font-bold text-slate-800">No Active Trip for Journal</h3>
        <p className="text-xs text-slate-500">
          Create a trip to track your visited attractions and save photos to your personal travel journal.
        </p>
      </div>
    );
  }

  const { itineraryDays, id: tripId, title, stops } = activeTrip;

  // Compute checklist stats
  const allActivities = [];
  itineraryDays.forEach((day) => {
    (day.activities || []).forEach((act) => {
      if (!act.isIntercityTransit) {
        allActivities.push({
          ...act,
          dayNumber: day.dayNumber,
          destinationId: day.destinationId,
          destinationName: day.destinationName
        });
      }
    });
  });

  const completedActivities = allActivities.filter((a) => a.completed);
  const remainingActivities = allActivities.filter((a) => !a.completed);
  const progressPct =
    allActivities.length > 0
      ? Math.round((completedActivities.length / allActivities.length) * 100)
      : 0;

  const handleToggleVisited = (dayNumber, activityId) => {
    const updatedDays = itineraryDays.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      return {
        ...day,
        activities: day.activities.map((act) => {
          if (act.id !== activityId) return act;
          const nextVal = !act.completed;
          if (nextVal) {
            try {
              confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
            } catch {}
          }
          return { ...act, completed: nextVal };
        })
      };
    });
    onUpdateItinerary(updatedDays);
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Are you sure you want to remove this photo?')) return;
    try {
      await indexedDbService.deletePhoto(photoId);
      if (onPhotosUpdated) onPhotosUpdated();
    } catch (e) {
      console.error('Failed to delete photo', e);
    }
  };

  const filteredActivities = allActivities.filter((act) => {
    if (selectedDestFilter !== 'all' && act.destinationId !== selectedDestFilter) return false;
    if (statusFilter === 'visited' && !act.completed) return false;
    if (statusFilter === 'pending' && act.completed) return false;
    return true;
  });

  const filteredPhotos = (photos || []).filter((p) => {
    if (p.tripId && p.tripId !== tripId) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">
            <Camera className="w-4 h-4" />
            <span>Circuit Memory & Progress Tracker</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title || 'Travel Journal'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track visited attractions across your stops and store captions securely in your browser's IndexedDB.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl self-start md:self-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === 'checklist'
                ? 'bg-white text-sky-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Checklist ({allActivities.length})
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === 'gallery'
                ? 'bg-white text-sky-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Photo Gallery ({filteredPhotos.length})
          </button>
        </div>
      </div>

      {/* Progress & Stats Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Trip Journey Completion: {completedActivities.length} of {allActivities.length} Sights Visited
            </h3>
            <p className="text-xs text-slate-500">
              {remainingActivities.length} sights remaining across your stops
            </p>
          </div>
          <div className="text-right">
            <span className="text-xl sm:text-2xl font-black text-sky-600">
              {progressPct}%
            </span>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-sky-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Local Browser Storage:</strong> Uploaded photos, captions, and visited markers are stored inside your browser's IndexedDB. They stay private to your device.
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Destination Stop Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          <span className="text-slate-400 font-semibold mr-1">City Stop:</span>
          <button
            onClick={() => setSelectedDestFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
              selectedDestFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Stops
          </button>
          {(stops || []).map((s) => (
            <button
              key={s.destination?.id}
              onClick={() => setSelectedDestFilter(s.destination?.id)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                selectedDestFilter === s.destination?.id
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>{s.destination?.name}</span>
            </button>
          ))}
        </div>

        {/* Status Filter */}
        {activeTab === 'checklist' && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Status:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('visited')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                statusFilter === 'visited'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Visited ({completedActivities.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pending ({remainingActivities.length})
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Checklist View */}
      {activeTab === 'checklist' && (
        <div className="space-y-3">
          {filteredActivities.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-400 text-xs border border-slate-200">
              No attractions match your current filter.
            </div>
          ) : (
            filteredActivities.map((act) => {
              const actPhotos = (photos || []).filter(
                (p) => p.attractionId === act.id || p.attractionId === act.originalId
              );

              return (
                <div
                  key={act.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    act.completed
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleVisited(act.dayNumber, act.id)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                        title={act.completed ? 'Mark unvisited' : 'Mark visited'}
                      >
                        {act.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 uppercase tracking-wider">
                            {act.destinationName} • Day {act.dayNumber}
                          </span>
                          <span className="text-xs text-slate-500">{act.timeSlot}</span>
                          {act.completed && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Visited ✓
                            </span>
                          )}
                        </div>

                        <h4
                          className={`text-base font-bold text-slate-900 ${
                            act.completed ? 'line-through text-slate-500' : ''
                          }`}
                        >
                          {act.name}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                          {act.description}
                        </p>
                      </div>
                    </div>

                    <div className="sm:self-start shrink-0">
                      <button
                        onClick={() => {
                          setUploadModalAttraction(act);
                          setUploadModalDay(act.dayNumber);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-sky-300 hover:border-sky-500 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Add Photo ({actPhotos.length})</span>
                      </button>
                    </div>
                  </div>

                  {actPhotos.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2 items-center">
                      <span className="text-[11px] font-semibold text-slate-500 mr-1">
                        Memories:
                      </span>
                      {actPhotos.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setLightboxPhoto(p)}
                          className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={p.dataUrl}
                            alt={p.caption || 'Photo'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Gallery View */}
      {activeTab === 'gallery' && (
        <div>
          {filteredPhotos.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800">No photos logged yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Capture memories during your circuit and tap "Add Photo" on any attraction in the checklist to save them.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div
                    onClick={() => setLightboxPhoto(photo)}
                    className="relative aspect-4/3 overflow-hidden cursor-pointer bg-slate-900"
                  >
                    <img
                      src={photo.dataUrl}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white">
                      Day {photo.dayNumber}
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Eye className="w-6 h-6 drop-shadow-md" />
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        {photo.attractionName}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 italic leading-snug">
                        "{photo.caption || 'Memory from the trip'}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{new Date(photo.createdAt).toLocaleDateString('en-IN')}</span>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <PhotoUploadModal
        isOpen={uploadModalAttraction !== null}
        onClose={() => setUploadModalAttraction(null)}
        tripId={tripId}
        attraction={uploadModalAttraction}
        dayNumber={uploadModalDay}
        onPhotoSaved={onPhotosUpdated}
      />

      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-3 right-3 p-2 text-white/80 hover:text-white bg-black/50 rounded-full z-10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[75vh] flex items-center justify-center bg-black">
              <img
                src={lightboxPhoto.dataUrl}
                alt={lightboxPhoto.caption}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="p-4 bg-slate-900 text-white space-y-1">
              <div className="text-xs text-sky-400 font-bold uppercase tracking-wider">
                Day {lightboxPhoto.dayNumber} • {lightboxPhoto.attractionName}
              </div>
              <p className="text-sm font-medium text-slate-200">
                {lightboxPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
