import React from 'react';
import { Phone, Mail, Edit3, CheckCircle2 } from 'lucide-react';

export default function ActionCenter({ actionCenterData }) {
  const { past7Days, today } = actionCenterData;

  const getTodayIcon = (index) => {
    if (index === 0) return Phone;
    if (index === 1) return Mail;
    return Edit3;
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
      <h4 className="text-xs font-bold text-slate-700 mb-3">Action Center</h4>

      <div className="grid grid-cols-2 gap-4">
        {/* PAST 7 DAYS Column */}
        <div className="flex flex-col space-y-2.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PAST 7 DAYS</span>
          {past7Days.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs"
                style={{ backgroundColor: item.color }}
              >
                {item.count}
              </div>
              <span className="text-xs text-slate-600 font-medium leading-tight">{item.label}</span>
            </div>
          ))}
        </div>

        {/* TODAY Column */}
        <div className="flex flex-col space-y-2.5 border-l border-slate-100 pl-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TODAY</span>
          {today.map((item, idx) => {
            const IconComponent = getTodayIcon(idx);
            return (
              <div key={item.id} className="flex items-start space-x-2 group cursor-pointer">
                <IconComponent className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-slate-700 group-hover:text-indigo-600 font-medium leading-tight transition-colors">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
