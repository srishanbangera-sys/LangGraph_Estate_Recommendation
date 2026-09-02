import React, { useState, useEffect, useRef } from 'react';
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
  UserCheck,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({
  activeNav,
  setActiveNav,
  onNewChat,
  savedCount = 0,
  onToggleDashboard,
  rightPanelMode,
  isMobile = false,
  onCloseMobile = null,
  sidebarWidth,
  setSidebarWidth,
  isCollapsed,
  setIsCollapsed
}) {
  const { currentUser, setIsAuthModalOpen } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef(null);

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
    if (isMobile && onCloseMobile) {
      onCloseMobile();
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

  // Resizing mouse events handlers
  const handleMouseDown = (e) => {
    if (isMobile) return;
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent) => {
      const maxAllowed = Math.min(window.innerWidth * 0.36, 440);
      const newWidth = Math.max(200, Math.min(moveEvent.clientX, maxAllowed));
      if (setSidebarWidth) {
        setSidebarWidth(newWidth);
        try {
          localStorage.setItem('proppilot_sidebar_width', newWidth.toString());
        } catch {}
      }
      if (isCollapsed && setIsCollapsed && newWidth > 120) {
        setIsCollapsed(false);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <aside 
      ref={sidebarRef}
      style={!isMobile && !isCollapsed ? { width: `${sidebarWidth || 260}px` } : {}}
      className={`bg-white border-r border-slate-100 flex flex-col justify-between shrink-0 h-full select-none relative overflow-hidden min-w-0 ${
        isDragging ? 'transition-none' : 'transition-all duration-150'
      } ${
        isMobile ? 'w-full p-6' : isCollapsed ? 'w-[72px] min-w-[72px] max-w-[72px] p-3' : 'p-6 min-w-[200px] max-w-[440px]'
      }`}
    >
      {/* Top Section: Header, Logo, Collapse Toggle & Nav */}
      <div className="flex flex-col space-y-6">
        {/* Top Header Row */}
        <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
          {/* Logo / Brand */}
          {!isCollapsed ? (
            <div 
              className="flex items-center cursor-pointer px-1 py-0.5 truncate" 
              onClick={() => {
                onNewChat();
                if (isMobile && onCloseMobile) onCloseMobile();
              }} 
              title="PropPilot AI"
            >
              <img 
                src="/logo.png" 
                alt="PropPilot" 
                className="h-9 w-auto max-w-[185px] object-contain transition-transform hover:scale-[1.02]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <HomeIcon className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg text-slate-900">PropPilot</span>
              </div>
            </div>
          ) : (
            /* Collapsed Logo Icon */
            <div 
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white cursor-pointer shadow-sm hover:scale-105 transition-transform"
              onClick={() => setIsCollapsed && setIsCollapsed(false)}
              title="Expand PropPilot Sidebar"
            >
              <span className="font-black text-sm">P</span>
            </div>
          )}

          {/* Desktop Collapse/Expand Toggle Button */}
          {!isMobile && setIsCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors ${
                isCollapsed ? 'hidden' : 'flex'
              }`}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Close Button */}
          {isMobile && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Collapsed Expand Quick Button */}
        {!isMobile && isCollapsed && setIsCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full py-2 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            title="Expand Sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}

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
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center ${
                  isCollapsed && !isMobile ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'
                } rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'text-indigo-600 font-bold bg-indigo-50/70 shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
                }`}
              >
                <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'}`}>
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-indigo-600 stroke-[2.4]' : 'text-slate-400 group-hover:text-slate-600'
                  }`} />
                  {(!isCollapsed || isMobile) && <span className="truncate">{item.label}</span>}
                </div>

                {(!isCollapsed || isMobile) && item.badge !== undefined && (
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
          onClick={() => {
            onNewChat();
            if (isMobile && onCloseMobile) onCloseMobile();
          }}
          title={isCollapsed ? 'New Chat' : undefined}
          className={`flex items-center justify-center ${
            isCollapsed && !isMobile ? 'p-2.5' : 'space-x-2 py-2.5 px-4'
          } w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all duration-200 shadow-xs hover:shadow-2xs active:scale-[0.98]`}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          {(!isCollapsed || isMobile) && <span>New Chat</span>}
        </button>
      </div>

      {/* Bottom Section: User Profile & Role Switcher */}
      <div className={`flex flex-col space-y-4 pt-4 border-t border-slate-100 ${isCollapsed && !isMobile ? 'items-center' : ''}`}>
        {/* User profile snippet with Role Indicator */}
        <div 
          onClick={() => {
            setIsAuthModalOpen(true);
            if (isMobile && onCloseMobile) onCloseMobile();
          }}
          className={`flex items-center ${
            isCollapsed && !isMobile ? 'justify-center p-1.5' : 'justify-between px-2 py-2'
          } group cursor-pointer hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 w-full`}
          title="Click to Switch User Role / Account"
        >
          <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'}`}>
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
            </div>

            {(!isCollapsed || isMobile) && (
              <div className="flex flex-col text-left min-w-0">
                <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 mt-0.5 rounded border inline-block truncate ${roleBadge.color}`}>
                  {roleBadge.label}
                </span>
              </div>
            )}
          </div>

          {(!isCollapsed || isMobile) && (
            <button 
              type="button" 
              className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg transition-colors text-xs font-semibold shrink-0"
            >
              Switch
            </button>
          )}
        </div>

        {/* Minimal Footer */}
        {(!isCollapsed || isMobile) && (
          <div className="px-1 text-[11px] text-slate-400 space-y-1">
            <div className="flex flex-wrap gap-x-1.5 gap-y-1 leading-relaxed">
              <a href="#privacy" className="hover:text-slate-600 transition-colors">Privacy</a>
              <span>•</span>
              <a href="#terms" className="hover:text-slate-600 transition-colors">Terms</a>
              <span>•</span>
              <a href="#help" className="hover:text-slate-600 transition-colors">Help</a>
            </div>
          </div>
        )}
      </div>

      {/* Draggable Resize Handle (Desktop Only) */}
      {!isMobile && !isCollapsed && (
        <div 
          onMouseDown={handleMouseDown}
          className={`absolute -right-1 top-0 bottom-0 w-2 cursor-col-resize z-30 group flex items-center justify-center transition-colors ${
            isDragging ? 'bg-indigo-500' : 'hover:bg-indigo-400/40'
          }`}
          title="Drag to resize sidebar width"
        >
          <div className={`w-0.5 h-7 rounded-full transition-colors ${
            isDragging ? 'bg-white' : 'bg-slate-300 group-hover:bg-indigo-600'
          }`} />
        </div>
      )}
    </aside>
  );
}
