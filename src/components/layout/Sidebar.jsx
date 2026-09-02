import React from 'react';
import { 
  MessageSquare, 
  Search, 
  Heart, 
  Lightbulb, 
  Plus, 
  MoreHorizontal, 
  Home as HomeIcon,
  Sparkles
} from 'lucide-react';

export default function Sidebar({
  activeNav,
  setActiveNav,
  onNewChat,
  savedCount = 0,
  onToggleDashboard,
  rightPanelMode
}) {
  const navItems = [
    { id: 'chats', label: 'Chats', icon: MessageSquare },
    { id: 'properties', label: 'Properties', icon: Search },
    { id: 'saved', label: 'Saved', icon: Heart, badge: savedCount },
    { id: 'insights', label: 'Market Insights', icon: Lightbulb, isDashboardToggle: true },
  ];

  const handleNavClick = (item) => {
    if (item.isDashboardToggle) {
      onToggleDashboard();
    } else {
      setActiveNav(item.id);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-6 shrink-0 h-full select-none">
      {/* Top Section: Logo & Nav */}
      <div className="flex flex-col space-y-7">
        {/* Logo */}
        <div className="flex items-center space-x-2.5 px-1 cursor-pointer" onClick={onNewChat}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <HomeIcon className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="flex items-center">
            <span className="font-bold text-xl tracking-tight text-slate-900">PropPilot</span>
            <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-600 rounded-md">AI</span>
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
                    ? 'text-slate-900 font-semibold bg-slate-50 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-slate-900 stroke-[2.2]' : 'text-slate-400 group-hover:text-slate-600'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full">
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
          className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80 rounded-2xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Bottom Section: User Profile & Footer */}
      <div className="flex flex-col space-y-5 pt-4 border-t border-slate-100">
        {/* User profile snippet */}
        <div className="flex items-center justify-between px-1 py-1 group cursor-pointer hover:bg-slate-50 rounded-xl transition-colors">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                alt="User Avatar"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-800 leading-tight">John</span>
              <span className="text-xs text-slate-400">Pro Plan</span>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Minimal Footer */}
        <div className="px-1 text-[11px] text-slate-400 space-y-1">
          <div className="flex flex-wrap gap-x-1.5 gap-y-1 leading-relaxed">
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
          <p className="pt-1 text-[10px] text-slate-400">© 2025, PropPilot, Inc.</p>
        </div>
      </div>
    </aside>
  );
}
