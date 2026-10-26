import React, { useEffect, useState } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { INTEREST_CATEGORIES } from '../data/destinationsData';

export default function AddActivityModal({
  isOpen,
  onClose,
  dayNumber,
  destinationCoordinates,
  onAddActivity,
  initialActivity = null
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('heritage');
  const [cost, setCost] = useState('0');
  const [durationMinutes, setDurationMinutes] = useState('90');
  const [timeSlot, setTimeSlot] = useState('02:00 PM – 03:30 PM');
  const [tips, setTips] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setName(initialActivity?.name || '');
    setDescription(initialActivity?.description || '');
    setCategory(initialActivity?.category || 'heritage');
    setCost(String(initialActivity?.cost ?? 0));
    setDurationMinutes(String(initialActivity?.durationMinutes ?? 90));
    setTimeSlot(initialActivity?.timeSlot || '02:00 PM – 03:30 PM');
    setTips(initialActivity?.tips || '');
  }, [isOpen, initialActivity]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newActivity = {
      ...initialActivity,
      id: initialActivity?.id || `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Custom added sight or stop.',
      category,
      cost: Math.max(0, Number(cost) || 0),
      durationMinutes: Number(durationMinutes) || 90,
      timeSlot,
      slotLabel: initialActivity?.slotLabel || 'Custom Plan',
      travelTime: initialActivity?.travelTime || 'User scheduled stop',
      transitMinutes: initialActivity?.transitMinutes || 15,
      coordinates: initialActivity?.coordinates || (destinationCoordinates ? {
        lat: destinationCoordinates.lat + (Math.random() - 0.5) * 0.04,
        lng: destinationCoordinates.lng + (Math.random() - 0.5) * 0.04
      } : { lat: 12.9716, lng: 77.5946 }),
      tips: tips.trim() || 'Carry water and cash for local fees.',
      completed: initialActivity?.completed || false
    };

    onAddActivity(dayNumber, newActivity);
    setName('');
    setDescription('');
    setCost('0');
    setTips('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">
              D{dayNumber}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{initialActivity ? 'Edit activity' : `Add Activity to Day ${dayNumber}`}</h3>
              <p className="text-xs text-slate-500">{initialActivity ? 'Update the details for this stop' : 'Insert custom sight, dining stop, or adventure activity'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Place / Activity Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Local Cafe Crawl, Sunrise Point, Boat Ride"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm capitalize"
              >
                {INTEREST_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Cost (₹ per person)
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Suggested Time Slot
              </label>
              <input
                type="text"
                placeholder="e.g. 03:00 PM – 05:00 PM"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="15"
                step="15"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Notes
            </label>
            <textarea
              rows="2"
              placeholder="What makes this place special? Any specific dishes to try or photography spots?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Helpful Travel Tip (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Carry sunglasses, best visited at sunset"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors shadow-sm flex items-center gap-1.5"
            >
              {initialActivity ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {initialActivity ? 'Save changes' : `Add to Day ${dayNumber}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
