import React, { useState } from 'react';
import { Heart, MapPin, Sparkles } from 'lucide-react';

export default function PropertyCard({
  property,
  isSaved = false,
  onToggleSave,
  onSelect,
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onSelect?.(property)}
      className="group relative flex-none w-[160px] sm:w-[170px] h-[190px] sm:h-[200px] rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Property Image with Gradient Overlay */}
      <img
        src={imgError ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' : property.image}
        alt={property.title}
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgError(true)}
        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
          imgLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Loading Skeleton */}
      {!imgLoaded && !imgError && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
      )}

      {/* Dark gradient overlay for clean text contrast matching Image 1 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

      {/* Top badges & Save button */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
        {property.aiMatchScore && property.aiMatchScore >= 95 ? (
          <span className="flex items-center space-x-1 px-2 py-0.5 bg-black/40 backdrop-blur-md text-[10px] font-semibold text-emerald-300 rounded-full border border-emerald-400/30">
            <Sparkles className="w-2.5 h-2.5" />
            <span>{property.aiMatchScore}% Match</span>
          </span>
        ) : <span />}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave?.(property.id);
          }}
          className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            isSaved
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-black/30 hover:bg-black/50 text-white/90 hover:text-white'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save property'}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Bottom Text Content: Title & Location */}
      <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
        <h3 className="font-bold text-sm tracking-tight leading-snug drop-shadow-sm truncate">
          {property.title}
        </h3>
        <p className="text-xs text-slate-200 font-normal drop-shadow-sm flex items-center mt-0.5 truncate">
          <span>{property.location}</span>
        </p>
      </div>
    </div>
  );
}
