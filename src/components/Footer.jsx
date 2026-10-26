import React from 'react';
import { Compass, Heart, Shield, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-bold text-base tracking-tight">SafarNama</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              India's smart, realistic travel planner. Helping wanderers discover incredible Bharat with authentic day-wise itineraries, verified coordinates, transparent budgets, and local memories.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs">Essential Portals</h4>
            <ul className="space-y-1.5">
              <li>
                <a href="https://www.irctc.co.in/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 flex items-center gap-1 transition-colors">
                  IRCTC Indian Railways <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.redbus.in/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 flex items-center gap-1 transition-colors">
                  redBus Online Buses <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.makemytrip.com/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 flex items-center gap-1 transition-colors">
                  MakeMyTrip Flights & Stays <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.airbnb.com/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 flex items-center gap-1 transition-colors">
                  Airbnb Stays <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.booking.com/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 flex items-center gap-1 transition-colors">
                  Booking.com Stays <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs">Responsible Travel Tips</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              • Respect sacred temple traditions (remove footwear & dress modestly).<br />
              • Carry an authorized photo ID (Aadhaar or Passport) for state checkposts & ASI monuments.<br />
              • Keep UPI and loose cash handy for street food and auto rickshaws.<br />
              • Protect nature: avoid single-use plastics in fragile hill stations and beaches.
            </p>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs">Disclaimer & Reliability</h4>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-[11px] text-slate-300 leading-relaxed">
              <Shield className="w-4 h-4 text-sky-400 inline mr-1" />
              Schedules, ticket prices, and travel times are realistic estimates based on verified Indian tourist data. Always confirm real-time schedules on official railway, bus, and state portals before final departures.
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-3">
          <div>
            &copy; {currentYear} SafarNama. Designed for seamless Indian travel experiences.
          </div>
          <div className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for travellers across India.
          </div>
        </div>
      </div>
    </footer>
  );
}
