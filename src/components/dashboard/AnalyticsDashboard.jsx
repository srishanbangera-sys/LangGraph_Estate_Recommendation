import React from 'react';
import { LayoutGrid, Sparkles, TrendingUp, Users, ArrowLeft, Building2 } from 'lucide-react';
import GaugeChart from './GaugeChart';
import FunnelChart from './FunnelChart';
import DonutChart from './DonutChart';
import ActionCenter from './ActionCenter';
import TaskChecklist from './TaskChecklist';
import { ANALYTICS_METRICS } from '../../data/mockAnalytics';

export default function AnalyticsDashboard({ onBackToFeed }) {
  const {
    activityGauge,
    subscribedGauge,
    pipelineFunnel,
    leadSources,
    actionCenter,
    tasksThisWeek
  } = ANALYTICS_METRICS;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden select-none">
      {/* Top Header */}
      <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-white/95 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToFeed}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Feed</span>
          </button>
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-bold text-slate-800">Market Intelligence & Analytics</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
            ● Live Sync
          </span>
        </div>
      </div>

      {/* Dashboard Grid Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* Top Metric Cards / Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GaugeChart
            percentage={activityGauge.percentage}
            label={activityGauge.label}
            period={activityGauge.period}
            color={activityGauge.color}
            gradientId="gauge-act"
          />
          <GaugeChart
            percentage={subscribedGauge.percentage}
            label={subscribedGauge.label}
            period={subscribedGauge.period}
            color={subscribedGauge.color}
            gradientId="gauge-sub"
          />
        </div>

        {/* Middle Section: Funnel & Donut Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FunnelChart stages={pipelineFunnel} />
          <DonutChart data={leadSources} />
        </div>

        {/* Bottom Section: Action Center & Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionCenter actionCenterData={actionCenter} />
          <TaskChecklist initialTasks={tasksThisWeek} />
        </div>
      </div>
    </div>
  );
}
