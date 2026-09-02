import React, { useState } from 'react';
import { MessageSquare, LayoutGrid, BarChart3, Menu, X, Sparkles, Smartphone, Monitor } from 'lucide-react';
import Sidebar from './Sidebar';
import ChatInterface from '../chat/ChatInterface';
import RecommendationFeed from '../recommendations/RecommendationFeed';
import AnalyticsDashboard from '../dashboard/AnalyticsDashboard';
import PropertyModal from '../recommendations/PropertyModal';
import ProfileView from '../profile/ProfileView';
import BottomNav from './BottomNav';
import MobileShowcase from '../showcase/MobileShowcase';
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

  // Mode: 'desktop' | 'showcase'
  const [displayMode, setDisplayMode] = useState('desktop');

  // Mobile navigation state: 'chat' | 'properties' | 'saved' | 'insights' | 'profile'
  const [mobileTab, setMobileTab] = useState('chat');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDashboard = () => {
    setRightPanelMode(prev => prev === 'feed' ? 'dashboard' : 'feed');
  };

  // If 3-Phone Showcase mode is selected, render the MobileShowcase
  if (displayMode === 'showcase') {
    return (
      <div className="relative min-h-screen">
        {/* Floating Switcher to return to Desktop */}
        <div className="fixed top-4 right-4 z-50 flex items-center space-x-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg border border-slate-200">
          <button
            onClick={() => setDisplayMode('desktop')}
            className="flex items-center space-x-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop View</span>
          </button>
          <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-lg">
            3-Phone Showcase
          </span>
        </div>

        <MobileShowcase
          messages={messages}
          inputValue={inputValue}
          setInputValue={setInputValue}
          isStreaming={isStreaming}
          onSendMessage={handleSendMessage}
          onSelectPrompt={handleSelectPrompt}
          onResetChat={handleNewChat}
          properties={properties}
          savedPropertyIds={savedPropertyIds}
          onToggleSave={toggleSaveProperty}
          onSelectProperty={(prop) => setSelectedProperty(prop)}
          onOpenInsights={() => {}}
        />

        {/* Property Detail Modal in Showcase */}
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          isSaved={selectedProperty ? savedPropertyIds.has(selectedProperty.id) : false}
          onToggleSave={toggleSaveProperty}
          onAskAI={(question) => handleSendMessage(question)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-0 md:p-3 lg:p-4 bg-[#e8ecf4]">
      {/* Top Floating View Switcher (Desktop vs 3-Phone Showcase) */}
      <div className="hidden md:flex items-center justify-between w-full max-w-[1560px] px-2 mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">PropPilot AI System</span>
        </div>
        <div className="flex items-center space-x-1.5 bg-white/80 backdrop-blur-sm p-1 rounded-2xl border border-slate-200/80 shadow-xs">
          <button
            onClick={() => setDisplayMode('desktop')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              displayMode === 'desktop'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop 3-Column</span>
          </button>
          <button
            onClick={() => setDisplayMode('showcase')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              displayMode === 'showcase'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
            <span>3-Phone Showcase</span>
          </button>
        </div>
      </div>

      {/* Main App Container */}
      <div className="w-full max-w-[1560px] h-screen md:h-[92vh] max-h-[960px] bg-white md:rounded-3xl shadow-float md:border md:border-slate-200/70 flex flex-col md:flex-row overflow-hidden relative">

        {/* Mobile Header (Small screens) */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 z-30 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-slate-900">PropPilot</span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-600 rounded">AI</span>
          </div>

          <button
            onClick={() => setDisplayMode('showcase')}
            className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>3-Phone View</span>
          </button>
        </div>

        {/* Desktop Left Column: Navigation Sidebar */}
        <div className="hidden md:block shrink-0 h-full">
          <Sidebar
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            onNewChat={handleNewChat}
            savedCount={savedPropertyIds.size}
            onToggleDashboard={toggleDashboard}
            rightPanelMode={rightPanelMode}
          />
        </div>

        {/* Middle Column: Conversational AI Interface */}
        <div className={`flex-1 h-full min-w-0 flex flex-col border-r border-slate-100 ${
          mobileTab === 'chat' ? 'flex' : 'hidden md:flex'
        }`}>
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

        {/* Right Column: Dynamic Recommendations / Analytics / Profile */}
        <div className={`w-full md:w-[380px] lg:w-[420px] xl:w-[460px] shrink-0 h-full bg-white flex flex-col ${
          mobileTab === 'properties' || mobileTab === 'insights' || mobileTab === 'saved' || mobileTab === 'profile'
            ? 'flex'
            : 'hidden md:flex'
        }`}>
          {mobileTab === 'profile' ? (
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
          ) : rightPanelMode === 'feed' || mobileTab === 'properties' || mobileTab === 'saved' ? (
            <RecommendationFeed
              properties={mobileTab === 'saved' ? properties.filter(p => savedPropertyIds.has(p.id)) : properties}
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

        {/* Mobile Bottom Navigation Bar (Visible only on mobile screen widths) */}
        <div className="md:hidden">
          <BottomNav
            activeTab={mobileTab}
            onTabChange={(tab) => {
              setMobileTab(tab);
              if (tab === 'insights') {
                setRightPanelMode('dashboard');
              } else if (tab === 'properties') {
                setRightPanelMode('feed');
              }
            }}
            savedCount={savedPropertyIds.size}
          />
        </div>

        {/* Property Detail Modal */}
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
    </div>
  );
}
