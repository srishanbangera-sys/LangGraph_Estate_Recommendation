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
  Sparkles,
  Home,
  Building,
  UserCheck,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileView({
  savedCount = 0,
  onOpenSaved,
  onOpenInsights,
  onOpenSellerCMS,
  onOpenBrokerCMS,
  onNewChat,
  onBackToChat
}) {
  const { currentUser, setIsAuthModalOpen, logout } = useAuth();
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
      title: 'Market Insights & Telemetry',
      badge: 'Live',
      action: onOpenInsights
    },
  ];

  // If Seller or Broker, add CMS links to mobile profile
  if (currentUser.role === 'seller' || currentUser.role === 'broker') {
    menuItems.push({
      id: 'seller_cms',
      icon: Home,
      title: 'Seller CMS Dashboard',
      badge: '3 listings',
      action: onOpenSellerCMS
    });
  }

  if (currentUser.role === 'broker') {
    menuItems.push({
      id: 'broker_cms',
      icon: Building,
      title: 'Regional Broker Oversight',
      badge: 'Mangalore Zone',
      action: onOpenBrokerCMS
    });
  }

  menuItems.push(
    {
      id: 'notifications',
      icon: Bell,
      title: 'Real-time Notifications',
      badge: notificationsEnabled ? 'On' : 'Off',
      action: () => setNotificationsEnabled(!notificationsEnabled)
    },
    {
      id: 'role_switch',
      icon: UserCheck,
      title: 'Switch User Role / Account',
      badge: currentUser.role.toUpperCase(),
      action: () => setIsAuthModalOpen(true)
    }
  );

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
          <h2 className="text-base font-bold text-slate-900">Profile & Access Control</h2>
        </div>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-2.5 py-1 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200/60 transition-colors"
        >
          Switch Role
        </button>
      </div>

      {/* Profile Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* User Card */}
        <div className="flex flex-col items-center p-6 bg-gradient-to-b from-slate-50/80 to-indigo-50/30 rounded-3xl border border-slate-100/90 shadow-2xs text-center relative overflow-hidden">
          <div className="relative mb-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-2xs"></span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 leading-snug">{currentUser.name}</h3>
          <p className="text-xs text-slate-500">{currentUser.email}</p>
          
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-white text-indigo-600 rounded-full text-xs font-semibold shadow-2xs border border-indigo-100 mt-2">
            <Sparkles className="w-3 h-3 fill-indigo-500/20" />
            <span>{currentUser.title}</span>
          </span>

          <p className="text-xs text-slate-500 mt-2 max-w-xs">
            {currentUser.zone || 'Personalized AI property concierge & market telemetry active.'}
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
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-600 group-hover:text-indigo-600 group-hover:scale-105 transition-all shadow-2xs border border-slate-100">
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[11px] font-medium bg-white text-slate-600 rounded-lg border border-slate-200/60 shadow-2xs">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2">
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-xs text-slate-400 font-medium">
            <a href="#company" className="hover:text-slate-600 transition-colors">Company</a>
            <span>•</span>
            <a href="#contact" className="hover:text-slate-600 transition-colors">Contact</a>
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

      {/* Modal for Chat History */}
      {activeModal === 'history' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Recent Searches</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl hover:bg-indigo-50/50 cursor-pointer">
                <p className="font-semibold text-slate-800">"3 BHK apartments in Kadri, Mangalore"</p>
                <span className="text-[10px] text-slate-400">2 hours ago • 4 matches</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl hover:bg-indigo-50/50 cursor-pointer">
                <p className="font-semibold text-slate-800">"Luxury villas in Bejai under ₹2.5 Cr"</p>
                <span className="text-[10px] text-slate-400">Yesterday • 2 matches</span>
              </div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
