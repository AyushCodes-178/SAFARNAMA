import React, { useState, useRef } from 'react';
import { X, Upload, Trash2, Camera, ShieldCheck, Check } from 'lucide-react';
import { indexedDbService } from '../services/indexedDbService';

export default function PhotoUploadModal({
  isOpen,
  onClose,
  tripId,
  attraction,
  dayNumber,
  onPhotoSaved
}) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen || !attraction) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImages((prev) => [
          ...prev,
          {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            dataUrl: event.target.result,
            fileName: file.name,
            fileSize: Math.round(file.size / 1024) + ' KB'
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeSelectedImage = (id) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (selectedImages.length === 0) return;

    setIsSaving(true);
    try {
      for (const img of selectedImages) {
        const photoEntry = {
          id: img.id,
          tripId: tripId || 'default-trip',
          attractionId: attraction.id,
          attractionName: attraction.name,
          dayNumber: dayNumber || 1,
          category: attraction.category || 'general',
          dataUrl: img.dataUrl,
          caption: caption.trim() || `Memories from ${attraction.name}`,
          createdAt: new Date().toISOString()
        };
        await indexedDbService.savePhoto(photoEntry);
      }

      if (onPhotoSaved) onPhotoSaved();
      setSelectedImages([]);
      setCaption('');
      onClose();
    } catch (err) {
      console.error('Failed to save photos to IndexedDB', err);
      alert('Could not save photo to local database. Please try a smaller image.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add Memories & Photos</h3>
              <p className="text-xs text-slate-500 truncate max-w-xs">{attraction.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-sm">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="hidden"
          />

          {/* Upload Drop Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-sky-200 hover:border-sky-500 hover:bg-sky-50/50 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
          >
            <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <p className="font-semibold text-slate-800 text-sm">
              Click to select travel photos
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports JPG, PNG, WEBP. Stored securely in your browser's IndexedDB.
            </p>
          </div>

          {/* Selected Previews */}
          {selectedImages.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Selected Photos ({selectedImages.length})
              </label>
              <div className="grid grid-cols-3 gap-2">
                {selectedImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative rounded-xl overflow-hidden aspect-square border border-slate-200 group"
                  >
                    <img
                      src={img.dataUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeSelectedImage(img.id)}
                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Caption Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Caption / Journal Note
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Magnificent morning light at the ghats, delicious masala chai nearby..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm resize-none"
            />
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Local Browser Storage:</strong> All uploaded photos and journal notes are preserved safely inside your browser's local IndexedDB. They are never transmitted to external servers without your permission.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedImages.length === 0 || isSaving}
              className="px-5 py-2 text-xs font-semibold bg-sky-600 disabled:bg-slate-300 text-white rounded-xl hover:bg-sky-700 transition-colors shadow-sm flex items-center gap-1.5"
            >
              {isSaving ? 'Saving to Database...' : <><Check className="w-4 h-4" /> Save {selectedImages.length} Photo{selectedImages.length > 1 ? 's' : ''}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
