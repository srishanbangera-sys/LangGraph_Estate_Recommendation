import React from 'react';
import { Waves, Flower2, Home, Globe } from 'lucide-react';

const iconMap = {
  Waves: Waves,
  Flower2: Flower2,
  Home: Home,
  Globe: Globe,
};

export default function PromptCard({ item, onClick }) {
  const IconComponent = iconMap[item.icon] || Home;

  return (
    <button
      onClick={() => onClick(item.prompt)}
      className="flex flex-col items-start justify-between p-5 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-slate-100 hover:border-slate-200/80 rounded-2xl text-left transition-all duration-200 group shadow-sm hover:shadow active:scale-[0.99] min-h-[110px]"
    >
      <div className="text-slate-700 group-hover:text-indigo-600 transition-colors">
        <IconComponent className="w-5 h-5 stroke-[1.8]" />
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
          {item.title}
        </h4>
      </div>
    </button>
  );
}
