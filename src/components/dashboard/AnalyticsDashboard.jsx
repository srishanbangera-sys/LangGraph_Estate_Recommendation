import React from 'react';
import { LayoutGrid, Sparkles, TrendingUp, Users, ArrowLeft, Building2, Zap, DollarSign } from 'lucide-react';
import GaugeChart from './GaugeChart';
import FunnelChart from './FunnelChart';
import DonutChart from './DonutChart';
import ActionCenter from './ActionCenter';
import TaskChecklist from './TaskChecklist';
import { ANALYTICS_METRICS } from '../../data/mockAnalytics';

export default function AnalyticsDashboard({ onBackToFeed, insightsMetrics }) {
  // Use dynamically calculated telemetry from chat & properties if available, fallback to mock
  const activityGauge = insightsMetrics?.activityGauge || ANALYTICS_METRICS.activityGauge;
  const subscribedGauge = insightsMetrics?.subscribedGauge || ANALYTICS_METRICS.subscribedGauge;
  const pipelineFunnel = insightsMetrics?.pipelineFunnel || ANALYTICS_METRICS.pipelineFunnel;
  const leadSources = insightsMetrics?.leadSources || ANALYTICS_METRICS.leadSources;
  const pricing = insightsMetrics?.pricing;
  const commentary = insightsMetrics?.commentary || "Live market telemetry initialized. Awaiting user property criteria.";
  const { actionCenter, tasksThisWeek } = ANALYTICS_METRICS;

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
            <span className="text-sm font-bold text-slate-800">Reactive Market Intelligence</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Auto-Sync
          </span>
        </div>
      </div>

      {/* Dashboard Grid Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* Dynamic Strategic Commentary Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start space-x-3 relative z-10">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/10">
              <Zap className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span>AI Conversational Telemetry</span>
                <span className="px-1.5 py-0.2 text-[9px] bg-white/15 text-white rounded">Live</span>
              </div>
              <p className="text-xs text-slate-100 leading-relaxed font-normal">
                {commentary}
              </p>
              {pricing && (
                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-indigo-300 text-[10px] block">Avg Match Price</span>
                    <span className="font-bold text-white">{pricing.average}</span>
                  </div>
                  <div>
                    <span className="text-indigo-300 text-[10px] block">Price Band</span>
                    <span className="font-bold text-white">{pricing.min} - {pricing.max}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

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
