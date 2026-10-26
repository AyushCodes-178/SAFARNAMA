import React, { useState } from 'react';
import {
  Compass,
  Calendar,
  Layers,
  PieChart,
  Navigation,
  BookOpen,
  Settings,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({
  activeView,
  setActiveView,
  activeTrip,
  onOpenSettings,
  onOpenBookings
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'plan', label: 'Plan a Trip', icon: Calendar },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'itinerary', label: 'My Itinerary', icon: Calendar },
    { id: 'budget', label: 'Budget & Analytics', icon: PieChart },
    { id: 'map', label: 'Travel Map', icon: Navigation },
    { id: 'journal', label: 'Travel Journal', icon: BookOpen }
  ];

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-sky-700 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-sky-100 transition-colors">
                  SafarNama
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-white/15 text-white">
                  India
                </span>
              </div>
              <p className="text-[10px] text-sky-100 font-medium hidden sm:block">
                Smart Itineraries & Realistic Budgets
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-white text-sky-800 shadow-xs'
                      : 'text-sky-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-700' : 'text-sky-200'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Active Trip Badge */}
            {activeTrip ? (
              <div
                onClick={() => handleNavClick('itinerary')}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium cursor-pointer hover:bg-white/20 transition-colors"
                title="Current active trip"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold max-w-[150px] truncate">{activeTrip.title || activeTrip.destination?.name}</span>
                <span className="text-sky-100">({activeTrip.durationDays}D)</span>
              </div>
            ) : null}

            {/* Booking Links Button */}
            <button
              onClick={onOpenBookings}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-white/30 text-white hover:text-white hover:border-white/50 hover:bg-white/10 flex items-center gap-1.5 transition-colors"
              title="Official Booking Portals (IRCTC, redBus, MakeMyTrip)"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Bookings</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-sky-100 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              title="Settings & AI Key"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden text-white hover:text-white rounded-lg hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sky-600 bg-sky-800 px-4 pt-2 pb-4 space-y-1">
          {activeTrip && (
            <div className="p-3 mb-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white flex items-center justify-between">
              <div>
                <span className="font-bold">Active Trip: </span>
                {activeTrip.destination?.name} ({activeTrip.durationDays} Days)
              </div>
              <button
                onClick={() => handleNavClick('itinerary')}
                className="text-xs font-bold text-emerald-300 underline"
              >
                View
              </button>
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full px-3 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-sky-100 hover:bg-white/10 hover:text-white'
                }`}
              >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-sky-200'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
