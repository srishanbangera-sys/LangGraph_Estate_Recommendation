import React from 'react';

export default function FunnelChart({ stages = [] }) {
  // SVG Inverted Funnel Geometry
  // 5 stacked trapezoid segments narrowing down to bottom point
  const heights = [32, 28, 24, 22, 20];
  const topWidths = [180, 150, 120, 90, 60];
  const bottomWidths = [150, 120, 90, 60, 30];

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-slate-700">Pipeline Status</h4>
        <span className="text-[10px] text-slate-400 font-medium">350 Total Leads</span>
      </div>

      <div className="flex flex-col items-center justify-center my-auto space-y-1 py-1">
        {stages.map((stage, idx) => {
          // Dynamic width calculation for pure CSS responsive trapezoid/funnel
          const widthPercent = 100 - (idx * 16);
          return (
            <div
              key={stage.stage}
              className="flex items-center justify-center text-white text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow-xs transition-all duration-300 hover:brightness-105 cursor-pointer"
              style={{
                backgroundColor: stage.color,
                width: `${widthPercent}%`,
                minWidth: '100px'
              }}
              title={`${stage.stage}: ${stage.count}`}
            >
              <span className="truncate">{stage.stage}: {stage.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
