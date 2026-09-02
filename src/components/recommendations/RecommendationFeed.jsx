import React, { useState } from 'react';
import { Map, LayoutGrid, ChevronRight, MapPin, Sparkles, SlidersHorizontal, BarChart3 } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { CATEGORIES } from '../../data/mockProperties';

export default function RecommendationFeed({
  properties = [],
  savedPropertyIds = new Set(),
  onToggleSave,
  onSelectProperty,
  onToggleDashboard,
  rightPanelMode,
}) {
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');

  // Categorize properties
  const forYouProps = properties.filter(p => p.category === 'For you in United Kingdom' || p.category === 'all-uk');
  const houseProps = properties.filter(p => p.category === 'House');
  const apartmentProps = properties.filter(p => p.category === 'Apartments');

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden select-none">
      {/* Top Header matching reference */}
      <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-white/90 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-slate-800 flex items-center">
            For you in <MapPin className="w-3.5 h-3.5 mx-1 text-slate-500 inline" /> <span className="font-extrabold ml-0.5">United kingdom</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Map Button */}
          <button
            onClick={() => setShowMapModal(!showMapModal)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/70 rounded-xl transition-colors shadow-xs"
          >
            <Map className="w-3.5 h-3.5 text-slate-600" />
            <span>Map</span>
          </button>

          {/* Toggle Analytics / Feed Button */}
          <button
            onClick={onToggleDashboard}
            className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              rightPanelMode === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/70'
            }`}
            title="Toggle Analytics Dashboard"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Insights</span>
          </button>
        </div>
      </div>

      {/* Categories Scrollable Feed */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Category 1: For you in United Kingdom */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center space-x-1.5">
              <span>For you in</span>
              <span className="text-indigo-600 font-extrabold flex items-center">
                <MapPin className="w-3.5 h-3.5 ml-1 mr-0.5" /> United kingdom
              </span>
            </h2>
            <button className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors">
              See all
            </button>
          </div>

          <div className="flex space-x-3.5 overflow-x-auto pb-2 no-scrollbar">
            {forYouProps.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isSaved={savedPropertyIds.has(property.id)}
                onToggleSave={onToggleSave}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        </section>

        {/* Category 2: House */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              House
            </h2>
            <button className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors">
              See all
            </button>
          </div>

          <div className="flex space-x-3.5 overflow-x-auto pb-2 no-scrollbar">
            {houseProps.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isSaved={savedPropertyIds.has(property.id)}
                onToggleSave={onToggleSave}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        </section>

        {/* Category 3: Apartments */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              Apartments
            </h2>
            <button className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors">
              See all
            </button>
          </div>

          <div className="flex space-x-3.5 overflow-x-auto pb-2 no-scrollbar">
            {apartmentProps.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isSaved={savedPropertyIds.has(property.id)}
                onToggleSave={onToggleSave}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Simulated Map View Drawer / Modal */}
      {showMapModal && (
        <div className="absolute inset-x-0 bottom-0 top-16 bg-white z-20 flex flex-col p-6 animate-in slide-in-from-bottom duration-300 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Map className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Interactive UK Map Explorer</h3>
            </div>
            <button
              onClick={() => setShowMapModal(false)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Back to Grid
            </button>
          </div>
          <div className="flex-1 bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center p-4">
            {/* Map styling mock */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 text-center space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-indigo-500/30 text-indigo-300 rounded-full text-xs border border-indigo-500/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>9 Matched Properties across UK</span>
              </div>
              <p className="text-white text-xs max-w-xs">
                London (1), Manchester (1), Edinburgh (1), Glasgow (1), Liverpool (1), Bristol (1), Newcastle (1), Birmingham (1)
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['London', 'Manchester', 'Edinburgh', 'Bristol'].map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      const prop = properties.find(p => p.location.includes(city));
                      if (prop) onSelectProperty(prop);
                    }}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium border border-white/10"
                  >
                    📍 {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
