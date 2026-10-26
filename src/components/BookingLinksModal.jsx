import React from 'react';
import { X, ExternalLink, ShieldAlert } from 'lucide-react';
import { BOOKING_PROVIDERS, STATE_TOURISM_PROVIDERS } from '../data/bookingProviders';

export default function BookingLinksModal({ isOpen, onClose, destinationName = '' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Travel & Booking Links</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Go directly to transport providers and places to stay for {destinationName || 'your trip'}.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Transparency Disclaimer Banner */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>Official Pricing Note:</strong> SafarNama provides verified direct booking links for your convenience. Ticket prices, berth quotas, seat availability, and hotel tariffs fluctuate in real-time. Please verify exact schedules and terms on the provider's official portal.
            </p>
          </div>

          {/* Primary Providers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {BOOKING_PROVIDERS.map((provider) => (
              <a
                key={provider.id}
                href={provider.id === 'airbnb' && destinationName && !destinationName.includes('➔')
                  ? `https://www.airbnb.com/s/${encodeURIComponent(destinationName)}/homes`
                  : provider.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:shadow-md transition-all bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-sky-100 group-hover:text-sky-700 transition-colors">
                      {provider.badge}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {provider.name}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {provider.description}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-amber-800 font-medium">
                  💡 {provider.tips}
                </div>
              </a>
            ))}
          </div>

          {/* State Tourism & Road Transport Corporations */}
          <div className="pt-2">
            <h4 className="text-sm font-bold text-slate-900 mb-2.5">
              State Road Transport & Official Tourism Portals
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {STATE_TOURISM_PROVIDERS.map((st) => (
                <a
                  key={st.name}
                  href={st.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <span className="font-semibold text-slate-800">{st.state}: </span>
                    <span className="text-slate-600">{st.name}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
