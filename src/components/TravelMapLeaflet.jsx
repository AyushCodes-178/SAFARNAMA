import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Navigation, AlertCircle } from 'lucide-react';

// Fix Leaflet's default icon paths in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const CATEGORY_COLORS = {
  completed: '#2E7D32',
  nature: '#2E7D32',
  adventure: '#4CAF50',
  beaches: '#64B5F6',
  heritage: '#1E88E5',
  food: '#4CAF50',
  culture: '#1E88E5',
  shopping: '#2E7D32',
  'religious tourism': '#1565C0'
};

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

export default function TravelMapLeaflet({
  attractions = [],
  selectedDay = null,
  center = [20.5937, 78.9629],
  zoom = 12,
  legendTitle = 'Sightseeing Sequence',
  legendDescription = 'Numbered pins show suggested itinerary order. Dotted lines indicate sequence.',
  onMapClick,
  onMarkerClick,
  showLegend = true
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const onMapClickRef = useRef(onMapClick);
  const onMarkerClickRef = useRef(onMarkerClick);
  const [hasMapError, setHasMapError] = useState(false);
  onMapClickRef.current = onMapClick;
  onMarkerClickRef.current = onMarkerClick;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      try {
        const map = L.map(mapContainerRef.current, {
          center: center,
          zoom: zoom,
          scrollWheelZoom: true
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        map.on('click', (event) => onMapClickRef.current?.({ lat: event.latlng.lat, lng: event.latlng.lng }));

        const layerGroup = L.layerGroup().addTo(map);
        layerGroupRef.current = layerGroup;
        mapInstanceRef.current = map;
      } catch (err) {
        console.error('Error initializing Leaflet map:', err);
        setHasMapError(true);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers, popups and polyline when attractions change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    const validAttractions = (attractions || []).filter(
      (a) => a.coordinates && typeof a.coordinates.lat === 'number' && typeof a.coordinates.lng === 'number'
    );

    if (validAttractions.length === 0) return;

    const latLngs = [];
    const markers = [];

    validAttractions.forEach((item, index) => {
      const { lat, lng } = item.coordinates;
      latLngs.push([lat, lng]);

      const catColor = CATEGORY_COLORS[item.category] || '#1E88E5';
      const orderNum = index + 1;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${catColor};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            <span style="
              transform: rotate(45deg);
              color: white;
              font-weight: 700;
              font-size: 13px;
              font-family: sans-serif;
            ">${orderNum}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -28]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });
      marker.on('click', () => onMarkerClickRef.current?.(item));
      const googleMapsDirUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; min-width: 220px; max-width: 280px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="
              background: ${catColor}15;
              color: ${catColor};
              font-size: 11px;
              font-weight: 600;
              padding: 2px 8px;
              border-radius: 9999px;
              text-transform: capitalize;
            ">
              ${item.destinationName ? escapeHtml(item.destinationName) + ' • ' : ''}#${orderNum} ${escapeHtml(item.category || 'Sight')}
            </span>
            <span style="font-size: 11px; font-weight: 600; color: #475569;">
              ₹${item.cost || 0} entry
            </span>
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 700; color: #0f172a;">${escapeHtml(item.name)}</h4>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; line-height: 1.4;">${escapeHtml(item.description || '')}</p>
          ${item.tips ? `<p style="margin: 0 0 8px 0; font-size: 11px; color: #d97706; background: #fef3c7; padding: 4px 6px; border-radius: 4px;"><strong>Tip:</strong> ${escapeHtml(item.tips)}</p>` : ''}
          <div style="display: flex; gap: 8px; margin-top: 6px;">
            <a href="${googleMapsDirUrl}" target="_blank" rel="noopener noreferrer" style="
              display: inline-flex;
              align-items: center;
              gap: 4px;
              background: #0f172a;
              color: #ffffff;
              padding: 6px 10px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 600;
              text-decoration: none;
            ">
              Directions ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      markers.push(marker);
      layerGroup.addLayer(marker);
    });

    if (latLngs.length > 1) {
      const polyline = L.polyline(latLngs, {
        color: '#1E88E5',
        weight: 3,
        opacity: 0.8,
        dashArray: '6, 8',
        lineCap: 'round'
      });
      layerGroup.addLayer(polyline);
    }

    try {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    } catch {
      // bounds fit error handled
    }
  }, [attractions, selectedDay]);

  if (hasMapError) {
    return (
      <div className="w-full h-80 sm:h-96 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-10 h-10 text-amber-600 mb-2" />
        <h4 className="font-semibold text-slate-800">Map Tile Notice</h4>
        <p className="text-sm text-slate-600 max-w-md mt-1">
          OpenStreetMap tiles could not be rendered right now. You can still view all attractions with GPS coordinates and open direct Google Maps directions links below.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[450px] sm:h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Legend */}
      {showLegend && <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-md max-w-xs text-xs">
        <div className="font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-sky-600" />
          <span>{legendTitle}</span>
        </div>
        <p className="text-[11px] text-slate-500 mb-2">
          {legendDescription}
        </p>
        <div className="flex flex-wrap gap-2 text-[10px]">
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span> Nature
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span> Heritage
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Adventure
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-700"></span> Culture
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span> Beach
          </span>
        </div>
      </div>}
    </div>
  );
}
