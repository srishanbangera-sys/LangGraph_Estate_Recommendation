import React, { useState } from 'react';
import { MessageSquare, LayoutGrid, BarChart3, Menu, X, Sparkles } from 'lucide-react';
import Sidebar from './Sidebar';
import ChatInterface from '../chat/ChatInterface';
import RecommendationFeed from '../recommendations/RecommendationFeed';
import AnalyticsDashboard from '../dashboard/AnalyticsDashboard';
import PropertyModal from '../recommendations/PropertyModal';
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

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Mobile active tab: 'chat' | 'feed' | 'analytics'
  const [mobileTab, setMobileTab] = useState('chat');

  const toggleDashboard = () => {
    setRightPanelMode(prev => prev === 'feed' ? 'dashboard' : 'feed');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 md:p-3 lg:p-4 bg-[#e8ecf4]">
      {/* Main App Container with rounded corners & shadow matching reference */}
      <div className="w-full max-w-[1560px] h-screen md:h-[94vh] max-h-[960px] bg-white md:rounded-3xl shadow-float md:border md:border-slate-200/70 flex flex-col md:flex-row overflow-hidden relative">

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 z-30 shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-bold text-lg text-slate-900">HomiGo</span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-600 rounded">AI</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setMobileTab('chat')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg ${mobileTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
            >
              Chat
            </button>
            <button
              onClick={() => { setMobileTab('feed'); setRightPanelMode('feed'); }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg ${mobileTab === 'feed' && rightPanelMode === 'feed' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
            >
              Feed
            </button>
            <button
              onClick={() => { setMobileTab('feed'); setRightPanelMode('dashboard'); }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg ${mobileTab === 'feed' && rightPanelMode === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
            >
              Insights
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-64 h-full bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
              <Sidebar
                activeNav={activeNav}
                setActiveNav={(nav) => {
                  setActiveNav(nav);
                  setMobileMenuOpen(false);
                }}
                onNewChat={() => {
                  handleNewChat();
                  setMobileMenuOpen(false);
                }}
                savedCount={savedPropertyIds.size}
                onToggleDashboard={() => {
                  toggleDashboard();
                  setMobileMenuOpen(false);
                }}
                rightPanelMode={rightPanelMode}
              />
            </div>
          </div>
        )}

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

        {/* Right Column: Dynamic Recommendations / Analytics Dashboard */}
        <div className={`w-full md:w-[380px] lg:w-[420px] xl:w-[460px] shrink-0 h-full bg-white flex flex-col ${
          mobileTab === 'feed' ? 'flex' : 'hidden md:flex'
        }`}>
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
