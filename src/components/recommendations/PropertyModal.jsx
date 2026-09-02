import React from 'react';
import { X, MapPin, Bed, Bath, Maximize2, Sparkles, Heart, MessageSquare, Check } from 'lucide-react';

export default function PropertyModal({
  property,
  onClose,
  isSaved,
  onToggleSave,
  onAskAI
}) {
  if (!property) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image with Badges */}
        <div className="relative h-60 w-full shrink-0 bg-slate-100">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          
          {/* Close & Save Buttons */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleSave(property.id)}
            className={`absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
              isSaved ? 'bg-rose-500 text-white' : 'bg-black/40 hover:bg-black/60 text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          {/* Bottom Title in Banner */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <span className="px-2 py-0.5 bg-indigo-500/80 backdrop-blur-md rounded-md text-[11px] font-semibold tracking-wide uppercase mb-1 inline-block">
              {property.type || property.category}
            </span>
            <h2 className="text-xl font-bold">{property.title}</h2>
            <p className="text-xs text-slate-200 flex items-center mt-0.5">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-300" />
              {property.location}, {property.country}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Key Specs Row */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <span className="text-xs text-slate-400 font-medium">Asking Price</span>
              <p className="text-lg font-bold text-slate-900">{property.priceFormatted}</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center space-x-1 text-slate-700">
              <Bed className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold">{property.beds}</span>
              <span className="text-xs text-slate-400">Beds</span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center space-x-1 text-slate-700">
              <Bath className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold">{property.baths}</span>
              <span className="text-xs text-slate-400">Baths</span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center space-x-1 text-slate-700">
              <Maximize2 className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold">{property.sqft}</span>
            </div>
          </div>

          {/* AI Match Insights */}
          <div className="p-3.5 bg-gradient-to-r from-indigo-50/80 to-purple-50/60 rounded-2xl border border-indigo-100">
            <div className="flex items-center space-x-2 text-indigo-700 mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Intelligence Match: {property.aiMatchScore}%</span>
            </div>
            <p className="text-xs text-indigo-950 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Tags */}
          {property.tags && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Highlights</h4>
              <div className="flex flex-wrap gap-1.5">
                {property.tags.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {property.amenities && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Amenities</h4>
              <div className="grid grid-cols-2 gap-2">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center space-x-3">
          <button
            onClick={() => {
              onAskAI(`Tell me more details about ${property.title} in ${property.location} and suggest similar alternatives.`);
              onClose();
            }}
            className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask AI about {property.title}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
