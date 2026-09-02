import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getPropertyCoordinates, getPropertyImage } from '../../utils/imageHelper';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

// Mangalore, India Coordinates
const DEFAULT_CENTER = [12.9141, 74.8560];
const DEFAULT_ZOOM = 13;

export default function PropertyMap({ 
  properties = [], 
  onSelectProperty,
  currentLocation = null,
  onMapMove = null,
  className = "w-full h-full min-h-[350px]"
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const isMovingFromRemote = useRef(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Map with touch gestures optimized
    const initialCenter = currentLocation ? [currentLocation.lat, currentLocation.lng] : DEFAULT_CENTER;
    const initialZoom = currentLocation ? currentLocation.zoom : DEFAULT_ZOOM;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
      attributionControl: false,
      tap: true,
      touchZoom: true,
      dragging: true,
      bounceAtZoomLimits: false
    });

    // Add CartoDB Positron clean tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Group layer for markers
    const markersLayer = L.featureGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Listen for local map moves to synchronize across devices
    map.on('moveend', () => {
      if (isMovingFromRemote.current) return;
      if (onMapMove) {
        const center = map.getCenter();
        const zoom = map.getZoom();
        onMapMove({ lat: center.lat, lng: center.lng, zoom });
      }
    });

    // Invalidate map size to handle responsive container / sidebar resizing
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Synchronize remote map movements from other devices
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !currentLocation) return;

    const cur = map.getCenter();
    const curZoom = map.getZoom();
    const dist = Math.abs(cur.lat - currentLocation.lat) + Math.abs(cur.lng - currentLocation.lng);
    
    if (dist > 0.005 || curZoom !== currentLocation.zoom) {
      isMovingFromRemote.current = true;
      map.setView([currentLocation.lat, currentLocation.lng], currentLocation.zoom, { animate: true });
      setTimeout(() => {
        isMovingFromRemote.current = false;
      }, 500);
    }
  }, [currentLocation]);

  // Update Markers whenever filtered properties change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    const bounds = L.latLngBounds();
    let hasCoords = false;

    properties.forEach((property, index) => {
      const coords = getPropertyCoordinates(property, index);
      const latLng = [coords.lat, coords.lng];
      bounds.extend(latLng);
      hasCoords = true;

      const priceLabel = property.priceFormatted || (property.price > 100000 ? `₹${(property.price / 10000000).toFixed(2)} Cr` : `₹${property.price}/mo`);
      const imageUrl = getPropertyImage(property, index);

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-property-pin',
        html: `
          <div style="
            background: #0f172a; 
            color: #ffffff; 
            padding: 4px 8px; 
            border-radius: 20px; 
            font-size: 11px; 
            font-weight: 700; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.25); 
            border: 2px solid #6366f1; 
            display: inline-flex; 
            align-items: center; 
            gap: 4px;
            white-space: nowrap;
            cursor: pointer;
            transform: translate(-50%, -50%);
            transition: all 0.2s ease;
          ">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#22c55e;"></span>
            <span>${priceLabel}</span>
          </div>
        `,
        iconSize: [80, 24],
        iconAnchor: [40, 12]
      });

      const marker = L.marker(latLng, { icon: customIcon });

      // Popup Content
      const popupHtml = `
        <div style="width: 220px; font-family: system-ui, sans-serif; padding: 2px;">
          <img src="${imageUrl}" alt="${property.title}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin-bottom: 2px;">${property.title}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">📍 ${property.location || 'Mangalore'}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: 800; color: #4f46e5; font-size: 13px;">${priceLabel}</span>
            <span style="font-size: 10px; background: #e0e7ff; color: #4338ca; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${property.beds || 3} BHK</span>
          </div>
          <button id="view-prop-btn-${property.id}" style="
            width: 100%; 
            background: #4f46e5; 
            color: #fff; 
            border: none; 
            padding: 6px 10px; 
            border-radius: 6px; 
            font-size: 11px; 
            font-weight: 600; 
            cursor: pointer;
          ">
            View Property Details
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 240, className: 'property-leaflet-popup' });

      marker.on('popupopen', () => {
        setTimeout(() => {
          const btn = document.getElementById(`view-prop-btn-${property.id}`);
          if (btn && onSelectProperty) {
            btn.onclick = () => {
              onSelectProperty(property);
              marker.closePopup();
            };
          }
        }, 50);
      });

      markersLayer.addLayer(marker);
    });

    // Auto-fit Bounds to strictly mirror filtered properties
    if (hasCoords && properties.length > 0 && !currentLocation) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
        animate: true,
        duration: 0.8
      });
    }
  }, [properties, onSelectProperty]);

  const handleResetToMangalore = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true });
      if (onMapMove) {
        onMapMove({ lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1], zoom: DEFAULT_ZOOM });
      }
    }
  };

  return (
    <div 
      style={{ isolation: 'isolate' }}
      className={`relative rounded-2xl overflow-hidden shadow-inner border border-slate-200 touch-pan-x touch-pan-y ${className}`}
    >
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px]" />

      {/* Floating Center Badge */}
      <div className="absolute top-3 left-3 z-[500] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-100 flex items-center space-x-2">
        <MapPin className="w-3.5 h-3.5 text-indigo-600" />
        <span className="text-xs font-bold text-slate-800">Mangalore, India</span>
        <span className="text-[10px] text-slate-400 font-medium">({properties.length} mapped)</span>
      </div>

      {/* Recenter Button */}
      <button
        onClick={handleResetToMangalore}
        title="Recenter Map to Mangalore"
        className="absolute bottom-3 right-3 z-[500] bg-white hover:bg-slate-50 text-slate-700 p-2 rounded-xl shadow-md border border-slate-100 transition-all"
      >
        <Navigation className="w-4 h-4 text-indigo-600" />
      </button>
    </div>
  );
}
