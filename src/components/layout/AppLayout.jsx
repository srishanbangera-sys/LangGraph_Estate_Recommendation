import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import ChatInterface from '../chat/ChatInterface';
import RecommendationFeed from '../recommendations/RecommendationFeed';
import AnalyticsDashboard from '../dashboard/AnalyticsDashboard';
import PropertyModal from '../recommendations/PropertyModal';
import ProfileView from '../profile/ProfileView';
import BottomNav from './BottomNav';
import SellerCMS from '../seller/SellerCMS';
import BrokerCMS from '../broker/BrokerCMS';
import LoginModal from '../auth/LoginModal';
import PermissionGuard from '../auth/PermissionGuard';
import { useLangGraphChat } from '../../hooks/useLangGraphChat';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
  const {
    messages,
    inputValue,
    setInputValue,
    isStreaming,
    properties,
    filteredProperties,
    activeFilters,
    clearFilter,
    clearAllFilters,
    insightsMetrics,
    savedPropertyIds,
    selectedProperty,
    setSelectedProperty,
    rightPanelMode,
    setRightPanelMode,
    activeNav,
    setActiveNav,
    handleSendMessage,
    handleSelectPrompt,
    handleNewChat,
    toggleSaveProperty,
    currentMapLocation,
    updateMapLocation,
    syncStatus
  } = useLangGraphChat();

  const { isAuthModalOpen, setIsAuthModalOpen, currentUser } = useAuth();

  // Mobile navigation state
  const [mobileTab, setMobileTab] = useState('chat');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Desktop sidebar resizing and collapse state
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    try {
      const saved = localStorage.getItem('proppilot_sidebar_width');
      if (saved) return Math.max(190, Math.min(parseInt(saved, 10), 480));
    } catch {}
    return 260;
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('proppilot_sidebar_collapsed') === 'true';
    } catch {}
    return false;
  });

  useEffect(() => {
    try {
      localStorage.setItem('proppilot_sidebar_collapsed', isSidebarCollapsed.toString());
    } catch {}
  }, [isSidebarCollapsed]);

  const toggleDashboard = () => {
    setRightPanelMode(prev => prev === 'feed' ? 'dashboard' : 'feed');
  };

  const savedPropertiesList = properties.filter(p => savedPropertyIds.has(p.id));

  return (
    <div className="w-screen h-screen overflow-hidden flex bg-white font-sans text-slate-900">

      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW (Phones & Small Viewports: < 768px / md)                   */}
      {/* Native full-screen mobile app layout with slide-out drawer & bottom nav   */}
      {/* ========================================================================= */}
      <div className="md:hidden flex flex-col w-full h-[100dvh] bg-white overflow-hidden relative">
        
        {/* Mobile Screen Content based on activeTab */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          
          {/* TAB 1: Chat Hub (Home) */}
          {mobileTab === 'chat' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Mobile Top Header with Hamburger & Logo */}
              <div className="h-14 px-4 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md shrink-0 z-20">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                    title="Open Navigation Menu"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <div className="flex items-center cursor-pointer" onClick={handleNewChat}>
                    <img 
                      src="/logo.png" 
                      alt="PropPilot" 
                      className="h-7 w-auto object-contain" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden items-center space-x-1.5">
                      <span className="font-bold text-base text-slate-900">PropPilot</span>
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-50 text-indigo-600 rounded">AI</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-slate-50 border border-slate-200/70 rounded-full text-[10px] font-bold">
                    <span className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                    <span className="text-slate-600 font-semibold">{syncStatus === 'connected' ? 'Live' : 'Syncing'}</span>
                  </div>

                  <div 
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => setMobileTab('profile')}
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Chat Canvas & Input */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <ChatInterface
                  messages={messages}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  isStreaming={isStreaming}
                  onSendMessage={handleSendMessage}
                  onSelectPrompt={handleSelectPrompt}
                  onResetChat={handleNewChat}
                  properties={filteredProperties}
                  onSelectProperty={(prop) => setSelectedProperty(prop)}
                />
              </div>
            </div>
          )}

          {/* TAB 2: Properties Feed */}
          {mobileTab === 'properties' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="h-14 px-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <h2 className="font-bold text-base text-slate-900">Explore Properties</h2>
                </div>
                <button
                  onClick={() => setMobileTab('insights')}
                  className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl"
                >
                  Insights
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <RecommendationFeed
                  properties={filteredProperties}
                  savedPropertyIds={savedPropertyIds}
                  activeFilters={activeFilters}
                  onClearFilter={clearFilter}
                  onClearAllFilters={clearAllFilters}
                  onToggleSave={toggleSaveProperty}
                  onSelectProperty={(prop) => setSelectedProperty(prop)}
                  onToggleDashboard={() => setMobileTab('insights')}
                  rightPanelMode="feed"
                  currentLocation={currentMapLocation}
                  onMapMove={updateMapLocation}
                />
              </div>
            </div>
          )}

          {/* TAB 3: Saved Properties */}
          {mobileTab === 'saved' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="h-14 px-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <h2 className="font-bold text-base text-slate-900">Saved ({savedPropertyIds.size})</h2>
                </div>
                <span className="text-xs text-indigo-600 font-semibold cursor-pointer" onClick={() => setMobileTab('properties')}>
                  Browse More
                </span>
              </div>
              <div className="flex-1 overflow-y-auto">
                {savedPropertiesList.length > 0 ? (
                  <RecommendationFeed
                    properties={savedPropertiesList}
                    savedPropertyIds={savedPropertyIds}
                    activeFilters={{}}
                    onToggleSave={toggleSaveProperty}
                    onSelectProperty={(prop) => setSelectedProperty(prop)}
                    onToggleDashboard={() => setMobileTab('insights')}
                    rightPanelMode="feed"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 p-6 text-center text-slate-400">
                    <p className="text-sm font-medium">No saved properties yet.</p>
                    <p className="text-xs text-slate-400 mt-1">Tap the heart icon on any property to save it.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Market Insights Dashboard */}
          {mobileTab === 'insights' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="h-14 px-4 border-b border-slate-100 flex items-center space-x-2 bg-white shrink-0">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h2 className="font-bold text-base text-slate-900">Market Intelligence</h2>
              </div>
              <div className="flex-1 overflow-hidden">
                <AnalyticsDashboard
                  onBackToFeed={() => setMobileTab('properties')}
                  insightsMetrics={insightsMetrics}
                />
              </div>
            </div>
          )}

          {/* TAB: Seller CMS Mobile View */}
          {mobileTab === 'seller_cms' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <PermissionGuard requiredRole="seller">
                <SellerCMS
                  properties={properties}
                  onBackToSearch={() => setMobileTab('chat')}
                />
              </PermissionGuard>
            </div>
          )}

          {/* TAB: Broker CMS Mobile View */}
          {mobileTab === 'broker_cms' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <PermissionGuard requiredRole="broker">
                <BrokerCMS
                  properties={properties}
                  onBackToSearch={() => setMobileTab('chat')}
                />
              </PermissionGuard>
            </div>
          )}

          {/* TAB 5: Profile & Role Switcher */}
          {mobileTab === 'profile' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <ProfileView
                savedCount={savedPropertyIds.size}
                onOpenSaved={() => setMobileTab('saved')}
                onOpenInsights={() => setMobileTab('insights')}
                onOpenSellerCMS={() => setMobileTab('seller_cms')}
                onOpenBrokerCMS={() => setMobileTab('broker_cms')}
                onNewChat={() => {
                  handleNewChat();
                  setMobileTab('chat');
                }}
                onBackToChat={() => setMobileTab('chat')}
              />
            </div>
          )}

        </div>

        {/* Mobile Bottom Navigation Bar */}
        <BottomNav
          activeTab={mobileTab}
          onTabChange={(tab) => setMobileTab(tab)}
          onOpenMenu={() => setIsMobileMenuOpen(true)}
          savedCount={savedPropertyIds.size}
        />

        {/* Mobile Slide-Out Drawer Sidebar with Backdrop */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[999] flex md:hidden animate-in fade-in duration-200">
            <div 
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-[300px] max-w-[85vw] h-full bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-300 flex flex-col">
              <Sidebar
                isMobile={true}
                onCloseMobile={() => setIsMobileMenuOpen(false)}
                activeNav={activeNav}
                setActiveNav={(nav) => {
                  setActiveNav(nav);
                  if (nav === 'chats') setMobileTab('chat');
                  else if (nav === 'properties') setMobileTab('properties');
                  else if (nav === 'saved') setMobileTab('saved');
                  else if (nav === 'insights') setMobileTab('insights');
                  else if (nav === 'seller_cms') setMobileTab('seller_cms');
                  else if (nav === 'broker_cms') setMobileTab('broker_cms');
                  setIsMobileMenuOpen(false);
                }}
                onNewChat={() => {
                  handleNewChat();
                  setMobileTab('chat');
                  setIsMobileMenuOpen(false);
                }}
                savedCount={savedPropertyIds.size}
                onToggleDashboard={() => {
                  setMobileTab('insights');
                  setIsMobileMenuOpen(false);
                }}
                rightPanelMode={rightPanelMode}
              />
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 💻 NATIVE FULL-PAGE DESKTOP VIEW (Screen >= 768px / md)                    */}
      {/* Resizable and collapsible sidebar with drag handle                         */}
      {/* ========================================================================= */}
      <div className="hidden md:flex w-full h-full overflow-hidden relative">
        
        {/* Column 1: Left Resizable Navigation Sidebar */}
        <Sidebar
          sidebarWidth={sidebarWidth}
          setSidebarWidth={setSidebarWidth}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onNewChat={handleNewChat}
          savedCount={savedPropertyIds.size}
          onToggleDashboard={toggleDashboard}
          rightPanelMode={rightPanelMode}
        />

        {/* Dynamic Main Workspace depending on activeNav */}
        {activeNav === 'seller_cms' ? (
          /* Dedicated Seller CMS View */
          <div className="flex-1 h-full min-w-0 flex flex-col">
            <PermissionGuard requiredRole="seller">
              <SellerCMS
                properties={properties}
                onBackToSearch={() => setActiveNav('chats')}
              />
            </PermissionGuard>
          </div>
        ) : activeNav === 'broker_cms' ? (
          /* Dedicated Regional Broker CMS View */
          <div className="flex-1 h-full min-w-0 flex flex-col">
            <PermissionGuard requiredRole="broker">
              <BrokerCMS
                properties={properties}
                onBackToSearch={() => setActiveNav('chats')}
              />
            </PermissionGuard>
          </div>
        ) : (
          /* Standard 2-Column AI Search Stage & Recommendations/Telemetry */
          <>
            {/* Column 2: Middle Conversational AI Stage */}
            <div className="flex-1 h-full min-w-0 flex flex-col border-r border-slate-100">
              <ChatInterface
                messages={messages}
                inputValue={inputValue}
                setInputValue={setInputValue}
                isStreaming={isStreaming}
                onSendMessage={handleSendMessage}
                onSelectPrompt={handleSelectPrompt}
                onResetChat={handleNewChat}
                properties={filteredProperties}
                onSelectProperty={(prop) => setSelectedProperty(prop)}
              />
            </div>

            {/* Column 3: Right Dynamic Recommendations or Analytics Dashboard */}
            <div className="w-[420px] lg:w-[470px] xl:w-[520px] 2xl:w-[560px] shrink-0 h-full bg-white flex flex-col">
              {rightPanelMode === 'feed' ? (
                <RecommendationFeed
                  properties={filteredProperties}
                  savedPropertyIds={savedPropertyIds}
                  activeFilters={activeFilters}
                  onClearFilter={clearFilter}
                  onClearAllFilters={clearAllFilters}
                  onToggleSave={toggleSaveProperty}
                  onSelectProperty={(prop) => setSelectedProperty(prop)}
                  onToggleDashboard={toggleDashboard}
                  rightPanelMode={rightPanelMode}
                  currentLocation={currentMapLocation}
                  onMapMove={updateMapLocation}
                />
              ) : (
                <AnalyticsDashboard
                  onBackToFeed={() => setRightPanelMode('feed')}
                  insightsMetrics={insightsMetrics}
                />
              )}
            </div>
          </>
        )}

      </div>

      {/* Global Property Detail Modal */}
      <PropertyModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        isSaved={selectedProperty ? savedPropertyIds.has(selectedProperty.id) : false}
        onToggleSave={toggleSaveProperty}
        onAskAI={(question) => {
          handleSendMessage(question);
          if (window.innerWidth < 768) {
            setMobileTab('chat');
          }
        }}
      />

      {/* Role-Based Authentication Modal */}
      <LoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
}
