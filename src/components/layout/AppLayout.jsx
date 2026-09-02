import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatInterface from '../chat/ChatInterface';
import RecommendationFeed from '../recommendations/RecommendationFeed';
import AnalyticsDashboard from '../dashboard/AnalyticsDashboard';
import PropertyModal from '../recommendations/PropertyModal';
import ProfileView from '../profile/ProfileView';
import BottomNav from './BottomNav';
import { useLangGraphChat } from '../../hooks/useLangGraphChat';

export default function AppLayout() {
  const {
    messages,
    inputValue,
    setInputValue,
    isStreaming,
    properties,
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
    toggleSaveProperty
  } = useLangGraphChat();

  // Mobile navigation tab state: 'chat' | 'properties' | 'saved' | 'insights' | 'profile'
  const [mobileTab, setMobileTab] = useState('chat');

  const toggleDashboard = () => {
    setRightPanelMode(prev => prev === 'feed' ? 'dashboard' : 'feed');
  };

  const savedPropertiesList = properties.filter(p => savedPropertyIds.has(p.id));

  return (
    <div className="w-full min-h-screen bg-[#e8ecf4] flex items-center justify-center">

      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW (Phones & Small Viewports: < 768px / md)                   */}
      {/* Native full-screen mobile app layout with bottom navigation               */}
      {/* ========================================================================= */}
      <div className="md:hidden flex flex-col w-full h-[100dvh] bg-white overflow-hidden relative">
        
        {/* Mobile Screen Content based on activeTab */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          
          {/* TAB 1: Chat Hub (Home) */}
          {mobileTab === 'chat' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Mobile Top Header */}
              <div className="h-14 px-4 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md shrink-0 z-20">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-xs">
                    <span className="font-extrabold text-xs">P</span>
                  </div>
                  <span className="font-bold text-base text-slate-900">PropPilot</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-50 text-indigo-600 rounded">AI</span>
                </div>

                <div 
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setMobileTab('profile')}
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
                    alt="John"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-100"
                  />
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
                  properties={properties}
                  onSelectProperty={(prop) => setSelectedProperty(prop)}
                />
              </div>
            </div>
          )}

          {/* TAB 2: Properties Feed */}
          {mobileTab === 'properties' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <RecommendationFeed
                properties={properties}
                savedPropertyIds={savedPropertyIds}
                onToggleSave={toggleSaveProperty}
                onSelectProperty={(prop) => setSelectedProperty(prop)}
                onToggleDashboard={() => setMobileTab('insights')}
                rightPanelMode="feed"
              />
            </div>
          )}

          {/* TAB 3: Saved Properties */}
          {mobileTab === 'saved' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="h-14 px-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <h2 className="font-bold text-base text-slate-900">Saved Properties ({savedPropertyIds.size})</h2>
                <span className="text-xs text-indigo-600 font-semibold cursor-pointer" onClick={() => setMobileTab('properties')}>
                  Browse More
                </span>
              </div>
              <div className="flex-1 overflow-y-auto">
                {savedPropertiesList.length > 0 ? (
                  <RecommendationFeed
                    properties={savedPropertiesList}
                    savedPropertyIds={savedPropertyIds}
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
              <AnalyticsDashboard
                onBackToFeed={() => setMobileTab('properties')}
              />
            </div>
          )}

          {/* TAB 5: Profile & Menu */}
          {mobileTab === 'profile' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <ProfileView
                savedCount={savedPropertyIds.size}
                onOpenSaved={() => setMobileTab('saved')}
                onOpenInsights={() => setMobileTab('insights')}
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
          savedCount={savedPropertyIds.size}
        />
      </div>

      {/* ========================================================================= */}
      {/* 💻 LAPTOP / DESKTOP VIEW (Screen >= 768px / md)                            */}
      {/* Full 3-column desktop layout matching reference Image 1                   */}
      {/* ========================================================================= */}
      <div className="hidden md:flex w-full max-w-[1560px] h-[94vh] max-h-[960px] bg-white rounded-3xl shadow-float border border-slate-200/70 overflow-hidden relative m-3 lg:m-4">
        
        {/* Column 1: Left Navigation Sidebar */}
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onNewChat={handleNewChat}
          savedCount={savedPropertyIds.size}
          onToggleDashboard={toggleDashboard}
          rightPanelMode={rightPanelMode}
        />

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
            properties={properties}
            onSelectProperty={(prop) => setSelectedProperty(prop)}
          />
        </div>

        {/* Column 3: Right Dynamic Recommendations or Analytics Dashboard */}
        <div className="w-[380px] lg:w-[420px] xl:w-[460px] shrink-0 h-full bg-white flex flex-col">
          {rightPanelMode === 'feed' ? (
            <RecommendationFeed
              properties={properties}
              savedPropertyIds={savedPropertyIds}
              onToggleSave={toggleSaveProperty}
              onSelectProperty={(prop) => setSelectedProperty(prop)}
              onToggleDashboard={toggleDashboard}
              rightPanelMode={rightPanelMode}
            />
          ) : (
            <AnalyticsDashboard
              onBackToFeed={() => setRightPanelMode('feed')}
            />
          )}
        </div>

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

    </div>
  );
}
