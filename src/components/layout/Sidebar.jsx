import React from 'react';
import { 
  MessageSquare, 
  Search, 
  Heart, 
  Lightbulb, 
  Plus, 
  MoreHorizontal, 
  Home as HomeIcon,
  Sparkles,
  Shield,
  Briefcase,
  Building,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({
  activeNav,
  setActiveNav,
  onNewChat,
  savedCount = 0,
  onToggleDashboard,
  rightPanelMode
}) {
  const { currentUser, setIsAuthModalOpen } = useAuth();

  // Dynamic Navigation Items based on Role Access Control (RBAC)
  const navItems = [
    { id: 'chats', label: 'AI Concierge', icon: MessageSquare },
    { id: 'properties', label: 'Properties', icon: Search },
    { id: 'saved', label: 'Saved', icon: Heart, badge: savedCount },
    { id: 'insights', label: 'Market Insights', icon: Lightbulb, isDashboardToggle: true },
  ];

  // Role 2: Seller Scoped CMS
  if (currentUser.role === 'seller' || currentUser.role === 'broker') {
    navItems.push({
      id: 'seller_cms',
      label: 'Seller CMS',
      icon: HomeIcon,
      badge: '3',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    });
  }

  // Role 3: Regional Broker Oversight
  if (currentUser.role === 'broker') {
    navItems.push({
      id: 'broker_cms',
      label: 'Broker Oversight',
      icon: Building,
      badge: '2 New',
      badgeColor: 'bg-amber-100 text-amber-800'
    });
  }

  const handleNavClick = (item) => {
    if (item.isDashboardToggle) {
      onToggleDashboard();
    } else {
      setActiveNav(item.id);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'broker':
        return { label: 'Regional Broker', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'seller':
        return { label: 'Seller (CMS)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default:
        return { label: 'Regular User', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    }
  };

  const roleBadge = getRoleBadge(currentUser.role);

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-6 shrink-0 h-full select-none">
      {/* Top Section: Logo & Nav */}
      <div className="flex flex-col space-y-6">
        {/* Logo */}
        <div className="flex items-center cursor-pointer px-1 py-0.5" onClick={onNewChat} title="PropPilot AI">
          <img 
            src="/logo.png" 
            alt="PropPilot" 
            className="h-10 w-auto max-w-[195px] object-contain transition-transform hover:scale-[1.02]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
              <HomeIcon className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="flex items-center">
              <span className="font-bold text-xl tracking-tight text-slate-900">PropPilot</span>
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-600 rounded-md">AI</span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = (activeNav === item.id && rightPanelMode === 'feed') || 
                             (item.id === 'insights' && rightPanelMode === 'dashboard');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'text-slate-900 font-semibold bg-slate-100 shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-indigo-600 stroke-[2.2]' : 'text-slate-400 group-hover:text-slate-600'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                    item.badgeColor || 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80 rounded-2xl text-sm font-semibold transition-all duration-200 shadow-xs hover:shadow-2xs active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Bottom Section: User Profile & Role Switcher */}
      <div className="flex flex-col space-y-4 pt-4 border-t border-slate-100">
        {/* User profile snippet with Role Indicator */}
        <div 
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center justify-between px-2 py-2 group cursor-pointer hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"
          title="Click to Switch User Role / Account"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                {currentUser.name}
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 mt-0.5 rounded border ${roleBadge.color}`}>
                {roleBadge.label}
              </span>
            </div>
          </div>
          <button 
            type="button" 
            className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg transition-colors text-xs font-semibold"
          >
            Switch
          </button>
        </div>

        {/* Minimal Footer */}
        <div className="px-1 text-[11px] text-slate-400 space-y-1">
          <div className="flex flex-wrap gap-x-1.5 gap-y-1 leading-relaxed">
            <a href="#privacy" className="hover:text-slate-600 transition-colors">Privacy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-slate-600 transition-colors">Terms</a>
            <span>•</span>
            <a href="#help" className="hover:text-slate-600 transition-colors">Help</a>
          </div>
        </div>
      </div>
    </aside>
  );
}
