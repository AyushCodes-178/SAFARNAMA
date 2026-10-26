import React, { useState } from 'react';
import { X, ShieldCheck, Cpu, CheckCircle2 } from 'lucide-react';
import { storageService } from '../services/storageService';

export default function SettingsModal({ isOpen, onClose, onSettingsUpdated }) {
  const currentSettings = storageService.getSettings();
  const [geminiApiKey, setGeminiApiKey] = useState(currentSettings.geminiApiKey || '');
  const [model, setModel] = useState(currentSettings.model || 'gemini-1.5-flash');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const current = storageService.getSettings();
    storageService.saveSettings({
      ...current,
      geminiApiKey: geminiApiKey.trim(),
      model
    });
    setSavedSuccess(true);
    if (onSettingsUpdated) onSettingsUpdated();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleClearApiKey = () => {
    setGeminiApiKey('');
    const current = storageService.getSettings();
    storageService.saveSettings({ ...current, geminiApiKey: '' });
    if (onSettingsUpdated) onSettingsUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Application Settings</h3>
              <p className="text-xs text-slate-500">Configure AI destination intelligence & preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-sm">
          {/* AI Configuration Section */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Optional Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs font-mono"
              />
              {geminiApiKey && (
                <button
                  type="button"
                  onClick={handleClearApiKey}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-rose-600 px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <label className="text-xs font-medium text-slate-600">AI Model:</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast & Light)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep reasoning)</option>
              </select>
            </div>

            {/* Explanatory note */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Secret Exposure & Offline Fallback</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                If no API key is provided, SafarNama runs its built-in deterministic Indian travel rule engine with 100% functionality. Any key you provide is stored only locally in your browser and used solely for personalized ranking insights.
              </p>
            </div>
          </div>

          {/* Local Storage Indicator */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Storage persistence:</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              localStorage & IndexedDB Active
            </span>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Settings saved!
              </span>
            ) : <span />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors shadow-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
