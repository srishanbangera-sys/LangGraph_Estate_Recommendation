import React, { useState } from 'react';
import { Map, LayoutGrid, ChevronRight, MapPin, Sparkles, SlidersHorizontal, BarChart3, X, Filter } from 'lucide-react';
import PropertyCard from './PropertyCard';
import PropertyMap from '../map/PropertyMap';

export default function RecommendationFeed({
  properties = [],
  savedPropertyIds = new Set(),
  activeFilters = {},
  onClearFilter,
  onClearAllFilters,
  onToggleSave,
  onSelectProperty,
  onToggleDashboard,
  rightPanelMode,
  currentLocation = null,
  onMapMove = null,
}) {
  const [showMapModal, setShowMapModal] = useState(false);

  // Active location text
  const currentRegion = activeFilters.location || 'Mangalore & Prime Hubs';

  // Dynamic filter lists
  const forYouProps = properties.slice(0, 5);
  const houseProps = properties.filter(p => (p.type || '').toLowerCase().includes('house') || (p.type || '').toLowerCase().includes('villa'));
  const apartmentProps = properties.filter(p => (p.type || '').toLowerCase().includes('apartment') || (p.type || '').toLowerCase().includes('flat'));

  const hasActiveFilters = Object.values(activeFilters).some(Boolean);

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden select-none relative">
      {/* Top Header */}
      <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-white/95 backdrop-blur-md z-10">
        <div className="flex items-center space-x-2 truncate">
          <span className="text-sm font-bold text-slate-800 flex items-center truncate">
            For you in <MapPin className="w-3.5 h-3.5 mx-1 text-indigo-600 inline shrink-0" />
            <span className="font-extrabold ml-0.5 truncate">{currentRegion}</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* Map View Toggle Button */}
          <button
            onClick={() => setShowMapModal(!showMapModal)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-2xs ${
              showMapModal
                ? 'bg-indigo-600 text-white shadow-indigo-200'
                : 'text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/70'
            }`}
            title="Toggle Interactive Property Map"
          >
            <Map className="w-3.5 h-3.5" />
            <span>{showMapModal ? 'Cards' : 'Map'}</span>
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

      {/* Conversational Filter Pills Bar */}
      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 px-6 bg-indigo-50/40 border-b border-indigo-100/60 no-scrollbar shrink-0">
          <div className="flex items-center text-[10px] font-bold text-indigo-700 uppercase tracking-wider mr-1 shrink-0">
            <Filter className="w-3 h-3 mr-1" /> Filters:
          </div>

          {activeFilters.location && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200 shadow-2xs shrink-0">
              📍 {activeFilters.location}
              <button onClick={() => onClearFilter?.('location')} className="hover:text-rose-600 ml-0.5 font-bold">×</button>
            </span>
          )}

          {activeFilters.bhk && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200 shadow-2xs shrink-0">
              🛏️ {activeFilters.bhk} BHK
              <button onClick={() => onClearFilter?.('bhk')} className="hover:text-rose-600 ml-0.5 font-bold">×</button>
            </span>
          )}

          {activeFilters.propertyType && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200 shadow-2xs shrink-0">
              🏡 {activeFilters.propertyType}
              <button onClick={() => onClearFilter?.('propertyType')} className="hover:text-rose-600 ml-0.5 font-bold">×</button>
            </span>
          )}

          {activeFilters.listingType && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200 shadow-2xs shrink-0">
              🏷️ {activeFilters.listingType}
              <button onClick={() => onClearFilter?.('listingType')} className="hover:text-rose-600 ml-0.5 font-bold">×</button>
            </span>
          )}

          {activeFilters.maxBudget && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200 shadow-2xs shrink-0">
              💰 ≤ ₹{(activeFilters.maxBudget / (activeFilters.maxBudget >= 10000000 ? 10000000 : 1000)).toFixed(1)}{activeFilters.maxBudget >= 10000000 ? 'Cr' : 'k'}
              <button onClick={() => onClearFilter?.('maxBudget')} className="hover:text-rose-600 ml-0.5 font-bold">×</button>
            </span>
          )}

          <button 
            onClick={onClearAllFilters} 
            className="text-[11px] text-indigo-600 hover:text-indigo-900 font-semibold underline ml-auto shrink-0 pl-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main View: Interactive Map Mode OR Card Feed */}
      {showMapModal ? (
        <div className="flex-1 flex flex-col p-4 overflow-hidden relative">
          <div className="flex-1 rounded-2xl overflow-hidden shadow-inner border border-slate-200">
            <PropertyMap
              properties={properties}
              onSelectProperty={onSelectProperty}
              currentLocation={currentLocation}
              onMapMove={onMapMove}
              className="w-full h-full"
            />
          </div>
        </div>
      ) : (
        /* Categories Scrollable Feed */
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Dynamic "For You" Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center space-x-1.5">
                <span>Tailored Recommendations</span>
                <span className="text-xs text-slate-400 font-medium">({forYouProps.length})</span>
              </h2>
              {hasActiveFilters && (
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Filtered
                </span>
              )}
            </div>

            {forYouProps.length > 0 ? (
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
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
                <p className="text-xs font-semibold text-slate-600">No properties match your exact filters.</p>
                <button
                  onClick={onClearAllFilters}
                  className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
                >
                  Reset Active Filters
                </button>
              </div>
            )}
          </section>

          {/* Category 2: Houses & Villas */}
          {houseProps.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                  Houses & Villas
                </h2>
                <span className="text-xs text-slate-400 font-medium">({houseProps.length})</span>
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
          )}

          {/* Category 3: Apartments */}
          {apartmentProps.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                  Modern Apartments
                </h2>
                <span className="text-xs text-slate-400 font-medium">({apartmentProps.length})</span>
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
          )}
        </div>
      )}
    </div>
  );
}
