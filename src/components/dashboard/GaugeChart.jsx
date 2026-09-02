import React from 'react';

export default function GaugeChart({
  percentage = 35,
  label = '% with Activity',
  period = '*Past 30 days',
  color = '#a855f7',
  gradientId = 'gauge-grad-1'
}) {
  const radius = 68;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Gauge ticks along 180 degrees
  const ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-slate-700">{label}</h4>
        {period && <span className="text-[10px] text-slate-400 font-medium">{period}</span>}
      </div>

      {/* SVG Arc Meter */}
      <div className="relative flex flex-col items-center justify-center my-1">
        <svg viewBox="0 0 180 110" className="w-full max-w-[170px] overflow-visible">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color === '#a855f7' ? '#c084fc' : '#22d3ee'} />
            </linearGradient>
          </defs>

          {/* Background track arc */}
          <path
            d="M 20 95 A 70 70 0 0 1 160 95"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active progress arc */}
          <path
            d="M 20 95 A 70 70 0 0 1 160 95"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />

          {/* Numbers around the gauge */}
          {ticks.map((val) => {
            const angle = (val / 100) * Math.PI; // 0 to PI
            const tickR = radius + 15;
            const x = 90 - tickR * Math.cos(angle);
            const y = 95 - tickR * Math.sin(angle);
            if (val % 20 !== 0 && val !== 50) return null; // Show 0, 20, 40, 50, 60, 80, 100 for clean spacing
            return (
              <text
                key={val}
                x={x}
                y={y}
                textAnchor="middle"
                fontSize="7"
                fill="#94a3b8"
                fontWeight="500"
              >
                {val}
              </text>
            );
          })}
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-xl font-extrabold text-slate-800 tracking-tight">{percentage}%</span>
        </div>
      </div>
    </div>
  );
}
