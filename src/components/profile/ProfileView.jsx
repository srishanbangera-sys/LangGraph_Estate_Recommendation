import React, { useState } from 'react';
import { 
  History, 
  Heart, 
  BarChart3, 
  Bell, 
  Settings, 
  ChevronRight, 
  ShieldCheck, 
  ExternalLink, 
  ArrowLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function ProfileView({
  savedCount = 0,
  onOpenSaved,
  onOpenInsights,
  onNewChat,
  onBackToChat
}) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  const menuItems = [
    {
      id: 'history',
      icon: History,
      title: 'Chat History',
      badge: '3 recent',
      action: () => setActiveModal('history')
    },
    {
      id: 'saved',
      icon: Heart,
      title: 'Saved Properties',
      badge: `${savedCount} saved`,
      action: onOpenSaved
    },
    {
      id: 'insights',
      icon: BarChart3,
      title: 'Market Insight Reports',
      badge: 'Live',
      action: onOpenInsights
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Notifications',
      badge: notificationsEnabled ? 'On' : 'Off',
      action: () => setNotificationsEnabled(!notificationsEnabled)
    },
    {
      id: 'settings',
      icon: Settings,
      title: 'Settings',
      action: () => setActiveModal('settings')
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden select-none">
      {/* Header */}
      <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-white/95 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          {onBackToChat && (
            <button
              onClick={onBackToChat}
              className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <h2 className="text-base font-bold text-slate-900">Profile & Menu</h2>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200/60">
          Verified
        </span>
      </div>

      {/* Profile Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* User Card matching Phone 3 */}
        <div className="flex flex-col items-center p-6 bg-gradient-to-b from-slate-50/80 to-indigo-50/30 rounded-3xl border border-slate-100/90 shadow-xs text-center relative overflow-hidden">
          <div className="relative mb-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80"
              alt="John"
              className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-xs"></span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 leading-snug">John</h3>
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-white text-indigo-600 rounded-full text-xs font-semibold shadow-xs border border-indigo-100 mt-1">
            <Sparkles className="w-3 h-3 fill-indigo-500/20" />
            <span>Pro Plan Member</span>
          </span>

          <p className="text-xs text-slate-500 mt-2 max-w-xs">
            Personalized AI property hunter & portfolio management active.
          </p>
        </div>

        {/* Menu Options List */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-100/90 rounded-2xl transition-all duration-200 group border border-slate-100/80 text-left"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-600 group-hover:text-indigo-600 group-hover:scale-105 transition-all shadow-xs border border-slate-100">
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[11px] font-medium bg-white text-slate-600 rounded-lg border border-slate-200/60 shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info matching Phone 3 */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2">
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-xs text-slate-400 font-medium">
            <a href="#company" className="hover:text-slate-600 transition-colors">Company</a>
            <span>•</span>
            <a href="#contact" className="hover:text-slate-600 transition-colors">Contact</a>
            <span>•</span>
            <a href="#help" className="hover:text-slate-600 transition-colors">Help</a>
            <span>•</span>
            <a href="#terms" className="hover:text-slate-600 transition-colors">Terms</a>
            <span>•</span>
            <a href="#privacy" className="hover:text-slate-600 transition-colors">Privacy</a>
          </div>
          <p className="text-[11px] text-slate-400 font-normal">
            © 2025, PropPilot, Inc.
          </p>
        </div>
      </div>

      {/* Modal / Dialog for Chat History & Settings */}
      {activeModal === 'history' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Recent Searches</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl hover:bg-indigo-50/50 cursor-pointer">
                <p className="font-semibold text-slate-800">"Waterfront homes in London"</p>
                <span className="text-[10px] text-slate-400">2 hours ago • 3 matches</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl hover:bg-indigo-50/50 cursor-pointer">
                <p className="font-semibold text-slate-800">"Wellness villas with private spa"</p>
                <span className="text-[10px] text-slate-400">Yesterday • 2 matches</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl hover:bg-indigo-50/50 cursor-pointer">
                <p className="font-semibold text-slate-800">"Modern apartments near Bristol"</p>
                <span className="text-[10px] text-slate-400">3 days ago • 4 matches</span>
              </div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">App Preferences</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Currency</span>
                <span className="font-bold text-indigo-600">GBP (£)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Measurement</span>
                <span className="font-bold text-slate-800">Sq Ft</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">LangGraph AI Model</span>
                <span className="font-bold text-indigo-600">Gemini 1.5 Pro</span>
              </div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
