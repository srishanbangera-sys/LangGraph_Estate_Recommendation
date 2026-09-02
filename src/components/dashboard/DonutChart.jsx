import React, { useState } from 'react';

export default function DonutChart({ data = [] }) {
  const [activeItem, setActiveItem] = useState(data[0] || null);

  const total = data.reduce((acc, curr) => acc + curr.count, 0);
  const size = 120;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-slate-700">Lead Sources</h4>
        <span className="text-[10px] text-slate-400 font-medium">*Past 30 days</span>
      </div>

      <div className="relative flex items-center justify-center my-2">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          {data.map((item, idx) => {
            const strokeDasharray = `${(item.count / total) * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedPercent * circumference;
            accumulatedPercent += item.count / total;

            return (
              <circle
                key={item.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="cursor-pointer transition-all duration-300 hover:opacity-80"
                onMouseEnter={() => setActiveItem(item)}
              />
            );
          })}
        </svg>

        {/* Hover Tooltip / Center text */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-xs font-bold text-slate-800">
            {activeItem?.label.split(' ')[0]}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            {activeItem?.count}
          </span>
        </div>
      </div>

      {/* Mini Legend */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 pt-1 border-t border-slate-50">
        {data.map((item) => (
          <div
            key={item.label}
            className="flex items-center space-x-1.5 text-[10px] text-slate-600 cursor-pointer hover:text-slate-900"
            onMouseEnter={() => setActiveItem(item)}
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="truncate">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
