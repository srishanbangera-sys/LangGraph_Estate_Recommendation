import React from 'react';
import { LayoutGrid, Sparkles, TrendingUp, Users, ArrowLeft, Building2, Zap, DollarSign, MapPin, PieChart, Activity, CheckCircle2 } from 'lucide-react';
import GaugeChart from './GaugeChart';
import FunnelChart from './FunnelChart';
import DonutChart from './DonutChart';
import ActionCenter from './ActionCenter';
import TaskChecklist from './TaskChecklist';
import { ANALYTICS_METRICS } from '../../data/mockAnalytics';

export default function AnalyticsDashboard({ onBackToFeed, insightsMetrics }) {
  // Extract values from dynamic telemetry or fall back gracefully
  const searchedRegion = insightsMetrics?.searchedRegion || 'Mangalore & Regional Hubs';
  const pricing = insightsMetrics?.pricing || {
    average: '₹1.37 Cr',
    min: '₹14,000',
    max: '₹1.80 Cr',
    ratePerSqft: '₹6,850/sqft'
  };
  const trendingNeighborhoods = insightsMetrics?.trendingNeighborhoods || [
    { name: 'Kadri Hills', demand: 'High', avgRate: '₹7,150/sqft', growth: '+8.4%' },
    { name: 'Bejai Commercial', demand: 'Very High', avgRate: '₹6,800/sqft', growth: '+6.9%' },
    { name: 'Surathkal Seafront', demand: 'Moderate', avgRate: '₹5,600/sqft', growth: '+11.3%' },
    { name: 'Metroville Central', demand: 'Strong', avgRate: '₹8,200/sqft', growth: '+9.2%' }
  ];
  const propertyDistribution = insightsMetrics?.propertyDistribution || [
    { label: 'Apartments', percentage: 55, color: '#4f46e5' },
    { label: 'Villas', percentage: 30, color: '#10b981' },
    { label: 'Independent Houses', percentage: 15, color: '#f59e0b' }
  ];
  const commentary = insightsMetrics?.commentary || "Live market telemetry initialized. Awaiting user property criteria.";
  const activityGauge = insightsMetrics?.activityGauge || ANALYTICS_METRICS.activityGauge;
  const subscribedGauge = insightsMetrics?.subscribedGauge || ANALYTICS_METRICS.subscribedGauge;
  const pipelineFunnel = insightsMetrics?.pipelineFunnel || ANALYTICS_METRICS.pipelineFunnel;
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
            <span className="text-sm font-bold text-slate-800">Dynamic Market Intelligence</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-Time Sync
          </span>
        </div>
      </div>

      {/* Dashboard Grid Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* Dynamic Strategic Commentary Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden border border-indigo-900/40">
          <div className="absolute -top-6 -right-6 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start space-x-3 relative z-10">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-400/30">
              <Zap className="w-4 h-4 text-amber-300" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Active Context: {searchedRegion}</span>
                <span className="px-2 py-0.5 text-[9px] font-extrabold bg-indigo-500/30 text-indigo-200 rounded-full border border-indigo-400/20">
                  Telemetry Active
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                {commentary}
              </p>
            </div>
          </div>
        </div>

        {/* 1. Scannable Visual Cards: Key Pricing & Area Analytics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Average Price</span>
            <div className="text-lg font-extrabold text-slate-900">{pricing.average}</div>
            <span className="text-[10px] text-indigo-600 font-bold">In active scope</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Estimated Rate</span>
            <div className="text-lg font-extrabold text-slate-900">{pricing.ratePerSqft}</div>
            <span className="text-[10px] text-emerald-600 font-bold">↑ +7.4% YoY trend</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Price Spectrum</span>
            <div className="text-sm font-extrabold text-slate-900 truncate">{pricing.min} - {pricing.max}</div>
            <span className="text-[10px] text-slate-400 font-medium">Min to Max</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Inventory Scope</span>
            <div className="text-lg font-extrabold text-slate-900">{insightsMetrics?.matchingCount || 4} units</div>
            <span className="text-[10px] text-emerald-600 font-bold">● High compatibility</span>
          </div>
        </div>

        {/* 2. Trending Neighborhoods Table Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              <span>Trending Micro-Markets in Context</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">Updated live</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {trendingNeighborhoods.map((n) => (
              <div key={n.name} className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100/80">
                <div className="font-bold text-xs text-slate-800 truncate">{n.name}</div>
                <div className="text-xs font-extrabold text-slate-900 mt-1">{n.avgRate}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9px] text-slate-400">Growth:</span>
                  <span className="text-[9px] font-extrabold text-emerald-600">{n.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Property Type Distribution & Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Property Type Distribution */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5 text-indigo-600" />
                <span>Property Type Distribution</span>
              </h4>
              <span className="text-[10px] text-indigo-600 font-bold">Live Breakdown</span>
            </div>

            <div className="space-y-2.5 my-auto py-2">
              {propertyDistribution.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{item.label}</span>
                    <span>{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search Intent Gauge */}
          <GaugeChart
            percentage={activityGauge.percentage}
            label={activityGauge.label}
            period={activityGauge.period}
            color={activityGauge.color}
            gradientId="gauge-act"
          />
        </div>

        {/* 4. Conversion & Funnel Progression */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FunnelChart stages={pipelineFunnel} />
          <ActionCenter actionCenterData={actionCenter} />
        </div>
      </div>
    </div>
  );
}
